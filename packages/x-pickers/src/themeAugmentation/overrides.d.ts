import { CalendarPickerClassKey } from '../CalendarPicker';
import { CalendarPickerSkeletonClassKey } from '../CalendarPickerSkeleton';
import { ClockPickerClassKey } from '../ClockPicker';
import { DateRangePickerDayClassKey } from '../DateRangePickerDay';
import { MonthPickerClassKey } from '../MonthPicker';
import { PickersDayClassKey } from '../PickersDay';
import { YearPickerClassKey } from '../YearPicker';
import { PickerStaticWrapperClassKey } from '../internal/components/PickerStaticWrapper';

// prettier-ignore
export interface LabComponentNameToClassKey {
  MuiCalendarPicker: CalendarPickerClassKey;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonClassKey;
  MuiClockPicker: ClockPickerClassKey;
  MuiDatePicker: never;
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateTimePicker: never;
  MuiMonthPicker: MonthPickerClassKey;
  MuiPickersDay: PickersDayClassKey;
  MuiYearPicker: YearPickerClassKey;
  MuiPickerStaticWrapper: PickerStaticWrapperClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends LabComponentNameToClassKey {}
}

// disable automatic export
export {};
