import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface PickersProComponents<Theme = unknown> {
  MuiDateRangeCalendar?: {
    defaultProps?: ComponentsProps['MuiDateRangeCalendar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangeCalendar'];
    variants?: ComponentsVariants['MuiDateRangeCalendar'];
  };
  MuiDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePicker'];
    variants?: ComponentsVariants['MuiDateRangePicker'];
  };
  MuiDateRangePickerDay?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerDay'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerDay'];
    variants?: ComponentsVariants['MuiDateRangePickerDay'];
  };
  MuiDateRangePickerInput?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerInput'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerInput'];
    variants?: ComponentsVariants['MuiDateRangePickerInput'];
  };
  MuiDateRangePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerToolbar'];
    variants?: ComponentsVariants['MuiDateRangePickerToolbar'];
  };
  MuiDateRangePickerViewDesktop?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerViewDesktop'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerViewDesktop'];
    variants?: ComponentsVariants['MuiDateRangePickerViewDesktop'];
  };
  MuiDesktopDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopDateRangePicker'];
    variants?: ComponentsVariants['MuiDesktopDateRangePicker'];
  };
  MuiDesktopNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopNextDateRangePicker'];
    variants?: ComponentsVariants['MuiDesktopNextDateRangePicker'];
  };
  MuiMobileDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMobileDateRangePicker'];
    variants?: ComponentsVariants['MuiMobileDateRangePicker'];
  };
  MuiMobileNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiMobileNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMobileNextDateRangePicker'];
    variants?: ComponentsVariants['MuiMobileNextDateRangePicker'];
  };
  MuiMultiInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputDateRangeField'];
    styleOverrides?: ComponentsOverrides['MuiMultiInputDateRangeField'];
    variants?: ComponentsVariants['MuiMultiInputDateRangeField'];
  };
  MuiNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiNextDateRangePicker'];
    variants?: ComponentsVariants['MuiNextDateRangePicker'];
  };
  MuiSingleInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiSingleInputDateRangeField'];
    styleOverrides?: ComponentsOverrides['MuiSingleInputDateRangeField'];
    variants?: ComponentsVariants['MuiSingleInputDateRangeField'];
  };
  MuiStaticDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticDateRangePicker'];
    variants?: ComponentsVariants['MuiStaticDateRangePicker'];
  };
  MuiStaticNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiStaticNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticNextDateRangePicker'];
    variants?: ComponentsVariants['MuiStaticNextDateRangePicker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickersProComponents<Theme> {}
}
