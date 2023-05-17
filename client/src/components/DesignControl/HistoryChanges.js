import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import moment from 'moment';

const HistoryChanges = ({ changes }) => {
    if (changes.length === 0) {
        return null;
    };
    const formatIsoDate = (dateString) => {
        if (!dateString) return "Дата не назначена";
        return moment(dateString).utcOffset('+0600').format('DD.MM.YYYY HH:mm');
    };
    return (
        <div>
            <h2>История изменений</h2>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent>
                            {changes.map((change, index) => (
                                <Typography variant="body2" key={index}>
                                    {formatIsoDate(change.fixationDate)}: {change.readiness}%
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default HistoryChanges;
