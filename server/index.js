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

const menuItems = [
    {
        id: 1,
        path: "/",
        title: "Главная",
        icon: "HomeIcon",
    },
    {
        id: 2,
        title: "Проекты",
        icon: "LayersIcon",
        onClick: "() => toggleProjectsExpanded()",
        subMenuItems: [
            {
                id: 2.1,
                path: "/addProject",
                title: "Добавить проект",
                icon: "AddBoxIcon",
            },
            {
                id: 2.2,
                path: "/projects/perspective",
                title: "Перспективные",
                icon: "UpdateIcon",
            },
            {
                id: 2.3,
                path: "/projects/current",
                title: "Текущие",
                icon: "WorkIcon",
            },
            {
                id: 2.4,
                path: "/projects/expertise",
                title: "В экспертизе",
                icon: "PublishedWithChangesIcon",
            },
            {
                id: 2.5,
                path: "/projects/completed",
                title: "Завершенные",
                icon: "DoneIcon",
            },
        ],
    },
    {
        id: 3,
        path: "/design-control",
        title: "Контроль проектирования",
        icon: "PercentIcon",
    },
    {
        id: 4,
        path: "/expertise",
        title: "Прохождение экспертизы",
        icon: "TableChartIcon",
    },

];

const projects = [
    { id: 1, name: 'Перспективный проект 1', category: 'perspective' },
    { id: 2, name: 'Текущий проект 2', category: 'current' },
    { id: 3, name: 'Проект в экспертизе 3', category: 'expertise' },
    { id: 4, name: 'Завершенный проект 4', category: 'completed' },
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
}

app.get("/menu-items", async (req, res) => {
    try {
        res.status(200).send(menuItems);
    } catch (error) {
        res.status(500).send({ message: "Error getting menu items" });
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


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})