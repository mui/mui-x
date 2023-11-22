import * as React from 'react';
import { styled, alpha, useThemeProps } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/utils';
import {
  getPickersMonthUtilityClass,
  pickersMonthClasses,
  PickersMonthClasses,
} from './pickersMonthClasses';

export interface ExportedPickersMonthProps {
  classes?: Partial<PickersMonthClasses>;
}

export interface PickersMonthProps extends ExportedPickersMonthProps {
  'aria-current'?: React.AriaAttributes['aria-current'];
  'aria-label'?: React.AriaAttributes['aria-label'];
  autoFocus: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: (event: React.MouseEvent, month: number) => void;
  onKeyDown: (event: React.KeyboardEvent, month: number) => void;
  onFocus: (event: React.FocusEvent, month: number) => void;
  onBlur: (event: React.FocusEvent, month: number) => void;
  selected?: boolean;
  value: number;
  tabIndex: number;
  monthsPerRow: 3 | 4;
}

const useUtilityClasses = (ownerState: PickersMonthProps) => {
  const { disabled, selected, classes } = ownerState;

  const slots = {
    root: ['root'],
    monthButton: ['monthButton', disabled && 'disabled', selected && 'selected'],
  };

  return composeClasses(slots, getPickersMonthUtilityClass, classes);
};

const PickersMonthRoot = styled('div', {
  name: 'MuiPickersMonth',
  slot: 'Root',
  overridesResolver: (_, styles) => [styles.root],
})<{
  ownerState: PickersMonthProps;
}>(({ ownerState }) => ({
  flexBasis: ownerState.monthsPerRow === 3 ? '33.3%' : '25%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PickersMonthButton = styled('button', {
  name: 'MuiPickersMonth',
  slot: 'MonthButton',
  overridesResolver: (_, styles) => [
    styles.monthButton,
    { [`&.${pickersMonthClasses.disabled}`]: styles.disabled },
    { [`&.${pickersMonthClasses.selected}`]: styles.selected },
  ],
})<{
  ownerState: PickersMonthProps;
}>(({ theme }) => ({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
  margin: '8px 0',
  height: 36,
  width: 72,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:hover': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:disabled': {
    cursor: 'auto',
    pointerEvents: 'none',
  },
  [`&.${pickersMonthClasses.disabled}`]: {
    color: (theme.vars || theme).palette.text.secondary,
  },
  [`&.${pickersMonthClasses.selected}`]: {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
}));

/**
 * @ignore - do not document.
 */
export const PickersMonth = React.memo(function PickersMonth(inProps: PickersMonthProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersMonth',
  });
  const {
    autoFocus,
    children,
    disabled,
    selected,
    value,
    tabIndex,
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    'aria-current': ariaCurrent,
    'aria-label': ariaLabel,
    // We don't want to forward this prop to the root element
    monthsPerRow,
    ...other
  } = props;

  const ref = React.useRef<HTMLButtonElement>(null);
  const classes = useUtilityClasses(props);

  useEnhancedEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
    }
  }, [autoFocus]);

  return (
    <PickersMonthRoot data-mui-test="month" className={classes.root} ownerState={props} {...other}>
      <PickersMonthButton
        ref={ref}
        disabled={disabled}
        type="button"
        role="radio"
        tabIndex={disabled ? -1 : tabIndex}
        aria-current={ariaCurrent}
        aria-checked={selected}
        aria-label={ariaLabel}
        onClick={(event) => onClick(event, value)}
        onKeyDown={(event) => onKeyDown(event, value)}
        onFocus={(event) => onFocus(event, value)}
        onBlur={(event) => onBlur(event, value)}
        className={classes.monthButton}
        ownerState={props}
      >
        {children}
      </PickersMonthButton>
    </PickersMonthRoot>
  );
});
