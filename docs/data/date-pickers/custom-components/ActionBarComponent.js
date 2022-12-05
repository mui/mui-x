import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import { unstable_useId as useId } from '@mui/utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { useLocaleText, WrapperVariantContext } from '@mui/x-date-pickers/internals';

function CustomActionBar(props) {
  const { onAccept, onClear, onCancel, onSetToday, actions } = props;
  const wrapperVariant = React.useContext(WrapperVariantContext);
  const localeText = useLocaleText();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = useId();

  const actionsArray =
    typeof actions === 'function' ? actions(wrapperVariant) : actions;

  if (actionsArray == null || actionsArray.length === 0) {
    return null;
  }

  const menuItems = actionsArray?.map((actionType) => {
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
    <DialogActions>
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

CustomActionBar.propTypes = {
  /**
   * Ordered array of actions to display.
   * If empty, does not display that action bar.
   * @default `['cancel', 'accept']` for mobile and `[]` for desktop
   */
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOf(['accept', 'cancel', 'clear', 'today'])),
    PropTypes.func,
  ]),
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
};

export default function ActionBarComponent() {
  const [value, setValue] = React.useState(() => dayjs('2022-02-01T00:00'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        onChange={(newValue) => setValue(newValue)}
        value={value}
        renderInput={(params) => <TextField {...params} />}
        components={{
          ActionBar: CustomActionBar,
        }}
        componentsProps={{
          actionBar: {
            actions: ['today'],
          },
        }}
      />
    </LocalizationProvider>
  );
}
