import {
  DateCalendarProps,
  ExportedSlideTransitionProps,
  PickersFadeTransitionGroupProps,
} from '../DateCalendar';
import { DayCalendarSkeletonProps } from '../DayCalendarSkeleton';
import { ClockNumberProps, TimeClockProps, ClockPointerProps, ClockProps } from '../TimeClock';
import { MonthCalendarProps } from '../MonthCalendar';
import { PickersDayProps } from '../PickersDay';
import { YearCalendarProps } from '../YearCalendar';
import { DateFieldProps } from '../DateField';
import { LocalizationProviderProps } from '../LocalizationProvider';
import { PickersLayoutProps } from '../PickersLayout';
import { DayCalendarProps } from '../DateCalendar/DayCalendar';
import { ExportedPickersArrowSwitcherProps } from '../internals/components/PickersArrowSwitcher/PickersArrowSwitcher.types';
import { PickerPopperProps } from '../internals/components/PickersPopper';
import { PickersToolbarProps } from '../internals/components/PickersToolbar';
import { PickersToolbarButtonProps } from '../internals/components/PickersToolbarButton';
import { ExportedPickersToolbarTextProps } from '../internals/components/PickersToolbarText';

import { DatePickerProps } from '../DatePicker';
import { ExportedDatePickerToolbarProps } from '../DatePicker/DatePickerToolbar';
import { DesktopDatePickerProps } from '../DesktopDatePicker';
import { MobileDatePickerProps } from '../MobileDatePicker';
import { StaticDatePickerProps } from '../StaticDatePicker';

import { DateTimePickerProps, DateTimePickerTabsProps } from '../DateTimePicker';
import { ExportedDateTimePickerToolbarProps } from '../DateTimePicker/DateTimePickerToolbar';
import { DesktopDateTimePickerProps } from '../DesktopDateTimePicker';
import { MobileDateTimePickerProps } from '../MobileDateTimePicker';
import { StaticDateTimePickerProps } from '../StaticDateTimePicker';
import { DateTimeFieldProps } from '../DateTimeField';

import { TimePickerProps } from '../TimePicker';
import { ExportedTimePickerToolbarProps } from '../TimePicker/TimePickerToolbar';
import { DesktopTimePickerProps } from '../DesktopTimePicker';
import { MobileTimePickerProps } from '../MobileTimePicker';
import { StaticTimePickerProps } from '../StaticTimePicker';
import { ExportedDigitalClockProps } from '../DigitalClock';
import { TimeFieldProps } from '../TimeField';
import {
  ExportedMultiSectionDigitalClockSectionProps,
  MultiSectionDigitalClockProps,
} from '../MultiSectionDigitalClock';
import { ExportedPickersCalendarHeaderProps } from '../PickersCalendarHeader';
import {
  PickersTextFieldProps,
  PickersInputBaseProps,
  PickersOutlinedInputProps,
  PickersInputProps,
  PickersFilledInputProps,
} from '../PickersTextField';
import { PickersSectionListProps } from '../PickersSectionList';
import { PickerValidValue } from '../internals/models';

export interface PickersComponentsPropsList {
  MuiClock: ClockProps;
  MuiClockNumber: ClockNumberProps;
  MuiClockPointer: ClockPointerProps;
  MuiDateCalendar: DateCalendarProps;
  MuiDateField: DateFieldProps<any>;
  MuiDatePickerToolbar: ExportedDatePickerToolbarProps;
  MuiDateTimeField: DateTimeFieldProps<any>;
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
  MuiPickersDay: PickersDayProps;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupProps;
  MuiPickersPopper: PickerPopperProps;
  MuiPickersSlideTransition: ExportedSlideTransitionProps;
  MuiPickersToolbar: PickersToolbarProps<PickerValidValue>;
  MuiPickersToolbarButton: PickersToolbarButtonProps;
  MuiPickersToolbarText: ExportedPickersToolbarTextProps;
  MuiPickersLayout: PickersLayoutProps<PickerValidValue>;
  MuiTimeClock: TimeClockProps;
  MuiTimeField: TimeFieldProps<any>;
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

  // V7 Picker's TextField
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
