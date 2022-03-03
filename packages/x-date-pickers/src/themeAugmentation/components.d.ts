import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface PickerComponents {
  MuiCalendarPicker?: {
    defaultProps?: ComponentsProps['MuiCalendarPicker'];
    styleOverrides?: ComponentsOverrides['MuiCalendarPicker'];
    variants?: ComponentsVariants['MuiCalendarPicker'];
  };
  MuiCalendarPickerSkeleton?: {
    defaultProps?: ComponentsProps['MuiCalendarPickerSkeleton'];
    styleOverrides?: ComponentsOverrides['MuiCalendarPickerSkeleton'];
    variants?: ComponentsVariants['MuiCalendarPickerSkeleton'];
  };
  MuiClockPicker?: {
    defaultProps?: ComponentsProps['MuiClockPicker'];
    styleOverrides?: ComponentsOverrides['MuiClockPicker'];
    variants?: ComponentsVariants['MuiClockPicker'];
  };
  MuiDatePicker?: {
    defaultProps?: ComponentsProps['MuiDatePicker'];
    styleOverrides?: ComponentsOverrides['MuiDatePicker'];
    variants?: ComponentsVariants['MuiDatePicker'];
  };
  MuiDateTimePicker?: {
    defaultProps?: ComponentsProps['MuiDateTimePicker'];
    styleOverrides?: ComponentsOverrides['MuiDateTimePicker'];
    variants?: ComponentsVariants['MuiDateTimePicker'];
  };
  MuiMonthPicker?: {
    defaultProps?: ComponentsProps['MuiMonthPicker'];
    styleOverrides?: ComponentsOverrides['MuiMonthPicker'];
    variants?: ComponentsVariants['MuiMonthPicker'];
  };
  MuiPickersDay?: {
    defaultProps?: ComponentsProps['MuiPickersDay'];
    styleOverrides?: ComponentsOverrides['MuiPickersDay'];
    variants?: ComponentsVariants['MuiPickersDay'];
  };
  MuiYearPicker?: {
    defaultProps?: ComponentsProps['MuiYearPicker'];
    styleOverrides?: ComponentsOverrides['MuiYearPicker'];
    variants?: ComponentsVariants['MuiYearPicker'];
  };
  MuiPickerStaticWrapper?: {
    defaultProps?: ComponentsProps['MuiPickerStaticWrapper'];
    styleOverrides?: ComponentsOverrides['MuiPickerStaticWrapper'];
    variants?: ComponentsVariants['MuiPickerStaticWrapper'];
  };
}

declare module '@mui/material/styles' {
  interface Components extends PickerComponents {}
}
