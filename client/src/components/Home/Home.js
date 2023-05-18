import React, { useEffect, useState } from 'react';
import './Home.css';
import axios from 'axios';
import moment from 'moment';

function Home() {

    const [changes, setChanges] = useState([]);
    const [expertiseDates, setExpertiseDates] = useState([]);
    const [categoryReadiness, setCategoryReadiness] = useState({});

    const fetchExpertiseDates = async () => {
        const res = await axios.get('http://localhost:8000/expertiseDates');
        setExpertiseDates(res.data);
    };

    const fetchChanges = async () => {
        const res = await axios.get('http://localhost:8000/changes');
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

    const formatIsoDate = (dateString) => {
        if (!dateString) return "Дата не назначена";
        return moment(dateString).utcOffset('+0600').format('DD.MM.YYYY HH:mm');
    };

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
                        changes.slice().map((change, index) => (
                            <li key={`${change.projectId}-${index}`}>
                                Изменение в проекте "{change.projectName}", группа "{change.groupId}", лист "{change.sheetId}":
                                готовность {change.readiness}% (Дата изменения: {formatIsoDate(change.fixationDate)})
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
                                Начало загрузки на комплектацию "{expertiseDate.projectName}": {moment(expertiseDate.date).utcOffset('+0600').format('DD.MM.YYYY')}
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
            </div>
        </div>
    )
}

export default Home;