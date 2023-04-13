import "./Perspective.css";
import React from "react";

function PerspectiveProjects(props) {
    const { projects } = props;

    if (!projects) {
        return <div>Loading...</div>;
    }

    useEffect(() => {
        handleCategoryChange('perspective');
    }, [handleCategoryChange]);

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

export default PerspectiveProjects;