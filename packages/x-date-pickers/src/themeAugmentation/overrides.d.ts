import {
  CalendarPickerClassKey,
  DayPickerClassKey,
  PickersCalendarHeaderClassKey,
  PickersFadeTransitionGroupClassKey,
  PickersSlideTransitionClassKey,
} from '../CalendarPicker';
import { CalendarPickerSkeletonClassKey } from '../CalendarPickerSkeleton';
import {
  ClockClassKey,
  ClockNumberClassKey,
  ClockPickerClassKey,
  ClockPointerClassKey,
} from '../ClockPicker';
import { MonthPickerClassKey, PickersMonthClassKey } from '../MonthPicker';
import { PickersDayClassKey } from '../PickersDay';
import { PickersYearClassKey, YearPickerClassKey } from '../YearPicker';
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
  MuiCalendarPicker: CalendarPickerClassKey;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonClassKey;
  MuiClock: ClockClassKey;
  MuiClockNumber: ClockNumberClassKey;
  MuiClockPicker: ClockPickerClassKey;
  MuiClockPointer: ClockPointerClassKey;
  MuiDatePicker: never;
  MuiDatePickerToolbar: DatePickerToolbarClassKey;
  MuiDateTimePicker: never;
  MuiDateTimePickerTabs: DateTimePickerTabsClassKey;
  MuiDateTimePickerToolbar: DateTimePickerToolbarClassKey;
  MuiDayPicker: DayPickerClassKey;
  MuiDesktopDatePicker: never;
  MuiDesktopDateTimePicker: never;
  MuiDesktopTimePicker: never;
  MuiLocalizationProvider: never;
  MuiMobileDatePicker: never;
  MuiMobileDateTimePicker: never;
  MuiMobileTimePicker: never;
  MuiMonthPicker: MonthPickerClassKey;
  MuiPickersArrowSwitcher: PickersArrowSwitcherClassKey;
  MuiPickersCalendarHeader: PickersCalendarHeaderClassKey;
  MuiPickersDay: PickersDayClassKey;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupClassKey;
  MuiPickersPopper: PickersPopperClassKey;
  MuiPickerStaticWrapper: PickerStaticWrapperClassKey;
  MuiPickersToolbar: PickersToolbarClassKey;
  MuiPickersToolbarButton: PickersToolbarButtonClassKey;
  MuiStaticDatePicker: never;
  MuiStaticDateTimePicker: never;
  MuiStaticTimePicker: never;
  MuiTimePicker: never;
  MuiTimePickerToolbar: TimePickerToolbarClassKey;
  MuiYearPicker: YearPickerClassKey;
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
