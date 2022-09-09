import { DateRangePickerInputClassKey } from '../DateRangePicker/dateRangePickerInputClasses';
import { DateRangePickerToolbarClassKey } from '../DateRangePicker/dateRangePickerToolbarClasses';
import { DateRangePickerDayClassKey } from '../DateRangePickerDay';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangePicker: never;
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateRangePickerInput: DateRangePickerInputClassKey;
  MuiDateRangePickerToolbar: DateRangePickerToolbarClassKey;
  MuiDesktopDateRangePicker: never;
  MuiMobileDateRangePicker: never;
  MuiStaticDateRangePicker: never;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersProComponentNameToClassKey {}
}

// disable automatic export
export {};
