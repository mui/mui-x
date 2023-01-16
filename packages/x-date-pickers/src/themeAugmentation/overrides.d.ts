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
import { DatePickerToolbarClassKey } from '../NextDatePicker';
import { TimePickerToolbarClassKey } from '../NextTimePicker';
import { DateTimePickerToolbarClassKey } from '../NextDateTimePicker';
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
  MuiDesktopNextDatePicker: never;
  MuiDesktopNextDateTimePicker: never;
  MuiDesktopNextTimePicker: never;
  MuiLocalizationProvider: never;
  MuiMobileNextDatePicker: never;
  MuiMobileNextDateTimePicker: never;
  MuiMobileNextTimePicker: never;
  MuiMonthCalendar: MonthCalendarClassKey;
  MuiNextDatePicker: never;
  MuiNextDateTimePicker: never;
  MuiNextTimePicker: never;
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
  MuiStaticNextDatePicker: never;
  MuiStaticNextDateTimePicker: never;
  MuiStaticNextTimePicker: never;
  MuiTimeClock: TimeClockClassKey;
  MuiTimePickerToolbar: TimePickerToolbarClassKey;
  MuiYearCalendar: YearCalendarClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
