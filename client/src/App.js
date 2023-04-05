import './App.css';
import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import DesignControl from './components/DesignControl/DesignControl';
import Expertise from './components/Expertise/Expertise';
import PerspectiveProjects from './components/Projects/typeOfProjects/PerspectiveProjects/PerspectiveProjects';
import ExpertiseProjects from './components/Projects/typeOfProjects/ExpertiseProjects/ExpertiseProjects';
import CurrentProjects from './components/Projects/typeOfProjects/CurrentProjects/CurrentProjects';
import CompletedProjects from './components/Projects/typeOfProjects/CompletedProjects/CompletedProjects';

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/projects">Projects</NavLink>
          </li>
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
        <Route path='/projects' element={<Projects />}>
          <Route path='perspective' element={<PerspectiveProjects />} />
          <Route path='current' element={<CurrentProjects />} />
          <Route path='expertise' element={<ExpertiseProjects />} />
          <Route path='completed' element={<CompletedProjects />} />
        </Route>
        <Route path='/design-control' element={<DesignControl />} />
        <Route path='/expertise' element={<Expertise />} />
      </Routes>
    </>
  );
}

export default App;