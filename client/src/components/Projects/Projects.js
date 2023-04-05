import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Projects() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <NavLink to="perspective">Перспективные проекты</NavLink>
                    </li>
                    <li>
                        <NavLink to="current">Текущие проекты</NavLink>
                    </li>
                    <li>
                        <NavLink to="expertise">Проекты в экспертизе</NavLink>
                    </li>
                    <li>
                        <NavLink to="completed">Завершенные проекты</NavLink>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

export default Projects;