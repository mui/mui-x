import { DateRangePickerProps } from '../DateRangePicker';
import { DateRangePickerInputProps } from '../DateRangePicker/DateRangePickerInput';
import { DateRangePickerToolbarProps } from '../DateRangePicker/DateRangePickerToolbar';
import { DateRangePickerViewDesktopProps } from '../DateRangePicker/DateRangePickerViewDesktop';
import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { StaticDateRangePickerProps } from '../StaticDateRangePicker';

export interface PickersProComponentsPropsList {
  MuiDateRangePicker: DateRangePickerProps<unknown>;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDateRangePickerInput: DateRangePickerInputProps<unknown>;
  MuiDateRangePickerToolbar: DateRangePickerToolbarProps<unknown>;
  MuiDateRangePickerViewDesktop: DateRangePickerViewDesktopProps<unknown>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<unknown>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<unknown>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
