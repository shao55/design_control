import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Grid,
    Modal,
    Backdrop,
    Fade,
    Button,
    CardActions
} from "@mui/material";

import moment from 'moment';
import EditProjectModal from "./EditProjectModal";

const ProjectCard = ({ project, handleUpdate }) => {
    const [open, setOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleEditModalOpen = () => {
        setEditModalOpen(true);
    };
    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const onUpdate = () => {
        handleUpdate();
    };

    const formatIsoDate = (dateString) => {
        if (!dateString) return "Дата не назначена";
        return moment(dateString).utcOffset('+0600').format('DD.MM.YYYY');
    };

    const startDate = formatIsoDate(project.expertiseDates?.[0]?.dates.find(
        (item) => item.stage === "Дата начала загрузки на комплектацию"
    )?.date);
    const endDate = formatIsoDate(project.expertiseDates?.[0]?.dates.find(
        (item) => item.stage === "Дата уведомления о выходе заключения ГЭ"
    )?.date);

    const categoryTranslations = {
        current: "Текущий",
        perspective: "Перспективный",
        expertise: "В экспертизе",
        completed: "Завершенный",
    };

    const translatedCategory = categoryTranslations[project.category] || project.category;

    return (
        <>
            <Card style={{ minHeight: "400px" }}>
                <CardContent>
                    <Grid container>
                        <Grid item>
                            <Typography
                                variant="subtitle1"
                                style={{ minHeight: "100px" }}
                            >
                                {project.name}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" my={1}>
                                <Chip label={translatedCategory} />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" color="textSecondary">
                                Заказчик:&nbsp;
                                <Typography component="span" color={"black"} display={"inline"} variant="body2">
                                    {project.customer || "Не назначено"}
                                </Typography>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Управление:&nbsp;
                                <Typography component="span" color={"black"} display={"inline"} variant="body2">
                                    {project.management || "Не назначено"}
                                </Typography>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Проектная организация:&nbsp;
                                <Typography component="span" color={"black"} display={"inline"} variant="body2">
                                    {project.designOrganization || "Не назначено"}
                                </Typography>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Куратор:&nbsp;
                                <Typography component="span" color={"black"} display={"inline"} variant="body2">
                                    {project.curator || "Не назначено"}
                                </Typography>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Дата начала загрузки на комплектацию:&nbsp;
                                <Typography component="span" color={"black"} display={"inline"} variant="body2">
                                    {startDate}
                                </Typography>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Дата уведомления о выходе заключения ГЭ:&nbsp;
                                <Typography component="span" color={"black"} display={"inline"} variant="body2">
                                    {endDate}
                                </Typography>
                            </Typography>
                            <Box mt={2}>
                                <CardActions>
                                    <Button size="small" onClick={handleOpen}>Подробнее</Button>
                                    <Button size="small" onClick={handleEditModalOpen}>Редактировать</Button>
                                </CardActions>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div
                        style={{
                            backgroundColor: "white",
                            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
                            padding: "2rem",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <h2>{project.name}</h2>
                        {/* Дополнительная информация о проекте */}
                    </div>
                </Fade>
            </Modal>
            <EditProjectModal onUpdate={onUpdate} open={editModalOpen} handleClose={handleEditModalClose} project={project} />
        </>
    );
};

export default ProjectCard;
