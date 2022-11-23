import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';

import RestaurantIcon from '@mui/icons-material/Restaurant';

const ActionList = (props) => {
  const { onAccept, onClear, onCancel, onSetToday } = props;
  const actions = [
    { text: 'Accept', method: onAccept },
    { text: 'Clear', method: onClear },
    { text: 'Cancel', method: onCancel },
    { text: 'Today', method: onSetToday },
  ];

  return (
    <List>
      {actions.map(({ text, method }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={method}>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

ActionList.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
};

const ViewLayoutRoot = (props) => {
  const { children, ...other } = props;

  return (
    <Box
      // Pass other props such that componentsProps.layoutRoot.sx is applied
      {...other}
    >
      {/* Add an icon to place in the layout */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gridColumn: '1',
          gridRow: '1',
        }}
      >
        <RestaurantIcon />
      </Box>
      {/* propagate the children */}
      {children}
    </Box>
  );
};

ViewLayoutRoot.propTypes = {
  children: PropTypes.node,
};

export default function AddComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker
        componentsProps={{
          layout: ({ toolbar, actionBar, content }) => ({
            sx: {
              // Keep the structure with display grid
              display: 'grid',
              gridAutoColumns: 'max-content auto max-content',
              gridAutoRows: 'max-content auto max-content',
              '& .MuiPickersViewLayout-actionbar': {
                gridColumn: '1',
                gridRow: '2',
              },
              '& .MuiPickersViewLayout-toolbar': {
                gridColumn: '2',
                gridRow: '1',
              },
            },
            children: [toolbar, actionBar, content],
          }),
        }}
        components={{
          ActionBar: ActionList,
        }}
      />
    </LocalizationProvider>
  );
}
