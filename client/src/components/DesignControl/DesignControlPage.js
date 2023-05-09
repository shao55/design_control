import React, { useState, useEffect } from 'react';
import ProjectSelector from './ProjectSelector';
import ConstructiveGroupList from './ConstructiveGroupList';
import SheetList from './SheetList';
import ReadinessInput from './ReadinessInput';
import axios from "axios";

const DesignControlPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedConstructiveGroupName, setSelectedConstructiveGroupName] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("http://localhost:8000/allProjects");
                const data = await response.data;
                setProjects(data);
            } catch (error) {
                console.error('Ошибка при загрузке данных проекта:', error);
            }
        };

        fetchProjects();
    }, []);

    const calculateProjectReadiness = () => {
        if (!selectedProject) {
            return 0;
        }
        let totalReadiness = 0;
        selectedProject.constructiveGroups.forEach((group) => {
            const groupWeight = group.specificWeight;

            group.sheets.forEach((sheet) => {
                const sheetWeight = sheet.specificWeight;
                const sheetReadiness = sheet.changes.length > 0 ? sheet.changes[sheet.changes.length - 1].readiness : 0;

                totalReadiness += groupWeight * sheetWeight * sheetReadiness;
            });
        });

        return totalReadiness.toFixed(2);
    };

    const calculateConstructiveGroupReadiness = (group) => {
        let totalReadiness = 0;

        group.sheets.forEach((sheet) => {
            const sheetWeight = sheet.specificWeight;
            const sheetReadiness = sheet.changes.length > 0 ? sheet.changes[sheet.changes.length - 1].readiness : 0;

            totalReadiness += sheetWeight * sheetReadiness;
        });

        return totalReadiness.toFixed(2);
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
    const handleSaveReadiness = async (sheetName, readiness) => {
        const selectedProject = projects.find((project) => project.id === selectedProjectId);

        if (selectedProject) {
            const selectedConstructiveGroup = selectedProject.constructiveGroups.find(
                (group) => group.name === selectedConstructiveGroupName
            );

            if (selectedConstructiveGroup) {
                const selectedSheet = selectedConstructiveGroup.sheets.find(
                    (sheet) => sheet.name === sheetName
                );

                if (selectedSheet) {
                    const newChange = {
                        readiness,
                        fixationDate: new Date().toISOString().slice(0, 10),
                    };

                    // Add the new change to the sheet's changes array
                    selectedSheet.changes.push(newChange);

                    try {
                        const response = await axios.put(
                            `http://localhost:8000/projects/${selectedProject.id}/constructiveGroups/${selectedConstructiveGroupName}/sheets/${sheetName}`,
                            selectedSheet
                        );

                        // Update the state with the updated project data
                        const updatedProject = response.data;
                        setProjects(
                            projects.map((project) =>
                                project.id === updatedProject.id ? updatedProject : project
                            )
                        );
                    } catch (error) {
                        console.error("Ошибка при сохранении процента готовности:", error);
                    }
                } else {
                    console.error("Лист не найден");
                }
            } else {
                console.error("Конструктивная группа не найдена");
            }
        } else {
            console.error("Проект не найден");
        }
    };

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
                        <h3>Общий % готовности проекта: {calculateProjectReadiness()}%</h3>
                    </div>
                    <ConstructiveGroupList
                        selectedProject={selectedProject}
                        selectedGroup={selectedGroup}
                        calculateConstructiveGroupReadiness={calculateConstructiveGroupReadiness}
                        handleGroupSelect={handleGroupSelect}
                    />
                </>
            )}

            {selectedGroup && (
                <SheetList sheets={selectedGroup.sheets} handleSheetClick={handleSheetClick} />
            )}
            {selectedSheet && <ReadinessInput sheet={selectedSheet} onSave={handleSaveReadiness} />}
        </div>
    );
};

export default DesignControlPage;
