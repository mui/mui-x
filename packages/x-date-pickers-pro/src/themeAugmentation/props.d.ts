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
import { DateTimeRangePickerProps } from '../DateTimeRangePicker';
import { DesktopDateTimeRangePickerProps } from '../DesktopDateTimeRangePicker';
import { MobileDateTimeRangePickerProps } from '../MobileDateTimeRangePicker';
import { ExportedDateTimeRangePickerTabsProps } from '../DateTimeRangePicker/DateTimeRangePickerTabs';
import { ExportedDateTimeRangePickerToolbarProps } from '../DateTimeRangePicker/DateTimeRangePickerToolbar';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps<unknown>;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDateTimeRangePickerTabs: ExportedDateTimeRangePickerTabsProps;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<unknown>;
  MuiDateTimeRangePickerToolbar: ExportedDateTimeRangePickerToolbarProps;

  // Multi input range fields
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<unknown>;
  MuiMultiInputDateTimeRangeField: MultiInputDateTimeRangeFieldProps<unknown>;
  MuiMultiInputTimeRangeField: MultiInputTimeRangeFieldProps<unknown>;

  // Single input range fields
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<unknown>;
  MuiSingleInputDateTimeRangeField: SingleInputDateTimeRangeFieldProps<unknown>;
  MuiSingleInputTimeRangeField: SingleInputTimeRangeFieldProps<unknown>;

  // Date Range Pickers
  MuiDateRangePicker: DateRangePickerProps<unknown>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<unknown>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<unknown>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<unknown>;

  // Date Time Range Pickers
  MuiDateTimeRangePicker: DateTimeRangePickerProps<unknown>;
  MuiDesktopDateTimeRangePicker: DesktopDateTimeRangePickerProps<unknown>;
  MuiMobileDateTimeRangePicker: MobileDateTimeRangePickerProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
