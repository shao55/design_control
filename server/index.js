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