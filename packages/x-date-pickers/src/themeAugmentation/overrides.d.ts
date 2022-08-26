import type { CalendarPickerClassKey } from '../CalendarPicker';
import type { CalendarPickerSkeletonClassKey } from '../CalendarPickerSkeleton';
import type { ClockPickerClassKey } from '../ClockPicker';
import type { MonthPickerClassKey } from '../MonthPicker';
import type { PickersDayClassKey } from '../PickersDay';
import type { YearPickerClassKey } from '../YearPicker';
import type { PickerStaticWrapperClassKey } from '../internals/components/PickerStaticWrapper';
import type { StaticDatePickerClassKey } from '../StaticDatePicker';
import type { StaticDateTimePickerClassKey } from '../StaticDateTimePicker';
import type { StaticTimePickerClassKey } from '../StaticTimePicker';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiCalendarPicker: CalendarPickerClassKey;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonClassKey;
  MuiClockPicker: ClockPickerClassKey;
  MuiDatePicker: never;
  MuiDateTimePicker: never;
  MuiMonthPicker: MonthPickerClassKey;
  MuiPickersDay: PickersDayClassKey;
  MuiYearPicker: YearPickerClassKey;
  MuiPickerStaticWrapper: PickerStaticWrapperClassKey;
  MuiStaticDatePicker: StaticDatePickerClassKey;
  MuiStaticDateTimePicker: StaticDateTimePickerClassKey;
  MuiStaticTimePicker: StaticTimePickerClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
