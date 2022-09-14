import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface PickerComponents<Theme = unknown> {
  MuiCalendarOrClockPicker?: {
    defaultProps?: ComponentsProps['MuiCalendarOrClockPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiCalendarOrClockPicker'];
    variants?: ComponentsVariants['MuiCalendarOrClockPicker'];
  };
  MuiCalendarPicker?: {
    defaultProps?: ComponentsProps['MuiCalendarPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiCalendarPicker'];
    variants?: ComponentsVariants['MuiCalendarPicker'];
  };
  MuiCalendarPickerSkeleton?: {
    defaultProps?: ComponentsProps['MuiCalendarPickerSkeleton'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiCalendarPickerSkeleton'];
    variants?: ComponentsVariants['MuiCalendarPickerSkeleton'];
  };
  MuiClock?: {
    defaultProps?: ComponentsProps['MuiClock'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiClock'];
    variants?: ComponentsVariants['MuiClock'];
  };
  MuiClockNumber?: {
    defaultProps?: ComponentsProps['MuiClockNumber'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiClockNumber'];
    variants?: ComponentsVariants['MuiClockNumber'];
  };
  MuiClockPicker?: {
    defaultProps?: ComponentsProps['MuiClockPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiClockPicker'];
    variants?: ComponentsVariants['MuiClockPicker'];
  };
  MuiClockPointer?: {
    defaultProps?: ComponentsProps['MuiClockPointer'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiClockPointer'];
    variants?: ComponentsVariants['MuiClockPointer'];
  };
  MuiDatePicker?: {
    defaultProps?: ComponentsProps['MuiDatePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDatePicker'];
    variants?: ComponentsVariants['MuiDatePicker'];
  };
  MuiDatePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDatePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDatePickerToolbar'];
    variants?: ComponentsVariants['MuiDatePickerToolbar'];
  };
  MuiDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiDateTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimePicker'];
    variants?: ComponentsVariants['MuiDateTimePicker'];
  };
  MuiDateTimePickerTabs?: {
    defaultProps?: ComponentsProps['MuiDateTimePickerTabs'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimePickerTabs'];
    variants?: ComponentsVariants['MuiDateTimePickerTabs'];
  };
  MuiDateTimePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateTimePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimePickerToolbar'];
    variants?: ComponentsVariants['MuiDateTimePickerToolbar'];
  };
  MuiDayPicker?: {
    defaultProps?: ComponentsProps['MuiDayPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDayPicker'];
    variants?: ComponentsVariants['MuiDayPicker'];
  };
  MuiMonthPicker?: {
    defaultProps?: ComponentsProps['MuiMonthPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMonthPicker'];
    variants?: ComponentsVariants['MuiMonthPicker'];
  };
  MuiPickersArrowSwitcher?: {
    defaultProps?: ComponentsProps['MuiPickersArrowSwitcher'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersArrowSwitcher'];
    variants?: ComponentsVariants['MuiPickersArrowSwitcher'];
  };
  MuiPickersCalendarHeader?: {
    defaultProps?: ComponentsProps['MuiPickersCalendarHeader'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersCalendarHeader'];
    variants?: ComponentsVariants['MuiPickersCalendarHeader'];
  };
  MuiPickersDay?: {
    defaultProps?: ComponentsProps['MuiPickersDay'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersDay'];
    variants?: ComponentsVariants['MuiPickersDay'];
  };
  MuiPickersFadeTransitionGroup?: {
    defaultProps?: ComponentsProps['MuiPickersFadeTransitionGroup'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersFadeTransitionGroup'];
    variants?: ComponentsVariants['MuiPickersFadeTransitionGroup'];
  };
  MuiPickersPopper?: {
    defaultProps?: ComponentsProps['MuiPickersPopper'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersPopper'];
    variants?: ComponentsVariants['MuiPickersPopper'];
  };
  MuiPickersToolbar?: {
    defaultProps?: ComponentsProps['MuiPickersToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersToolbar'];
    variants?: ComponentsVariants['MuiPickersToolbar'];
  };
  MuiPickersToolbarButton?: {
    defaultProps?: ComponentsProps['MuiPickersToolbarButton'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersToolbarButton'];
    variants?: ComponentsVariants['MuiPickersToolbarButton'];
  };
  MuiTimePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiTimePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTimePickerToolbar'];
    variants?: ComponentsVariants['MuiTimePickerToolbar'];
  };
  MuiYearPicker?: {
    defaultProps?: ComponentsProps['MuiYearPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiYearPicker'];
    variants?: ComponentsVariants['MuiYearPicker'];
  };
  MuiPickerStaticWrapper?: {
    defaultProps?: ComponentsProps['MuiPickerStaticWrapper'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickerStaticWrapper'];
    variants?: ComponentsVariants['MuiPickerStaticWrapper'];
  };
  // TODO v6: Rename 'PrivatePickersSlideTransition' to 'MuiPickersSlideTransition' to follow convention
  PrivatePickersSlideTransition?: {
    defaultProps?: ComponentsProps['PrivatePickersSlideTransition'];
    styleOverrides?: ComponentsOverrides<Theme>['PrivatePickersSlideTransition'];
    variants?: ComponentsVariants['PrivatePickersSlideTransition'];
  };
  // TODO v6: Rename 'PrivatePickersToolbarText' to 'MuiPickersToolbarText' to follow convention
  PrivatePickersToolbarText?: {
    defaultProps?: ComponentsProps['PrivatePickersToolbarText'];
    styleOverrides?: ComponentsOverrides<Theme>['PrivatePickersToolbarText'];
    variants?: ComponentsVariants['PrivatePickersToolbarText'];
  };
  // TODO v6: Rename 'PrivatePickersYear' to 'MuiPickersYear' to follow convention
  PrivatePickersYear?: {
    defaultProps?: ComponentsProps['PrivatePickersYear'];
    styleOverrides?: ComponentsOverrides<Theme>['PrivatePickersYear'];
    variants?: ComponentsVariants['PrivatePickersYear'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickerComponents<Theme> {}
}
