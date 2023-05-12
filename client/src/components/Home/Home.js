import React, { useEffect, useState } from 'react';
import './Home.css';
import axios from 'axios';

function Home() {

    const [changes, setChanges] = useState([]);
    const [expertiseDates, setExpertiseDates] = useState([]);

    const fetchExpertiseDates = async () => {
        const res = await axios.get('http://localhost:8000/expertiseDates');
        setExpertiseDates(res.data);
    };

    const fetchChanges = async () => {
        const res = await axios.get('http://localhost:8000/changes');
        setChanges(res.data);
    };

    useEffect(() => {
        fetchExpertiseDates();
        fetchChanges();
    }, []);

    console.log(expertiseDates)

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
                {/* <h2>Активные проекты</h2>
                <ul>
                    <li>Проект А: <a href="/projects/a">перейти к проекту</a></li>
                    <li>Проект B: <a href="/projects/b">перейти к проекту</a></li>
                    <li>Проект C: <a href="/projects/c">перейти к проекту</a></li>
                </ul> */}
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
