import "./Completed.css";
import React from "react";

function CompletedProjects(props) {
    const { projects } = props;

    console.log(projects);

    if (!projects) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                ))}
            </ul>

            Привет из завершенных проектов
        </div>
    );
}

export default CompletedProjects;
