import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';

function ActionList(props) {
  const { onAccept, onClear, onCancel, onSetToday, className } = props;
  const actions = [
    { text: 'Accept', method: onAccept },
    { text: 'Clear', method: onClear },
    { text: 'Cancel', method: onCancel },
    { text: 'Today', method: onSetToday },
  ];

  return (
    // Propagate the className such that CSS selectors can be applied
    <List className={className}>
      {actions.map(({ text, method }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={method}>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

ActionList.propTypes = {
  className: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
};

export default function MovingActions() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker
        componentsProps={{
          layout: {
            sx: {
              [`.${pickersLayoutClasses.actionBar}`]: {
                gridColumn: 1,
                gridRow: 2,
              },
            },
          },
        }}
        components={{
          ActionBar: ActionList,
        }}
      />
    </LocalizationProvider>
  );
}
