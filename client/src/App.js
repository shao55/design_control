// Компоненты
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import axios from "axios";
// Стили
import './App.css';
// Компоненты
import Home from './components/Home/Home';
import DesignControl from './components/DesignControl/DesignControl';
import Expertise from './components/Expertise/Expertise';
import PerspectiveProjects from './components/Projects/PerspectiveProjects/Perspective';
import CurrentProjects from './components/Projects/CurrentProjects/Current';
import ExpertiseProjects from './components/Projects/ExpertiseProjects/Expertise';
import CompletedProjects from './components/Projects/CompletedProjects/Completed';

function App() {
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
      title: "Начальная страница",
      path: "/",
    },
    {
      title: "Проекты",
      onClick: () => toggleProjectsExpanded(),
      subMenuItems: [
        {
          title: "Перспективные",
          path: "/projects/perspective",
          onClick: () => handleCategoryChange("perspective"),
        },
        {
          title: "Текущие",
          path: "/projects/current",
          onClick: () => handleCategoryChange("current"),
        },
        {
          title: "В экспертизе",
          path: "/projects/expertise",
          onClick: () => handleCategoryChange("expertise"),
        },
        {
          title: "Завершенные",
          path: "/projects/completed",
          onClick: () => handleCategoryChange("completed"),
        },
      ],
    },
    {
      title: "Контроль проектирования проектов",
      path: "/design-control",
    },
    {
      title: "Процедура прохождения экспертизы",
      path: "/expertise",
    },
  ];

  return (
    <div className='App'>
      <nav id="sidebar">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              {item.subMenuItems ? (
                <>
                  <NavLink onClick={item.onClick}>{item.title}</NavLink>
                  {isProjectsExpanded && (
                    <ul>
                      {item.subMenuItems.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink onClick={subItem.onClick} to={subItem.path}>
                            {subItem.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink to={item.path}>{item.title}</NavLink>
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