import { DateRangePickerDayClassKey } from '../DateRangePickerDay';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiMultiInputDateRangeField: never;
  MuiSingleInputDateRangeField: never;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersProComponentNameToClassKey {}
}

// disable automatic export
export {};
