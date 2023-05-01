import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface PickerComponents<Theme = unknown> {
  MuiClock?: {
    defaultProps?: ComponentsProps['MuiClock'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiClock'];
  };
  MuiClockNumber?: {
    defaultProps?: ComponentsProps['MuiClockNumber'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiClockNumber'];
  };
  MuiClockPointer?: {
    defaultProps?: ComponentsProps['MuiClockPointer'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiClockPointer'];
  };
  MuiDateCalendar?: {
    defaultProps?: ComponentsProps['MuiDateCalendar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateCalendar'];
  };
  MuiDateField?: {
    defaultProps?: ComponentsProps['MuiDateField'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateField'];
  };
  MuiDatePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDatePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDatePickerToolbar'];
  };
  MuiDateTimePickerTabs?: {
    defaultProps?: ComponentsProps['MuiDateTimePickerTabs'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimePickerTabs'];
  };
  MuiDateTimePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateTimePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimePickerToolbar'];
  };
  MuiDayCalendar?: {
    defaultProps?: ComponentsProps['MuiDayCalendar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDayCalendar'];
  };
  MuiDayCalendarSkeleton?: {
    defaultProps?: ComponentsProps['MuiDayCalendarSkeleton'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDayCalendarSkeleton'];
  };
  MuiDigitalClock?: {
    defaultProps?: ComponentsProps['MuiDigitalClock'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDigitalClock'];
  };
  MuiLocalizationProvider?: {
    defaultProps?: ComponentsProps['MuiLocalizationProvider'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiLocalizationProvider'];
  };
  MuiMonthCalendar?: {
    defaultProps?: ComponentsProps['MuiMonthCalendar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMonthCalendar'];
  };
  MuiMultiSectionDigitalClock?: {
    defaultProps?: ComponentsProps['MuiMultiSectionDigitalClock'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMultiSectionDigitalClock'];
  };
  MuiMultiSectionDigitalClockSection?: {
    defaultProps?: ComponentsProps['MuiMultiSectionDigitalClockSection'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMultiSectionDigitalClockSection'];
  };
  MuiPickersArrowSwitcher?: {
    defaultProps?: ComponentsProps['MuiPickersArrowSwitcher'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersArrowSwitcher'];
  };
  MuiPickersCalendarHeader?: {
    defaultProps?: ComponentsProps['MuiPickersCalendarHeader'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersCalendarHeader'];
  };
  MuiPickersDay?: {
    defaultProps?: ComponentsProps['MuiPickersDay'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersDay'];
  };
  MuiPickersFadeTransitionGroup?: {
    defaultProps?: ComponentsProps['MuiPickersFadeTransitionGroup'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersFadeTransitionGroup'];
  };
  MuiPickersMonth?: {
    defaultProps?: ComponentsProps['MuiPickersMonth'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersMonth'];
  };
  MuiPickersPopper?: {
    defaultProps?: ComponentsProps['MuiPickersPopper'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersPopper'];
  };
  MuiPickersSlideTransition?: {
    defaultProps?: ComponentsProps['MuiPickersSlideTransition'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersSlideTransition'];
  };
  MuiPickersToolbar?: {
    defaultProps?: ComponentsProps['MuiPickersToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersToolbar'];
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
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersLayout'];
  };
  MuiPickersYear?: {
    defaultProps?: ComponentsProps['MuiPickersYear'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersYear'];
  };
  MuiTimeClock?: {
    defaultProps?: ComponentsProps['MuiTimeClock'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTimeClock'];
  };
  MuiTimePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiTimePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTimePickerToolbar'];
  };
  MuiYearCalendar?: {
    defaultProps?: ComponentsProps['MuiYearCalendar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiYearCalendar'];
  };

  // Date Pickers
  MuiDatePicker?: {
    defaultProps?: ComponentsProps['MuiDatePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDatePicker'];
  };
  MuiDesktopDatePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDatePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopDatePicker'];
  };
  MuiMobileDatePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDatePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMobileDatePicker'];
  };
  MuiStaticDatePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDatePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticDatePicker'];
  };

  // Time Pickers
  MuiTimePicker?: {
    defaultProps?: ComponentsProps['MuiTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTimePicker'];
  };
  MuiDesktopTimePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopTimePicker'];
  };
  MuiMobileTimePicker?: {
    defaultProps?: ComponentsProps['MuiMobileTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMobileTimePicker'];
  };
  MuiStaticTimePicker?: {
    defaultProps?: ComponentsProps['MuiStaticTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticTimePicker'];
  };

  // Date Time Pickers
  MuiDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiDateTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimePicker'];
  };
  MuiDesktopDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDateTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopDateTimePicker'];
  };
  MuiMobileDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDateTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMobileDateTimePicker'];
  };
  MuiStaticDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDateTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticDateTimePicker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickerComponents<Theme> {}
}
