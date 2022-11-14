import { DateRangePickerProps } from '../DateRangePicker';
import { DateRangePickerInputProps } from '../DateRangePicker/DateRangePickerInput';
import { DateRangePickerToolbarProps } from '../DateRangePicker/DateRangePickerToolbar';
import { DateRangePickerViewDesktopProps } from '../DateRangePicker/DateRangePickerViewDesktop';
import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { MultiInputDateRangeFieldProps } from '../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField/SingleInputDateRangeField.types';
import { DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { StaticDateRangePickerProps } from '../StaticDateRangePicker';
import { DateRangeCalendarProps } from '../DateRangeCalendar';

import { NextDateRangePickerProps } from '../NextDateRangePicker';
import { DesktopNextDateRangePickerProps } from '../DesktopNextDateRangePicker';
import { MobileNextDateRangePickerProps } from '../MobileNextDateRangePicker';
import { StaticNextDateRangePickerProps } from '../StaticNextDateRangePicker';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps<unknown>;
  MuiDateRangePicker: DateRangePickerProps<unknown>;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDateRangePickerInput: DateRangePickerInputProps<unknown>;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<unknown>;
  MuiDateRangePickerViewDesktop: DateRangePickerViewDesktopProps<unknown>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<unknown>;
  MuiDesktopNextDateRangePicker: DesktopNextDateRangePickerProps<unknown>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<unknown>;
  MuiMobileNextDateRangePicker: MobileNextDateRangePickerProps<unknown>;
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<unknown, unknown>;
  MuiNextDateRangePicker: NextDateRangePickerProps<unknown>;
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<unknown, unknown>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<unknown>;
  MuiStaticNextDateRangePicker: StaticNextDateRangePickerProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
