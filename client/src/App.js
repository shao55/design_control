import './App.css';
import React, { useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import axios from "axios";

import Home from './components/Home/Home';
import DesignControl from './components/DesignControl/DesignControl';
import Expertise from './components/Expertise/Expertise';
import PerspectiveProjects from './components/Projects/PerspectiveProjects/Perspective';
import CurrentProjects from './components/Projects/CurrentProjects/Current';
import ExpertiseProjects from './components/Projects/ExpertiseProjects/Expertise';
import CompletedProjects from './components/Projects/CompletedProjects/Completed';

function App() {

  const [isProjectsExpanded, setProjectsExpanded] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleCategoryChange = async (category) => {
    const response = await axios.get(`http://localhost:8000/projects/${category}`);
    setProjects(response.data);
  };

  const toggleProjectsExpanded = () => {
    setProjectsExpanded(!isProjectsExpanded);
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

          <NavLink onClick={toggleProjectsExpanded}>Projects</NavLink>
          {isProjectsExpanded && (
            <ul>
              <li>
                <NavLink onClick={() => handleCategoryChange("perspective")} to="/projects/perspective">Перспективные</NavLink>
              </li>
              <li>
                <NavLink onClick={() => handleCategoryChange("current")} to="/projects/current">Текущие</NavLink>
              </li>
              <li>
                <NavLink onClick={() => handleCategoryChange("expertise")} to="/projects/expertise">В экспертизе</NavLink>
              </li>
              <li>
                <NavLink onClick={() => handleCategoryChange("completed")} to="/projects/completed">Завершенные</NavLink>
              </li>
            </ul>
          )}
          <li>
            <NavLink to="/design-control">Design Control</NavLink>
          </li>
          <li>
            <NavLink to="/expertise">Expertise</NavLink>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/projects/perspective' element={<PerspectiveProjects projects={projects} />} />
        <Route path='/projects/current' element={<CurrentProjects projects={projects} />} />
        <Route path='/projects/expertise' element={<ExpertiseProjects projects={projects} />} />
        <Route path='/projects/completed' element={<CompletedProjects projects={projects} />} />
        <Route path='/design-control' element={<DesignControl />} />
        <Route path='/expertise' element={<Expertise />} />
      </Routes>
    </>
  );
}

export default App;