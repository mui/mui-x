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
import { PickerStaticWrapperClassKey } from '../internals/components/PickerStaticWrapper';
import { DatePickerToolbarClassKey } from '../DatePicker';
import { DateTimePickerTabsClassKey, DateTimePickerToolbarClassKey } from '../DateTimePicker';
import { TimePickerToolbarClassKey } from '../TimePicker';
import {
  CalendarOrClockPickerClassKey,
  PickersArrowSwitcherClassKey,
  PickersPopperClassKey,
  PickersToolbarButtonClassKey,
  PickersToolbarClassKey,
  PickersToolbarTextClassKey,
} from '../internals';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiCalendarOrClockPicker: CalendarOrClockPickerClassKey;
  MuiClock: ClockClassKey;
  MuiClockNumber: ClockNumberClassKey;
  MuiClockPointer: ClockPointerClassKey;
  MuiDateCalendar: DateCalendarClassKey;
  MuiDateField: never;
  MuiDatePicker: never;
  MuiDatePickerToolbar: DatePickerToolbarClassKey;
  MuiDateTimePicker: never;
  MuiDateTimePickerTabs: DateTimePickerTabsClassKey;
  MuiDateTimePickerToolbar: DateTimePickerToolbarClassKey;
  MuiDayCalendar: DayCalendarClassKey;
  MuiDayCalendarSkeleton: DayCalendarSkeletonClassKey;
  MuiDesktopDatePicker: never;
  MuiDesktopDateTimePicker: never;
  MuiDesktopNextDatePicker: never;
  MuiDesktopNextDateTimePicker: never;
  MuiDesktopNextTimePicker: never;
  MuiDesktopTimePicker: never;
  MuiLocalizationProvider: never;
  MuiMobileDatePicker: never;
  MuiMobileDateTimePicker: never;
  MuiMobileNextDatePicker: never;
  MuiMobileNextDateTimePicker: never;
  MuiMobileNextTimePicker: never;
  MuiMobileTimePicker: never;
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
  MuiPickerStaticWrapper: PickerStaticWrapperClassKey;
  MuiPickersToolbar: PickersToolbarClassKey;
  MuiPickersToolbarButton: PickersToolbarButtonClassKey;
  MuiPickersToolbarText: PickersToolbarTextClassKey;
  MuiPickersYear: PickersYearClassKey;
  MuiStaticDatePicker: never;
  MuiStaticDateTimePicker: never;
  MuiStaticNextDatePicker: never;
  MuiStaticNextDateTimePicker: never;
  MuiStaticNextTimePicker: never;
  MuiStaticTimePicker: never;
  MuiTimeClock: TimeClockClassKey;
  MuiTimePicker: never;
  MuiTimePickerToolbar: TimePickerToolbarClassKey;
  MuiYearCalendar: YearCalendarClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
