import {
  DateCalendarClassKey,
  DayCalendarClassKey,
  PickersCalendarHeaderClassKey,
  PickersFadeTransitionGroupClassKey,
  PickersSlideTransitionClassKey,
} from '../DateCalendar';
import { DayCalendarSkeletonClassKey } from '../DayCalendarSkeleton';
import {
  ClockClassKey,
  ClockNumberClassKey,
  TimeClockClassKey,
  ClockPointerClassKey,
} from '../TimeClock';
import { MonthCalendarClassKey, PickersMonthClassKey } from '../MonthCalendar';
import { PickersDayClassKey } from '../PickersDay';
import { PickersYearClassKey, YearCalendarClassKey } from '../YearCalendar';
import { PickersLayoutClassKey } from '../PickersLayout';
import { DatePickerToolbarClassKey } from '../DatePicker';
import { TimePickerToolbarClassKey } from '../TimePicker';
import { DateTimePickerToolbarClassKey, DateTimePickerTabsClassKey } from '../DateTimePicker';
import {
  PickersArrowSwitcherClassKey,
  PickersPopperClassKey,
  PickersToolbarButtonClassKey,
  PickersToolbarClassKey,
  PickersToolbarTextClassKey,
} from '../internals';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiClock: ClockClassKey;
  MuiClockNumber: ClockNumberClassKey;
  MuiClockPointer: ClockPointerClassKey;
  MuiDateCalendar: DateCalendarClassKey;
  MuiDateField: never;
  MuiDatePickerToolbar: DatePickerToolbarClassKey;
  MuiDateTimePickerTabs: DateTimePickerTabsClassKey;
  MuiDateTimePickerToolbar: DateTimePickerToolbarClassKey;
  MuiDayCalendar: DayCalendarClassKey;
  MuiDayCalendarSkeleton: DayCalendarSkeletonClassKey;
  MuiLocalizationProvider: never;
  MuiMonthCalendar: MonthCalendarClassKey;
  MuiPickersArrowSwitcher: PickersArrowSwitcherClassKey;
  MuiPickersCalendarHeader: PickersCalendarHeaderClassKey;
  MuiPickersDay: PickersDayClassKey;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupClassKey;
  MuiPickersMonth: PickersMonthClassKey;
  MuiPickersPopper: PickersPopperClassKey;
  MuiPickersSlideTransition: PickersSlideTransitionClassKey;
  MuiPickersToolbar: PickersToolbarClassKey;
  MuiPickersToolbarButton: PickersToolbarButtonClassKey;
  MuiPickersToolbarText: PickersToolbarTextClassKey;
  MuiPickersLayout: PickersLayoutClassKey;
  MuiPickersYear: PickersYearClassKey;
  MuiTimeClock: TimeClockClassKey;
  MuiTimePickerToolbar: TimePickerToolbarClassKey;
  MuiYearCalendar: YearCalendarClassKey;

  // Date Pickers
  MuiDatePicker: never;
  MuiDesktopDatePicker: never;
  MuiMobileDatePicker: never;
  MuiStaticDatePicker: never;

  // Time Pickers
  MuiTimePicker: never;
  MuiDesktopTimePicker: never;
  MuiMobileTimePicker: never;
  MuiStaticTimePicker: never;
  
  // Date Time Pickers
  MuiDateTimePicker: never;
  MuiDesktopDateTimePicker: never;
  MuiMobileDateTimePicker: never;
  MuiStaticDateTimePicker: never;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
