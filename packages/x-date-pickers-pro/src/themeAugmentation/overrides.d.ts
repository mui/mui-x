import { DateRangePickerDayClassKey } from '../DateRangePickerDay';
import { DateRangeCalendarClassKey } from '../DateRangeCalendar';
import { DateRangePickerToolbarClassKey } from '../DateRangePicker';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangeCalendar: DateRangeCalendarClassKey;
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateRangePickerToolbar: DateRangePickerToolbarClassKey;

  // Multi input range fields
  MuiMultiInputDateRangeField: never;
  MuiMultiInputDateTimeRangeField: never;
  MuiMultiInputTimeRangeField: never;

  // Single input range fields
  MuiSingleInputDateRangeField: never;
  MuiSingleInputDateTimeRangeField: never;
  MuiSingleInputTimeRangeField: never;
  
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
