// Компоненты
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import axios from "axios";
// Стили
import './App.css';
import { ListItemButton, ListItemIcon } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import HomeIcon from '@mui/icons-material/Home';
import UpdateIcon from '@mui/icons-material/Update';
import WorkIcon from '@mui/icons-material/Work';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DoneIcon from '@mui/icons-material/Done';
import PercentIcon from '@mui/icons-material/Percent';
import TableChartIcon from '@mui/icons-material/TableChart';
import AddBoxIcon from '@mui/icons-material/AddBox';

// Компоненты
import Home from './components/Home/Home';
import DesignControl from './components/DesignControl/DesignControl';
import Expertise from './components/Expertise/Expertise';
import PerspectiveProjects from './components/Projects/PerspectiveProjects/Perspective';
import CurrentProjects from './components/Projects/CurrentProjects/Current';
import ExpertiseProjects from './components/Projects/ExpertiseProjects/Expertise';
import CompletedProjects from './components/Projects/CompletedProjects/Completed';
import AddProject from './components/Projects/addProject/Add';

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
  // Хук для выпадающего списка раздела "Проекты"
  const [isProjectsExpanded, setProjectsExpanded] = useState(false);
  // Хук для хранения списока проектов по разделам
  const [projects, setProjects] = useState([]);

  const [menuItems, setMenuItems] = useState([]);

  // Запрашиваю данные с сервера и сохраняю в хук
  const handleCategoryChange = async (category) => {
    const response = await axios.get(`http://localhost:8000/projects/${category}`);
    setProjects(response.data);
  };
  // Сохраняю в Session Storage значение из хука isProjectsExpanded
  const saveStateToSessionStorage = (params) => {
    sessionStorage.setItem("isProjectsListExpanded", JSON.stringify(params));
  }
  // Загружаю из Session Storage состояние открытого списка
  const loadStateToSessionStorage = () => {
    const isExpanded = JSON.parse(sessionStorage.getItem("isProjectsListExpanded"));
    if (isExpanded) {
      setProjectsExpanded(isExpanded);
    }
  }
  // Функция для вызова 
  const toggleProjectsExpanded = () => {
    setProjectsExpanded(!isProjectsExpanded);
    saveStateToSessionStorage(!isProjectsExpanded);
  };
  // При первом рендере загружаю состояние списка и перехожу на главную страницу
  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await axios.get("http://localhost:8000/menu-items");
      setMenuItems(response.data);
    };

    fetchMenuItems();
    loadStateToSessionStorage();
    navigate('/');
  }, []);

  return (
    <div className='App'>

      <nav id="sidebar">
        <ul className='mainListItem'>
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.subMenuItems ? (
                <>
                  <ListItemButton>
                    <ListItemIcon>
                      <LayersIcon />
                    </ListItemIcon>
                    <NavLink onClick={item.onClick}>{item.title}</NavLink>
                  </ListItemButton>
                  {isProjectsExpanded && (
                    <ul className='subListItem'>
                      {item.subMenuItems.map((subItem) => (
                        <ListItemButton key={subItem.id}>
                          <ListItemIcon>
                            {React.createElement(iconMap[subItem.path])}
                          </ListItemIcon>
                          <NavLink onClick={subItem.onClick} to={subItem.path}>{subItem.title}</NavLink>
                        </ListItemButton>
                      ))}
                    </ul>
                  )}
                </>
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
    </div>
  );
}

export default App;