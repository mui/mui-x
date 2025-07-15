import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  MonthCalendarSlotProps,
  MonthCalendarSlots,
  MonthButtonOwnerState,
} from './MonthCalendar.types';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import {
  getMonthCalendarUtilityClass,
  monthCalendarClasses,
  MonthCalendarClasses,
} from './monthCalendarClasses';

export interface MonthCalendarButtonProps {
  value: number;
  tabIndex: number;
  selected: boolean;
  disabled: boolean;
  autoFocus: boolean;
  classes: Partial<MonthCalendarClasses> | undefined;
  slots: MonthCalendarSlots | undefined;
  slotProps: MonthCalendarSlotProps | undefined;
  'aria-current': React.AriaAttributes['aria-current'];
  'aria-label': React.AriaAttributes['aria-label'];
  children: React.ReactNode;
  onClick: (event: React.MouseEvent, month: number) => void;
  onKeyDown: (event: React.KeyboardEvent, month: number) => void;
  onFocus: (event: React.FocusEvent, month: number) => void;
  onBlur: (event: React.FocusEvent, month: number) => void;
}

const useUtilityClasses = (
  classes: Partial<MonthCalendarClasses> | undefined,
  ownerState: MonthButtonOwnerState,
) => {
  const slots = {
    button: [
      'button',
      ownerState.isMonthDisabled && 'disabled',
      ownerState.isMonthSelected && 'selected',
    ],
  };

  return composeClasses(slots, getMonthCalendarUtilityClass, classes);
};

const DefaultMonthButton = styled('button', {
  name: 'MuiMonthCalendar',
  slot: 'Button',
  overridesResolver: (_, styles) => [
    styles.button,
    { [`&.${monthCalendarClasses.disabled}`]: styles.disabled },
    { [`&.${monthCalendarClasses.selected}`]: styles.selected },
  ],
})<{
  ownerState?: MonthButtonOwnerState;
}>(({ theme }) => ({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
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
  [`&.${monthCalendarClasses.disabled}`]: {
    color: (theme.vars || theme).palette.text.secondary,
  },
  [`&.${monthCalendarClasses.selected}`]: {
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
export const MonthCalendarButton = React.memo(function MonthCalendarButton(
  props: MonthCalendarButtonProps,
) {
  const {
    autoFocus,
    classes: classesProp,
    disabled,
    selected,
    value,
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    slots,
    slotProps,
    ...other
  } = props;

  const ref = React.useRef<HTMLButtonElement>(null);
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const ownerState: MonthButtonOwnerState = {
    ...pickerOwnerState,
    isMonthDisabled: disabled,
    isMonthSelected: selected,
  };

  const classes = useUtilityClasses(classesProp, ownerState);

  // We can't forward the `autoFocus` to the button because it is a native button, not a MUI Button
  useEnhancedEffect(() => {
    if (autoFocus) {
      // `ref.current` being `null` would be a bug in MUI.
      ref.current?.focus();
    }
  }, [autoFocus]);

  const MonthButton = slots?.monthButton ?? DefaultMonthButton;
  const monthButtonProps = useSlotProps({
    elementType: MonthButton,
    externalSlotProps: slotProps?.monthButton,
    externalForwardedProps: other,
    additionalProps: {
      disabled,
      ref,
      type: 'button' as const,
      role: 'radio',
      'aria-checked': selected,
      onClick: (event: React.MouseEvent) => onClick(event, value),
      onKeyDown: (event: React.KeyboardEvent) => onKeyDown(event, value),
      onFocus: (event: React.FocusEvent) => onFocus(event, value),
      onBlur: (event: React.FocusEvent) => onBlur(event, value),
    },
    ownerState,
    className: classes.button,
  });

  return <MonthButton {...monthButtonProps} />;
});
