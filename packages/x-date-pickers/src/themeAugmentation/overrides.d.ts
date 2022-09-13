import {
  CalendarPickerClassKey,
  DayPickerClassKey,
  PickersCalendarHeaderClassKey,
  PickersFadeTransitionGroupClassKey,
} from '../CalendarPicker';
import { CalendarPickerSkeletonClassKey } from '../CalendarPickerSkeleton';
import {
  ClockClassKey,
  ClockNumberClassKey,
  ClockPickerClassKey,
  ClockPointerClassKey,
} from '../ClockPicker';
import { MonthPickerClassKey } from '../MonthPicker';
import { PickersDayClassKey } from '../PickersDay';
import { PickersYearClassKey, YearPickerClassKey } from '../YearPicker';
import { PickerStaticWrapperClassKey } from '../internals/components/PickerStaticWrapper';
import { DatePickerToolbarClassKey } from '../DatePicker';
import { DateTimePickerTabsClassKey, DateTimePickerToolbarClassKey } from '../DateTimePicker';
import { TimePickerToolbarClassKey } from '../TimePicker';
import {
  PickersPopperClassKey,
  PickersToolbarButtonClassKey,
  PickersToolbarClassKey,
  PickersToolbarTextClassKey,
} from '../internals';

// prettier-ignore
export interface PickersComponentNameToClassKey {
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
  MuiMonthPicker: MonthPickerClassKey;
  MuiPickersCalendarHeader: PickersCalendarHeaderClassKey;
  MuiPickersDay: PickersDayClassKey;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupClassKey;
  MuiPickersPopper: PickersPopperClassKey;
  MuiPickersToolbar: PickersToolbarClassKey;
  MuiPickersToolbarButton: PickersToolbarButtonClassKey;
  MuiTimePickerToolbar: TimePickerToolbarClassKey;
  MuiYearPicker: YearPickerClassKey;
  MuiPickerStaticWrapper: PickerStaticWrapperClassKey;
  PrivatePickersYear: PickersYearClassKey;
  PrivatePickersToolbarText: PickersToolbarTextClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
