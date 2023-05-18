import React, { useEffect, useState } from "react";

import {
    Button,
    TextField,
    Grid,
    Typography,
    Container,
    Paper,
    IconButton,
    Box,
    InputAdornment,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function AddProject() {
    const initialProjectState = {
        name: '',
        customer: '',
        management: '',
        designOrganization: '',
        curator: '',
        category: '',
        expertiseDates: [],
        constructiveGroups: [],
    }
    const [project, setProject] = useState(initialProjectState);
    const [totalConstructiveWeight, setTotalConstructiveWeight] = useState(0);
    const [totalSheetWeight, setTotalSheetWeight] = useState([]);

    const calculateWeights = () => {
        const newTotalConstructiveWeight = project.constructiveGroups.reduce(
            (acc, group) => acc + parseFloat(group.specificWeight || 0),
            0
        );
        setTotalConstructiveWeight(newTotalConstructiveWeight);

        const newTotalSheetWeight = project.constructiveGroups.map((group) => {
            if (group.sheets && group.sheets.length > 0) {
                return group.sheets.reduce((acc, sheet) => {
                    const specificWeight = sheet.specificWeight === '' ? 0 : parseFloat(sheet.specificWeight);
                    return acc + specificWeight;
                }, 0);
            }
            return 0;
        });
        setTotalSheetWeight(newTotalSheetWeight);
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProject({ ...project, [name]: value });
    };
    const handleConstructiveChange = (index, event) => {
        const { name, value } = event.target;
        const newConstructiveGroups = [...project.constructiveGroups];
        newConstructiveGroups[index][name] = value;
        setProject({ ...project, constructiveGroups: newConstructiveGroups });
    };
    const handleSheetChange = (cIndex, sIndex, event) => {
        const { name, value } = event.target;
        const newConstructiveGroups = [...project.constructiveGroups];
        newConstructiveGroups[cIndex].sheets[sIndex][name] = value;
        setProject({ ...project, constructiveGroups: newConstructiveGroups });
    };
    const addConstructive = () => {
        setProject({
            ...project,
            constructiveGroups: [
                ...project.constructiveGroups,
                { name: '', specificWeight: '', comment: '', sheets: [] },
            ],
        });
    };
    const addSheet = (index) => {
        const newConstructiveGroups = [...project.constructiveGroups];
        newConstructiveGroups[index].sheets.push({
            name: '',
            specificWeight: 0,
            comment: '',
            changes: [],
        });
        setProject({ ...project, constructiveGroups: newConstructiveGroups });
    };
    const removeConstructive = (index) => {
        const newConstructiveGroups = [...project.constructiveGroups];
        newConstructiveGroups.splice(index, 1);
        setProject({ ...project, constructiveGroups: newConstructiveGroups });
    };
    const removeSheet = (cIndex, sIndex) => {
        const newConstructiveGroups = [...project.constructiveGroups];
        newConstructiveGroups[cIndex].sheets.splice(sIndex, 1);
        setProject({ ...project, constructiveGroups: newConstructiveGroups });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });

            if (response.ok) {
                const data = await response.json();
                setProject(initialProjectState);
                console.log('Проект успешно добавлен:', data);
            } else {
                console.error('Ошибка при добавлении проекта:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при добавлении проекта:', error);
        }
    };

    const fetchTemplate = async () => {
        try {
            const response = await fetch('http://localhost:8000/template', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Ошибка при получении шаблона:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при получении шаблона:', error);
        }
    };

    const applyTemplate = async () => {
        const template = await fetchTemplate();
        if (template) {
            setProject((prevState) => ({
                ...prevState,
                constructiveGroups: template.constructiveGroups,
            }));
        }
    };

    useEffect(() => {
        calculateWeights();
    })

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom m={2} >
                Добавить проект
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Название"
                            name="name"
                            value={project.name}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Заказчик"
                            name="customer"
                            value={project.customer}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Управление"
                            name="management"
                            value={project.management}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Проектная организация"
                            name="designOrganization"
                            value={project.designOrganization}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Куратор"
                            name="curator"
                            value={project.curator}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="project-status-label">Статус проекта</InputLabel>
                            <Select
                                labelId="project-status-label"
                                name="category"
                                label="Статус проекта"
                                value={project.category}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="completed">Завершенный</MenuItem>
                                <MenuItem value="expertise">Проект в экспертизе</MenuItem>
                                <MenuItem value="current">Текущий</MenuItem>
                                <MenuItem value="perspective">Перспективный</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {project.constructiveGroups.length > 0 && (
                    <Typography variant="h6" gutterBottom mt={4}>
                        Сумма удельного веса всех конструктивов: {`${Math.round(totalConstructiveWeight * 100)}%`}
                    </Typography>
                )}
                {project.constructiveGroups.map((constructive, cIndex) => (
                    <Box key={cIndex} mt={6} mb={6}>
                        <Paper elevation={12}>
                            <Grid container spacing={2}>
                                <Grid container spacing={2} m={2} alignItems={"center"}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Конструктив"
                                            name="name"
                                            size="small"
                                            value={constructive.name}
                                            onChange={(event) => handleConstructiveChange(cIndex, event)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Удельный вес"
                                            name="specificWeight"
                                            size="small"
                                            value={constructive.specificWeight != null ? Math.round(constructive.specificWeight * 100) : ''}
                                            onChange={(event) => {
                                                const valueAsPercent = event.target.value === '' ? '' : parseFloat(event.target.value) / 100;
                                                handleConstructiveChange(cIndex, { target: { name: event.target.name, value: valueAsPercent } });
                                            }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Комментарий"
                                            name="comment"
                                            size="small"
                                            value={constructive.comment}
                                            onChange={(event) => handleConstructiveChange(cIndex, event)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={() => removeConstructive(cIndex)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box m={2} ml={4}>
                                <Paper elevation={8}>
                                    {constructive.sheets.map((sheet, sIndex) => (
                                        <Grid key={sIndex} container spacing={1} m={2}>
                                            <Grid container spacing={1} pt={2} pb={2} alignItems={"center"}>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Лист"
                                                        name="name"
                                                        size="small"
                                                        value={sheet.name}
                                                        onChange={(event) => handleSheetChange(cIndex, sIndex, event)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Удельный вес"
                                                        name="specificWeight"
                                                        size="small"
                                                        value={sheet.specificWeight != null ? Math.round(sheet.specificWeight * 100) : ''}
                                                        onChange={(event) => {
                                                            const valueAsPercent = event.target.value === '' ? '' : parseFloat(event.target.value) / 100;
                                                            handleSheetChange(cIndex, sIndex, { target: { name: event.target.name, value: valueAsPercent } });
                                                        }}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Комментарий"
                                                        name="comment"
                                                        size="small"
                                                        value={sheet.comment}
                                                        onChange={(event) => handleSheetChange(cIndex, sIndex, event)}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <IconButton onClick={() => removeSheet(cIndex, sIndex)}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Paper>
                            </Box>
                            <Grid container justifyContent="flex-start" spacing={2} p={2}>
                                <Grid item>
                                    {totalSheetWeight[cIndex] != null && (
                                        <Typography variant="h6" gutterBottom>
                                            Сумма удельного веса всех листов в конструктиве: {`${Math.round(totalSheetWeight[cIndex] * 100)}%`}
                                        </Typography>
                                    )}
                                    <Button
                                        onClick={() => addSheet(cIndex)}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                    >
                                        Добавить лист
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                ))}
                <Grid container justifyContent="space-between" spacing={2} pt={2} pb={4}>
                    <Grid item>
                        <Button
                            onClick={addConstructive}
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                        >
                            Добавить конструктив
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={applyTemplate}
                            variant="contained"
                            color="secondary"
                        >
                            Применить шаблон
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                            Сохранить
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default AddProject;
