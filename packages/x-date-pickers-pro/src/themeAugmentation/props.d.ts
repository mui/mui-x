import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { DateRangeCalendarProps } from '../DateRangeCalendar';
import { DateRangePickerProps } from '../DateRangePicker';
import { ExportedDateRangePickerToolbarProps } from '../DateRangePicker/DateRangePickerToolbar';
import { DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { StaticDateRangePickerProps } from '../StaticDateRangePicker';
import { MultiInputRangeFieldProps } from '../MultiInputRangeField';
import { SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField';
import { SingleInputDateTimeRangeFieldProps } from '../SingleInputDateTimeRangeField';
import { SingleInputTimeRangeFieldProps } from '../SingleInputTimeRangeField';
import { DateTimeRangePickerProps } from '../DateTimeRangePicker';
import { DesktopDateTimeRangePickerProps } from '../DesktopDateTimeRangePicker';
import { MobileDateTimeRangePickerProps } from '../MobileDateTimeRangePicker';
import { ExportedDateTimeRangePickerTabsProps } from '../DateTimeRangePicker/DateTimeRangePickerTabs';
import { ExportedDateTimeRangePickerToolbarProps } from '../DateTimeRangePicker/DateTimeRangePickerToolbar';
import { ExportedPickersRangeCalendarHeaderProps } from '../PickersRangeCalendarHeader';
import { PickerPossibleRangeManager } from '../internals/models/managers';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps;
  MuiDateRangePickerDay: DateRangePickerDayProps;
  MuiDateTimeRangePickerTabs: ExportedDateTimeRangePickerTabsProps;
  MuiDateRangePickerToolbar: ExportedDateRangePickerToolbarProps;
  MuiDateTimeRangePickerToolbar: ExportedDateTimeRangePickerToolbarProps;
  MuiPickersRangeCalendarHeader: ExportedPickersRangeCalendarHeaderProps;

  // Single input range fields
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<any>;
  MuiSingleInputDateTimeRangeField: SingleInputDateTimeRangeFieldProps<any>;
  MuiSingleInputTimeRangeField: SingleInputTimeRangeFieldProps<any>;
  MuiMultiInputRangeField: MultiInputRangeFieldProps<PickerPossibleRangeManager>;

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
