const express = require("express");
const router = express.Router();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));

// router.get("/projects/:category", (req, res) => {
//     const category = req.params.category;
//     const projects = [
//         { id: 1, name: 'Проект 1', category: 'perspective' },
//         { id: 2, name: 'Проект 2', category: 'current' },
//         { id: 3, name: 'Проект 3', category: 'expertise' },
//         { id: 4, name: 'Проект 4', category: 'completed' },
//     ];
//     const filteredProjects = projects.filter(p => p.category === category);
//     res.json(filteredProjects);
// });

app.get("/projects/:category", (req, res) => {
    const category = req.params.category;
    const projects = [
        { id: 1, name: 'Проект 1', category: 'perspective' },
        { id: 2, name: 'Проект 2', category: 'current' },
        { id: 3, name: 'Проект 3', category: 'expertise' },
        { id: 4, name: 'Проект 4', category: 'completed' },
    ];
    // res.json(projects);
    const filteredProjects = projects.filter(p => p.category === category);
    res.json(filteredProjects);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})