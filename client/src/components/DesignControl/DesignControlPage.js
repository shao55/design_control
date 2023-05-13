import React, { useState, useEffect } from 'react';

import ProjectSelector from './ProjectSelector';
import ConstructiveGroupList from './ConstructiveGroupList';
import SheetList from './SheetList';
import ReadinessInput from './ReadinessInput';
import HistoryChanges from './HistoryChanges';

import axios from "axios";

const DesignControlPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedConstructiveGroupName, setSelectedConstructiveGroupName] = useState(null);
    const [readinessData, setReadinessData] = useState({});

    const fetchReadinessData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/readiness");
            setReadinessData(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных готовности:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get("http://localhost:8000/allProjects");
            const data = await response.data;
            setProjects(data);
        } catch (error) {
            console.error('Ошибка при загрузке данных проекта:', error);
        }
    };

    const handleProjectChange = (event) => {
        const projectId = parseInt(event.target.value);
        setSelectedProjectId(projectId);
        setSelectedProject(projects.find((project) => project.id === projectId));
        setSelectedGroup(null);
        setSelectedSheet(null);
    };

    const handleGroupSelect = (groupName) => {
        setSelectedConstructiveGroupName(groupName);
        setSelectedGroup(selectedProject.constructiveGroups.find((group) => group.name === groupName));
        setSelectedSheet(null);
    };

    const handleSheetClick = (sheet) => {
        setSelectedSheet(sheet);
    };

    const findProject = (projectId) => projects.find((project) => project.id === projectId);
    const findGroup = (project, groupName) => project.constructiveGroups.find((group) => group.name === groupName);
    const findSheet = (group, sheetName) => group.sheets.find((sheet) => sheet.name === sheetName);

    const handleSaveReadiness = async (sheetName, readiness) => {
        try {
            const selectedProject = findProject(selectedProjectId);

            if (!selectedProject) {
                throw new Error("Проект не найден");
            }

            const selectedConstructiveGroup = findGroup(selectedProject, selectedConstructiveGroupName);

            if (!selectedConstructiveGroup) {
                throw new Error("Конструктивная группа не найдена");
            }

            const selectedSheet = findSheet(selectedConstructiveGroup, sheetName);

            if (!selectedSheet) {
                throw new Error("Лист не найден");
            }

            const newChange = {
                readiness,
                fixationDate: new Date().toISOString().slice(0, 10),
            };

            // Add the new change to the sheet's changes array
            selectedSheet.changes.push(newChange);

            const response = await axios.put(
                `http://localhost:8000/projects/${selectedProject.id}/constructiveGroups/${selectedConstructiveGroupName}/sheets/${sheetName}`,
                selectedSheet
            );

            // Update the state with the updated project data received from the backend
            const updatedProject = response.data;
            setProjects(
                projects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            );

            // Update the selected project, group, and sheet
            setSelectedProject(updatedProject);
            setSelectedGroup(findGroup(updatedProject, selectedConstructiveGroupName));
            setSelectedSheet(findSheet(selectedConstructiveGroup, sheetName));

            // Fetch the updated readiness data
            fetchReadinessData();
            console.log(projects);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchReadinessData();
        fetchProjects();
    }, []);

    return (
        <div>
            <ProjectSelector
                projects={projects}
                selectedProjectId={selectedProject?.id || ''}
                handleProjectChange={handleProjectChange}
            />
            {selectedProject && (
                <>
                    <div className="project-readiness">
                        <h2>
                            Общий % готовности проекта:{" "}
                            {readinessData[selectedProject.id]?.projectReadiness || 0}%
                        </h2>
                    </div>
                    <ConstructiveGroupList
                        selectedProject={selectedProject}
                        selectedGroup={selectedGroup}
                        readinessData={readinessData[selectedProject.id]?.groupReadiness || {}}
                        handleGroupSelect={handleGroupSelect}
                    />
                </>
            )}

            {selectedGroup && (
                <SheetList sheets={selectedGroup.sheets} handleSheetClick={handleSheetClick} />
            )}
            {selectedSheet && (
                <>
                    <ReadinessInput sheet={selectedSheet} onSave={handleSaveReadiness} />
                    <HistoryChanges changes={selectedSheet.changes} />
                </>
            )}
        </div>
    );
};

export default DesignControlPage;
