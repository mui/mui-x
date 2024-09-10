import * as React from 'react';
import clsx from 'clsx';
import { styled, alpha, useThemeProps } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  getPickersMonthUtilityClass,
  pickersMonthClasses,
  PickersMonthClasses,
} from './pickersMonthClasses';
import { MonthCalendarSlotProps, MonthCalendarSlots } from './MonthCalendar.types';

export interface ExportedPickersMonthProps {
  classes?: Partial<PickersMonthClasses>;
}

export interface PickersMonthProps extends ExportedPickersMonthProps {
  'aria-current'?: React.AriaAttributes['aria-current'];
  'aria-label'?: React.AriaAttributes['aria-label'];
  autoFocus: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent, month: number) => void;
  onKeyDown: (event: React.KeyboardEvent, month: number) => void;
  onFocus: (event: React.FocusEvent, month: number) => void;
  onBlur: (event: React.FocusEvent, month: number) => void;
  selected?: boolean;
  value: number;
  tabIndex: number;
  monthsPerRow: 3 | 4;
  slots?: MonthCalendarSlots;
  slotProps?: MonthCalendarSlotProps;
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
}>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexBasis: '33.3%',
  variants: [{ props: { monthsPerRow: 4 }, style: { flexBasis: '25%' } }],
});

const MonthCalendarButton = styled('button', {
  name: 'MuiPickersMonth',
  slot: 'MonthButton',
  overridesResolver: (_, styles) => [
    styles.monthButton,
    { [`&.${pickersMonthClasses.disabled}`]: styles.disabled },
    { [`&.${pickersMonthClasses.selected}`]: styles.selected },
  ],
})<{
  ownerState?: PickersMonthProps;
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
    className,
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
    slots,
    slotProps,
    ...other
  } = props;

  const ref = React.useRef<HTMLButtonElement>(null);
  const classes = useUtilityClasses(props);

  // We can't forward the `autoFocus` to the button because it is a native button, not a MUI Button
  useEnhancedEffect(() => {
    if (autoFocus) {
      // `ref.current` being `null` would be a bug in MUI.
      ref.current?.focus();
    }
  }, [autoFocus]);

  const MonthButton = slots?.monthButton ?? MonthCalendarButton;
  const monthButtonProps = useSlotProps({
    elementType: MonthButton,
    externalSlotProps: slotProps?.monthButton,
    additionalProps: {
      children,
      disabled,
      tabIndex,
      ref,
      type: 'button' as const,
      role: 'radio',
      'aria-current': ariaCurrent,
      'aria-checked': selected,
      'aria-label': ariaLabel,
      onClick: (event: React.MouseEvent) => onClick(event, value),
      onKeyDown: (event: React.KeyboardEvent) => onKeyDown(event, value),
      onFocus: (event: React.FocusEvent) => onFocus(event, value),
      onBlur: (event: React.FocusEvent) => onBlur(event, value),
    },
    ownerState: props,
    className: classes.monthButton,
  });

  return (
    <PickersMonthRoot
      data-mui-test="month"
      className={clsx(classes.root, className)}
      ownerState={props}
      {...other}
    >
      <MonthButton {...monthButtonProps} />
    </PickersMonthRoot>
  );
});
