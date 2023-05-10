import React, { useState } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

const SheetList = ({ sheets, handleSheetClick }) => {

  const [selectedSheetName, setSelectedSheetName] = useState(null);

  const onSheetClick = (sheet) => {
    setSelectedSheetName(sheet.name);
    handleSheetClick(sheet);
  };

  return (
    <div>
      <h2>Листы конструктива</h2>
      <Grid container spacing={2}>
        {sheets.map((sheet) => (
          <Grid item key={sheet.name} xs={12} md={6} lg={2}>
            <Card
              onClick={() => onSheetClick(sheet)}
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                boxShadow: 2,
                height: '100%',
                backgroundColor:
                  selectedSheetName === sheet.name ? 'primary.main' : 'background.paper',
                color:
                  selectedSheetName === sheet.name ? 'primary.contrastText' : 'text.primary',
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  {sheet.name}
                </Typography>
                <Typography variant="body2">
                  % готовности: {sheet.changes.length > 0 ? sheet.changes[sheet.changes.length - 1].readiness : 0}%
                </Typography>
                <Typography variant="body2">
                  Удельный вес: {sheet.specificWeight}
                </Typography>
                <Typography variant="body2">
                  Комментарий: {sheet.comment}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SheetList;