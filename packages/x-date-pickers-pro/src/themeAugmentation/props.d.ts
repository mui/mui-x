import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { MultiInputDateRangeFieldProps } from '../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { SingleInputDateRangeFieldProps } from '../SingleInputDateRangeField/SingleInputDateRangeField.types';
import { DateRangeCalendarProps } from '../DateRangeCalendar';

import { NextDateRangePickerProps, DateRangePickerToolbarProps } from '../NextDateRangePicker';
import { DesktopNextDateRangePickerProps } from '../DesktopNextDateRangePicker';
import { MobileNextDateRangePickerProps } from '../MobileNextDateRangePicker';
import { StaticNextDateRangePickerProps } from '../StaticNextDateRangePicker';

export interface PickersProComponentsPropsList {
  MuiDateRangeCalendar: DateRangeCalendarProps<unknown>;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<unknown>;
  MuiDesktopNextDateRangePicker: DesktopNextDateRangePickerProps<unknown>;
  MuiMobileNextDateRangePicker: MobileNextDateRangePickerProps<unknown>;
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldProps<unknown, unknown>;
  MuiNextDateRangePicker: NextDateRangePickerProps<unknown>;
  MuiSingleInputDateRangeField: SingleInputDateRangeFieldProps<unknown, unknown>;
  MuiStaticNextDateRangePicker: StaticNextDateRangePickerProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
