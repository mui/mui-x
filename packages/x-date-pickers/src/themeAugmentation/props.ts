import type {
  DateCalendarProps,
  ExportedSlideTransitionProps,
  ExportedPickersFadeTransitionGroupProps,
} from '../DateCalendar';
import type { DayCalendarSkeletonProps } from '../DayCalendarSkeleton';
import type { ClockNumberProps, TimeClockProps, ClockPointerProps, ClockProps } from '../TimeClock';
import type { MonthCalendarProps } from '../MonthCalendar';
import type { PickerDayProps } from '../PickerDay';
import type { YearCalendarProps } from '../YearCalendar';
import type { DateFieldProps } from '../DateField';
import type { LocalizationProviderProps } from '../LocalizationProvider';
import type { PickersLayoutProps } from '../PickersLayout';
import type { DayCalendarProps } from '../DateCalendar/DayCalendar';
import type { ExportedPickersArrowSwitcherProps } from '../internals/components/PickersArrowSwitcher/PickersArrowSwitcher.types';
import type { ExportedPickerPopperProps } from '../internals/components/PickerPopper';
import type { PickersToolbarProps } from '../internals/components/PickersToolbar';
import type { PickersToolbarButtonProps } from '../internals/components/PickersToolbarButton';
import type { ExportedPickersToolbarTextProps } from '../internals/components/PickersToolbarText';

import type { DatePickerProps } from '../DatePicker';
import type { ExportedDatePickerToolbarProps } from '../DatePicker/DatePickerToolbar';
import type { DesktopDatePickerProps } from '../DesktopDatePicker';
import type { MobileDatePickerProps } from '../MobileDatePicker';
import type { StaticDatePickerProps } from '../StaticDatePicker';

import type { DateTimePickerProps, DateTimePickerTabsProps } from '../DateTimePicker';
import type { ExportedDateTimePickerToolbarProps } from '../DateTimePicker/DateTimePickerToolbar';
import type { DesktopDateTimePickerProps } from '../DesktopDateTimePicker';
import type { MobileDateTimePickerProps } from '../MobileDateTimePicker';
import type { StaticDateTimePickerProps } from '../StaticDateTimePicker';
import type { DateTimeFieldProps } from '../DateTimeField';

import type { TimePickerProps } from '../TimePicker';
import type { ExportedTimePickerToolbarProps } from '../TimePicker/TimePickerToolbar';
import type { DesktopTimePickerProps } from '../DesktopTimePicker';
import type { MobileTimePickerProps } from '../MobileTimePicker';
import type { StaticTimePickerProps } from '../StaticTimePicker';
import type { ExportedDigitalClockProps } from '../DigitalClock';
import type { TimeFieldProps } from '../TimeField';
import type {
  ExportedMultiSectionDigitalClockSectionProps,
  MultiSectionDigitalClockProps,
} from '../MultiSectionDigitalClock';
import type { ExportedPickersCalendarHeaderProps } from '../PickersCalendarHeader';
import type {
  PickersTextFieldProps,
  PickersInputBaseProps,
  PickersOutlinedInputProps,
  PickersInputProps,
  PickersFilledInputProps,
} from '../PickersTextField';
import type { PickersSectionListProps } from '../PickersSectionList';
import type { PickerValidValue } from '../internals/models';

export interface PickersComponentsPropsList {
  MuiClock: ClockProps;
  MuiClockNumber: ClockNumberProps;
  MuiClockPointer: ClockPointerProps;
  MuiDateCalendar: DateCalendarProps;
  MuiDateField: DateFieldProps;
  MuiDatePickerToolbar: ExportedDatePickerToolbarProps;
  MuiDateTimeField: DateTimeFieldProps;
  MuiDateTimePickerTabs: DateTimePickerTabsProps;
  MuiDateTimePickerToolbar: ExportedDateTimePickerToolbarProps;
  MuiDayCalendar: DayCalendarProps;
  MuiDayCalendarSkeleton: DayCalendarSkeletonProps;
  MuiDigitalClock: ExportedDigitalClockProps;
  MuiLocalizationProvider: LocalizationProviderProps<unknown>;
  MuiMonthCalendar: MonthCalendarProps;
  MuiMultiSectionDigitalClock: MultiSectionDigitalClockProps;
  MuiMultiSectionDigitalClockSection: ExportedMultiSectionDigitalClockSectionProps;
  MuiPickersArrowSwitcher: ExportedPickersArrowSwitcherProps;
  MuiPickersCalendarHeader: ExportedPickersCalendarHeaderProps;
  MuiPickerDay: PickerDayProps;
  MuiPickersFadeTransitionGroup: ExportedPickersFadeTransitionGroupProps;
  MuiPickerPopper: ExportedPickerPopperProps;
  MuiPickersSlideTransition: ExportedSlideTransitionProps;
  MuiPickersToolbar: PickersToolbarProps;
  MuiPickersToolbarButton: PickersToolbarButtonProps;
  MuiPickersToolbarText: ExportedPickersToolbarTextProps;
  MuiPickersLayout: PickersLayoutProps<PickerValidValue>;
  MuiTimeClock: TimeClockProps;
  MuiTimeField: TimeFieldProps;
  MuiTimePickerToolbar: ExportedTimePickerToolbarProps;
  MuiYearCalendar: YearCalendarProps;

  // Date Pickers
  MuiDatePicker: DatePickerProps;
  MuiDesktopDatePicker: DesktopDatePickerProps;
  MuiMobileDatePicker: MobileDatePickerProps;
  MuiStaticDatePicker: StaticDatePickerProps;

  // Time Pickers
  MuiTimePicker: TimePickerProps;
  MuiDesktopTimePicker: DesktopTimePickerProps;
  MuiMobileTimePicker: MobileTimePickerProps;
  MuiStaticTimePicker: StaticTimePickerProps;

  // Date Time Pickers
  MuiDateTimePicker: DateTimePickerProps;
  MuiDesktopDateTimePicker: DesktopDateTimePickerProps;
  MuiMobileDateTimePicker: MobileDateTimePickerProps;
  MuiStaticDateTimePicker: StaticDateTimePickerProps;

  // Picker's TextField
  MuiPickersTextField: PickersTextFieldProps;
  MuiPickersInputBase: PickersInputBaseProps;
  MuiPickersInput: PickersInputProps;
  MuiPickersFilledInput: PickersFilledInputProps;
  MuiPickersOutlinedInput: PickersOutlinedInputProps;
  MuiPickersSectionList: PickersSectionListProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersComponentsPropsList {}
}

// disable automatic export
export {};
