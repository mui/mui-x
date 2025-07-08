import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  YearButtonOwnerState,
  YearCalendarSlotProps,
  YearCalendarSlots,
} from './YearCalendar.types';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { PickerOwnerState } from '../models/pickers';
import {
  getYearCalendarUtilityClass,
  yearCalendarClasses,
  YearCalendarClasses,
} from './yearCalendarClasses';

export interface YearCalendarButtonProps {
  value: number;
  tabIndex: number;
  selected: boolean;
  disabled: boolean;
  autoFocus: boolean;
  classes: Partial<YearCalendarClasses> | undefined;
  slots: YearCalendarSlots | undefined;
  slotProps: YearCalendarSlotProps | undefined;
  'aria-current': React.AriaAttributes['aria-current'];
  children: React.ReactNode;
  onClick: (event: React.MouseEvent, year: number) => void;
  onKeyDown: (event: React.KeyboardEvent, year: number) => void;
  onFocus: (event: React.FocusEvent, year: number) => void;
  onBlur: (event: React.FocusEvent, year: number) => void;
}

const useUtilityClasses = (
  classes: Partial<YearCalendarClasses> | undefined,
  ownerState: YearButtonOwnerState,
) => {
  const slots = {
    button: [
      'button',
      ownerState.isYearDisabled && 'disabled',
      ownerState.isYearSelected && 'selected',
    ],
  };

  return composeClasses(slots, getYearCalendarUtilityClass, classes);
};

const DefaultYearButton = styled('button', {
  name: 'MuiYearCalendar',
  slot: 'Button',
  overridesResolver: (_, styles) => [
    styles.button,
    { [`&.${yearCalendarClasses.disabled}`]: styles.disabled },
    { [`&.${yearCalendarClasses.selected}`]: styles.selected },
  ],
})<{ ownerState: PickerOwnerState }>(({ theme }) => ({
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
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.focusOpacity),
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
  [`&.${yearCalendarClasses.disabled}`]: {
    color: (theme.vars || theme).palette.text.secondary,
  },
  [`&.${yearCalendarClasses.selected}`]: {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
}));

/**
 * @ignore - internal component.
 */
export const YearCalendarButton = React.memo(function YearCalendarButton(
  props: YearCalendarButtonProps,
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
  const ownerState: YearButtonOwnerState = {
    ...pickerOwnerState,
    isYearDisabled: disabled,
    isYearSelected: selected,
  };
  const classes = useUtilityClasses(classesProp, ownerState);

  // We can't forward the `autoFocus` to the button because it is a native button, not a MUI Button
  useEnhancedEffect(() => {
    if (autoFocus) {
      // `ref.current` being `null` would be a bug in MUI.
      ref.current?.focus();
    }
  }, [autoFocus]);

  const YearButton = slots?.yearButton ?? DefaultYearButton;
  const yearButtonProps = useSlotProps({
    elementType: YearButton,
    externalSlotProps: slotProps?.yearButton,
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

  return <YearButton {...yearButtonProps} />;
});
