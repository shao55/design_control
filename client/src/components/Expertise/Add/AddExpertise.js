import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Typography,
    Grid,
    Container,
    Paper,
    CircularProgress,
    Card,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button
} from '@mui/material';
import D3TimeLine from "./D3TimeLine";

const AddExpertise = () => {
    const [startDate, setStartDate] = useState('');
    const [newDates, setNewDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
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
            const response = await axios.get("http://localhost:8000/stages");
            setStages(response.data)
        } catch (error) {
            console.error("Error fetching stages", error);
        }
    };

    const findLatestStartDate = (projectId) => {
        const project = projects.find((project) => project.id === projectId);
        if (project && project.expertiseDates.length > 0) {
            const latestExpertiseDate = project.expertiseDates.reduce((prev, curr) =>
                prev.saveDate > curr.saveDate ? prev : curr
            );
            const startDateObj = latestExpertiseDate.dates.find(
                (dateObj) => dateObj.stage === "Дата начала загрузки на комплектацию"
            );
            if (startDateObj) {
                return startDateObj.date;
            }
        }
        return "";
    };

    const handleProjectSelect = (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        if (projectId) {
            const latestStartDate = findLatestStartDate(projectId);
            setStartDate(latestStartDate);
        } else {
            setStartDate("");
        }
    };

    const handleSave = async () => {
        // Проверяем, выбран ли проект и дата
        if (!selectedProject || !startDate) {
            alert("Выберите проект и дату");
            return;
        }
        const newExpertiseDate = {
            saveDate: new Date().toISOString().slice(0, 10), // текущая дата сохранения
            dates: [
                {
                    stage: "Дата начала загрузки на комплектацию",
                    date: startDate,
                },
                ...stages.map((stage, index) => ({
                    stage: stage.title,
                    date: newDates[index],
                })),
            ],
        };
        // Обновляем массив expertiseDates выбранного проекта
        const updatedExpertiseDates = [
            ...projects.find((project) => project.id === selectedProject).expertiseDates,
            newExpertiseDate,
        ];
        // Отправляем данные на бэкенд для обновления
        try {
            const response = await fetch("http://localhost:8000/update-project-dates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ projectId: selectedProject, expertiseDates: updatedExpertiseDates }),
            });
            if (response.status === 200) {
                setSelectedProject('');
                setStartDate('');
                setNewDates([]);
                fetchProjects();
                alert("Даты успешно сохранены");
                // Если нужно обновить данные проекта на фронтенде, это надо сделать тут
            } else {
                alert("Ошибка при сохранении дат");
            }
        } catch (error) {
            console.error("Error updating project dates:", error);
            alert("Ошибка при сохранении дат");
        }
    };

    const calculateStartDate = (startDateIndex, prevDates) => {
        if (startDateIndex === null) {
            return startDate;
        }
        return prevDates[startDateIndex];
    };

    const fetchDates = async () => {
        if (!startDate) return;

        setLoading(true);
        setNewDates([]);
        let prevDates = [];
        for (const stage of stages) {
            try {
                const startDateForStage = calculateStartDate(stage.startDateIndex, prevDates);
                const response = await axios.post(
                    'http://localhost:8000/calculate-date',
                    {
                        startDate: startDateForStage,
                        daysToAdd: stage.daysToAdd,
                        timeZone: 'Asia/Almaty',
                        useCalendarDays: stage.useCalendarDays,
                    }
                );
                prevDates.push(response.data.newDate);
                setNewDates((prevDates) => [...prevDates, response.data.newDate]);
            } catch (error) {
                console.error('Error calculating date:', error);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDates();
    }, [startDate]);

    useEffect(() => {
        fetchProjects();
        fetchStages();
    }, []);

    return (
        <Container maxWidth="xl">
            <Paper elevation={12} style={{ padding: '1rem', marginTop: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    Сроки прохождения экспертизы
                </Typography>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid item xs={5}>
                        <FormControl fullWidth>
                            <InputLabel id="project-select-label">Выберите проект</InputLabel>
                            <Select
                                labelId="project-select-label"
                                label="Выберите проект"
                                value={selectedProject}
                                onChange={handleProjectSelect}
                            >
                                {projects.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label="Дата начала загрузки проекта на комплектацию"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Сохранить
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1} mt={1}>
                    {stages.map((stage, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                            <Card
                                variant="outlined"
                                style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    minHeight: '150px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="h8" gutterBottom>
                                    {stage.title}:
                                </Typography>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <Typography variant="body1">
                                        {newDates[index] || 'N/A'}
                                    </Typography>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Paper>
            <Paper elevation={12} style={{ padding: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>
                <Typography variant="h4">
                    График прохождения экспертизы
                </Typography>
                <Grid item mb={4}>
                    {startDate.length > 0 && (
                        <div className="chart-wrapper">
                            <D3TimeLine stages={stages} newDates={newDates} />
                        </div>
                    )}
                </Grid>
            </Paper>
        </Container >
    );
};

export default AddExpertise;