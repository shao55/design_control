const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { addDays, isWeekend, parseISO, isSameDay, format, startOfDay } = require("date-fns");
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());

const MenuItems = [
    {
        id: 1,
        path: "/addProject",
        group: "Проекты",
        title: "Добавить проект",
        icon: "AddBoxIcon",
    },
    {
        id: 2,
        path: "/allProjects",
        group: "Проекты",
        title: "Все проекты",
        icon: "AccountTreeIcon",
    },
    {
        id: 3,
        path: "/projects/perspective",
        group: "Проекты",
        title: "Перспективные",
        icon: "UpdateIcon",
    },
    {
        id: 4,
        path: "/projects/current",
        group: "Проекты",
        title: "Текущие",
        icon: "WorkIcon",
    },
    {
        id: 5,
        path: "/projects/expertise",
        group: "Проекты",
        title: "В экспертизе",
        icon: "PublishedWithChangesIcon",
    },
    {
        id: 6,
        path: "/projects/completed",
        group: "Проекты",
        title: "Завершенные",
        icon: "DoneIcon",
    },
    {
        id: 7,
        path: "/design-control",
        group: "Контроль проектирования",
        title: "Контроль проектирования",
        icon: "PercentIcon",
    },
    {
        id: 8,
        path: "/expertise/add-expertise",
        group: "Прохождение экспертизы",
        title: "Добавить сроки экспертизы",
        icon: "MoreTimeIcon",
    },
    {
        id: 9,
        path: "/expertise/all-expertise",
        group: "Прохождение экспертизы",
        title: "Свод сроков экспертизы",
        icon: "ViewTimelineIcon",
    },
];

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

const holidays = [
    "2023-01-02",
    "2023-01-03",
    "2023-03-08",
    "2023-03-21",
    "2023-03-22",
    "2023-03-23",
    "2023-05-01",
    "2023-05-08",
    "2023-05-09",
    "2023-06-28",
    "2023-07-06",
    "2023-07-07",
    "2023-08-30",
    "2023-10-25",
    "2023-12-18",
    // Формат: "YYYY-MM-DD"
];

const stages = [
    {
        title: 'Дата окончания загрузки ПСД на комплектацию',
        daysToAdd: 5,
        startDateIndex: null,
    },
    {
        title: 'Дата подписания договора с Экспертизой',
        daysToAdd: 10,
        useCalendarDays: true,
        startDateIndex: 0,
    },
    {
        title: 'Дата оплаты услуг ГЭ по условиям договора',
        daysToAdd: 2,
        startDateIndex: 1,
    },
    {
        title: 'Поступление оплаты',
        daysToAdd: 1,
        startDateIndex: 2,
    },
    {
        title: 'Дата выдачи мотивированных замечаний',
        daysToAdd: 20,
        startDateIndex: 3,
    },
    {
        title: 'Дата выдачи ответов на мотивированные замечания',
        daysToAdd: 10,
        startDateIndex: 4,
    },
    {
        title: 'Последний день загрузки технической части',
        daysToAdd: 35,
        startDateIndex: 3,
    },
    {
        title: 'Последний день загрузки сметной документации',
        daysToAdd: 40,
        startDateIndex: 3,
    },
    {
        title: 'Дата завершения рассмотрения ответов на замечания',
        daysToAdd: 15,
        startDateIndex: 5,
    },
    {
        title: 'Дата завершения подготовки и оформления экспертного заключения',
        daysToAdd: 15,
        startDateIndex: 5,
    },
    {
        title: 'Дата уведомления о выходе заключения ГЭ',
        daysToAdd: 45,
        startDateIndex: 3,
    },
];

const template = {
    constructiveGroups: [
        {
            name: 'АР',
            specificWeight: 0.17,
            comment: "Архитектурные решения",
            sheets: [
                {
                    name: "Общие данные, перечень рабочих проектов, пояснительная записка по АР",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Кладочные/обмерные планы этажей",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Маркировочные планы этажей",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Экспликация полов",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Ведомость заполнения дверных и оконных проемов",
                    specificWeight: 0.09,
                    comment: "",
                    changes: []
                },
                {
                    name: "Планы потолка.Узлы и детали потолков",
                    specificWeight: 0.07,
                    comment: "",
                    changes: []
                },
                {
                    name: "План кровли, узлы кровли",
                    specificWeight: 0.03,
                    comment: "",
                    changes: []
                },
                {
                    name: "Разрезы здания",
                    specificWeight: 0.01,
                    comment: "",
                    changes: []
                },
                {
                    name: "Лестницы, планы и разрезы, объемы и спецификация",
                    specificWeight: 0.01,
                    comment: "",
                    changes: []
                },
                {
                    name: "Фасад (ведомость материалов наружной отделки), узлы и детали фасада, спецификация",
                    specificWeight: 0.09,
                    comment: "",
                    changes: []
                },
                {
                    name: "Раздел по лифту",
                    specificWeight: 0.01,
                    comment: "",
                    changes: []
                },
                {
                    name: "Демонтаж, Перегородки, потолки, полы, окна, двери,спецификация",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Схема наружных внутрених витражей",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Развертка стен, выкросы, навигация",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Узлы деформационных швов",
                    specificWeight: 0.09,
                    comment: "",
                    changes: []
                },
                {
                    name: "Узлы лотков и приямков",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Перечень перемычек, спецификация",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Схема усиления стен",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Ведомость отделочных материалов пола, стен, плинтусов",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
                {
                    name: "Крыльцо, узлы и спецификация",
                    specificWeight: 0.05,
                    comment: "",
                    changes: []
                },
            ]
        },
        {
            name: 'ГП',
            specificWeight: 0.08,
            comment: "Генеральный план",
            sheets: [
                {
                    name: "Общие данные",
                    specificWeight: 0.09,
                    comment: "",
                    changes: []
                },
                {
                    name: "Разбивочный план",
                    specificWeight: 0.22,
                    comment: "",
                    changes: []
                },
                {
                    name: "План озеленения",
                    specificWeight: 0.12,
                    comment: "",
                    changes: []
                },
                {
                    name: "План проездов, тротуаров, дорожек, и площадок",
                    specificWeight: 0.12,
                    comment: "",
                    changes: []
                },
                {
                    name: "План расположения МАФ",
                    specificWeight: 0.1,
                    comment: "",
                    changes: []
                },
                {
                    name: "План организации рельефа",
                    specificWeight: 0.12,
                    comment: "",
                    changes: []
                },
                {
                    name: "План земляных масс",
                    specificWeight: 0.11,
                    comment: "",
                    changes: []
                },
                {
                    name: "Конструкции дорожных одежд",
                    specificWeight: 0.12,
                    comment: "",
                    changes: []
                }
            ]
        },
    ]
};

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
        res.status(200).send(MenuItems);
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