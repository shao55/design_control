const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");
const { addDays, isWeekend, parseISO, isSameDay, format, startOfDay } = require("date-fns");
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");

const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();

const menuItems = require("./data/MenuItems");
const holidays = require("./data/holidays");
const stages = require("./data/stages");
const template = require("./data/template");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

let projects = [
    {
        id: 1,
        name: 'Обновленный перспективный проект 1 с новой структурой',
        customer: '',
        management: '',
        designOrganization: '',
        curator: '',
        category: 'perspective',
        expertiseDates: [],
        constructiveGroups: [
            {
                name: 'Конструктив 1',
                specificWeight: 0.25,
                comment: "Комментарий о конструктиве",
                sheets: [
                    {
                        name: "Лист 1",
                        specificWeight: 0.1,
                        comment: "Комментарий о листе",
                        changes: [
                            {
                                readiness: 50,
                                fixationDate: "12-04-2023"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Обновленный текущий проект 2 с новой структурой',
        customer: '',
        management: '',
        designOrganization: '',
        curator: '',
        category: 'current',
        expertiseDates: [
            {
                saveDate: "2023-05-13",
                dates: [
                    { stage: 'Дата начала загрузки на комплектацию', date: '2023-05-16' },

                    { stage: 'Дата окончания загрузки ПСД на комплектацию', date: '2023-05-23' }
2
:
{ stage: 'Дата подписания договора с Экспертизой', date: '2023-06-02' }
3
:
{ stage: 'Дата оплаты услуг ГЭ по условиям договора', date: '2023-06-06' }
4
:
{ stage: 'Поступление оплаты', date: '2023-06-07' }
5
:
{ stage: 'Дата выдачи мотивированных замечаний', date: '2023-07-10' }
6
:
{ stage: 'Дата выдачи ответов на мотивированные замечания', date: '2023-07-24' }
7
:
{ stage: 'Последний день загрузки технической части', date: '2023-07-31' }
8
:
{ stage: 'Последний день загрузки сметной документации', date: '2023-08-07' }
9
:
{ stage: 'Дата завершения рассмотрения ответов на замечания', date: '2023-08-14' }
10
:
{ stage: 'Дата завершения подготовки и оформления экспертного заключения', date: '2023-08-14' }
11
:
{ stage: 'Дата уведомления о выходе заключения ГЭ', date: '2023-08-14' }
                ]
            }
        ],
constructiveGroups: [
    {
        name: 'Конструктив 1',
        specificWeight: 0.25,
        comment: "Комментарий о конструктиве",
        sheets: [
            {
                name: "Лист 1",
                specificWeight: 0.1,
                comment: "Комментарий о листе",
                changes: [
                    {
                        readiness: 50,
                        fixationDate: "12-04-2023"
                    }
                ]
            }
        ]
    }
]
    },
{
    id: 3,
        name: 'Обновленный проект в экспертизе 3 с новой структурой',
            customer: '',
                management: '',
                    management: '',
                        designOrganization: '',
                            curator: '',
                                category: 'expertise',
                                    expertiseDates: [],
                                        constructiveGroups: [
                                            {
                                                name: 'Конструктив 1',
                                                specificWeight: 0.25,
                                                comment: "Комментарий о конструктиве",
                                                sheets: [
                                                    {
                                                        name: "Лист 1",
                                                        specificWeight: 0.1,
                                                        comment: "Комментарий о листе",
                                                        changes: [
                                                            {
                                                                readiness: 50,
                                                                fixationDate: "12-04-2023"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
},
];

// Расчет готовности проекта
const calculateReadiness = (project) => {
    let totalReadiness = 0;
    project.constructiveGroups.forEach((group) => {
        const groupWeight = group.specificWeight;
        group.sheets.forEach((sheet) => {
            const sheetWeight = sheet.specificWeight;
            const sheetReadiness = sheet.changes.length > 0 ? sheet.changes[sheet.changes.length - 1].readiness : 0;
            totalReadiness += groupWeight * sheetWeight * sheetReadiness;
        });
    });

    return totalReadiness.toFixed(2);
};

// Расчет готовности конструктивов в проекте
const calculateGroupReadiness = (group) => {
    let totalReadiness = 0;
    group.sheets.forEach((sheet) => {
        const sheetWeight = sheet.specificWeight;
        const sheetReadiness = sheet.changes.length > 0 ? sheet.changes[sheet.changes.length - 1].readiness : 0;
        totalReadiness += sheetWeight * sheetReadiness;
    });

    return totalReadiness.toFixed(2);
};

// Общая функция расчета и обновления объекта readinessData
const getReadinessData = () => {
    let readinessData = {};

    projects.forEach((project) => {
        const projectId = project.id;
        readinessData[projectId] = {
            projectName: project.name,
            projectReadiness: calculateReadiness(project),
            groupReadiness: {}
        };

        project.constructiveGroups.forEach((group) => {
            const groupId = group.id;
            readinessData[projectId].groupReadiness[groupId] = {
                groupName: group.name,
                groupReadiness: calculateGroupReadiness(group)
            };
        });
    });

    return readinessData;
};

// Расчет общего % готовности проектов по категориям
const calculateCategoryReadiness = () => {
    const categories = {
        'perspective': [],
        'current': [],
        'expertise': [],
        'completed': [],
    };

    projects.forEach((project) => {
        const readiness = calculateReadiness(project);
        categories[project.category].push(parseFloat(readiness));
    });

    const categoryReadiness = {};

    for (const [category, readinesses] of Object.entries(categories)) {
        const totalReadiness = readinesses.reduce((a, b) => a + b, 0);
        const averageReadiness = readinesses.length > 0 ? totalReadiness / readinesses.length : 0;
        categoryReadiness[category] = averageReadiness.toFixed(2);
    }

    return categoryReadiness;
};

// Найдите проект по ID
function findProjectById(projectId) {
    return projects.find(project => project.id === projectId);
}

// Найдите конструктивную группу по имени
function findConstructiveGroupByName(project, constructiveGroupName) {
    return project.constructiveGroups.find(cg => cg.name === constructiveGroupName);
}

// Найдите лист по имени
function findSheetByName(constructiveGroup, sheetName) {
    return constructiveGroup.sheets.find(sheet => sheet.name === sheetName);
}

function addBusinessDays(startDate, daysToAdd, holidays = [], timeZone = "Asia/Almaty") {
    const holidayDates = holidays.map((holiday) => parseISO(holiday));
    let currentDate = startDate;
    let daysAdded = 0;

    while (daysAdded < daysToAdd) {
        currentDate = addDays(currentDate, 1);

        if (isWeekend(currentDate) || holidayDates.some((holiday) => isSameDay(holiday, currentDate))) {
            continue;
        }

        daysAdded++;
    }

    return currentDate;
};

app.get('/readiness', (req, res) => {
    const readinessData = getReadinessData();
    res.json(readinessData);
});

app.get('/categoryReadiness', (req, res) => {
    const categoryReadiness = calculateCategoryReadiness();
    res.json(categoryReadiness);
});

app.get('/expertiseDates', async (req, res) => {
    try {
        let expertiseDates = [];

        // Перебираем все проекты и добавляем их даты экспертизы в массив
        projects.forEach(project => {
            // Проверяем, есть ли даты в проекте
            if (project.expertiseDates && project.expertiseDates.length > 0) {
                // Берем последний объект из массива ExpertiseDates
                const lastExpertiseDateObj = project.expertiseDates[project.expertiseDates.length - 1];
                // Проверяем, есть ли даты в этом объекте
                if (lastExpertiseDateObj.dates && lastExpertiseDateObj.dates.length > 0) {
                    lastExpertiseDateObj.dates.forEach(dateObj => {
                        // Добавляем информацию о проекте и стадии к каждому объекту даты только если стадия равна 'Дата начала загрузки на комплектацию'
                        if (dateObj.stage === 'Дата начала загрузки на комплектацию') {
                            const enrichedDateObj = {
                                ...dateObj,
                                projectName: project.name,
                            };
                            expertiseDates.push(enrichedDateObj);
                        }
                    });
                }
            }
        });

        // Сортируем даты
        expertiseDates.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Фильтруем даты, оставляя только те, которые ещё не наступили
        const currentDate = new Date();
        expertiseDates = expertiseDates.filter(expertiseDateObj => new Date(expertiseDateObj.date) > currentDate);
        // Отправляем только первые 5 объектов
        expertiseDates = expertiseDates.slice(0, 5);
        res.json(expertiseDates);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});

app.get('/changes', async (req, res) => {
    try {
        let changes = [];

        projects.forEach(project => {
            project.constructiveGroups.forEach(group => {
                group.sheets.forEach(sheet => {
                    sheet.changes.forEach(change => {
                        const enrichedChange = {
                            projectId: project.id,
                            ...change,
                            projectName: project.name,
                            groupId: group.name,
                            sheetId: sheet.name,
                        };
                        changes.push(enrichedChange);
                    });
                });
            });
        });

        changes.sort((a, b) => new Date(b.fixationDate) - new Date(a.fixationDate));
        changes = changes.slice(0, 5);

        res.json(changes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});

app.put('/projects/:projectId/constructiveGroups/:constructiveGroupName/sheets/:sheetName', (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const constructiveGroupName = req.params.constructiveGroupName;
    const sheetName = req.params.sheetName;
    const updatedSheet = req.body;

    const project = findProjectById(projectId);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const constructiveGroup = findConstructiveGroupByName(project, constructiveGroupName);

    if (!constructiveGroup) {
        return res.status(404).json({ error: 'Constructive group not found' });
    }

    const sheet = findSheetByName(constructiveGroup, sheetName);

    if (!sheet) {
        return res.status(404).json({ error: 'Sheet not found' });
    }

    // Обновите лист с новыми данными
    Object.assign(sheet, updatedSheet);

    // Отправьте обновленный проект в качестве ответа
    res.json(project);
});

app.put("/projects/:id", (req, res) => {
    const projectId = parseInt(req.params.id);
    const updatedProject = req.body;

    const projectIndex = projects.findIndex((project) => project.id === projectId);

    if (projectIndex === -1) {
        res.status(404).send("Проект не найден");
        return;
    }

    projects[projectIndex] = updatedProject;
    res.send(updatedProject);
});

app.get("/template", async (req, res) => {
    try {
        res.status(200).send(template);
    } catch (error) {
        res.status(500).send({ message: "Error getting template" });
    }
});

app.get("/menu-items", async (req, res) => {
    try {
        res.status(200).send(menuItems);
    } catch (error) {
        res.status(500).send({ message: "Error getting menu items" });
    }
});

app.get("/stages", async (req, res) => {
    try {
        res.status(200).send(stages);
    } catch (error) {
        res.status(500).send({ message: "Error getting stages" });
    }
});

app.get("/projects/:category", (req, res) => {
    const category = req.params.category;
    const filteredProjects = projects.filter(p => p.category === category);
    res.json(filteredProjects);
    console.log("Сработал запрос!");
});

app.post("/create", (req, res) => {
    const newProject = req.body;

    if (newProject && newProject.name) {
        const maxId = projects.reduce((max, project) => Math.max(max, project.id), 0);
        newProject.id = maxId + 1;
        projects.push(newProject);
        res.status(201).send(newProject);
        console.log(projects)
    } else {
        res.status(400).send({ message: "Invalid project data" });
    }
});

app.post("/calculate-date", (req, res) => {
    const { startDate, daysToAdd, timeZone, useCalendarDays } = req.body;

    if (!startDate || typeof daysToAdd !== "number" || !timeZone) {
        return res.status(400).send({ message: "Invalid input" });
    }

    const parsedStartDate = utcToZonedTime(startOfDay(parseISO(startDate)), timeZone);

    let newDate;
    if (useCalendarDays) {
        newDate = addDays(parsedStartDate, daysToAdd);
    } else {
        newDate = addBusinessDays(parsedStartDate, daysToAdd, holidays);
    }

    const utcNewDate = zonedTimeToUtc(newDate, timeZone);
    const formattedNewDate = format(utcNewDate, "yyyy-MM-dd");

    res.status(200).send({ newDate: formattedNewDate });
});

app.get("/allProjects", (req, res) => {
    res.json(projects);
    console.log("Запрос списка всех проектов");
});

app.post("/update-project-dates", (req, res) => {
    const { projectId, expertiseDates } = req.body;

    if (!projectId || !expertiseDates) {
        return res.status(400).send({ message: "Invalid input" });
    }

    const projectIndex = projects.findIndex((project) => project.id === projectId);

    if (projectIndex !== -1) {
        projects[projectIndex].expertiseDates = expertiseDates;
        res.status(200).send({ message: "Project dates updated successfully" });
        console.log(projects)
    } else {
        res.status(404).send({ message: "Project not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});