const express = require("express");
// const router = express.Router();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));

app.get("/projects/:category", (req, res) => {
    const category = req.params.category;
    const projects = [
        { id: 1, name: 'Перспективный проект 1', category: 'perspective' },
        { id: 2, name: 'Текущий проект 2', category: 'current' },
        { id: 3, name: 'Проект в экспертизе 3', category: 'expertise' },
        { id: 4, name: 'Завершенный проект 4', category: 'completed' },
        { id: 5, name: 'Перспективный проект 1', category: 'perspective' },
        { id: 6, name: 'Текущий проект 2', category: 'current' },
        { id: 7, name: 'Проект в экспертизе 3', category: 'expertise' },
        { id: 8, name: 'Завершенный проект 4', category: 'completed' },
        { id: 9, name: 'Перспективный проект 1', category: 'perspective' },
        { id: 10, name: 'Текущий проект 2', category: 'current' },
        { id: 11, name: 'Проект в экспертизе 3', category: 'expertise' },
        { id: 12, name: 'Завершенный проект 4', category: 'completed' },
        { id: 13, name: 'Перспективный проект 1', category: 'perspective' },
        { id: 14, name: 'Текущий проект 2', category: 'current' },
        { id: 15, name: 'Проект в экспертизе 3', category: 'expertise' },
        { id: 16, name: 'Завершенный проект 4', category: 'completed' },
    ];
    const filteredProjects = projects.filter(p => p.category === category);
    res.json(filteredProjects);
    console.log("Сработал запрос!");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})