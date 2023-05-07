import "./Completed.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';

function CompletedProjects() {
    const [projects, setProjects] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchProjects = async () => {
            const category = location.pathname.split("/").pop();
            const response = await axios.get(`http://localhost:8000/projects/${category}`);
            setProjects(response.data);
        };

        fetchProjects();
    }, [location.pathname]);

    if (!projects) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default CompletedProjects;
