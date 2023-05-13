const stages = [
    {
        title: 'Дата окончания загрузки ПСД на комплектацию',
        daysToAdd: 5,
        startDateIndex: null,
    },
    {
        title: 'Дата подписания договора с Экспертизой',
        daysToAdd: 10,
        useCalendarDays: true,
        startDateIndex: 0,
    },
    {
        title: 'Дата оплаты услуг ГЭ по условиям договора',
        daysToAdd: 2,
        startDateIndex: 1,
    },
    {
        title: 'Поступление оплаты',
        daysToAdd: 1,
        startDateIndex: 2,
    },
    {
        title: 'Дата выдачи мотивированных замечаний',
        daysToAdd: 20,
        startDateIndex: 3,
    },
    {
        title: 'Дата выдачи ответов на мотивированные замечания',
        daysToAdd: 10,
        startDateIndex: 4,
    },
    {
        title: 'Последний день загрузки технической части',
        daysToAdd: 35,
        startDateIndex: 3,
    },
    {
        title: 'Последний день загрузки сметной документации',
        daysToAdd: 40,
        startDateIndex: 3,
    },
    {
        title: 'Дата завершения рассмотрения ответов на замечания',
        daysToAdd: 15,
        startDateIndex: 5,
    },
    {
        title: 'Дата завершения подготовки и оформления экспертного заключения',
        daysToAdd: 15,
        startDateIndex: 5,
    },
    {
        title: 'Дата уведомления о выходе заключения ГЭ',
        daysToAdd: 45,
        startDateIndex: 3,
    },
];
module.exports = stages;