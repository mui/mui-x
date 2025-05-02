import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { EnhancedDateRangePickerDayProps } from '../EnhancedDateRangePickerDay';
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
  MuiEnhancedDateRangePickerDay: EnhancedDateRangePickerDayProps;
  MuiDateTimeRangePickerTabs: ExportedDateTimeRangePickerTabsProps;
  MuiDateRangePickerToolbar: ExportedDateRangePickerToolbarProps;
  MuiDateTimeRangePickerToolbar: ExportedDateTimeRangePickerToolbarProps;
  MuiPickersRangeCalendarHeader: ExportedPickersRangeCalendarHeaderProps;

  // Multi input range fields
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<any>;
  MuiMultiInputDateTimeRangeField: MultiInputDateTimeRangeFieldProps<any>;
  MuiMultiInputTimeRangeField: MultiInputTimeRangeFieldProps<any>;

  // Single input range fields
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<any>;
  MuiSingleInputDateTimeRangeField: SingleInputDateTimeRangeFieldProps<any>;
  MuiSingleInputTimeRangeField: SingleInputTimeRangeFieldProps<any>;

  // Date Range Pickers
  MuiDateRangePicker: DateRangePickerProps<any>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<any>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<any>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps;

  // Date Time Range Pickers
  MuiDateTimeRangePicker: DateTimeRangePickerProps<any>;
  MuiDesktopDateTimeRangePicker: DesktopDateTimeRangePickerProps<any>;
  MuiMobileDateTimeRangePicker: MobileDateTimeRangePickerProps<any>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
