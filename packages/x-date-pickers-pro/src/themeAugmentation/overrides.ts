import type { DateRangePickerDayClassKey } from '../DateRangePickerDay';
import type { DateRangeCalendarClassKey } from '../DateRangeCalendar';
import type { DateRangePickerToolbarClassKey } from '../DateRangePicker';
import type {
  DateTimeRangePickerTabsClassKey,
  DateTimeRangePickerToolbarClassKey,
} from '../DateTimeRangePicker';
import type { MultiInputDateRangeFieldClassKey } from '../MultiInputDateRangeField';
import type { MultiInputDateTimeRangeFieldClassKey } from '../MultiInputDateTimeRangeField';
import type { MultiInputTimeRangeFieldClassKey } from '../MultiInputTimeRangeField';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangeCalendar: DateRangeCalendarClassKey;
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateRangePickerToolbar: DateRangePickerToolbarClassKey;

  MuiDateTimeRangePickerTabs: DateTimeRangePickerTabsClassKey;
  MuiDateTimeRangePickerToolbar: DateTimeRangePickerToolbarClassKey;

  // Multi input range fields
  MuiMultiInputDateRangeField: MultiInputDateRangeFieldClassKey;	
  MuiMultiInputDateTimeRangeField: MultiInputDateTimeRangeFieldClassKey;	
  MuiMultiInputTimeRangeField: MultiInputTimeRangeFieldClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersProComponentNameToClassKey {}
}

// disable automatic export
export {};
