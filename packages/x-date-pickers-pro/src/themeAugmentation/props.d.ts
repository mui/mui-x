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
import { DateTimeRangePickerProps } from '../DateTimeRangePicker';
import { DesktopDateTimeRangePickerProps } from '../DesktopDateTimeRangePicker';
import { MobileDateTimeRangePickerProps } from '../MobileDateTimeRangePicker';
import { ExportedDateTimeRangePickerTabsProps } from '../DateTimeRangePicker/DateTimeRangePickerTabs';
import { ExportedDateTimeRangePickerToolbarProps } from '../DateTimeRangePicker/DateTimeRangePickerToolbar';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps<PickerValidDate>;
  MuiDateRangePickerDay: DateRangePickerDayProps<PickerValidDate>;
  MuiDateTimeRangePickerTabs: ExportedDateTimeRangePickerTabsProps;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<PickerValidDate>;
  MuiDateTimeRangePickerToolbar: ExportedDateTimeRangePickerToolbarProps;

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

  // Date Time Range Pickers
  MuiDateTimeRangePicker: DateTimeRangePickerProps<PickerValidDate>;
  MuiDesktopDateTimeRangePicker: DesktopDateTimeRangePickerProps<PickerValidDate>;
  MuiMobileDateTimeRangePicker: MobileDateTimeRangePickerProps<PickerValidDate>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
