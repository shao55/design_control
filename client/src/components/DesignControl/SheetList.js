import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const SheetList = ({ sheets, handleSheetClick }) => {
  return (
    <List>
      {sheets.map((sheet) => (
        <ListItem key={sheet.name} button onClick={() => handleSheetClick(sheet)}>
          <ListItemText primary={sheet.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default SheetList;
