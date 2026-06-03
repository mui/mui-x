import {
  type DateCalendarClassKey,
  type DayCalendarClassKey,
  type PickersFadeTransitionGroupClassKey,
  type PickersSlideTransitionClassKey,
} from '../DateCalendar';
import { type PickersCalendarHeaderClassKey } from '../PickersCalendarHeader';
import { type DayCalendarSkeletonClassKey } from '../DayCalendarSkeleton';
import {
  type ClockClassKey,
  type ClockNumberClassKey,
  type TimeClockClassKey,
  type ClockPointerClassKey,
} from '../TimeClock';
import { type MonthCalendarClassKey } from '../MonthCalendar';
import { type PickerDayClassKey } from '../PickerDay';
import { type YearCalendarClassKey } from '../YearCalendar';
import { type PickersLayoutClassKey } from '../PickersLayout';
import { type DatePickerToolbarClassKey } from '../DatePicker';
import { type TimePickerToolbarClassKey } from '../TimePicker';
import {
  type DateTimePickerToolbarClassKey,
  type DateTimePickerTabsClassKey,
} from '../DateTimePicker';
import { type PickersArrowSwitcherClassKey } from '../internals/components/PickersArrowSwitcher';
import { type PickersToolbarClassKey } from '../internals/components/pickersToolbarClasses';
import { type PickerPopperClassKey } from '../internals/components/PickerPopper';
import { type PickersToolbarButtonClassKey } from '../internals/components/pickersToolbarButtonClasses';
import { type PickersToolbarTextClassKey } from '../internals/components/pickersToolbarTextClasses';
import { type DigitalClockClassKey } from '../DigitalClock';
import {
  type MultiSectionDigitalClockClassKey,
  type MultiSectionDigitalClockSectionClassKey,
} from '../MultiSectionDigitalClock';
import {
  type PickersTextFieldClassKey,
  type PickersInputClassKey,
  type PickersOutlinedInputClassKey,
  type PickersFilledInputClassKey,
  type PickersInputBaseClassKey,
} from '../PickersTextField';
import { type PickersSectionListClassKey } from '../PickersSectionList';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiClock: ClockClassKey;
  MuiClockNumber: ClockNumberClassKey;
  MuiClockPointer: ClockPointerClassKey;
  MuiDateCalendar: DateCalendarClassKey;
  MuiDatePickerToolbar: DatePickerToolbarClassKey;
  MuiDateTimePickerTabs: DateTimePickerTabsClassKey;
  MuiDateTimePickerToolbar: DateTimePickerToolbarClassKey;
  MuiDayCalendar: DayCalendarClassKey;
  MuiDayCalendarSkeleton: DayCalendarSkeletonClassKey;
  MuiDigitalClock: DigitalClockClassKey;
  MuiMonthCalendar: MonthCalendarClassKey;
  MuiMultiSectionDigitalClock: MultiSectionDigitalClockClassKey;
  MuiMultiSectionDigitalClockSection: MultiSectionDigitalClockSectionClassKey;
  MuiPickersArrowSwitcher: PickersArrowSwitcherClassKey;
  MuiPickersCalendarHeader: PickersCalendarHeaderClassKey;
  MuiPickerDay: PickerDayClassKey;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupClassKey;
  MuiPickersLayout: PickersLayoutClassKey;
  MuiPickerPopper: PickerPopperClassKey;
  MuiPickersSlideTransition: PickersSlideTransitionClassKey;
  MuiPickersToolbar: PickersToolbarClassKey;
  MuiPickersToolbarButton: PickersToolbarButtonClassKey;
  MuiPickersToolbarText: PickersToolbarTextClassKey;
  MuiTimeClock: TimeClockClassKey;
  MuiTimePickerToolbar: TimePickerToolbarClassKey;
  MuiYearCalendar: YearCalendarClassKey;

  // Picker's TextField
  MuiPickersTextField: PickersTextFieldClassKey;
  MuiPickersInputBase: PickersInputBaseClassKey
  MuiPickersInput: PickersInputClassKey
  MuiPickersFilledInput: PickersFilledInputClassKey
  MuiPickersOutlinedInput: PickersOutlinedInputClassKey
  MuiPickersSectionList: PickersSectionListClassKey
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
