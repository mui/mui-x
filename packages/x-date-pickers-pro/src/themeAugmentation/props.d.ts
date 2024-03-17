import { PickerValidDate } from '@mui/x-date-pickers/models';
import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { MultiInputDateRangeFieldProps } from '../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField/SingleInputDateRangeField.types';
import { DateRangeCalendarProps } from '../DateRangeCalendar';
import { DateRangePickerProps } from '../DateRangePicker';
import { ExportedDateRangePickerToolbarProps } from '../DateRangePicker/DateRangePickerToolbar';
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
import { ExportedPickersRangeCalendarHeaderProps } from '../PickersRangeCalendarHeader';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps<PickerValidDate>;
  MuiDateRangePickerDay: DateRangePickerDayProps<PickerValidDate>;
  MuiDateTimeRangePickerTabs: ExportedDateTimeRangePickerTabsProps;
  MuiDateRangePickerToolbar: ExportedDateRangePickerToolbarProps;
  MuiDateTimeRangePickerToolbar: ExportedDateTimeRangePickerToolbarProps;
  MuiPickersRangeCalendarHeader: ExportedPickersRangeCalendarHeaderProps<PickerValidDate>;

  // Multi input range fields
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<PickerValidDate, any>;
  MuiMultiInputDateTimeRangeField: MultiInputDateTimeRangeFieldProps<PickerValidDate, any>;
  MuiMultiInputTimeRangeField: MultiInputTimeRangeFieldProps<PickerValidDate, any>;

  // Single input range fields
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<PickerValidDate, any>;
  MuiSingleInputDateTimeRangeField: SingleInputDateTimeRangeFieldProps<PickerValidDate, any>;
  MuiSingleInputTimeRangeField: SingleInputTimeRangeFieldProps<PickerValidDate, any>;

  // Date Range Pickers
  MuiDateRangePicker: DateRangePickerProps<PickerValidDate, any>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<PickerValidDate, any>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<PickerValidDate, any>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<PickerValidDate>;

  // Date Time Range Pickers
  MuiDateTimeRangePicker: DateTimeRangePickerProps<PickerValidDate, any>;
  MuiDesktopDateTimeRangePicker: DesktopDateTimeRangePickerProps<PickerValidDate, any>;
  MuiMobileDateTimeRangePicker: MobileDateTimeRangePickerProps<PickerValidDate, any>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
