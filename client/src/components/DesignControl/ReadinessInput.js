import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const ReadinessInput = ({ sheet, onSave }) => {
    const lastReadiness = sheet.changes.length > 0 ? sheet.changes[sheet.changes.length - 1].readiness : 0;
    const [readiness, setReadiness] = useState(lastReadiness);

    const handleChange = (event) => {
        setReadiness(event.target.value);
    };

    const handleSave = () => {
        onSave(sheet.name, readiness);
    };

    return (
        <Box>
            <TextField
                label="Готовность, %"
                type="number"
                value={readiness}
                onChange={handleChange}
            />
            <Button onClick={handleSave}>Сохранить</Button>
        </Box>
    );
};

export default ReadinessInput;
