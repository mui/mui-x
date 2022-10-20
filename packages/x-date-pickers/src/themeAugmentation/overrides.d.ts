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
  ClockPickerClassKey,
  ClockPointerClassKey,
} from '../ClockPicker';
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
import { PickerViewLayoutClassKey } from '../internals/components/PickerViewLayout';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiCalendarOrClockPicker: CalendarOrClockPickerClassKey;
  MuiClock: ClockClassKey;
  MuiClockNumber: ClockNumberClassKey;
  MuiClockPicker: ClockPickerClassKey;
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
  MuiDesktopTimePicker: never;
  MuiLocalizationProvider: never;
  MuiMobileDatePicker: never;
  MuiMobileDateTimePicker: never;
  MuiMobileTimePicker: never;
  MuiMonthCalendar: MonthCalendarClassKey;
  MuiPickersArrowSwitcher: PickersArrowSwitcherClassKey;
  MuiPickersCalendarHeader: PickersCalendarHeaderClassKey;
  MuiPickersDay: PickersDayClassKey;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupClassKey;
  MuiPickersPopper: PickersPopperClassKey;
  MuiPickerStaticWrapper: PickerStaticWrapperClassKey;
  MuiPickersToolbar: PickersToolbarClassKey;
  MuiPickersToolbarButton: PickersToolbarButtonClassKey;
  MuiPickerViewLayout: PickerViewLayoutClassKey;
  MuiStaticDatePicker: never;
  MuiStaticDateTimePicker: never;
  MuiStaticTimePicker: never;
  MuiTimePicker: never;
  MuiTimePickerToolbar: TimePickerToolbarClassKey;
  MuiYearCalendar: YearCalendarClassKey;
  PrivatePickersMonth: PickersMonthClassKey;
  PrivatePickersSlideTransition: PickersSlideTransitionClassKey;
  PrivatePickersToolbarText: PickersToolbarTextClassKey;
  PrivatePickersYear: PickersYearClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
