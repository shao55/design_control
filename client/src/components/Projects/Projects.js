import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import Perspective from './typeOfProjects/PerspectiveProjects/Perspective';
import Current from './typeOfProjects/CurrentProjects/Current';
import Expertise from './typeOfProjects/ExpertiseProjects/Expertise';
import Completed from './typeOfProjects/CompletedProjects/Completed';


function Projects() {

    const [projects, setProjects] = useState([]);
    const propsToPass = {
        projects: projects,
    };

    const handleCategoryChange = async (category) => {
        const response = await axios.get(`http://localhost:8000/projects/${category}`);
        setProjects(response.data);
    };

    // console.log(projects);

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/projects/perspective">Перспективные проекты</NavLink>
                    </li>
                    <li>
                        <NavLink onClick={() => handleCategoryChange("current")} to="/projects/current">Текущие проекты</NavLink>
                    </li>
                    <li>
                        <NavLink onClick={() => handleCategoryChange("expertise")} to="/projects/expertise">Проекты в экспертизе</NavLink>
                    </li>
                    <li>
                        <NavLink onClick={() => handleCategoryChange("completed")} to="/projects/completed">Завершенные проекты</NavLink>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/projects/perspective" element={<Perspective />} />
                <Route path="/projects/current" element={<Current />} />
                <Route path="/projects/expertise" element={<Expertise />} />
                <Route path="/projects/completed" element={<Completed />} />
            </Routes>
        </div>
    );
}

export default Projects;