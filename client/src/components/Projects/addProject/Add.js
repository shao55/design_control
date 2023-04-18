import "./Add.css";
import React, { useState } from "react";

import {
    Button,
    TextField,
    Grid,
    Typography,
    Container,
    Paper,
    IconButton,
    Box,
    InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function AddProject() {
    const [project, setProject] = useState({
        name: '',
        customer: '',
        management: '',
        designOrganization: '',
        curator: '',
        projectStatus: '',
        constructiveGroups: [],
    });

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
            specificWeight: '',
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
            const response = await fetch('Добавить адрес ПОСТ запроса', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Проект успешно добавлен:', data);
            } else {
                console.error('Ошибка при добавлении проекта:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при добавлении проекта:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Добавить проект
            </Typography>
            <form onSubmit={handleSubmit}>
                {/* Основные свойства проекта */}
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
                        <TextField
                            fullWidth
                            required
                            label="Статус проекта"
                            name="projectStatus"
                            value={project.projectStatus}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>

                {/* Конструктивы и листы */}
                {project.constructiveGroups.map((constructive, cIndex) => (
                    <Box key={cIndex} mt={6} mb={6}>
                        <Paper elevation={12}>
                            <Grid container spacing={2}>
                                {/* Свойства конструктива */}
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
                                            value={constructive.specificWeight != null ? constructive.specificWeight * 100 : ''} // Умножаем на 100 для отображения в виде процента, если значение установлено
                                            onChange={(event) => {
                                                // Конвертируем введенное значение в процент и вызываем handleConstructiveChange
                                                const valueAsPercent = parseFloat(event.target.value) / 100;
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


                            {constructive.sheets.map((sheet, sIndex) => (
                                <Box key={sIndex} m={2} ml={4}>
                                    <Paper elevation={8}>
                                        <Grid container spacing={1} m={2}>
                                            {/* Свойства листа */}
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
                                                        value={sheet.specificWeight}
                                                        onChange={(event) => handleSheetChange(cIndex, sIndex, event)}
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
                                    </Paper>

                                </Box>
                            ))}

                            <Grid container justifyContent="flex-start" spacing={2} p={2}>
                                <Grid item>
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
