import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';

import {
  pickersViewLayoutClasses,
  PickersViewLayoutContentWrapper,
  PickersViewLayoutRoot,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersViewLayout';

function ActionList(props) {
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

ActionList.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
};

function CustomLayout(props) {
  const { isLandscape } = props;
  const { toolbar, tabs, content, actionBar } = usePickerLayout(props);

  return (
    <PickersViewLayoutRoot
      ownerState={{ isLandscape }}
      sx={{
        [`.${pickersViewLayoutClasses.actionBar}`]: {
          gridColumn: 1,
          gridRow: 2,
        },
      }}
    >
      {toolbar}
      {actionBar}
      <PickersViewLayoutContentWrapper
        className={pickersViewLayoutClasses.contentWrapper}
      >
        {tabs}
        {content}
      </PickersViewLayoutContentWrapper>
    </PickersViewLayoutRoot>
  );
}

CustomLayout.propTypes = {
  isLandscape: PropTypes.bool.isRequired,
};

export default function MovingActionsReorder() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker
        components={{
          Layout: CustomLayout,
          ActionBar: ActionList,
        }}
      />
    </LocalizationProvider>
  );
}
