import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";

const EditProjectModal = ({ open, handleClose, project }) => {
    const [updatedProject, setUpdatedProject] = useState(project);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedProject((prevProject) => ({
            ...prevProject,
            [name]: value,
        }));
    };

    const onUpdate = () => {
        handleUpdate();
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8000/projects/${project.id}`, updatedProject);
            onUpdate();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Редактировать проект</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Название проекта"
                    value={updatedProject.name}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="customer"
                    label="Заказчик"
                    value={updatedProject.customer}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="management"
                    label="Управление"
                    value={updatedProject.management}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="designOrganization"
                    label="Проектная организация"
                    value={updatedProject.designOrganization}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="curator"
                    label="Куратор"
                    value={updatedProject.curator}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="category"
                    label="Категория"
                    value={updatedProject.category}
                    onChange={handleChange}
                    fullWidth
                />
                {/* Добавьте другие поля для редактирования, аналогично выше */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProjectModal;
