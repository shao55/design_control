import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const ConstructiveGroupList = ({ constructiveGroups, selectedGroupId, handleGroupSelect }) => {
  return (
    <List>
      {constructiveGroups.map((group) => (
        <ListItem
          key={group.name}
          button
          selected={selectedGroupId === group.name}
          onClick={() => handleGroupSelect(group.name)}
        >
          <ListItemText primary={group.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default ConstructiveGroupList;
