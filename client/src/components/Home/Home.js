import React, { useEffect, useState } from 'react';
import './Home.css';
import axios from 'axios';

function Home() {

    const [changes, setChanges] = useState([]);
    const [expertiseDates, setExpertiseDates] = useState([]);
    const [categoryReadiness, setCategoryReadiness] = useState({});

    const fetchExpertiseDates = async () => {
        const res = await axios.get('http://localhost:8000/expertiseDates');
        console.log(res.data);
        setExpertiseDates(res.data);
    };

    const fetchChanges = async () => {
        const res = await axios.get('http://localhost:8000/changes');
        console.log(res.data);
        setChanges(res.data);
    };

    const fetchCategoryReadiness = async () => {
        try {
            const response = await axios.get("http://localhost:8000/categoryReadiness");
            setCategoryReadiness(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных готовности по категориям:", error);
        }
    };

    useEffect(() => {
        fetchExpertiseDates();
        fetchChanges();
        fetchCategoryReadiness();
    }, []);

    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src = "https://api-maps.yandex.ru/2.1/?apikey=06d4438d-ecbf-4e9f-bf58-45321609f1f7&lang=ru_RU";
    //     script.async = true;
    //     document.body.appendChild(script);

    //     script.addEventListener("load", () => {
    //         window.ymaps.ready(init);
    //     });

    //     function init() {
    //         var myMap = new window.ymaps.Map("map", {
    //             center: [51.138116, 71.405122],
    //             zoom: 17,
    //             controls: []
    //         });

    //         var myPlacemark = new window.ymaps.Placemark([51.138116, 71.405122], {}, {});
    //         myMap.geoObjects.add(myPlacemark);
    //     }

    //     return () => {
    //         document.body.removeChild(script);
    //     }
    // }, []);

    return (
        <div className='home_wrap' >
            <div className='home_content'>
                <div className='content_header'>
                    <h1>Добро пожаловать</h1>
                    <p>Здесь вы можете управлять аспектами ваших проектов: слежение за прогрессом и сроками, взаимодействие с графиками, контроль сроков экспертизы</p>
                </div>
                <h2>Общий % готовности проектов по категориям:</h2>
                <ul>
                    <li>Перспективные проекты: {categoryReadiness['perspective'] || 0}%</li>
                    <li>Текущие проекты: {categoryReadiness['current'] || 0}%</li>
                    <li>Проекты в экспертизе: {categoryReadiness['expertise'] || 0}%</li>
                    <li>Завершенные проекты: {categoryReadiness['completed'] || 0}%</li>
                </ul>
                <h2>Последние обновления</h2>
                <ul>
                    {changes.length > 0 ?
                        changes.slice().reverse().map((change, index) => (
                            <li key={`${change.projectId}-${index}`}>
                                Изменение в проекте "{change.projectName}", группа "{change.groupId}", лист "{change.sheetId}":
                                готовность {change.readiness}% (Дата изменения: {change.fixationDate})
                            </li>
                        ))
                        :
                        <li>Готовности проектов не назначались</li>
                    }
                </ul>
                <h2>Ближайшие даты начала экспертизы</h2>
                <ul>
                    {expertiseDates.length > 0 ?
                        expertiseDates.map((expertiseDate, index) => (
                            <li key={index}>
                                Начало загрузки на комплектацию "{expertiseDate.projectName}": {expertiseDate.date}
                            </li>
                        ))
                        :
                        <li>Даты прохождения экспертизы не назначались</li>
                    }
                </ul>
            </div>
            <div className='home_about'>
                <div>
                    <h3>Наши контакты:</h3>
                    <p>ТОО «Engineering center ltd»010000, ГСЛ №22008877</p>
                    <p>Почта: engineering_center_ltd@eng-services.kz</p>
                    <p>Республика Казахстан, Нур-Султан, Қайым Мухамедханова 5 , блок Б, Офис 5-3 , 5-этаж</p>
                    <p>Телефон: +7 (7172) 79-64-00</p>
                </div>
                {/* <div id="map" style={{ width: '100%', height: '150px' }}>
                    <h3>Наши контакты:</h3>
                </div> */}
            </div>
        </div>
    )
}

export default Home;
