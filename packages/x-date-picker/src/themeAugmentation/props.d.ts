import { CalendarPickerProps } from '../components/CalendarPicker';
import { CalendarPickerSkeletonProps } from '../components/CalendarPickerSkeleton';
import { ClockPickerProps } from '../components/ClockPicker';
import { DatePickerProps } from '../components/DatePicker';
import { DateRangePickerDayProps } from '../components/DateRangePickerDay/DateRangePickerDay';
import { DateTimePickerProps } from '../components/DateTimePicker';
import { DesktopDateTimePickerProps } from '../components/DesktopDateTimePicker';
import { DesktopTimePickerProps } from '../components/DesktopTimePicker';
import { MobileDatePickerProps } from '../components/MobileDatePicker';
import { MobileDateTimePickerProps } from '../components/MobileDateTimePicker';
import { MobileTimePickerProps } from '../components/MobileTimePicker';
import { MonthPickerProps } from '../components/MonthPicker/MonthPicker';
import { PickersDayProps } from '../components/PickersDay';
import { StaticDatePickerProps } from '../components/StaticDatePicker';
import { StaticDateTimePickerProps } from '../components/StaticDateTimePicker';
import { StaticTimePickerProps } from '../components/StaticTimePicker';
import { TimePickerProps } from '../components/TimePicker';
import { YearPickerProps } from '../components/YearPicker';
import { PickerStaticWrapperProps } from '../internal/pickers/wrappers/PickerStaticWrapper';

export interface LabComponentsPropsList {
  MuiCalendarPicker: CalendarPickerProps<unknown>;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonProps;
  MuiClockPicker: ClockPickerProps<unknown>;
  MuiDatePicker: DatePickerProps;
  MuiDateRangePickerDay: DateRangePickerDayProps<unknown>;
  MuiDateTimePicker: DateTimePickerProps;
  MuiDesktopDateTimePicker: DesktopDateTimePickerProps;
  MuiDesktopTimePicker: DesktopTimePickerProps;
  MuiMobileDatePicker: MobileDatePickerProps;
  MuiMobileDateTimePicker: MobileDateTimePickerProps;
  MuiMobileTimePicker: MobileTimePickerProps;
  MuiMonthPicker: MonthPickerProps<unknown>;
  MuiPickersDay: PickersDayProps<unknown>;
  MuiStaticDatePicker: StaticDatePickerProps;
  MuiStaticDateTimePicker: StaticDateTimePickerProps;
  MuiStaticTimePicker: StaticTimePickerProps;
  MuiTimePicker: TimePickerProps;
  MuiYearPicker: YearPickerProps<unknown>;
  MuiPickerStaticWrapper: PickerStaticWrapperProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends LabComponentsPropsList {}
}

// disable automatic export
export {};
