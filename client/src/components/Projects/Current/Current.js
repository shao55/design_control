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
                {projects.map((project) => (
                    <li key={project.id}>
                        <h3>{project.name}</h3>
                        <p>Customer: {project.customer}</p>
                        <p>Management: {project.management}</p>
                        <p>Design Organization: {project.designOrganization}</p>
                        <p>Curator: {project.curator}</p>
                        <p>Category: {project.category}</p>
                        <p>Expertise Dates:</p>
                        <ul>
                            {project.expertiseDates.map((expertiseDate, index) => (
                                <li key={index}>
                                    Save Date: {expertiseDate.saveDate}
                                    <ul>
                                        {expertiseDate.dates.map((date, dateIndex) => (
                                            <li key={dateIndex}>
                                                {date.stage}: {date.date}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <p>Constructive Groups:</p>
                        <ul>
                            {project.constructiveGroups.map((group, index) => (
                                <li key={index}>
                                    Name: {group.name}
                                    <p>Specific Weight: {group.specificWeight}</p>
                                    <p>Comment: {group.comment}</p>
                                    <p>Sheets:</p>
                                    <ul>
                                        {group.sheets.map((sheet, sheetIndex) => (
                                            <li key={sheetIndex}>
                                                Name: {sheet.name}
                                                <p>Specific Weight: {sheet.specificWeight}</p>
                                                <p>Comment: {sheet.comment}</p>
                                                <p>Changes:</p>
                                                <ul>
                                                    {sheet.changes.map((change, changeIndex) => (
                                                        <li key={changeIndex}>
                                                            Readiness: {change.readiness}
                                                            <br />
                                                            Fixation Date: {change.fixationDate}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CurrentProjects;
