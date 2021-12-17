import { ComponentsOverrides, ComponentsProps } from '@mui/material/styles';
import {
  DatePickerProps,
  DatePickerDesktopProps,
  DatePickerMobileProps,
  CalendarPickerProps,
} from '../components';

export interface DatePickerComponentsPropsList {
  MuiDatePicker: DatePickerProps;
  MuiDatePickerDesktop: DatePickerDesktopProps;
  MuiDatePickerMobile: DatePickerMobileProps;
  MuiCalendarPicker: CalendarPickerProps<unknown>;
}

export interface DatePickerComponents {
  MuiDatePicker?: {
    defaultProps?: ComponentsProps['MuiDatePicker'];
    styleOverrides?: ComponentsOverrides['MuiDatePicker'];
  };
  MuiDatePickerDesktop?: {
    defaultProps?: ComponentsProps['MuiDatePickerDesktop'];
    styleOverrides?: ComponentsOverrides['MuiDatePickerDesktop'];
  };
  MuiDatePickerMobile?: {
    defaultProps?: ComponentsProps['MuiDatePickerMobile'];
    styleOverrides?: ComponentsOverrides['MuiDatePickerMobile'];
  };
  MuiCalendarPicker?: {
    defaultProps?: ComponentsProps['MuiCalendarPicker'];
    styleOverrides?: ComponentsOverrides['MuiCalendarPicker'];
  };
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DatePickerComponentsPropsList {}
}

declare module '@mui/material/styles/components' {
  interface Components extends DatePickerComponents {}
}
