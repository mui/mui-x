import { ComponentsProps } from '@mui/material/styles';
import { ComponentsOverrides, PickerToolbarOwnerState } from '@mui/x-date-pickers/internals';
import { FieldOwnerState, PickerOwnerState } from '@mui/x-date-pickers/models';
import { DateRangeCalendarOwnerState } from '../DateRangeCalendar/DateRangeCalendar.types';
import { DateRangePickerDayOwnerState } from '../DateRangePickerDay/DateRangePickerDay.types';

export interface PickersProComponents<Theme = unknown> {
  MuiDateRangeCalendar?: {
    defaultProps?: ComponentsProps['MuiDateRangeCalendar'];
    styleOverrides?: ComponentsOverrides<
      Theme,
      DateRangeCalendarOwnerState
    >['MuiDateRangeCalendar'];
  };
  MuiDateRangePickerDay?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerDay'];
    styleOverrides?: ComponentsOverrides<
      Theme,
      DateRangePickerDayOwnerState
    >['MuiDateRangePickerDay'];
  };
  MuiDateTimeRangePickerTabs?: {
    defaultProps?: ComponentsProps['MuiDateTimeRangePickerTabs'];
    styleOverrides?: ComponentsOverrides<Theme, PickerOwnerState>['MuiDateTimeRangePickerTabs'];
  };
  MuiDateRangePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerToolbar'];
    styleOverrides?: ComponentsOverrides<
      Theme,
      PickerToolbarOwnerState
    >['MuiDateRangePickerToolbar'];
  };
  MuiDateTimeRangePickerToolbar?: {
    defaultProps?: ComponentsProps['MuiDateTimeRangePickerToolbar'];
    styleOverrides?: ComponentsOverrides<
      Theme,
      PickerToolbarOwnerState
    >['MuiDateTimeRangePickerToolbar'];
  };
  MuiPickersRangeCalendarHeader?: {
    defaultProps?: ComponentsProps['MuiPickersRangeCalendarHeader'];
  };

  // Multi input range fields
  MuiMultiInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputDateRangeField'];
    styleOverrides?: ComponentsOverrides<Theme, FieldOwnerState>['MuiMultiInputDateRangeField'];
  };
  MuiMultiInputDateTimeRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputDateTimeRangeField'];
    styleOverrides?: ComponentsOverrides<Theme, FieldOwnerState>['MuiMultiInputDateTimeRangeField'];
  };
  MuiMultiInputTimeRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputTimeRangeField'];
    styleOverrides?: ComponentsOverrides<Theme, FieldOwnerState>['MuiMultiInputTimeRangeField'];
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
