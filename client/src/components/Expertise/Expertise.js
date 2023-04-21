import React, { useState, useEffect, useRef } from 'react';
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
import * as d3 from 'd3';
import "./Expertise.css"

const Expertise = () => {
    const [startDate, setStartDate] = useState('');
    const [newDates, setNewDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const chartRef = useRef(null);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/allProjects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
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

    const stages = [
        {
            title: 'Дата окончания загрузки ПСД на комплектацию',
            daysToAdd: 5,
            calculateStartDate: () => startDate,
        },
        {
            title: 'Дата подписания договора с Экспертизой',
            daysToAdd: 10,
            useCalendarDays: true,
            calculateStartDate: (prevDates) => prevDates[0],
        },
        {
            title: 'Дата оплаты услуг ГЭ по условиям договора',
            daysToAdd: 2,
            calculateStartDate: (prevDates) => prevDates[1],
        },
        {
            title: 'Поступление оплаты',
            daysToAdd: 1,
            calculateStartDate: (prevDates) => prevDates[2],
        },
        {
            title: 'Дата выдачи мотивированных замечаний',
            daysToAdd: 20,
            calculateStartDate: (prevDates) => prevDates[3],
        },
        {
            title: 'Дата выдачи ответов на мотивированные замечания',
            daysToAdd: 10,
            calculateStartDate: (prevDates) => prevDates[4],
        },
        {
            title: 'Последний день загрузки технической части',
            daysToAdd: 35,
            calculateStartDate: (prevDates) => prevDates[3],
        },
        {
            title: 'Последний день загрузки сметной документации',
            daysToAdd: 40,
            calculateStartDate: (prevDates) => prevDates[3],
        },
        {
            title: 'Дата завершения рассмотрения ответов на замечания',
            daysToAdd: 15,
            calculateStartDate: (prevDates) => prevDates[5],
        },
        {
            title: 'Дата завершения подготовки и оформления экспертного заключения',
            daysToAdd: 15,
            calculateStartDate: (prevDates) => prevDates[5],
        },
        {
            title: 'Дата уведомления о выходе заключения ГЭ',
            daysToAdd: 45,
            calculateStartDate: (prevDates) => prevDates[3],
        },
    ];

    const drawChart = () => {
        if (!chartRef.current) return;

        const data = stages.map((stage, index) => ({
            name: stage.title,
            date: new Date(newDates[index]),
        }));

        const margin = { top: 40, right: 100, bottom: 40, left: 270 };
        const width = chartRef.current.parentElement.clientWidth - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        d3.select(chartRef.current).select('svg').remove();

        const svg = d3
            .select(chartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleTime()
            .domain([
                d3.min(data, (d) => d.date),
                d3.max(data, (d) => d.date),
            ])
            .range([0, width]);

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, height])
            .padding(0.1);

        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg
            .append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).tickFormat('')) // Удалите форматирование меток
            .selectAll('g.tick')
            .append('foreignObject') // Добавьте foreignObject к каждому элементу
            .attr('width', 250)
            .attr('height', y.bandwidth())
            .attr('x', -260) // Расположение по оси X
            .attr('y', -y.bandwidth() / 2) // Расположение по оси Y
            .append('xhtml:div') // Добавьте div внутри foreignObject
            .attr('style', 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; white-space: pre-wrap; width: 250px; text-align: end;')
            .text((d) => d);

        svg
            .selectAll('.point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('cx', (d) => x(d.date))
            .attr('cy', (d) => y(d.name) + y.bandwidth() / 2)
            .attr('r', 5)
            .attr('fill', '#69b3a2');
        svg
            .selectAll('.point-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'point-label')
            .attr('x', (d) => x(d.date) + 10) // Смещение меток вправо от точек
            .attr('y', (d) => y(d.name) + y.bandwidth() / 2 + 5) // Смещение меток по вертикали для центрирования
            .text((d) => d3.timeFormat("%Y-%m-%d")(d.date)) // Форматирование даты
            .style('font-size', '12px')
            .style('fill', '#000');
    };

    useEffect(() => {
        const fetchDates = async () => {
            if (!startDate) return;

            setLoading(true);
            setNewDates([]);
            let prevDates = [];
            for (const stage of stages) {
                try {
                    const startDateForStage = stage.calculateStartDate(prevDates);
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
        fetchDates();
    }, [startDate]);

    useEffect(() => {
        if (newDates.length === stages.length) {
            drawChart();
        }
    }, [newDates]);

    useEffect(() => {
        fetchProjects();
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
                    <div className="chart-wrapper">
                        <div ref={chartRef} />
                    </div>
                </Grid>
            </Paper>
        </Container >
    );
};

export default Expertise;