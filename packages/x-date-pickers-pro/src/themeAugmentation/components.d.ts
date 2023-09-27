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
  };
  MuiSingleInputDateTimeRangeField?: {
    defaultProps?: ComponentsProps['MuiSingleInputDateTimeRangeField'];
  };
  MuiSingleInputTimeRangeField?: {
    defaultProps?: ComponentsProps['MuiSingleInputTimeRangeField'];
  };

  // Date Range Pickers
  MuiDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDateRangePicker'];
  };
  MuiDesktopDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDateRangePicker'];
  };
  MuiMobileDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDateRangePicker'];
  };
  MuiStaticDateRangePicker?: {
    defaultProps?: ComponentsProps['MuiStaticDateRangePicker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickersProComponents<Theme> {}
}
