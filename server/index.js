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

const Project = require('./models/project');

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


// Расчет готовности проекта
const calculateReadiness = async (projectId) => {
    let totalReadiness = 0;
    const project = await Project.findById(projectId);

    if (project) {
        project.constructiveGroups.forEach((group) => {
            const groupWeight = group.specificWeight;
            group.sheets.forEach((sheet) => {
                const sheetWeight = sheet.specificWeight;
                const sheetReadiness = sheet.changes.length > 0 ? sheet.changes[sheet.changes.length - 1].readiness : 0;
                totalReadiness += groupWeight * sheetWeight * sheetReadiness;
            });
        });
    }

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
const getReadinessData = async () => {
    let readinessData = {};
    const projects = await Project.find();

    for (const project of projects) {
        const projectId = project._id.toString();
        readinessData[projectId] = {
            projectName: project.name,
            projectReadiness: await calculateReadiness(projectId),
            groupReadiness: {}
        };

        project.constructiveGroups.forEach((group) => {
            const groupId = group._id.toString();
            readinessData[projectId].groupReadiness[groupId] = {
                groupName: group.name,
                groupReadiness: calculateGroupReadiness(group)
            };
        });
    }

    return readinessData;
};

app.get('/readiness', async (req, res) => {
    try {
        const readinessData = await getReadinessData();
        res.json(readinessData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});
// Расчет общего % готовности проектов по категориям
const calculateCategoryReadiness = async () => {
    const categories = {
        'perspective': [],
        'current': [],
        'expertise': [],
        'completed': [],
    };

    const projects = await Project.find({}); // Получение всех проектов из базы данных

    await Promise.all(projects.map(async (project) => {
        const readiness = await calculateReadiness(project._id); // Убедитесь, что calculateReadiness возвращает промис
        categories[project.category].push(parseFloat(readiness));
    }));

    const categoryReadiness = {};

    for (const [category, readinesses] of Object.entries(categories)) {
        const totalReadiness = readinesses.reduce((a, b) => a + b, 0);
        const averageReadiness = readinesses.length > 0 ? totalReadiness / readinesses.length : 0;
        categoryReadiness[category] = averageReadiness.toFixed(2);
    }

    return categoryReadiness;
};

app.get('/categoryReadiness', async (req, res) => {
    const categoryReadiness = await calculateCategoryReadiness(); // calculateCategoryReadiness теперь асинхронная функция
    res.json(categoryReadiness);
});

app.get('/expertiseDates', async (req, res) => {
    try {
        let expertiseDates = [];
        const projects = await Project.find({}).lean();
        projects.forEach(project => {
            if (project.expertiseDates && project.expertiseDates.length > 0) {
                const lastExpertiseDateObj = project.expertiseDates[project.expertiseDates.length - 1];
                if (lastExpertiseDateObj.dates && lastExpertiseDateObj.dates.length > 0) {
                    lastExpertiseDateObj.dates.forEach(dateObj => {
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
        expertiseDates.sort((a, b) => new Date(a.date) - new Date(b.date));
        const currentDate = new Date();
        expertiseDates = expertiseDates.filter(expertiseDateObj => new Date(expertiseDateObj.date) > currentDate);
        expertiseDates = expertiseDates.slice(0, 5);
        console.log(expertiseDates)
        res.json(expertiseDates);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});

app.get('/changes', async (req, res) => {
    try {
        let changes = [];

        const projects = await Project.find({})

        projects.forEach(project => {
            project.constructiveGroups.forEach(group => {
                group.sheets.forEach(sheet => {
                    sheet.changes.forEach(change => {
                        const enrichedChange = {
                            projectId: project._id.toString(),
                            ...change.toObject(),
                            projectName: project.name,
                            groupId: group.name,
                            sheetId: sheet.name,
                        };
                        changes.push(enrichedChange);
                    });
                });
            });
        });

        // Сортируем массив `changes` по `fixationDate` в обратном порядке (сначала самые свежие)
        changes.sort((a, b) => new Date(b.fixationDate) - new Date(a.fixationDate));

        // Отправляем только последние 5 изменений
        res.json(changes.slice(0, 5));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});

app.put('/projects/:projectId/constructiveGroups/:constructiveGroupName/sheets/:sheetName', async (req, res) => {
    const projectId = req.params.projectId;
    const constructiveGroupName = req.params.constructiveGroupName;
    const sheetName = req.params.sheetName;
    const updatedSheet = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const constructiveGroup = project.constructiveGroups.find(cg => cg.name === constructiveGroupName);
        if (!constructiveGroup) {
            return res.status(404).json({ error: 'Constructive group not found' });
        }

        const sheet = constructiveGroup.sheets.find(sheet => sheet.name === sheetName);
        if (!sheet) {
            return res.status(404).json({ error: 'Sheet not found' });
        }

        // Обновите лист с новыми данными
        Object.assign(sheet, updatedSheet);

        // Сохраните обновленный проект
        await project.save();

        // Отправьте обновленный проект в качестве ответа
        res.json(project);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});

app.put("/projects/:id", async (req, res) => {
    const projectId = req.params.id;
    const updatedProject = req.body;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).send("Проект не найден");
        }

        // Обновление полей проекта
        project.name = updatedProject.name;
        project.customer = updatedProject.customer;
        project.management = updatedProject.management;
        project.designOrganization = updatedProject.designOrganization;
        project.curator = updatedProject.curator;
        project.category = updatedProject.category;

        // Здесь вы можете добавить обновление других полей

        // Сохранение обновленного проекта
        const savedProject = await project.save();

        res.status(200).send(savedProject);
    } catch (error) {
        console.error(error);
        res.status(500).send("Внутренняя ошибка сервера");
    }
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

app.get("/projects/:category", async (req, res) => {
    const category = req.params.category;

    try {
        const filteredProjects = await Project.find({ category: category });
        console.log("Сработал запрос!");
        res.json(filteredProjects);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.post("/create", async (req, res) => {
    const newProjectData = req.body;

    if (newProjectData && newProjectData.name) {
        try {
            const newProject = new Project(newProjectData);

            // Save the new project in the database
            const savedProject = await newProject.save();

            res.status(201).json(savedProject);
        } catch (error) {
            console.log(error); // Add this line
            res.status(500).send({ message: "Error creating project", error: error.toString() });
        }
    } else {
        res.status(400).send({ message: "Invalid project data" });
    }
});

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

app.get("/allProjects", async (req, res) => {
    try {
        const projects = await Project.find({});
        console.log("Запрос списка всех проектов");
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.post("/update-project-dates", async (req, res) => {
    const { projectId, expertiseDates } = req.body;

    if (!projectId || !expertiseDates) {
        return res.status(400).send({ message: "Invalid input" });
    }

    try {
        const project = await Project.findById(projectId);
        if (project) {
            project.expertiseDates = expertiseDates;
            await project.save();
            res.status(200).send({ message: "Project dates updated successfully" });
            console.log(project)
        } else {
            res.status(404).send({ message: "Project not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error: " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
});