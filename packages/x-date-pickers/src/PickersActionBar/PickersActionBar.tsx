import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import { useLocaleText } from '../internals/hooks/useUtils';

export type PickersActionBarAction = 'clear' | 'cancel' | 'accept' | 'today';

export interface PickersActionBarProps {
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

const PickersActionBarRoot = styled(DialogActions)<{
  ownerState: PickersActionBarProps;
}>(({ ownerState }) => ({
  ...((ownerState.actions?.includes('clear') || ownerState.actions?.includes('today')) && {
    // set justifyContent to default value to fix IE11 layout bug
    // see https://github.com/mui-org/material-ui-pickers/pull/267
    justifyContent: 'flex-start',
    '& > *:first-of-type': {
      marginRight: 'auto',
    },
  }),
}));

export const PickersActionBar = (props: PickersActionBarProps) => {
  const { onAccept, onClear, onCancel, onSetToday, actions } = props;

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
  const ownerState = props;

  return <PickersActionBarRoot ownerState={ownerState}>{buttons}</PickersActionBarRoot>;
};
