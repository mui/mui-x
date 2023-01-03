import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface PickersProComponents<Theme = unknown> {
  MuiDateRangeCalendar?: {
    defaultProps?: ComponentsProps['MuiDateRangeCalendar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangeCalendar'];
  };
  MuiDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePicker'];
  };
  MuiDateRangePickerDay?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerDay'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerDay'];
  };
  MuiDateRangePickerInput?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerInput'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerInput'];
  };
  MuiDateRangePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerToolbar'];
  };
  MuiDateRangePickerViewDesktop?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerViewDesktop'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerViewDesktop'];
  };
  MuiDesktopDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopDateRangePicker'];
  };
  MuiDesktopNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopNextDateRangePicker'];
  };
  MuiMobileDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMobileDateRangePicker'];
  };
  MuiMobileNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiMobileNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMobileNextDateRangePicker'];
  };
  MuiMultiInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputDateRangeField'];
    styleOverrides?: ComponentsOverrides['MuiMultiInputDateRangeField'];
  };
  MuiNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiNextDateRangePicker'];
  };
  MuiSingleInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiSingleInputDateRangeField'];
    styleOverrides?: ComponentsOverrides['MuiSingleInputDateRangeField'];
  };
  MuiStaticDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticDateRangePicker'];
  };
  MuiStaticNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiStaticNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticNextDateRangePicker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickersProComponents<Theme> {}
}
