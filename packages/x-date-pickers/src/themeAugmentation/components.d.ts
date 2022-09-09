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
  MuiClockPicker?: {
    defaultProps?: ComponentsProps['MuiClockPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiClockPicker'];
    variants?: ComponentsVariants['MuiClockPicker'];
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
  MuiDesktopDatePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDatePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopDatePicker'];
    variants?: ComponentsVariants['MuiDesktopDatePicker'];
  };
  MuiDesktopDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDateTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopDateTimePicker'];
    variants?: ComponentsVariants['MuiDesktopDateTimePicker'];
  };
  MuiDesktopTimePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopTimePicker'];
    variants?: ComponentsVariants['MuiDesktopTimePicker'];
  };
  MuiMonthPicker?: {
    defaultProps?: ComponentsProps['MuiMonthPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMonthPicker'];
    variants?: ComponentsVariants['MuiMonthPicker'];
  };
  MuiPickersDay?: {
    defaultProps?: ComponentsProps['MuiPickersDay'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickersDay'];
    variants?: ComponentsVariants['MuiPickersDay'];
  };
  MuiPickerStaticWrapper?: {
    defaultProps?: ComponentsProps['MuiPickerStaticWrapper'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPickerStaticWrapper'];
    variants?: ComponentsVariants['MuiPickerStaticWrapper'];
  };
  MuiStaticDatePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDatePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticDatePicker'];
    variants?: ComponentsVariants['MuiStaticDatePicker'];
  };
  MuiStaticDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDateTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticDateTimePicker'];
    variants?: ComponentsVariants['MuiStaticDateTimePicker'];
  };
  MuiStaticTimePicker?: {
    defaultProps?: ComponentsProps['MuiStaticTimePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticTimePicker'];
    variants?: ComponentsVariants['MuiStaticTimePicker'];
  };
  MuiYearPicker?: {
    defaultProps?: ComponentsProps['MuiYearPicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiYearPicker'];
    variants?: ComponentsVariants['MuiYearPicker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickerComponents<Theme> {}
}
