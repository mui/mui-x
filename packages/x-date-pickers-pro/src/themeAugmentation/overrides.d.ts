import { DateRangePickerDayClassKey } from '../DateRangePickerDay';
import { DateRangeCalendarClassKey } from '../DateRangeCalendar';
import { DateRangePickerToolbarClassKey } from '../NextDateRangePicker';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangeCalendar: DateRangeCalendarClassKey
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateRangePickerToolbar: DateRangePickerToolbarClassKey;
  MuiDateRangePickerViewDesktop: DateRangePickerViewDesktopClassKey;
  MuiDesktopNextDateRangePicker: never;
  MuiMobileNextDateRangePicker: never;
  MuiMultiInputDateRangeField: never;
  MuiNextDateRangePicker: never;
  MuiSingleInputDateRangeField: never;
  MuiStaticNextDateRangePicker: never;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersProComponentNameToClassKey {}
}

// disable automatic export
export {};
