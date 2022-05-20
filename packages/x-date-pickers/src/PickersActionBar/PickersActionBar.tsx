import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { useLocaleText } from '../internals/hooks/useUtils';
import {
  WrapperVariant,
  WrapperVariantContext,
} from '../internals/components/wrappers/WrapperVariantContext';

export type PickersActionBarAction = 'clear' | 'cancel' | 'accept' | 'today';

export interface PickersActionBarProps {
  /**
   * Ordered array of actions to display.
   * If empty, does not display that action bar.
   * @default `['cancel', 'accept']` for mobile and `[]` for desktop
   */
  actions?:
    | PickersActionBarAction[]
    | ((wrapperVariant: WrapperVariant) => PickersActionBarAction[]);
  onAccept: () => void;
  onClear: () => void;
  onCancel: () => void;
  onSetToday: () => void;
}

export const PickersActionBar = (props: PickersActionBarProps) => {
  const { onAccept, onClear, onCancel, onSetToday, actions } = props;
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const localeText = useLocaleText();

  const actionsArray = typeof actions === 'function' ? actions(wrapperVariant) : actions;

  if (actionsArray == null || actionsArray.length === 0) {
    return null;
  }

  const buttons = actionsArray?.map((actionType) => {
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

  return <DialogActions>{buttons}</DialogActions>;
};
