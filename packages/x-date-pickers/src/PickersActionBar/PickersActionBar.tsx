'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DialogActions, { DialogActionsProps } from '@mui/material/DialogActions';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import { usePickerActionsContext } from '../hooks';

export type PickersActionBarAction = 'clear' | 'cancel' | 'accept' | 'today';

export interface PickersActionBarProps extends DialogActionsProps {
  /**
   * Ordered array of actions to display.
   * If empty, does not display that action bar.
   * @default
   * - `[]` for Desktop Date Picker and Desktop Date Range Picker
   * - `['cancel', 'accept']` for all other Pickers
   */
  actions?: PickersActionBarAction[];
}

const PickersActionBarRoot = styled(DialogActions, {
  name: 'MuiPickersLayout',
  slot: 'ActionBar',
  overridesResolver: (_, styles) => styles.actionBar,
})({});

/**
 * Demos:
 *
 * - [Custom slots and subcomponents](https://mui.com/x/react-date-pickers/custom-components/)
 * - [Custom layout](https://mui.com/x/react-date-pickers/custom-layout/)
 *
 * API:
 *
 * - [PickersActionBar API](https://mui.com/x/api/date-pickers/pickers-action-bar/)
 */
function PickersActionBarComponent(props: PickersActionBarProps) {
  const { actions, ...other } = props;

  const translations = usePickerTranslations();
  const { clearValue, setValueToToday, acceptValueChanges, cancelValueChanges } =
    usePickerActionsContext();

  if (actions == null || actions.length === 0) {
    return null;
  }

  const buttons = actions?.map((actionType) => {
    switch (actionType) {
      case 'clear':
        return (
          <Button data-testid="clear-action-button" onClick={clearValue} key={actionType}>
            {translations.clearButtonLabel}
          </Button>
        );

      case 'cancel':
        return (
          <Button onClick={cancelValueChanges} key={actionType}>
            {translations.cancelButtonLabel}
          </Button>
        );

      case 'accept':
        return (
          <Button onClick={acceptValueChanges} key={actionType}>
            {translations.okButtonLabel}
          </Button>
        );

      case 'today':
        return (
          <Button data-testid="today-action-button" onClick={setValueToToday} key={actionType}>
            {translations.todayButtonLabel}
          </Button>
        );

      default:
        return null;
    }
  });

  return <PickersActionBarRoot {...other}>{buttons}</PickersActionBarRoot>;
}

PickersActionBarComponent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Ordered array of actions to display.
   * If empty, does not display that action bar.
   * @default
   * - `[]` for Desktop Date Picker and Desktop Date Range Picker
   * - `['cancel', 'accept']` for all other Pickers
   */
  actions: PropTypes.arrayOf(PropTypes.oneOf(['accept', 'cancel', 'clear', 'today']).isRequired),
  /**
   * If `true`, the actions do not have additional margin.
   * @default false
   */
  disableSpacing: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

const PickersActionBar = React.memo(PickersActionBarComponent);

export { PickersActionBar };
