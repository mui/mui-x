import { DateRangePickerProps } from '../DateRangePicker';
import { DateRangePickerDayProps } from '../DateRangePickerDay';
import { DesktopDateRangePickerProps } from '../DesktopDateRangePicker';
import { MobileDateRangePickerProps } from '../MobileDateRangePicker';
import { StaticDateRangePickerProps } from '../StaticDateRangePicker';

export interface PickersProComponentsPropsList {
  MuiDateRangePicker: DateRangePickerProps<unknown, unknown>;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDesktopDateRangePicker: DesktopDateRangePickerProps<unknown, unknown>;
  MuiMobileDateRangePicker: MobileDateRangePickerProps<unknown, unknown>;
  MuiStaticDateRangePicker: StaticDateRangePickerProps<unknown, unknown>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersProComponentsPropsList {}
}

// disable automatic export
export {};
