// Компоненты
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import axios from "axios";
// Стили
import './App.css';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LayersIcon from '@mui/icons-material/Layers';
import HomeIcon from '@mui/icons-material/Home';
import UpdateIcon from '@mui/icons-material/Update';
import WorkIcon from '@mui/icons-material/Work';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DoneIcon from '@mui/icons-material/Done';
import PercentIcon from '@mui/icons-material/Percent';
import TableChartIcon from '@mui/icons-material/TableChart';
// Компоненты
import Home from './components/Home/Home';
import DesignControl from './components/DesignControl/DesignControl';
import Expertise from './components/Expertise/Expertise';
import PerspectiveProjects from './components/Projects/PerspectiveProjects/Perspective';
import CurrentProjects from './components/Projects/CurrentProjects/Current';
import ExpertiseProjects from './components/Projects/ExpertiseProjects/Expertise';
import CompletedProjects from './components/Projects/CompletedProjects/Completed';

function App() {

  const iconMap = {
    '/': HomeIcon,
    '/projects/perspective': UpdateIcon,
    '/projects/current': WorkIcon,
    '/projects/expertise': PublishedWithChangesIcon,
    '/projects/completed': DoneIcon,
    '/design-control': PercentIcon,
    '/expertise': TableChartIcon
  };

  const navigate = useNavigate();
  // Хук для выпадающего списка раздела "Проекты"
  const [isProjectsExpanded, setProjectsExpanded] = useState(false);
  // Хук для хранения списока проектов по разделам
  const [projects, setProjects] = useState([]);

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
    loadStateToSessionStorage();
    navigate('/');
  }, []);

  const menuItems = [
    {
      id: 1,
      title: "Начальная страница",
      path: "/",
    },
    {
      id: 2,
      title: "Проекты",
      onClick: () => toggleProjectsExpanded(),
      subMenuItems: [
        {
          id: 2.1,
          title: "Перспективные",
          path: "/projects/perspective",
          onClick: () => handleCategoryChange("perspective"),
        },
        {
          id: 2.2,
          title: "Текущие",
          path: "/projects/current",
          onClick: () => handleCategoryChange("current"),
        },
        {
          id: 2.3,
          title: "В экспертизе",
          path: "/projects/expertise",
          onClick: () => handleCategoryChange("expertise"),
        },
        {
          id: 2.4,
          title: "Завершенные",
          path: "/projects/completed",
          onClick: () => handleCategoryChange("completed"),
        },
      ],
    },
    {
      id: 3,
      title: "Контроль проектирования проектов",
      path: "/design-control",
    },
    {
      id: 4,
      title: "Процедура прохождения экспертизы",
      path: "/expertise",
    },
  ];

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
          <Route path='/projects/perspective' element={<PerspectiveProjects projects={projects} />} />
          <Route path='/projects/current' element={<CurrentProjects projects={projects} />} />
          <Route path='/projects/expertise' element={<ExpertiseProjects projects={projects} />} />
          <Route path='/projects/completed' element={<CompletedProjects projects={projects} />} />
          <Route path='/design-control' element={<DesignControl />} />
          <Route path='/expertise' element={<Expertise />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;