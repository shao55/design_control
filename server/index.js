const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

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

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})