import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

import './App.css';
import { ListItemButton, ListItemIcon, Backdrop, CircularProgress, Typography, Grid, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import UpdateIcon from '@mui/icons-material/Update';
import WorkIcon from '@mui/icons-material/Work';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DoneIcon from '@mui/icons-material/Done';
import PercentIcon from '@mui/icons-material/Percent';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import Home from './components/Home/Home';
import AddProject from './components/Projects/Add/Add';
import AllProjects from './components/Projects/All/All';
import PerspectiveProjects from './components/Projects/Perspective/Perspective';
import CurrentProjects from './components/Projects/Current/Current';
import ExpertiseProjects from './components/Projects/Expertise/Expertise';
import CompletedProjects from './components/Projects/Completed/Completed';
import DesignControlPage from './components/DesignControl/DesignControlPage';
import AddExpertise from './components/Expertise/Add/AddExpertise';
import AllExpertise from './components/Expertise/All/AllExpertise';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const iconMap = {
    'HomeIcon': HomeIcon,
    'AddBoxIcon': AddBoxIcon,
    'AccountTreeIcon': AccountTreeIcon,
    'UpdateIcon': UpdateIcon,
    'WorkIcon': WorkIcon,
    'PublishedWithChangesIcon': PublishedWithChangesIcon,
    'DoneIcon': DoneIcon,
    'PercentIcon': PercentIcon,
    'MoreTimeIcon': MoreTimeIcon,
    'ViewTimelineIcon': ViewTimelineIcon,
  };

  const updateLastVisitedRoute = (route) => {
    sessionStorage.setItem("lastVisitedRoute", route)
  };

  useEffect(() => {
    const lastVisitedRoute = sessionStorage.getItem("lastVisitedRoute");
    if (lastVisitedRoute) {
      navigate(lastVisitedRoute, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/menu-items");
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    updateLastVisitedRoute(location.pathname)
  }, [location.pathname]);

  const menuGroups = menuItems.reduce((groups, item) => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    groups[item.group].push(item);
    return groups;
  }, {});

  return (
    <div className='App'>
      {!loading && (
        <Grid container>
          <Grid item xs={2} sm={4} md={4} lg={3} xl={2} p={1} component="nav" className="navbar" style={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)', backgroundColor: '#f5f5f5' }}>
            <Grid container display={'flex'} justifyContent={'center'} alignItems={'center'} mt={1} mb={1}>
              <Grid item>
                <IconButton onClick={() => navigate('/')}>
                  <HomeIcon />
                </IconButton>
              </Grid>
              <Grid>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Engineering Center
                  </NavLink>
                </Typography>
              </Grid>
            </Grid>
            <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
              {Object.entries(menuGroups).map(([group, items]) => (
                <li key={group}>
                  <Typography variant="caption" pl={1} color={'#938e8c'}>{group}</Typography>
                  {items.map((item) => (
                    <ListItemButton key={item.id}>
                      <ListItemIcon>
                        {React.createElement(iconMap[item.icon])}
                      </ListItemIcon>
                      <NavLink to={item.path}>{item.title}</NavLink>
                    </ListItemButton>
                  ))}
                </li>
              ))}
            </ul>
          </Grid>
          {!loading && (
            <Grid item xs={10} sm={8} md={8} lg={9} xl={10} p={1} component="main" className="content-wrapper" style={{ overflow: 'auto' }}>
              <main>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/addProject' element={<AddProject />} />
                  <Route path='/allProjects' element={<AllProjects />} />
                  <Route path='/projects/perspective' element={<PerspectiveProjects />} />
                  <Route path='/projects/current' element={<CurrentProjects />} />
                  <Route path='/projects/expertise' element={<ExpertiseProjects />} />
                  <Route path='/projects/completed' element={<CompletedProjects />} />
                  <Route path='/design-control' element={<DesignControlPage />} />
                  <Route path='/expertise/add-expertise' element={<AddExpertise />} />
                  <Route path='/expertise/all-expertise' element={<AllExpertise />} />
                </Routes>
              </main>
            </Grid>
          )}
        </Grid>
      )}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div >
  );
}

export default App;