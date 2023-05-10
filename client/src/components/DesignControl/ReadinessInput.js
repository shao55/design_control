import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Card,
    CardContent,
    Grid,
} from '@mui/material';

const ReadinessInput = ({ sheet, onSave }) => {
    const [readiness, setReadiness] = useState(0);

    useEffect(() => {
        const lastReadiness =
            sheet.changes.length > 0
                ? sheet.changes[sheet.changes.length - 1].readiness
                : 0;
        setReadiness(lastReadiness);
    }, [sheet]);

    const handleChange = (event) => {
        setReadiness(event.target.value);
    };

    const handleSave = () => {
        onSave(sheet.name, readiness);
    };

    return (
        <div>
            <h2>Ввод готовности</h2>
            <Grid container spacing={1}>
                <Grid item>
                    <Card>
                        <CardContent>
                            <TextField
                                label="Готовность, %"
                                type="number"
                                value={readiness}
                                onChange={handleChange}
                                sx={{ mb: 2, mt: 2 }}
                            />
                            <Box>
                                <Button variant="contained" onClick={handleSave}>
                                    Сохранить
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default ReadinessInput;