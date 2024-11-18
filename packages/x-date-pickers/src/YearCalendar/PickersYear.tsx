import * as React from 'react';
import clsx from 'clsx';
import { styled, alpha, useThemeProps } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  getPickersYearUtilityClass,
  pickersYearClasses,
  PickersYearClasses,
} from './pickersYearClasses';
import {
  PickerYearOwnerState,
  YearCalendarSlotProps,
  YearCalendarSlots,
} from './YearCalendar.types';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { PickerOwnerState } from '../models/pickers';

export interface ExportedPickersYearProps {
  classes?: Partial<PickersYearClasses>;
}

export interface PickersYearProps extends ExportedPickersYearProps {
  'aria-current'?: React.AriaAttributes['aria-current'];
  autoFocus?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent, year: number) => void;
  onKeyDown: (event: React.KeyboardEvent, year: number) => void;
  onFocus: (event: React.FocusEvent, year: number) => void;
  onBlur: (event: React.FocusEvent, year: number) => void;
  selected: boolean;
  value: number;
  tabIndex: number;
  yearsPerRow: 3 | 4;
  slots?: YearCalendarSlots;
  slotProps?: YearCalendarSlotProps;
}

const useUtilityClasses = (
  classes: Partial<PickersYearClasses> | undefined,
  ownerState: PickerYearOwnerState,
) => {
  const slots = {
    root: ['root'],
    yearButton: [
      'yearButton',
      ownerState.isYearDisabled && 'disabled',
      ownerState.isYearSelected && 'selected',
    ],
  };

  return composeClasses(slots, getPickersYearUtilityClass, classes);
};

const PickersYearRoot = styled('div', {
  name: 'MuiPickersYear',
  slot: 'Root',
  overridesResolver: (_, styles) => [styles.root],
})<{ ownerState: PickerOwnerState }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexBasis: '33.3%',
  variants: [{ props: { yearsPerRow: 4 }, style: { flexBasis: '25%' } }],
});

const YearCalendarButton = styled('button', {
  name: 'MuiPickersYear',
  slot: 'YearButton',
  overridesResolver: (_, styles) => [
    styles.yearButton,
    { [`&.${pickersYearClasses.disabled}`]: styles.disabled },
    { [`&.${pickersYearClasses.selected}`]: styles.selected },
  ],
})<{ ownerState: PickerOwnerState }>(({ theme }) => ({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
  margin: '6px 0',
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
  [`&.${pickersYearClasses.disabled}`]: {
    color: (theme.vars || theme).palette.text.secondary,
  },
  [`&.${pickersYearClasses.selected}`]: {
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
export const PickersYear = React.memo(function PickersYear(inProps: PickersYearProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersYear',
  });
  const {
    autoFocus,
    className,
    classes: classesProp,
    children,
    disabled = false,
    selected = false,
    value,
    tabIndex,
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    'aria-current': ariaCurrent,
    // We don't want to forward this prop to the root element
    yearsPerRow,
    slots,
    slotProps,
    ...other
  } = props;

  const ref = React.useRef<HTMLButtonElement>(null);
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const ownerState: PickerYearOwnerState = {
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

  const YearButton = slots?.yearButton ?? YearCalendarButton;
  const yearButtonProps = useSlotProps({
    elementType: YearButton,
    externalSlotProps: slotProps?.yearButton,
    additionalProps: {
      children,
      disabled,
      tabIndex,
      ref,
      type: 'button' as const,
      role: 'radio',
      'aria-current': ariaCurrent,
      'aria-checked': selected,
      onClick: (event: React.MouseEvent) => onClick(event, value),
      onKeyDown: (event: React.KeyboardEvent) => onKeyDown(event, value),
      onFocus: (event: React.FocusEvent) => onFocus(event, value),
      onBlur: (event: React.FocusEvent) => onBlur(event, value),
    },
    ownerState,
    className: classes.yearButton,
  });

  return (
    <PickersYearRoot
      data-testid="year"
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <YearButton {...yearButtonProps} />
    </PickersYearRoot>
  );
});
