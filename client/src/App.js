import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

import './App.css';
import { ListItemButton, ListItemIcon, Backdrop, CircularProgress } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import HomeIcon from '@mui/icons-material/Home';
import UpdateIcon from '@mui/icons-material/Update';
import WorkIcon from '@mui/icons-material/Work';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DoneIcon from '@mui/icons-material/Done';
import PercentIcon from '@mui/icons-material/Percent';
import TableChartIcon from '@mui/icons-material/TableChart';
import AddBoxIcon from '@mui/icons-material/AddBox';

import Home from './components/Home/Home';
import DesignControl from './components/DesignControl/DesignControl';
import Expertise from './components/Expertise/Expertise';
import PerspectiveProjects from './components/Projects/Perspective/Perspective';
import CurrentProjects from './components/Projects/Current/Current';
import ExpertiseProjects from './components/Projects/Expertise/Expertise';
import CompletedProjects from './components/Projects/Completed/Completed';
import AddProject from './components/Projects/Add/Add';

function App() {

  const iconMap = {
    '/': HomeIcon,
    '/projects/perspective': UpdateIcon,
    '/projects/current': WorkIcon,
    '/projects/expertise': PublishedWithChangesIcon,
    '/projects/completed': DoneIcon,
    '/design-control': PercentIcon,
    '/expertise': TableChartIcon,
    '/addProject': AddBoxIcon,
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [isProjectsExpanded, setProjectsExpanded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCategoryChange = async (category) => {
    const response = await axios.get(`http://localhost:8000/projects/${category}`);
    setProjects(response.data);
  };
  const saveStateToSessionStorage = (params) => {
    sessionStorage.setItem("isProjectsListExpanded", JSON.stringify(params));
  }
  const loadStateToSessionStorage = () => {
    const isExpanded = JSON.parse(sessionStorage.getItem("isProjectsListExpanded"));
    if (isExpanded) {
      setProjectsExpanded(isExpanded);
    }
  }
  const toggleProjectsExpanded = () => {
    setProjectsExpanded(!isProjectsExpanded);
    saveStateToSessionStorage(!isProjectsExpanded);
  };
  const updateLastVisitedRoute = (route) => {
    sessionStorage.setItem("lastVisitedRoute", route)
  };
  useEffect(() => {
    const lastVisitedRoute = sessionStorage.getItem("lastVisitedRoute");
    if (lastVisitedRoute) {
      navigate(lastVisitedRoute, { replace: true })
      if (lastVisitedRoute.includes("/projects/")) {
        const category = lastVisitedRoute.split("/").pop();
        handleCategoryChange(category);
      }
    } else {
      navigate('/', { replace: true })
    }
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/menu-items");
        setMenuItems(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    loadStateToSessionStorage();
  }, [menuItems]);

  useEffect(() => {
    updateLastVisitedRoute(location.pathname)
  }, [location.pathname])

  return (
    <div className='App'>
      <nav id="sidebar">
        <ul className='mainListItem'>
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.subMenuItems ? (
                <div>
                  <ListItemButton>
                    <ListItemIcon>
                      <LayersIcon />
                    </ListItemIcon>
                    <NavLink onClick={() => toggleProjectsExpanded()}>{item.title}</NavLink>
                  </ListItemButton>
                  {isProjectsExpanded && (
                    <ul className='subListItem'>
                      {item.subMenuItems.map((subItem) => (
                        <ListItemButton key={subItem.id}>
                          <ListItemIcon>
                            {React.createElement(iconMap[subItem.path])}
                          </ListItemIcon>
                          <NavLink
                            onClick={() => handleCategoryChange(subItem.path.split("/").pop())}
                            to={subItem.path}
                          >
                            {subItem.title}
                          </NavLink>
                        </ListItemButton>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <ListItemButton>
                  <ListItemIcon>
                    {React.createElement(iconMap[item.path])}
                  </ListItemIcon>
                  <NavLink to={item.path}>{item.title}</NavLink>
                </ListItemButton>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/projects/perspective' element={<PerspectiveProjects projects={projects} handleCategoryChange={handleCategoryChange} />} />
          <Route path='/projects/current' element={<CurrentProjects projects={projects} handleCategoryChange={handleCategoryChange} />} />
          <Route path='/projects/expertise' element={<ExpertiseProjects projects={projects} handleCategoryChange={handleCategoryChange} />} />
          <Route path='/projects/completed' element={<CompletedProjects projects={projects} handleCategoryChange={handleCategoryChange} />} />
          <Route path='/design-control' element={<DesignControl />} />
          <Route path='/expertise' element={<Expertise />} />
          <Route path='/addProject' element={<AddProject />} />
        </Routes>
      </main>
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default App;