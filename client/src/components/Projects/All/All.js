import { Grid, Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "../ProjectCard";

function AllProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        setTimeout(async () => {
            const response = await axios.get("http://localhost:8000/allProjects");
            setProjects(response.data);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

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

export default AllProjects;
