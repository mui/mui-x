import { DateRangePickerDayProps } from '../DateRangePickerDay';

export interface LabComponentsPropsList {
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends LabComponentsPropsList {}
}

// disable automatic export
export {};
