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
        onClick: "toggleProjectsExpanded",
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
        title: "Прохождение экспертизы",
        icon: "LayersIcon",
        onClick: "toggleExpertiseExpanded",
        subMenuItems: [
            {
                id: 4.1,
                path: "/expertise/add-expertise",
                title: "Добавить сроки экспертизы",
                icon: "MoreTimeIcon",
            },
            {
                id: 4.2,
                path: "/expertise/all-expertise",
                title: "Свод сроков экспертизы",
                icon: "ViewTimelineIcon",
            },
        ],
    },

];

const projects = [
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
    {
        id: 4,
        name: 'Обновленный завершенный проект 4 с новой структурой',
        customer: '',
        management: '',
        management: '',
        designOrganization: '',
        curator: '',
        category: 'completed',
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