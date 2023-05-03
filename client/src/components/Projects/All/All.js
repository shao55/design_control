import "./All.css";
import React from "react";

function AllProjects(props) {
    const { projects } = props;

    if (!projects) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            Все проекты!
        </div>
    );
}

export default AllProjects;
