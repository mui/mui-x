import {
  DateCalendarProps,
  ExportedSlideTransitionProps,
  PickersFadeTransitionGroupProps,
} from '../DateCalendar';
import { DayCalendarSkeletonProps } from '../DayCalendarSkeleton';
import { ClockNumberProps, TimeClockProps, ClockPointerProps, ClockProps } from '../TimeClock';
import { DatePickerProps, DatePickerToolbarProps } from '../DatePicker';
import {
  DateTimePickerProps,
  DateTimePickerTabsProps,
  DateTimePickerToolbarProps,
} from '../DateTimePicker';
import { DesktopDateTimePickerProps } from '../DesktopDateTimePicker';
import { DesktopTimePickerProps } from '../DesktopTimePicker';
import { MobileDatePickerProps } from '../MobileDatePicker';
import { MobileDateTimePickerProps } from '../MobileDateTimePicker';
import { MobileTimePickerProps } from '../MobileTimePicker';
import { ExportedPickersMonthProps, MonthCalendarProps } from '../MonthCalendar';
import { PickersDayProps } from '../PickersDay';
import { StaticDatePickerProps } from '../StaticDatePicker';
import { StaticDateTimePickerProps } from '../StaticDateTimePicker';
import { StaticTimePickerProps } from '../StaticTimePicker';
import { TimePickerProps, TimePickerToolbarProps } from '../TimePicker';
import { ExportedPickersYearProps, YearCalendarProps } from '../YearCalendar';
import { DateFieldProps } from '../DateField';
import { LocalizationProviderProps } from '../LocalizationProvider';
import { DesktopDatePickerProps } from '../DesktopDatePicker';
import { PickersViewLayoutProps } from '../PickersViewLayout';
import {
  CalendarOrClockPickerProps,
  DayCalendarProps,
  ExportedPickersArrowSwitcherProps,
  PickerPopperProps,
  PickersToolbarButtonProps,
  PickersToolbarProps,
  PickerStaticWrapperProps,
  ExportedCalendarHeaderProps,
  ExportedPickersToolbarTextProps,
} from '../internals';
import { DateOrTimeView } from '../internals/models';

import { NextDatePickerProps } from '../NextDatePicker';
import { DesktopNextDatePickerProps } from '../DesktopNextDatePicker';
import { MobileNextDatePickerProps } from '../MobileNextDatePicker';
import { StaticNextDatePickerProps } from '../StaticNextDatePicker';

import { NextDateTimePickerProps } from '../NextDateTimePicker';
import { DesktopNextDateTimePickerProps } from '../DesktopNextDateTimePicker';
import { MobileNextDateTimePickerProps } from '../MobileNextDateTimePicker';
import { StaticNextDateTimePickerProps } from '../StaticNextDateTimePicker';

import { NextTimePickerProps } from '../NextTimePicker';
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
  MuiDatePicker: DatePickerProps<unknown>;
  MuiDatePickerToolbar: DatePickerToolbarProps<unknown>;
  MuiDateTimePicker: DateTimePickerProps<unknown>;
  MuiDateTimePickerTabs: DateTimePickerTabsProps;
  MuiDateTimePickerToolbar: DateTimePickerToolbarProps<unknown>;
  MuiDayCalendar: DayCalendarProps<unknown>;
  MuiDayCalendarSkeleton: DayCalendarSkeletonProps;
  MuiDesktopDatePicker: DesktopDatePickerProps<unknown>;
  MuiDesktopDateTimePicker: DesktopDateTimePickerProps<unknown>;
  MuiDesktopNextDatePicker: DesktopNextDatePickerProps<unknown>;
  MuiDesktopNextDateTimePicker: DesktopNextDateTimePickerProps<unknown>;
  MuiDesktopNextTimePicker: DesktopNextTimePickerProps<unknown>;
  MuiDesktopTimePicker: DesktopTimePickerProps<unknown>;
  MuiLocalizationProvider: LocalizationProviderProps<unknown>;
  MuiMobileDatePicker: MobileDatePickerProps<unknown>;
  MuiMobileDateTimePicker: MobileDateTimePickerProps<unknown>;
  MuiMobileNextDatePicker: MobileNextDatePickerProps<unknown>;
  MuiMobileNextDateTimePicker: MobileNextDateTimePickerProps<unknown>;
  MuiMobileNextTimePicker: MobileNextTimePickerProps<unknown>;
  MuiMobileTimePicker: MobileTimePickerProps<unknown>;
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
  MuiPickerStaticWrapper: PickerStaticWrapperProps<unknown>;
  MuiPickersToolbar: PickersToolbarProps<unknown, unknown>;
  MuiPickersToolbarButton: PickersToolbarButtonProps;
  MuiPickersToolbarText: ExportedPickersToolbarTextProps;
  MuiPickersViewLayout: PickersViewLayoutProps<unknown, unknown>;
  MuiPickersYear: ExportedPickersYearProps;
  MuiStaticDatePicker: StaticDatePickerProps<unknown>;
  MuiStaticDateTimePicker: StaticDateTimePickerProps<unknown>;
  MuiStaticNextDatePicker: StaticNextDatePickerProps<unknown>;
  MuiStaticNextDateTimePicker: StaticNextDateTimePickerProps<unknown>;
  MuiStaticNextTimePicker: StaticNextTimePickerProps<unknown>;
  MuiStaticTimePicker: StaticTimePickerProps<unknown>;
  MuiTimeClock: TimeClockProps<unknown>;
  MuiTimePicker: TimePickerProps<unknown>;
  MuiTimePickerToolbar: TimePickerToolbarProps<unknown>;
  MuiYearCalendar: YearCalendarProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersComponentsPropsList {}
}

// disable automatic export
export {};
