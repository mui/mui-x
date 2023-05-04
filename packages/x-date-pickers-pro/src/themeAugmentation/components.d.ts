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

  // Multi input range fields
  MuiMultiInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputDateRangeField'];
    styleOverrides?: ComponentsOverrides['MuiMultiInputDateRangeField'];
  };
  MuiMultiInputDateTimeRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputDateTimeRangeField'];
    styleOverrides?: ComponentsOverrides['MuiMultiInputDateTimeRangeField'];
  };
  MuiMultiInputTimeRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputTimeRangeField'];
    styleOverrides?: ComponentsOverrides['MuiMultiInputTimeRangeField'];
  };

  // Single input range fields
  MuiSingleInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiSingleInputDateRangeField'];
    styleOverrides?: ComponentsOverrides['MuiSingleInputDateRangeField'];
  };
  MuiSingleInputDateTimeRangeField?: {
    defaultProps?: ComponentsProps['MuiSingleInputDateTimeRangeField'];
    styleOverrides?: ComponentsOverrides['MuiSingleInputDateTimeRangeField'];
  };
  MuiSingleInputTimeRangeField?: {
    defaultProps?: ComponentsProps['MuiSingleInputTimeRangeField'];
    styleOverrides?: ComponentsOverrides['MuiSingleInputTimeRangeField'];
  };

  // Date Range Pickers
  MuiDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePicker'];
  };
  MuiDesktopDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDesktopDateRangePicker'];
  };
  MuiMobileDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMobileDateRangePicker'];
  };
  MuiStaticDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDateRangePicker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiStaticDateRangePicker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickersProComponents<Theme> {}
}
