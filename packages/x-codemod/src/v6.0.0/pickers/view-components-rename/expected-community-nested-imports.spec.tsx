// @ts-nocheck
import * as React from 'react';
import {
  DateCalendar,
  DateCalendarProps,
  DateCalendarSlotsComponent,
  DateCalendarSlotsComponentsProps,
  DateCalendarClasses,
  DateCalendarClassKey,
  dateCalendarClasses,
  getDateCalendarUtilityClass,
} from '@mui/x-date-pickers/DateCalendar';
import {
  MonthCalendar,
  MonthCalendarProps,
  MonthCalendarClasses,
  MonthCalendarClassKey,
  monthCalendarClasses,
  getMonthCalendarUtilityClass,
} from '@mui/x-date-pickers/MonthCalendar';
import {
  YearCalendar,
  YearCalendarProps,
  YearCalendarClasses,
  YearCalendarClassKey,
  yearCalendarClasses,
  getYearCalendarUtilityClass,
} from '@mui/x-date-pickers/YearCalendar';
import {
  TimeClock,
  TimeClockProps,
  TimeClockClasses,
  TimeClockClassKey,
  timeClockClasses,
  getTimeClockUtilityClass,
} from '@mui/x-date-pickers/TimeClock';
import {
  DayCalendarSkeleton,
  DayCalendarSkeletonProps,
  DayCalendarSkeletonClasses,
  DayCalendarSkeletonClassKey,
  dayCalendarSkeletonClasses,
  getDayCalendarSkeletonUtilityClass,
} from '@mui/x-date-pickers/DayCalendarSkeleton';

// prettier-ignore
function App() {
  type DateProps = DateCalendarProps<any>;
  type MonthProps = MonthCalendarProps<any>;
  type YearProps = YearCalendarProps<any>;
  type TimeProps = TimeClockProps<any>;
  type DaySkeletonProps = DayCalendarSkeletonProps;

  getDateCalendarUtilityClass('root');
  getMonthCalendarUtilityClass('root');
  getYearCalendarUtilityClass('root');
  getTimeClockUtilityClass('root');
  getDayCalendarSkeletonUtilityClass('root');

  return (
    (<React.Fragment>
      <DateCalendar value={null} onChange={() => {}} />
      <MonthCalendar value={null} onChange={() => {}} />
      <YearCalendar value={null} onChange={() => {}} />
      <TimeClock value={null} onChange={() => {}} />
      <DayCalendarSkeleton />
    </React.Fragment>)
  );
}
