import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { DateRangePickerDay2Props } from '../DateRangePickerDay2';
import { DateRangeCalendarProps } from '../DateRangeCalendar';
import { DateRangePickerProps } from '../DateRangePicker';
import { ExportedDateRangePickerToolbarProps } from '../DateRangePicker/DateRangePickerToolbar';
import { DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { StaticDateRangePickerProps } from '../StaticDateRangePicker';
import { MultiInputDateRangeFieldProps } from '../MultiInputDateRangeField';
import { MultiInputDateTimeRangeFieldProps } from '../MultiInputDateTimeRangeField';
import { MultiInputTimeRangeFieldProps } from '../MultiInputTimeRangeField';
import { SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField';
import { SingleInputDateTimeRangeFieldProps } from '../SingleInputDateTimeRangeField';
import { SingleInputTimeRangeFieldProps } from '../SingleInputTimeRangeField';
import { DateTimeRangePickerProps } from '../DateTimeRangePicker';
import { DesktopDateTimeRangePickerProps } from '../DesktopDateTimeRangePicker';
import { MobileDateTimeRangePickerProps } from '../MobileDateTimeRangePicker';
import { ExportedDateTimeRangePickerTabsProps } from '../DateTimeRangePicker/DateTimeRangePickerTabs';
import { ExportedDateTimeRangePickerToolbarProps } from '../DateTimeRangePicker/DateTimeRangePickerToolbar';
import { ExportedPickersRangeCalendarHeaderProps } from '../PickersRangeCalendarHeader';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps;
  MuiDateRangePickerDay: DateRangePickerDayProps;
  MuiDateRangePickerDay2: DateRangePickerDay2Props;
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
