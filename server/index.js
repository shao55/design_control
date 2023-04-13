const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./models/menuItem")

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }), express.json());

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    console.log("Connected to MongoDB Atlas")
);

app.get("/menu-items", async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).send(menuItems);
    } catch (error) {
        res.status(500).send({ message: "Error getting menu items" });
    }
});

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
    res.status(200).send(filteredProjects);
    console.log("Сработал запрос!");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})