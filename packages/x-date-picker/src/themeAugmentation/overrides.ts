import {
  DatePickerClassKey,
  DatePickerMobileClassKey,
  DatePickerDesktopClassKey,
  CalendarPickerClassKey,
} from '../components';

export interface DatePickerComponentNameToClassKey {
  MuiDatePicker: DatePickerClassKey;
  MuiDatePickerDesktop: DatePickerDesktopClassKey;
  MuiDatePickerMobile: DatePickerMobileClassKey;
  MuiCalendarPicker: CalendarPickerClassKey;
}

declare module '@mui/material/styles/overrides' {
  interface ComponentNameToClassKey extends DatePickerComponentNameToClassKey {}
}
