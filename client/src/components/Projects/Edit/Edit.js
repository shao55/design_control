// import React, { useState, useEffect } from 'react';
// import axios from "axios";
// import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
// import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

// function EditProject() {
//     const [projects, setProjects] = useState([]);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [updatedProject, setUpdatedProject] = useState(null);

//     const fetchProjects = async () => {
//         try {
//             const response = await axios.get("http://localhost:8000/allProjects");
//             const data = await response.data;
//             setProjects(data);
//         } catch (error) {
//             console.error('Ошибка при загрузке данных проекта:', error);
//         }
//     };

//     const handleConstructiveChange = (cIndex, event) => {
//         const { name, value } = event.target;
//         setUpdatedProject(prevProject => {
//             const newProject = { ...prevProject };
//             newProject.constructiveGroups[cIndex][name] = value;
//             return newProject;
//         });
//     };

//     const handleSheetChange = (cIndex, sIndex, event) => {
//         const { name, value } = event.target;
//         setUpdatedProject(prevProject => {
//             const newProject = { ...prevProject };
//             newProject.constructiveGroups[cIndex].sheets[sIndex][name] = value;
//             return newProject;
//         });
//     };

//     const addConstructive = () => {
//         setUpdatedProject(prevProject => {
//             const newProject = { ...prevProject };
//             newProject.constructiveGroups.push({ name: '', sheets: [] });
//             return newProject;
//         });
//     };

//     const removeConstructive = (cIndex) => {
//         setUpdatedProject(prevProject => {
//             const newProject = { ...prevProject };
//             newProject.constructiveGroups.splice(cIndex, 1);
//             return newProject;
//         });
//     };

//     const addSheet = (cIndex) => {
//         setUpdatedProject(prevProject => {
//             const newProject = { ...prevProject };
//             newProject.constructiveGroups[cIndex].sheets.push({ name: '' });
//             return newProject;
//         });
//     };

//     const removeSheet = (cIndex, sIndex) => {
//         setUpdatedProject(prevProject => {
//             const newProject = { ...prevProject };
//             newProject.constructiveGroups[cIndex].sheets.splice(sIndex, 1);
//             return newProject;
//         });
//     };

