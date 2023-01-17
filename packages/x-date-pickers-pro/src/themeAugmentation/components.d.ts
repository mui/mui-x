import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface PickersProComponents<Theme = unknown> {
  MuiDateRangeCalendar?: {
    defaultProps?: ComponentsProps['MuiDateRangeCalendar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangeCalendar'];
  };
  MuiDateRangePickerDay?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerDay'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerDay'];
  };
  MuiDateRangePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerToolbar'];
  };
  MuiDesktopNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopNextDateRangePicker'];
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
  MuiStaticNextDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiStaticNextDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticNextDateRangePicker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickersProComponents<Theme> {}
}
