import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

const ConstructiveGroupList = ({ selectedProject, selectedGroup, readinessData, handleGroupSelect }) => {

  return (
    <div>
      <h2>Конструктивы</h2>
      <Grid container spacing={1}>
        {selectedProject.constructiveGroups.map((group) => (
          <Grid item key={group.name} xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                height: '100%',
                backgroundColor:
                  selectedGroup?.name === group.name ? 'primary.main' : 'background.paper',
                color:
                  selectedGroup?.name === group.name ? 'primary.contrastText' : 'text.primary',
              }}
              variant="outlined"
              onClick={() => handleGroupSelect(group.name)}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {group.name}
                </Typography>
                <Typography variant="body2">
                  Готовность группы: {readinessData[group._id]?.groupReadiness || 0}%
                </Typography>
                <Typography variant="body2">
                  Удельный вес: {group.specificWeight}
                </Typography>
                <Typography variant="body2">
                  Комментарий: {group.comment}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ConstructiveGroupList;