//     const handleProjectChange = (event) => {
//         const projectId = event.target.value;
//         const project = projects.find((project) => project._id === projectId);
//         setSelectedProject(project);
//         setUpdatedProject({ ...project }); // клонируем выбранный проект
//     };

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setUpdatedProject((prevProject) => ({
//             ...prevProject,
//             [name]: value,
//         }));
//     };

//     const handleSave = async () => {
//         if (!updatedProject) return;
//         try {
//             const response = await axios.put(`http://localhost:8000/projects/${updatedProject._id}`, updatedProject);
//             if (response.status === 200) {  // проверяем статус ответа
//                 alert("Проект успешно обновлен!");  // выводим сообщение об успешном обновлении
//                 setSelectedProject(null);  // обнуляем выбранный проект
//                 setUpdatedProject(null);  // обнуляем обновленный проект
//                 fetchProjects(); // обновляем список проектов после сохранения
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     return (
//         <div>
//             <FormControl fullWidth>
//                 <InputLabel id="project-select-label">Выберите проект</InputLabel>
//                 <Select
//                     labelId="project-select-label"
//                     label="Выберите проект"
//                     value={selectedProject ? selectedProject._id : ''}
//                     onChange={handleProjectChange}
//                 >
//                     {projects.map((project) => (
//                         <MenuItem key={project._id} value={project._id}>
//                             {project.name}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//             {updatedProject && (
//                 <div>
//                     <TextField
//                         margin="dense"
//                         name="name"
//                         label="Название проекта"
//                         value={updatedProject.name}
//                         onChange={handleChange}
//                         fullWidth
//                     />
//                     <TextField
//                         margin="dense"
//                         name="customer"
//                         label="Заказчик"
//                         value={updatedProject.customer}
//                         onChange={handleChange}
//                         fullWidth
//                     />
//                     <TextField
//                         margin="dense"
//                         name="management"
//                         label="Управление"
//                         value={updatedProject.management}
//                         onChange={handleChange}
//                         fullWidth
//                     />
//                     <TextField
//                         margin="dense"
//                         name="designOrganization"
//                         label="Проектная организация"
//                         value={updatedProject.designOrganization}
//                         onChange={handleChange}
//                         fullWidth
//                     />
//                     <TextField
//                         margin="dense"
//                         name="curator"
//                         label="Куратор"
//                         value={updatedProject.curator}
//                         onChange={handleChange}
//                         fullWidth
//                     />
//                     <FormControl margin="dense" fullWidth>
//                         <InputLabel id="project-status-label">Статус проекта</InputLabel>
//                         <Select
//                             labelId="project-status-label"
//                             name="category"
//                             label="Статус проекта"
//                             value={updatedProject.category}
//                             onChange={handleChange}
//                         >
//                             <MenuItem value="completed">Завершенный</MenuItem>
//                             <MenuItem value="expertise">Проект в экспертизе</MenuItem>
//                             <MenuItem value="current">Текущий</MenuItem>
//                             <MenuItem value="perspective">Перспективный</MenuItem>
//                         </Select>
//                     </FormControl>
//                     {updatedProject.constructiveGroups.map((constructive, cIndex) => (
//                         <Box key={cIndex} mt={6} mb={6}>
//                             <Paper elevation={12}>
//                                 <Grid container spacing={2}>
//                                     <Grid container spacing={2} m={2} alignItems={"center"}>
//                                         <Grid item xs={12} sm={4}>
//                                             <TextField
//                                                 fullWidth
//                                                 required
//                                                 label="Конструктив"
//                                                 name="name"
//                                                 size="small"
//                                                 value={constructive.name}
//                                                 onChange={(event) => handleConstructiveChange(cIndex, event)}
//                                             />
//                                         </Grid>
//                                         <Grid item>
//                                             <IconButton onClick={() => removeConstructive(cIndex)}>
//                                                 <RemoveIcon />
//                                             </IconButton>
//                                         </Grid>
//                                     </Grid>
//                                 </Grid>
//                                 <Box m={2} ml={4}>
//                                     <Paper elevation={8}>
//                                         {constructive.sheets.map((sheet, sIndex) => (
//                                             <Grid key={sIndex} container spacing={1} m={2}>
//                                                 <Grid container spacing={1} pt={2} pb={2} alignItems={"center"}>
//                                                     <Grid item xs={12} sm={4}>
//                                                         <TextField
//                                                             fullWidth
//                                                             required
//                                                             label="Лист"
//                                                             name="name"
//                                                             size="small"
//                                                             value={sheet.name}
//                                                             onChange={(event) => handleSheetChange(cIndex, sIndex, event)}
//                                                         />
//                                                     </Grid>
//                                                     <Grid item>
//                                                         <IconButton onClick={() => removeSheet(cIndex, sIndex)}>
//                                                             <RemoveIcon />
//                                                         </IconButton>
//                                                     </Grid>
//                                                 </Grid>
//                                             </Grid>
//                                         ))}
//                                     </Paper>
//                                 </Box>
//                                 <Grid container justifyContent="flex-start" spacing={2} p={2}>
//                                     <Grid item>
//                                         <Button
//                                             onClick={() => addSheet(cIndex)}
//                                             variant="contained"
//                                             color="primary"
//                                             startIcon={<AddIcon />}
//                                         >
//                                             Добавить лист
//                                         </Button>
//                                     </Grid>
//                                 </Grid>
//                             </Paper>
//                         </Box>
//                     ))}
//                     <Grid container justifyContent="space-between" spacing={2} pt={2} pb={4}>
//                         <Grid item>
//                             <Button
//                                 onClick={addConstructive}
//                                 variant="contained"
//                                 color="primary"
//                                 startIcon={<AddIcon />}
//                             >
//                                 Добавить конструктив
//                             </Button>
//                         </Grid>
//                         <Grid item>
//                             <Button type="submit" variant="contained" color="primary">
//                                 Сохранить
//                             </Button>
//                         </Grid>
//                     </Grid>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default EditProject;
