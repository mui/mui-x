import { DateRangePickerDayClassKey } from '../DateRangePickerDay';

// prettier-ignore
export interface LabComponentNameToClassKey {
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends LabComponentNameToClassKey {}
}

// disable automatic export
export {};
