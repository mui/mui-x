import { DateRangePickerDayClassKey } from '../DateRangePickerDay';
import { DateRangePickerDay2ClassKey } from '../DateRangePickerDay2';
import { DateRangeCalendarClassKey } from '../DateRangeCalendar';
import { DateRangePickerToolbarClassKey } from '../DateRangePicker';
import {
  DateTimeRangePickerTabsClassKey,
  DateTimeRangePickerToolbarClassKey,
} from '../DateTimeRangePicker';
import { MultiInputDateRangeFieldClassKey } from '../MultiInputDateRangeField';
import { MultiInputDateTimeRangeFieldClassKey } from '../MultiInputDateTimeRangeField';
import { MultiInputTimeRangeFieldClassKey } from '../MultiInputTimeRangeField';

// prettier-ignore
export interface PickersProComponentNameToClassKey {
  MuiDateRangeCalendar: DateRangeCalendarClassKey;
  MuiDateRangePickerDay: DateRangePickerDayClassKey;
  MuiDateRangePickerDay2: DateRangePickerDay2ClassKey;
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
