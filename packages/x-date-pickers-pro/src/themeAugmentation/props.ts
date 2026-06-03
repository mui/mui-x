import { type DateRangePickerDayProps } from '../DateRangePickerDay';
import { type DateRangeCalendarProps } from '../DateRangeCalendar';
import { type DateRangePickerProps } from '../DateRangePicker';
import { type ExportedDateRangePickerToolbarProps } from '../DateRangePicker/DateRangePickerToolbar';
import { type DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { type MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { type StaticDateRangePickerProps } from '../StaticDateRangePicker';
import { type MultiInputDateRangeFieldProps } from '../MultiInputDateRangeField';
import { type MultiInputDateTimeRangeFieldProps } from '../MultiInputDateTimeRangeField';
import { type MultiInputTimeRangeFieldProps } from '../MultiInputTimeRangeField';
import { type SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField';
import { type SingleInputDateTimeRangeFieldProps } from '../SingleInputDateTimeRangeField';
import { type SingleInputTimeRangeFieldProps } from '../SingleInputTimeRangeField';
import { type DateTimeRangePickerProps } from '../DateTimeRangePicker';
import { type DesktopDateTimeRangePickerProps } from '../DesktopDateTimeRangePicker';
import { type MobileDateTimeRangePickerProps } from '../MobileDateTimeRangePicker';
import { type ExportedDateTimeRangePickerTabsProps } from '../DateTimeRangePicker/DateTimeRangePickerTabs';
import { type ExportedDateTimeRangePickerToolbarProps } from '../DateTimeRangePicker/DateTimeRangePickerToolbar';
import { type ExportedPickersRangeCalendarHeaderProps } from '../PickersRangeCalendarHeader';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps;
  MuiDateRangePickerDay: DateRangePickerDayProps;
  MuiDateTimeRangePickerTabs: ExportedDateTimeRangePickerTabsProps;
  MuiDateRangePickerToolbar: ExportedDateRangePickerToolbarProps;
  MuiDateTimeRangePickerToolbar: ExportedDateTimeRangePickerToolbarProps;
  MuiPickersRangeCalendarHeader: ExportedPickersRangeCalendarHeaderProps;

  // Multi input range fields
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps;
  MuiMultiInputDateTimeRangeField: MultiInputDateTimeRangeFieldProps;
  MuiMultiInputTimeRangeField: MultiInputTimeRangeFieldProps;

  // Single input range fields
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps;
  MuiSingleInputDateTimeRangeField: SingleInputDateTimeRangeFieldProps;
  MuiSingleInputTimeRangeField: SingleInputTimeRangeFieldProps;

  // Date Range Pickers
  MuiDateRangePicker: DateRangePickerProps;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps;
  MuiMobileDateRangePicker: MobileDateRangePickerProps;
  MuiStaticDateRangePicker: StaticDateRangePickerProps;

  // Date Time Range Pickers
  MuiDateTimeRangePicker: DateTimeRangePickerProps;
  MuiDesktopDateTimeRangePicker: DesktopDateTimeRangePickerProps;
  MuiMobileDateTimeRangePicker: MobileDateTimeRangePickerProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
