import { DateRangePickerDayClassKey } from '../DateRangePickerDay';
import { DateRangeCalendarClassKey } from '../DateRangeCalendar';
import { DateRangePickerToolbarClassKey } from '../DateRangePicker';
import { MultiInputRangeFieldClassKey } from '../models';
import {
  DateTimeRangePickerTabsClassKey,
  DateTimeRangePickerToolbarClassKey,
} from '../DateTimeRangePicker';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangeCalendar: DateRangeCalendarClassKey;
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateRangePickerToolbar: DateRangePickerToolbarClassKey;

  MuiDateTimeRangePickerTabs: DateTimeRangePickerTabsClassKey;
  MuiDateTimeRangePickerToolbar: DateTimeRangePickerToolbarClassKey;

  // Multi input range fields
  MuiMultiInputDateRangeField: MultiInputRangeFieldClassKey;
  MuiMultiInputDateTimeRangeField: MultiInputRangeFieldClassKey;
  MuiMultiInputTimeRangeField: MultiInputRangeFieldClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersProComponentNameToClassKey {}
}

// disable automatic export
export {};
