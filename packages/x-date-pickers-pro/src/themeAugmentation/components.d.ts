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
  MuiDateTimeRangePickerTabs?: {
    defaultProps?: ComponentsProps['MuiDateTimeRangePickerTabs'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimeRangePickerTabs'];
  };
  MuiDateRangePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateRangePickerToolbar'];
  };
  MuiDateTimeRangePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateTimeRangePickerToolbar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateTimeRangePickerToolbar'];
  };
  MuiPickersRangeCalendarHeader?: {
    defaultProps?: ComponentsProps['MuiPickersRangeCalendarHeader'];
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
  MuiMultiInputRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputRangeField'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMultiInputRangeField'];
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

  // Date Time Range Pickers
  MuiDateTimeRangePicker?: {
    defaultProps?: ComponentsProps['MuiDateTimeRangePicker'];
  };
  MuiDesktopDateTimeRangePicker?: {
    defaultProps?: ComponentsProps['MuiDesktopDateTimeRangePicker'];
  };
  MuiMobileDateTimeRangePicker?: {
    defaultProps?: ComponentsProps['MuiMobileDateTimeRangePicker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends PickersProComponents<Theme> {}
}
