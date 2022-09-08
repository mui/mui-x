import type { CalendarPickerClassKey } from '../CalendarPicker';
import type { CalendarPickerSkeletonClassKey } from '../CalendarPickerSkeleton';
import type { ClockPickerClassKey } from '../ClockPicker';
import type { MonthPickerClassKey } from '../MonthPicker';
import type { PickersDayClassKey } from '../PickersDay';
import type { YearPickerClassKey } from '../YearPicker';
import type { PickerStaticWrapperClassKey } from '../internals/components/PickerStaticWrapper';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiCalendarPicker: CalendarPickerClassKey;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonClassKey;
  MuiClockPicker: ClockPickerClassKey;
  MuiDatePicker: never;
  MuiDateTimePicker: never;
  MuiDesktopDatePicker: never;
  MuiDesktopDateTimePicker: never;
  MuiDesktopTimePicker: never;
  MuiMonthPicker: MonthPickerClassKey;
  MuiPickersDay: PickersDayClassKey;
  MuiYearPicker: YearPickerClassKey;
  MuiPickerStaticWrapper: PickerStaticWrapperClassKey;
  MuiStaticDatePicker: never;
  MuiStaticDateTimePicker: never;
  MuiStaticTimePicker: never;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
