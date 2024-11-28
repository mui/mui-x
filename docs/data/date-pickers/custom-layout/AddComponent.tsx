import * as React from 'react';
import { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import { DateView } from '@mui/x-date-pickers/models';

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

function RestaurantHeader() {
  return (
    <Box
      sx={{
        // Place the element in the grid layout
        gridColumn: 1,
        gridRow: 1,
        // Center the icon
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <RestaurantIcon />
    </Box>
  );
}

function CustomLayout(props: PickersLayoutProps<Dayjs | null, DateView>) {
  const { toolbar, tabs, content, actionBar, ownerState } = usePickerLayout(props);

  return (
    <PickersLayoutRoot
      ownerState={ownerState}
      sx={{
        overflow: 'auto',
        [`.${pickersLayoutClasses.actionBar}`]: {
          gridColumn: 1,
          gridRow: 2,
        },
        [`.${pickersLayoutClasses.toolbar}`]: {
          gridColumn: 2,
          gridRow: 1,
        },
      }}
    >
      <RestaurantHeader />
      {toolbar}
      {actionBar}
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        ownerState={ownerState}
      >
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}
export default function AddComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        slots={{
          layout: CustomLayout,
          actionBar: ActionList,
        }}
      />
    </LocalizationProvider>
  );
}
