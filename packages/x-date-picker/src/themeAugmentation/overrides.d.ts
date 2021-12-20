import {
  CalendarPickerClassKey,
  CalendarPickerSkeletonClassKey,
  ClockPickerClassKey,
  DateRangePickerDayClassKey,
  MonthPickerClassKey,
  PickersDayClassKey,
  YearPickerClassKey,
} from '../components';
import { PickerStaticWrapperClassKey } from '../internal/pickers/wrappers/PickerStaticWrapper';

// prettier-ignore
export interface LabComponentNameToClassKey {
  MuiCalendarPicker: CalendarPickerClassKey;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonClassKey;
  MuiClockPicker: ClockPickerClassKey;
  MuiDatePicker: {};
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateTimePicker: {};
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
