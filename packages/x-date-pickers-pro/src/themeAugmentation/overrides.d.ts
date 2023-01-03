import { DateRangePickerInputClassKey } from '../DateRangePicker/dateRangePickerInputClasses';
import { DateRangePickerToolbarClassKey } from '../DateRangePicker/dateRangePickerToolbarClasses';
import { DateRangePickerViewDesktopClassKey } from '../DateRangePicker/dateRangePickerViewDesktopClasses';
import { DateRangePickerDayClassKey } from '../DateRangePickerDay';
import { DateRangeCalendarClassKey } from '../DateRangeCalendar/dateRangeCalendarClasses';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangeCalendar: DateRangeCalendarClassKey
  MuiDateRangePicker: never;
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateRangePickerInput: DateRangePickerInputClassKey;
  MuiDateRangePickerToolbar: DateRangePickerToolbarClassKey;
  MuiDateRangePickerViewDesktop: DateRangePickerViewDesktopClassKey;
  MuiDesktopDateRangePicker: never;
  MuiDesktopNextDateRangePicker: never;
  MuiMobileDateRangePicker: never;
  MuiMobileNextDateRangePicker: never;
  MuiMultiInputDateRangeField: never;
  MuiNextDateRangePicker: never;
  MuiSingleInputDateRangeField: never;
  MuiStaticDateRangePicker: never;
  MuiStaticNextDateRangePicker: never;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersProComponentNameToClassKey {}
}

// disable automatic export
export {};
