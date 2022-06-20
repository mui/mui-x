import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

import { useLocaleText, WrapperVariantContext } from '@mui/x-date-pickers/internals';

const CustomActionBar = (props) => {
  const { onAccept, onClear, onCancel, onSetToday, actions } = props;
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const localeText = useLocaleText();

  const actionsArray =
    typeof actions === 'function' ? actions(wrapperVariant) : actions;

  if (actionsArray == null || actionsArray.length === 0) {
    return null;
  }

  const buttons = actionsArray?.map((actionType) => {
    switch (actionType) {
      case 'clear':
        return (
          <Button
            data-mui-test="clear-action-button"
            onClick={onClear}
            key={actionType}
          >
            {localeText.clearButtonLabel}
          </Button>
        );

      case 'cancel':
        return (
          <Button onClick={onCancel} key={actionType}>
            {localeText.cancelButtonLabel}
          </Button>
        );

      case 'accept':
        return (
          <Button onClick={onAccept} key={actionType}>
            {localeText.okButtonLabel}
          </Button>
        );

      case 'today':
        return (
          <Button
            data-mui-test="today-action-button"
            onClick={onSetToday}
            key={actionType}
          >
            {localeText.todayButtonLabel}
          </Button>
        );

      default:
        return null;
    }
  });

  return <DialogActions>{buttons}</DialogActions>;
};

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
  const [value, setValue] = React.useState(() => new Date(2022, 1, 1, 1, 1));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDateTimePicker
        onChange={(newValue) => setValue(newValue)}
        value={value}
        renderInput={(params) => <TextField {...params} />}
        components={{
          ActionBar: CustomActionBar,
        }}
      />
    </LocalizationProvider>
  );
}
