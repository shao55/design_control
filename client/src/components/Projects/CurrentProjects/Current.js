import "./Current.css";
import React from "react";

function CurrentProjects(props) {
    const { projects } = props;

    if (!projects) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ul>
                {projects.map((projects) => (
                    <li key={projects.id}>{projects.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default CurrentProjects;