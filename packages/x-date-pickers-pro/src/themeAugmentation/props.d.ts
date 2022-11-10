import { DateRangePickerProps } from '../DateRangePicker';
import { DateRangePickerInputProps } from '../DateRangePicker/DateRangePickerInput';
import { DateRangePickerToolbarProps } from '../DateRangePicker/DateRangePickerToolbar';
import { DesktopDateRangeCalendarProps } from '../DateRangePicker/DateRangePickerViewDesktop';
import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { StaticDateRangePickerProps } from '../StaticDateRangePicker';

export interface PickersProComponentsPropsList {
  MuiDateRangePicker: DateRangePickerProps<unknown, unknown>;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDateRangePickerInput: DateRangePickerInputProps<unknown, unknown>;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<unknown>;
  MuiDateRangePickerViewDesktop: DesktopDateRangeCalendarProps<unknown>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<unknown, unknown>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<unknown, unknown>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<unknown, unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
