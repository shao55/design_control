import './App.css';
import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import DesignControl from './components/DesignControl/DesignControl';
import Expertise from './components/Expertise/Expertise';

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
        <Route path='/projects/*' element={<Projects />} />
        <Route path='/design-control' element={<DesignControl />} />
        <Route path='/expertise' element={<Expertise />} />
      </Routes>
    </>
  );
}

export default App;