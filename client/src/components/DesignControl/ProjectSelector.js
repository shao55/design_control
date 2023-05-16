import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const ProjectSelector = ({ projects, selectedProjectId, handleProjectChange }) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="project-select-label">Выберите проект</InputLabel>
            <Select
                labelId="project-select-label"
                label="Выберите проект"
                value={selectedProjectId}
                onChange={handleProjectChange}
            >
                {projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                        {project.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ProjectSelector;
