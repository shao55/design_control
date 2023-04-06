import "./Completed.css";
import React from "react";

function CompletedProjects(props) {
    const { projects } = props;

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
        </div>
    );
}

export default CompletedProjects;
