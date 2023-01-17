import {
  DateCalendarProps,
  ExportedSlideTransitionProps,
  PickersFadeTransitionGroupProps,
} from '../DateCalendar';
import { DayCalendarSkeletonProps } from '../DayCalendarSkeleton';
import { ClockNumberProps, TimeClockProps, ClockPointerProps, ClockProps } from '../TimeClock';
import { ExportedPickersMonthProps, MonthCalendarProps } from '../MonthCalendar';
import { PickersDayProps } from '../PickersDay';
import { ExportedPickersYearProps, YearCalendarProps } from '../YearCalendar';
import { DateFieldProps } from '../DateField';
import { LocalizationProviderProps } from '../LocalizationProvider';
import { PickersLayoutProps } from '../PickersLayout';
import {
  CalendarOrClockPickerProps,
  DayCalendarProps,
  ExportedPickersArrowSwitcherProps,
  PickerPopperProps,
  PickersToolbarButtonProps,
  PickersToolbarProps,
  ExportedCalendarHeaderProps,
  ExportedPickersToolbarTextProps,
} from '../internals';
import { DateOrTimeView } from '../internals/models';

import { NextDatePickerProps, DatePickerToolbarProps } from '../NextDatePicker';
import { DesktopNextDatePickerProps } from '../DesktopNextDatePicker';
import { MobileNextDatePickerProps } from '../MobileNextDatePicker';
import { StaticNextDatePickerProps } from '../StaticNextDatePicker';

import {
  NextDateTimePickerProps,
  DateTimePickerTabsProps,
  DateTimePickerToolbarProps,
} from '../NextDateTimePicker';
import { DesktopNextDateTimePickerProps } from '../DesktopNextDateTimePicker';
import { MobileNextDateTimePickerProps } from '../MobileNextDateTimePicker';
import { StaticNextDateTimePickerProps } from '../StaticNextDateTimePicker';

import { NextTimePickerProps, TimePickerToolbarProps } from '../NextTimePicker';
import { DesktopNextTimePickerProps } from '../DesktopNextTimePicker';
import { MobileNextTimePickerProps } from '../MobileNextTimePicker';
import { StaticNextTimePickerProps } from '../StaticNextTimePicker';

export interface PickersComponentsPropsList {
  MuiCalendarOrClockPicker: CalendarOrClockPickerProps<unknown, DateOrTimeView>;
  MuiClock: ClockProps<unknown>;
  MuiClockNumber: ClockNumberProps;
  MuiClockPointer: ClockPointerProps;
  MuiDateCalendar: DateCalendarProps<unknown>;
  MuiDateField: DateFieldProps<unknown>;
  MuiDatePickerToolbar: DatePickerToolbarProps<unknown>;
  MuiDateTimePickerTabs: DateTimePickerTabsProps;
  MuiDateTimePickerToolbar: DateTimePickerToolbarProps<unknown>;
  MuiDayCalendar: DayCalendarProps<unknown>;
  MuiDayCalendarSkeleton: DayCalendarSkeletonProps;
  MuiDesktopNextDatePicker: DesktopNextDatePickerProps<unknown>;
  MuiDesktopNextDateTimePicker: DesktopNextDateTimePickerProps<unknown>;
  MuiDesktopNextTimePicker: DesktopNextTimePickerProps<unknown>;
  MuiLocalizationProvider: LocalizationProviderProps<unknown>;
  MuiMobileNextDatePicker: MobileNextDatePickerProps<unknown>;
  MuiMobileNextDateTimePicker: MobileNextDateTimePickerProps<unknown>;
  MuiMobileNextTimePicker: MobileNextTimePickerProps<unknown>;
  MuiMonthCalendar: MonthCalendarProps<unknown>;
  MuiNextDatePicker: NextDatePickerProps<unknown>;
  MuiNextDateTimePicker: NextDateTimePickerProps<unknown>;
  MuiNextTimePicker: NextTimePickerProps<unknown>;
  MuiPickersArrowSwitcher: ExportedPickersArrowSwitcherProps;
  MuiPickersCalendarHeader: ExportedCalendarHeaderProps<unknown>;
  MuiPickersDay: PickersDayProps<unknown>;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupProps;
  MuiPickersMonth: ExportedPickersMonthProps;
  MuiPickersPopper: PickerPopperProps;
  MuiPickersSlideTransition: ExportedSlideTransitionProps;
  MuiPickersToolbar: PickersToolbarProps<unknown, unknown>;
  MuiPickersToolbarButton: PickersToolbarButtonProps;
  MuiPickersToolbarText: ExportedPickersToolbarTextProps;
  MuiPickersLayout: PickersLayoutProps<unknown, DateOrTimeView>;
  MuiPickersYear: ExportedPickersYearProps;
  MuiStaticNextDatePicker: StaticNextDatePickerProps<unknown>;
  MuiStaticNextDateTimePicker: StaticNextDateTimePickerProps<unknown>;
  MuiStaticNextTimePicker: StaticNextTimePickerProps<unknown>;
  MuiTimeClock: TimeClockProps<unknown>;
  MuiTimePickerToolbar: TimePickerToolbarProps<unknown>;
  MuiYearCalendar: YearCalendarProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersComponentsPropsList {}
}

// disable automatic export
export {};
