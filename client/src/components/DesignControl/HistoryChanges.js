import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const HistoryChanges = ({ changes }) => {
    if (changes.length === 0) {
        return null;
    }
    return (
        <div>
            <h2>История изменений</h2>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent>
                            {changes.map((change, index) => (
                                <Typography variant="body2" key={index}>
                                    {change.fixationDate}: {change.readiness}%
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
