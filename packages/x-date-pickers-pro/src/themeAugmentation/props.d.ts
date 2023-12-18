import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { MultiInputDateRangeFieldProps } from '../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField/SingleInputDateRangeField.types';
import { DateRangeCalendarProps } from '../DateRangeCalendar';

import { DateRangePickerProps, DateRangePickerToolbarProps } from '../DateRangePicker';
import { DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { StaticDateRangePickerProps } from '../StaticDateRangePicker';
import { MultiInputDateTimeRangeFieldProps } from '../MultiInputDateTimeRangeField';
import { MultiInputTimeRangeFieldProps } from '../MultiInputTimeRangeField';
import { SingleInputDateTimeRangeFieldProps } from '../SingleInputDateTimeRangeField';
import { SingleInputTimeRangeFieldProps } from '../SingleInputTimeRangeField';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps<unknown>;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<unknown>;

  // Multi input range fields
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<unknown, any>;
  MuiMultiInputDateTimeRangeField: MultiInputDateTimeRangeFieldProps<unknown, any>;
  MuiMultiInputTimeRangeField: MultiInputTimeRangeFieldProps<unknown, any>;

  // Single input range fields
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<unknown, any>;
  MuiSingleInputDateTimeRangeField: SingleInputDateTimeRangeFieldProps<unknown, any>;
  MuiSingleInputTimeRangeField: SingleInputTimeRangeFieldProps<unknown, any>;

  // Date Range Pickers
  MuiDateRangePicker: DateRangePickerProps<unknown, any>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<unknown, any>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<unknown, any>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
