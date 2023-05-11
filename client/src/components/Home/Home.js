import React, { useEffect } from 'react';
import { Grid } from '@mui/material';

function Home() {

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://api-maps.yandex.ru/2.1/?apikey=06d4438d-ecbf-4e9f-bf58-45321609f1f7&lang=ru_RU";
        script.async = true;
        document.body.appendChild(script);

        script.addEventListener("load", () => {
            window.ymaps.ready(init);
        });

        function init() {
            var myMap = new window.ymaps.Map("map", {
                center: [51.138116, 71.405122], // здесь должны быть координаты вашего офиса
                zoom: 17,
                controls: []
            });

            var myPlacemark = new window.ymaps.Placemark([51.138116, 71.405122], {}, {}); // здесь должны быть координаты вашего офиса
            myMap.geoObjects.add(myPlacemark);
        }

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div>
            <h1>Главная страница!</h1>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <div>
                        <h2>КОНТАКТЫ:</h2>
                        <p>ТОО «Engineering center ltd»010000, ГСЛ №22008877</p>
                        <p>Республика Казахстан, Нур-Султан, Қайым Мухамедханова 5 , блок Б, Офис 5-3 , 5-этаж</p>
                        <p>Почта:engineering_center_ltd@eng-services.kz</p>
                        <p>Телефон: +7 (7172) 79-64-00</p>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div id="map" style={{ width: '100%', height: '200px' }}></div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Home;
