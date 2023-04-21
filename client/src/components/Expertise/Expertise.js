import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Typography,
    Grid,
    Container,
    Paper,
    CircularProgress,
    Card
} from '@mui/material';

const Expertise = () => {
    const [startDate, setStartDate] = useState('');
    const [newDates, setNewDates] = useState([]);
    const [loading, setLoading] = useState(false);
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
        if (!window.google || !window.google.visualization) return;
        const data = new window.google.visualization.DataTable();
        data.addColumn('string', 'Task ID');
        data.addColumn('string', 'Task Name');
        data.addColumn('date', 'Start Date');
        data.addColumn('date', 'End Date');
        data.addColumn('number', 'Duration');
        data.addColumn('number', 'Percent Complete');
        data.addColumn('string', 'Dependencies');

        data.addRows(
            stages.map((stage, index) => {
                const startDate = new Date(newDates[index]);
                const endDate = new Date(newDates[index + 1] || newDates[index]);
                endDate.setDate(endDate.getDate() + (index === stages.length - 1 ? 0 : 1));
                return [
                    `task${index}`,
                    stage.title,
                    startDate,
                    endDate,
                    null,
                    100,
                    index === 0 ? null : `task${index - 1}`,
                ];
            })
        );

        const options = {
            height: 500,
            width: 1200,
            gantt: {
                criticalPathEnabled: false,
            },
        };

        const chart = new window.google.visualization.Gantt(
            document.getElementById('chart_div')
        );

        chart.draw(data, options);
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
        if (!loading) {
            drawChart();
        }
        fetchDates();
    }, [startDate, loading]);

    useEffect(() => {
        window.google.charts.load('current', { packages: ['gantt'] });
    }, []);



    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '1rem' }}>
                <Typography variant="h4" gutterBottom>
                    Прохождение экспертизы
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Дата начала загрузки проекта на комплектацию"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    {stages.map((stage, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="outlined" style={{ padding: '1rem', textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
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
            {!loading && window.google && window.google.visualization && (
                <div id="chart_div" style={{ marginTop: '2rem' }} />
            )}

        </Container>
    );
};

export default Expertise;