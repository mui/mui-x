// @ts-nocheck
import * as React from 'react';
import {
  CalendarPicker,
  CalendarPickerProps,
  CalendarPickerSlotsComponent,
  CalendarPickerSlotsComponentsProps,
  CalendarPickerClasses,
  CalendarPickerClassKey,
  calendarPickerClasses,
  getCalendarPickerUtilityClass,
} from '@mui/x-date-pickers/CalendarPicker';
import {
  MonthPicker,
  MonthPickerProps,
  MonthPickerClasses,
  MonthPickerClassKey,
  monthPickerClasses,
  getMonthPickerUtilityClass,
} from '@mui/x-date-pickers/MonthPicker';
import {
  YearPicker,
  YearPickerProps,
  YearPickerClasses,
  YearPickerClassKey,
  yearPickerClasses,
  getYearPickerUtilityClass,
} from '@mui/x-date-pickers/YearPicker';
import {
  ClockPicker,
  ClockPickerProps,
  ClockPickerClasses,
  ClockPickerClassKey,
  clockPickerClasses,
  getClockPickerUtilityClass,
} from '@mui/x-date-pickers/ClockPicker';
import {
  CalendarPickerSkeleton,
  CalendarPickerSkeletonProps,
  CalendarPickerSkeletonClasses,
  CalendarPickerSkeletonClassKey,
  calendarPickerSkeletonClasses,
  getCalendarPickerSkeletonUtilityClass,
} from '@mui/x-date-pickers/CalendarPickerSkeleton';

// prettier-ignore
function App() {
  type DateProps = CalendarPickerProps<any>;
  type MonthProps = MonthPickerProps<any>;
  type YearProps = YearPickerProps<any>;
  type TimeProps = ClockPickerProps<any>;
  type DaySkeletonProps = CalendarPickerSkeletonProps;

  getCalendarPickerUtilityClass('root');
  getMonthPickerUtilityClass('root');
  getYearPickerUtilityClass('root');
  getClockPickerUtilityClass('root');
  getCalendarPickerSkeletonUtilityClass('root');

  return (
    <React.Fragment>
      <CalendarPicker value={null} onChange={() => {}} />
      <MonthPicker value={null} onChange={() => {}} />
      <YearPicker value={null} onChange={() => {}} />
      <ClockPicker value={null} onChange={() => {}} />
      <CalendarPickerSkeleton />
    </React.Fragment>
  );
}
