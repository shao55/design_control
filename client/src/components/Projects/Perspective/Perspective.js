import "./Perspective.css";
import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import ProjectCard from "../ProjectCard";

function PerspectiveProjects() {
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
        <Grid container spacing={2} >
            {projects.map((project) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={project.id}>
                    <ProjectCard project={project} />
                </Grid>
            ))}
        </Grid>
    );
}

export default PerspectiveProjects;