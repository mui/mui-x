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
  MuiDateField?: {
    defaultProps?: ComponentsProps['MuiDateField'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDateField'];
    variants?: ComponentsVariants['MuiDateField'];
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
  MuiLocalizationProvider?: {
    defaultProps?: ComponentsProps['MuiLocalizationProvider'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiLocalizationProvider'];
    variants?: ComponentsVariants['MuiLocalizationProvider'];
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
