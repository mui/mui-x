import { CalendarPickerProps, PickersFadeTransitionGroupProps } from '../CalendarPicker';
import { CalendarPickerSkeletonProps } from '../CalendarPickerSkeleton';
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
import { MonthPickerProps } from '../MonthPicker';
import { PickersDayProps } from '../PickersDay';
import { StaticDatePickerProps } from '../StaticDatePicker';
import { StaticDateTimePickerProps } from '../StaticDateTimePicker';
import { StaticTimePickerProps } from '../StaticTimePicker';
import { TimePickerProps, TimePickerToolbarProps } from '../TimePicker';
import { YearPickerProps } from '../YearPicker';
import { DateFieldProps } from '../DateField';
import { LocalizationProviderProps } from '../LocalizationProvider';
import { DesktopDatePickerProps } from '../DesktopDatePicker';
import {
  CalendarOrClockPickerProps,
  DayPickerProps,
  ExportedPickersArrowSwitcherProps,
  PickerPopperProps,
  PickersToolbarButtonProps,
  PickersToolbarProps,
  PickerStaticWrapperProps,
  ExportedCalendarHeaderProps,
  CalendarOrClockPickerView,
} from '../internals';

export interface PickersComponentsPropsList {
  MuiCalendarOrClockPicker: CalendarOrClockPickerProps<unknown, CalendarOrClockPickerView>;
  MuiCalendarPicker: CalendarPickerProps<unknown>;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonProps;
  MuiClock: ClockProps<unknown>;
  MuiClockNumber: ClockNumberProps;
  MuiClockPicker: ClockPickerProps<unknown>;
  MuiClockPointer: ClockPointerProps;
  MuiDateField: DateFieldProps<unknown>;
  MuiDatePicker: DatePickerProps<unknown>;
  MuiDatePickerToolbar: DatePickerToolbarProps<unknown>;
  MuiDateTimePicker: DateTimePickerProps<unknown>;
  MuiDateTimePickerTabs: DateTimePickerTabsProps;
  MuiDateTimePickerToolbar: DateTimePickerToolbarProps<unknown>;
  MuiDayPicker: DayPickerProps<unknown>;
  MuiDesktopDatePicker: DesktopDatePickerProps<unknown>;
  MuiDesktopDateTimePicker: DesktopDateTimePickerProps<unknown>;
  MuiDesktopTimePicker: DesktopTimePickerProps<unknown>;
  MuiLocalizationProvider: LocalizationProviderProps;
  MuiMobileDatePicker: MobileDatePickerProps<unknown>;
  MuiMobileDateTimePicker: MobileDateTimePickerProps<unknown>;
  MuiMobileTimePicker: MobileTimePickerProps<unknown>;
  MuiMonthPicker: MonthPickerProps<unknown>;
  MuiPickersArrowSwitcher: ExportedPickersArrowSwitcherProps;
  MuiPickersCalendarHeader: ExportedCalendarHeaderProps<unknown>;
  MuiPickersDay: PickersDayProps<unknown>;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupProps;
  MuiPickersPopper: PickerPopperProps;
  MuiPickerStaticWrapper: PickerStaticWrapperProps<unknown>;
  MuiPickersToolbar: PickersToolbarProps<unknown, unknown>;
  MuiPickersToolbarButton: PickersToolbarButtonProps;
  MuiStaticDatePicker: StaticDatePickerProps<unknown>;
  MuiStaticDateTimePicker: StaticDateTimePickerProps<unknown>;
  MuiStaticTimePicker: StaticTimePickerProps<unknown>;
  MuiTimePicker: TimePickerProps<unknown>;
  MuiTimePickerToolbar: TimePickerToolbarProps<unknown>;
  MuiYearPicker: YearPickerProps<unknown>;
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
