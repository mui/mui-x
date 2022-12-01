import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { pickersViewLayoutClasses } from '@mui/x-date-pickers/PickersViewLayout';

function ActionList(props: PickersActionBarProps) {
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
}

export default function MovingActionsReorder() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker
        componentsProps={{
          layout: ({ toolbar, content, actionBar }) => ({
            sx: {
              [`.${pickersViewLayoutClasses.actionBar}`]: {
                gridColumn: 1,
                gridRow: 2,
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
