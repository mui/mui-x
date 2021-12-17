import * as React from 'react';
import clsx from 'clsx';
import { useThemeProps, styled } from '@mui/material/styles';
import {
  generateUtilityClasses,
  generateUtilityClass,
  unstable_composeClasses as composeClasses,
} from '@mui/material';
import { CalendarPickerProps } from './CalendarPickerProps';
import { CalendarPickerClasses } from './calendarPickerClasses';
import { PickerView, DayPicker } from '../pickerViews';
import { useCalendarState } from './useCalendarState'
import {useDefaultDates} from "../../hooks/utils/useDateUtils";

export const getCalendarPickerUtilityClass = (slot: string) =>
  generateUtilityClass('MuiCalendarPicker', slot);

export const calendarPickerClasses: CalendarPickerClasses = generateUtilityClasses(
  'MuiCalendarPicker',
  ['root', 'viewTransitionContainer'],
);

const useUtilityClasses = (
  ownerState: CalendarPickerProps<any> & { classes?: Partial<CalendarPickerClasses> },
) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getCalendarPickerUtilityClass, classes);
};

const CalendarPickerRoot = styled(PickerView, {
  name: 'MuiCalendarPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: CalendarPickerProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
});

const defaultReduceAnimations =
    typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent);

/**
 * TODO: Fix name duplicate with core `MuiCalendarPicker` component
 */
export function CalendarPicker<TDate>(inProps: CalendarPickerProps<TDate>) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiCalendarPicker',
  });

  const {
    autoFocus,
    onViewChange,
    date,
    disableFuture = false,
    disablePast = false,
    defaultCalendarMonth,
    loading = false,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onChange,
    onMonthChange,
    reduceAnimations = defaultReduceAnimations,
    renderLoading = () => <span data-mui-test="loading-progress">...</span>,
    shouldDisableDate,
    // shouldDisableYear,
    // view,
    // views = ['year', 'day'],
    // openTo = 'day',
    className,
    ...other
  } = props;
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const defaultDates = useDefaultDates<TDate>();
  const minDate = minDateProp ?? defaultDates.minDate;
  const maxDate = maxDateProp ?? defaultDates.maxDate;

  const {
    calendarState,
    changeFocusedDay,
    changeMonth,
    isDateDisabled,
    handleChangeMonth,
    onMonthSwitchingAnimationEnd,
  } = useCalendarState({
    date,
    defaultCalendarMonth,
    reduceAnimations,
    onMonthChange,
    minDate,
    maxDate,
    shouldDisableDate,
    disablePast,
    disableFuture,
  });

  return (
    <CalendarPickerRoot className={clsx(classes.root, className)} ownerState={ownerState}>
      <DayPicker
          {...other}
          {...calendarState}
          autoFocus={autoFocus}
          onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
          onFocusedDayChange={changeFocusedDay}
          reduceAnimations={reduceAnimations}
          date={date}
          onChange={onChange}
          isDateDisabled={isDateDisabled}
          loading={loading}
          renderLoading={renderLoading}
      />
    </CalendarPickerRoot>
  );

  return <div>TEST</div>;
};
