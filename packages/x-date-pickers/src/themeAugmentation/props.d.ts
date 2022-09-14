import { CalendarPickerProps } from '../CalendarPicker';
import { CalendarPickerSkeletonProps } from '../CalendarPickerSkeleton';
import { ClockPickerProps } from '../ClockPicker';
import { DatePickerProps, DatePickerToolbarProps } from '../DatePicker';
import {
  DateTimePickerProps,
  DateTimePickerTabsProps,
  DateTimePickerToolbarProps,
} from '../DateTimePicker';
import { DesktopDateTimePickerProps } from '../DesktopDateTimePicker';
import { DesktopTimePickerProps } from '../DesktopTimePicker';
import { MobileDatePickerProps } from '../MobileDatePicker';
import { MobileDateTimePickerProps } from '../MobileDateTimePicker';
import { MobileTimePickerProps } from '../MobileTimePicker';
import { MonthPickerProps } from '../MonthPicker';
import { PickersDayProps } from '../PickersDay';
import { StaticDatePickerProps } from '../StaticDatePicker';
import { StaticDateTimePickerProps } from '../StaticDateTimePicker';
import { StaticTimePickerProps } from '../StaticTimePicker';
import { TimePickerProps } from '../TimePicker';
import { YearPickerProps } from '../YearPicker';
import { PickerStaticWrapperProps } from '../internals/components/PickerStaticWrapper';
import {
  CalendarOrClockPickerProps,
  DayPickerProps,
  ExportedArrowSwitcherProps,
  PickerPopperProps,
  PickersToolbarButtonProps,
  PickersToolbarProps,
} from '../internals';
import { PickersCalendarHeaderProps } from '../CalendarPicker/PickersCalendarHeader';
import { PickersFadeTransitionGroupProps } from '../CalendarPicker/PickersFadeTransitionGroup';
import { ClockProps } from '../ClockPicker/Clock';
import { ClockNumberProps } from '../ClockPicker/ClockNumber';
import { ClockPointerProps } from '../ClockPicker/ClockPointer';
import { TimePickerToolbarProps } from '../TimePicker/TimePickerToolbar';
import { LocalizationProviderProps } from '../LocalizationProvider';

export interface PickersComponentsPropsList {
  MuiCalendarOrClockPicker: CalendarOrClockPickerProps<unknown, unknown>;
  MuiCalendarPicker: CalendarPickerProps<unknown>;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonProps;
  MuiClock: ClockProps<unknown>;
  MuiClockNumber: ClockNumberProps;
  MuiClockPicker: ClockPickerProps<unknown>;
  MuiClockPointer: ClockPointerProps;
  MuiDatePicker: DatePickerProps<unknown, unknown>;
  MuiDatePickerToolbar: DatePickerToolbarProps<unknown>;
  MuiDateTimePicker: DateTimePickerProps<unknown, unknown>;
  MuiDateTimePickerTabs: DateTimePickerTabsProps;
  MuiDateTimePickerToolbar: DateTimePickerToolbarProps<unknown>;
  MuiDayPicker: DayPickerProps<unknown>;
  MuiDesktopDateTimePicker: DesktopDateTimePickerProps<unknown, unknown>;
  MuiDesktopTimePicker: DesktopTimePickerProps<unknown, unknown>;
  MuiLocalizationProvider: LocalizationProviderProps;
  MuiMobileDatePicker: MobileDatePickerProps<unknown, unknown>;
  MuiMobileDateTimePicker: MobileDateTimePickerProps<unknown, unknown>;
  MuiMobileTimePicker: MobileTimePickerProps<unknown, unknown>;
  MuiMonthPicker: MonthPickerProps<unknown>;
  MuiPickersArrowSwitcher: ExportedArrowSwitcherProps;
  MuiPickersCalendarHeader: PickersCalendarHeaderProps<unknown>;
  MuiPickersDay: PickersDayProps<unknown>;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupProps;
  MuiPickersPopper: PickerPopperProps;
  MuiPickersToolbar: PickersToolbarProps<unknown, unknown>;
  MuiPickersToolbarButton: PickersToolbarButtonProps;
  MuiStaticDatePicker: StaticDatePickerProps<unknown, unknown>;
  MuiStaticDateTimePicker: StaticDateTimePickerProps<unknown, unknown>;
  MuiStaticTimePicker: StaticTimePickerProps<unknown, unknown>;
  MuiTimePicker: TimePickerProps<unknown, unknown>;
  MuiTimePickerToolbar: TimePickerToolbarProps<unknown>;
  MuiYearPicker: YearPickerProps<unknown>;
  MuiPickerStaticWrapper: PickerStaticWrapperProps;
  // TODO v6: add `PrivatePickersMonth` once component is renamed to `MuiPickersMonth`
  PrivatePickersMonth: never;
  // TODO v6: add `PrivatePickersSlideTransition` once component is renamed to `MuiPickersSlideTransition`
  PrivatePickersSlideTransition: never;
  // TODO v6: add `PickersToolbarTextProps` once component is renamed to `MuiPickersToolbarText`
  PrivatePickersToolbarText: never;
  // TODO v6: add `PickersYearProps` once component is renamed to `MuiPickersYear`
  PrivatePickersYear: never;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersComponentsPropsList {}
}

// disable automatic export
export {};
