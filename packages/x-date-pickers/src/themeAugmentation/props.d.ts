import { DateCalendarProps, PickersFadeTransitionGroupProps } from '../DateCalendar';
import { DayCalendarSkeletonProps } from '../DayCalendarSkeleton';
import { ClockNumberProps, ClockPickerProps, ClockPointerProps, ClockProps } from '../ClockPicker';
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
import { MonthCalendarProps } from '../MonthCalendar';
import { PickersDayProps } from '../PickersDay';
import { StaticDatePickerProps } from '../StaticDatePicker';
import { StaticDateTimePickerProps } from '../StaticDateTimePicker';
import { StaticTimePickerProps } from '../StaticTimePicker';
import { TimePickerProps, TimePickerToolbarProps } from '../TimePicker';
import { YearCalendarProps } from '../YearCalendar';
import { DateFieldProps } from '../DateField';
import { LocalizationProviderProps } from '../LocalizationProvider';
import { DesktopDatePickerProps } from '../DesktopDatePicker';
import {
  CalendarOrClockPickerProps,
  DayCalendarProps,
  ExportedPickersArrowSwitcherProps,
  PickerPopperProps,
  PickersToolbarButtonProps,
  PickersToolbarProps,
  PickerStaticWrapperProps,
  ExportedCalendarHeaderProps,
} from '../internals';
import { CalendarOrClockPickerView } from '../internals/models';
import { PickerViewLayoutProps } from '../internals/components/PickerViewLayout';

export interface PickersComponentsPropsList {
  MuiCalendarOrClockPicker: CalendarOrClockPickerProps<unknown, CalendarOrClockPickerView>;
  MuiClock: ClockProps<unknown>;
  MuiClockNumber: ClockNumberProps;
  MuiClockPicker: ClockPickerProps<unknown>;
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
  MuiDesktopTimePicker: DesktopTimePickerProps<unknown>;
  MuiLocalizationProvider: LocalizationProviderProps<unknown>;
  MuiMobileDatePicker: MobileDatePickerProps<unknown>;
  MuiMobileDateTimePicker: MobileDateTimePickerProps<unknown>;
  MuiMobileTimePicker: MobileTimePickerProps<unknown>;
  MuiMonthCalendar: MonthCalendarProps<unknown>;
  MuiPickersArrowSwitcher: ExportedPickersArrowSwitcherProps;
  MuiPickersCalendarHeader: ExportedCalendarHeaderProps<unknown>;
  MuiPickersDay: PickersDayProps<unknown>;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupProps;
  MuiPickersPopper: PickerPopperProps;
  MuiPickerStaticWrapper: PickerStaticWrapperProps<unknown>;
  MuiPickersToolbar: PickersToolbarProps<unknown>;
  MuiPickersToolbarButton: PickersToolbarButtonProps;
  MuiPickerViewLayout: PickerViewLayoutProps<unknown, CalendarOrClockPickerView>;
  MuiStaticDatePicker: StaticDatePickerProps<unknown>;
  MuiStaticDateTimePicker: StaticDateTimePickerProps<unknown>;
  MuiStaticTimePicker: StaticTimePickerProps<unknown>;
  MuiTimePicker: TimePickerProps<unknown>;
  MuiTimePickerToolbar: TimePickerToolbarProps<unknown>;
  MuiYearCalendar: YearCalendarProps<unknown>;
  // TODO v6: add `PrivatePickersMonth` once component is renamed to `MuiPickersMonth`
  PrivatePickersMonth: never;
  // TODO v6: add `PrivatePickersSlideTransition` once component is renamed to `MuiPickersSlideTransition`
  PrivatePickersSlideTransition: never;
  // TODO v6: add `PickersToolbarTextProps` once component is renamed to `MuiPickersToolbarText`
  PrivatePickersToolbarText: never;
  // TODO v6: add `PickersYearProps` once component is renamed to `MuiPickersYear`
  PrivatePickersYear: never;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersComponentsPropsList {}
}

// disable automatic export
export {};
