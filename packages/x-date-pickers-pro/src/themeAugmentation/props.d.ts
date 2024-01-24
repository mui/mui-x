import { PickerValidDate } from '@mui/x-date-pickers/models';
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
  MuiDateRangeCalendar: DateRangeCalendarProps<PickerValidDate>;
  MuiDateRangePickerDay: DateRangePickerDayProps<PickerValidDate>;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<PickerValidDate>;

  // Multi input range fields
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<PickerValidDate>;
  MuiMultiInputDateTimeRangeField: MultiInputDateTimeRangeFieldProps<PickerValidDate>;
  MuiMultiInputTimeRangeField: MultiInputTimeRangeFieldProps<PickerValidDate>;

  // Single input range fields
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<PickerValidDate>;
  MuiSingleInputDateTimeRangeField: SingleInputDateTimeRangeFieldProps<PickerValidDate>;
  MuiSingleInputTimeRangeField: SingleInputTimeRangeFieldProps<PickerValidDate>;

  // Date Range Pickers
  MuiDateRangePicker: DateRangePickerProps<PickerValidDate>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<PickerValidDate>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<PickerValidDate>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<PickerValidDate>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
