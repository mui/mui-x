import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface PickerComponents<Theme = unknown> {
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
  MuiDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiDateTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimePicker'];
    variants?: ComponentsVariants['MuiDateTimePicker'];
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
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickerComponents<Theme> {}
}
