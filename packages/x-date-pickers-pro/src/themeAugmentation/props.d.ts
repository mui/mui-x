import { DateRangePickerDayProps } from '../DateRangePickerDay';

export interface PickersProComponentsPropsList {
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
