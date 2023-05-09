import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const ReadinessInput = ({ sheet, onSave }) => {
    const [readiness, setReadiness] = useState(sheet.changes[0]?.readiness || 0);

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
