import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { MultiInputDateRangeFieldProps } from '../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField/SingleInputDateRangeField.types';
import { DateRangeCalendarProps } from '../DateRangeCalendar';

import { DateRangePickerProps, DateRangePickerToolbarProps } from '../DateRangePicker';
import { DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { StaticDateRangePickerProps } from '../StaticDateRangePicker';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps<unknown>;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<unknown>;
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<unknown, unknown>;
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<unknown, unknown>;

  // Date Range Pickers
  MuiDateRangePicker: DateRangePickerProps<unknown>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<unknown>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<unknown>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
