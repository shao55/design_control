import { Grid, Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import ProjectCard from "../ProjectCard";

function ExpertiseProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const fetchProjects = async () => {
        const category = location.pathname.split("/").pop();
        setTimeout(async () => {
            const response = await axios.get(`http://localhost:8000/projects/${category}`);
            setProjects(response.data);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchProjects();
    }, [location.pathname]);

    if (loading) {
        return (
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    };

    if (projects.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Typography variant="h4">Объекты не добавлены</Typography>
            </Box>
        )
    }

    return (
        <Grid container spacing={2} >
            {projects.map((project) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={project._id}>
                    <ProjectCard project={project} handleUpdate={fetchProjects} />
                </Grid>
            ))}
        </Grid>
    );
}


export default ExpertiseProjects;