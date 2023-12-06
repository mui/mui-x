import * as React from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import { unstable_useId as useId } from '@mui/utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { useLocaleText } from '@mui/x-date-pickers/internals';

function CustomActionBar(props) {
  const { onAccept, onClear, onCancel, onSetToday, actions, className } = props;
  const localeText = useLocaleText();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = useId();

  if (actions == null || actions.length === 0) {
    return null;
  }

  const menuItems = actions?.map((actionType) => {
    switch (actionType) {
      case 'clear':
        return (
          <MenuItem
            data-mui-test="clear-action-button"
            onClick={() => {
              onClear();
              setAnchorEl(null);
            }}
            key={actionType}
          >
            {localeText.clearButtonLabel}
          </MenuItem>
        );

      case 'cancel':
        return (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onCancel();
            }}
            key={actionType}
          >
            {localeText.cancelButtonLabel}
          </MenuItem>
        );

      case 'accept':
        return (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onAccept();
            }}
            key={actionType}
          >
            {localeText.okButtonLabel}
          </MenuItem>
        );

      case 'today':
        return (
          <MenuItem
            data-mui-test="today-action-button"
            onClick={() => {
              setAnchorEl(null);
              onSetToday();
            }}
            key={actionType}
          >
            {localeText.todayButtonLabel}
          </MenuItem>
        );

      default:
        return null;
    }
  });

  return (
    <DialogActions className={className}>
      <Button
        id={`picker-actions-${id}`}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Actions
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': `picker-actions-${id}`,
        }}
      >
        {menuItems}
      </Menu>
    </DialogActions>
  );
}

export default function ActionBarComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        defaultValue={dayjs('2022-04-17')}
        slots={{
          actionBar: CustomActionBar,
        }}
        slotProps={{
          actionBar: {
            actions: ['today'],
          },
        }}
      />
    </LocalizationProvider>
  );
}
