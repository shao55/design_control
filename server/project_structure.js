const projectJSON = {
    'name': '',
    'customer': '',
    'management': '',
    'designOrganization': '',
    'curator': '',
    'category': '',
    'expertiseDates': [], // Даты экспертизы
    'constructiveGroups': [
        {
            "name": 'Конструктив 1',
            "specificWeight": 0.25,
            "comment": "Комментарий о конструктиве",
            "sheets": [
                {
                    "name": "Лист 1",
                    "specificWeight": 0.1,
                    "comment": "Комментарий о листе",
                    "changes": [
                        {
                            "readiness": 50,
                            "fixationDate": "12-04-2023"
                        }
                    ]
                }
            ]
        }
    ]
};
