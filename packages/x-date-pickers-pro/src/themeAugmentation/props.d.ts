import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { MultiInputDateRangeFieldProps } from '../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField/SingleInputDateRangeField.types';

export interface PickersProComponentsPropsList {
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<unknown, unknown>;
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<unknown, unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
