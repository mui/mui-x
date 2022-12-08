import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions, { DialogActionsProps } from '@mui/material/DialogActions';
import { useLocaleText } from '../internals/hooks/useUtils';

export type PickersActionBarAction = 'clear' | 'cancel' | 'accept' | 'today';

export interface PickersActionBarProps extends DialogActionsProps {
  /**
   * Ordered array of actions to display.
   * If empty, does not display that action bar.
   * @default `['cancel', 'accept']` for mobile and `[]` for desktop
   */
  actions?: PickersActionBarAction[];
  onAccept: () => void;
  onClear: () => void;
  onCancel: () => void;
  onSetToday: () => void;
}

export function PickersActionBar(props: PickersActionBarProps) {
  const { onAccept, onClear, onCancel, onSetToday, actions, ...other } = props;

  const localeText = useLocaleText();

  if (actions == null || actions.length === 0) {
    return null;
  }

  const buttons = actions?.map((actionType) => {
    switch (actionType) {
      case 'clear':
        return (
          <Button data-mui-test="clear-action-button" onClick={onClear} key={actionType}>
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
          <Button data-mui-test="today-action-button" onClick={onSetToday} key={actionType}>
            {localeText.todayButtonLabel}
          </Button>
        );
      default:
        return null;
    }
  });

  return <DialogActions {...other}>{buttons}</DialogActions>;
}
