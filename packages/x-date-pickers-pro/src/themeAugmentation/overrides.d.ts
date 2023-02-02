import { DateRangePickerDayClassKey } from '../DateRangePickerDay';
import { DateRangeCalendarClassKey } from '../DateRangeCalendar';
import { DateRangePickerToolbarClassKey } from '../DateRangePicker';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangeCalendar: DateRangeCalendarClassKey;
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateRangePickerToolbar: DateRangePickerToolbarClassKey;
  MuiMultiInputDateRangeField: never;
  MuiSingleInputDateRangeField: never;
  
  // Date Range Pickers
  MuiDateRangePicker: never;
  MuiDesktopDateRangePicker: never;
  MuiMobileDateRangePicker: never;
  MuiStaticDateRangePicker: never;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersProComponentNameToClassKey {}
}

// disable automatic export
export {};
