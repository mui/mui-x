import { ComponentsProps } from '@mui/material/styles';
import { ComponentsOverrides } from '../internals/models/helpers';
import { PickerTextFieldOwnerState } from '../models/fields';
import { ClockOwnerState } from '../TimeClock/Clock';
import { ClockNumberOwnerState } from '../TimeClock/ClockNumber';
import { ClockPointerOwnerState } from '../TimeClock/ClockPointer';
import { PickerOwnerState } from '../models/pickers';
import { PickerToolbarOwnerState } from '../internals/hooks/useToolbarOwnerState';
import { PickerDayOwnerState } from '../PickersDay';
import { DigitalClockOwnerState } from '../DigitalClock/DigitalClock.types';
import { MultiSectionDigitalClockSectionOwnerState } from '../MultiSectionDigitalClock/MultiSectionDigitalClockSection';
import { PickerPopperOwnerState } from '../internals/components/PickerPopper/PickerPopper';
import { PickerLayoutOwnerState } from '../PickersLayout';
import { PickerInputOwnerState } from '../PickersTextField/PickersInput/PickersInput';
import { PickerFilledInputOwnerState } from '../PickersTextField/PickersFilledInput/PickersFilledInput';

export interface PickerComponents<Theme = unknown> {
  MuiClock?: {
    defaultProps?: ComponentsProps['MuiClock'];
    styleOverrides?: ComponentsOverrides<Theme, ClockOwnerState>['MuiClock'];
  };
  MuiClockNumber?: {
    defaultProps?: ComponentsProps['MuiClockNumber'];
    styleOverrides?: ComponentsOverrides<Theme, ClockNumberOwnerState>['MuiClockNumber'];
  };
  MuiClockPointer?: {
    defaultProps?: ComponentsProps['MuiClockPointer'];
    styleOverrides?: ComponentsOverrides<Theme, ClockPointerOwnerState>['MuiClockPointer'];
  };
  MuiDateCalendar?: {
    defaultProps?: ComponentsProps['MuiDateCalendar'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiDateCalendar'];
  };
  MuiDateField?: {
    defaultProps?: ComponentsProps['MuiDateField'];
  };
  MuiDatePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDatePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme, PickerToolbarOwnerState>['MuiDatePickerToolbar'];
  };
  MuiDateTimeField?: {
    defaultProps?: ComponentsProps['MuiDateTimeField'];
  };
  MuiDateTimePickerTabs?: {
    defaultProps?: ComponentsProps['MuiDateTimePickerTabs'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiDateTimePickerTabs'];
  };
  MuiDateTimePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateTimePickerToolbar'];
    styleOverrides?: ComponentsOverrides<
      Theme,
      PickerToolbarOwnerState
    >['MuiDateTimePickerToolbar'];
  };
  MuiDayCalendar?: {
    defaultProps?: ComponentsProps['MuiDayCalendar'];
    styleOverrides?: ComponentsOverrides<Theme, PickerDayOwnerState>['MuiDayCalendar'];
  };
  MuiDayCalendarSkeleton?: {
    defaultProps?: ComponentsProps['MuiDayCalendarSkeleton'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDayCalendarSkeleton'];
  };
  MuiDigitalClock?: {
    defaultProps?: ComponentsProps['MuiDigitalClock'];
    styleOverrides?: ComponentsOverrides<Theme, DigitalClockOwnerState>['MuiDigitalClock'];
  };
  MuiLocalizationProvider?: {
    defaultProps?: ComponentsProps['MuiLocalizationProvider'];
  };
  MuiMonthCalendar?: {
    defaultProps?: ComponentsProps['MuiMonthCalendar'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiMonthCalendar'];
  };
  MuiMultiSectionDigitalClock?: {
    defaultProps?: ComponentsProps['MuiMultiSectionDigitalClock'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiMultiSectionDigitalClock'];
  };
  MuiMultiSectionDigitalClockSection?: {
    defaultProps?: ComponentsProps['MuiMultiSectionDigitalClockSection'];
    styleOverrides?: ComponentsOverrides<
      Theme,
      MultiSectionDigitalClockSectionOwnerState
    >['MuiMultiSectionDigitalClockSection'];
  };
  MuiPickersArrowSwitcher?: {
    defaultProps?: ComponentsProps['MuiPickersArrowSwitcher'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiPickersArrowSwitcher'];
  };
  MuiPickersCalendarHeader?: {
    defaultProps?: ComponentsProps['MuiPickersCalendarHeader'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiPickersCalendarHeader'];
  };
  MuiPickersDay?: {
    defaultProps?: ComponentsProps['MuiPickersDay'];
    styleOverrides?: ComponentsOverrides<Theme, PickerDayOwnerState>['MuiPickersDay'];
  };
  MuiPickersFadeTransitionGroup?: {
    defaultProps?: ComponentsProps['MuiPickersFadeTransitionGroup'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersFadeTransitionGroup'];
  };
  MuiPickerPopper?: {
    defaultProps?: ComponentsProps['MuiPickerPopper'];
    styleOverrides?: ComponentsOverrides<Theme, PickerPopperOwnerState>['MuiPickerPopper'];
  };
  MuiPickersSlideTransition?: {
    defaultProps?: ComponentsProps['MuiPickersSlideTransition'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersSlideTransition'];
  };
  MuiPickersToolbar?: {
    defaultProps?: ComponentsProps['MuiPickersToolbar'];
    styleOverrides?: ComponentsOverrides<Theme, PickerToolbarOwnerState>['MuiPickersToolbar'];
  };
  MuiPickersToolbarButton?: {
    defaultProps?: ComponentsProps['MuiPickersToolbarButton'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersToolbarButton'];
  };
  MuiPickersToolbarText?: {
    defaultProps?: ComponentsProps['MuiPickersToolbarText'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersToolbarText'];
  };
  MuiPickersLayout?: {
    defaultProps?: ComponentsProps['MuiPickersLayout'];
    styleOverrides?: ComponentsOverrides<Theme, PickerLayoutOwnerState>['MuiPickersLayout'];
  };
  MuiTimeClock?: {
    defaultProps?: ComponentsProps['MuiTimeClock'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiTimeClock'];
  };
  MuiTimeField?: {
    defaultProps?: ComponentsProps['MuiTimeField'];
  };
  MuiTimePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiTimePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme, PickerToolbarOwnerState>['MuiTimePickerToolbar'];
  };
  MuiYearCalendar?: {
    defaultProps?: ComponentsProps['MuiYearCalendar'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiYearCalendar'];
  };

  // Date Pickers
  MuiDatePicker?: {
    defaultProps?: ComponentsProps['MuiDatePicker'];
  };
  MuiDesktopDatePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDatePicker'];
  };
  MuiMobileDatePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDatePicker'];
  };
  MuiStaticDatePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDatePicker'];
  };

  // Time Pickers
  MuiTimePicker?: {
    defaultProps?: ComponentsProps['MuiTimePicker'];
  };
  MuiDesktopTimePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopTimePicker'];
  };
  MuiMobileTimePicker?: {
    defaultProps?: ComponentsProps['MuiMobileTimePicker'];
  };
  MuiStaticTimePicker?: {
    defaultProps?: ComponentsProps['MuiStaticTimePicker'];
  };

  // Date Time Pickers
  MuiDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiDateTimePicker'];
  };
  MuiDesktopDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDateTimePicker'];
  };
  MuiMobileDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDateTimePicker'];
  };
  MuiStaticDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDateTimePicker'];
  };

  // PickersTextField
  MuiPickersTextField?: {
    defaultProps?: ComponentsProps['MuiPickersTextField'];
    styleOverrides?: ComponentsOverrides<Theme, PickerTextFieldOwnerState>['MuiPickersTextField'];
  };
  MuiPickersInputBase?: {
    defaultProps?: ComponentsProps['MuiPickersInputBase'];
    styleOverrides?: ComponentsOverrides<Theme, PickerTextFieldOwnerState>['MuiPickersInputBase'];
  };
  MuiPickersInput?: {
    defaultProps?: ComponentsProps['MuiPickersInput'];
    styleOverrides?: ComponentsOverrides<Theme, PickerInputOwnerState>['MuiPickersInput'];
  };
  MuiPickersFilledInput?: {
    defaultProps?: ComponentsProps['MuiPickersFilledInput'];
    styleOverrides?: ComponentsOverrides<
      Theme,
      PickerFilledInputOwnerState
    >['MuiPickersFilledInput'];
  };
  MuiPickersOutlinedInput?: {
    defaultProps?: ComponentsProps['MuiPickersOutlinedInput'];
    styleOverrides?: ComponentsOverrides<
      Theme,
      PickerTextFieldOwnerState
    >['MuiPickersOutlinedInput'];
  };
  MuiPickersSectionList?: {
    defaultProps?: ComponentsProps['MuiPickersSectionList'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiPickersSectionList'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickerComponents<Theme> {}
}
