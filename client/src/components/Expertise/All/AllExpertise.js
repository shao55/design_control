import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Container
} from '@mui/material';

function AllExpertise() {
    const [projects, setProjects] = useState([]);
    const [stages, setStages] = useState([]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/allProjects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };
    const fetchStages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/stages');
            setStages(response.data);
        } catch (error) {
            console.error('Error fetching stages:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchStages();
    }, [])

    console.log(projects)

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Название проекта</TableCell>
                            <TableCell align="right">Дата начала загрузки</TableCell>
                            {stages.map((stage, index) => (
                                <TableCell key={index} align="right">
                                    {stage.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects
                            .filter((project) => project.expertiseDates && project.expertiseDates.length > 0)
                            .map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell component="th" scope="row">
                                        {project.name}
                                    </TableCell>
                                    {/* Отображение значений дат здесь */}
                                    {project.expertiseDates[project.expertiseDates.length - 1].dates.map(
                                        (dateObj, index) => (
                                            <TableCell key={index} align="right">
                                                {dateObj.date}
                                            </TableCell>
                                        )
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AllExpertise;