import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

// This object is not Partial<PickersLocaleText> because it is the default values
const enUSPickers: PickersLocaleText<any> = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  openPreviousView: 'open previous view',
  openNextView: 'open next view',
  cancelButtonLabel: 'Cancel',
  clearButtonLabel: 'Clear',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Today',
  start: 'Start',
  end: 'End',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'year view is open, switch to calendar view'
      : 'calendar view is open, switch to year view',
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null ? 'No time selected' : `Selected time is ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} hours`,
  minutesClockNumberText: (minutes) => `${minutes} minutes`,
  secondsClockNumberText: (seconds) => `${seconds} seconds`,
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Choose date, selected date is ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Choose date',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Choose time, selected time is ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Choose time',
  timeTableLabel: 'pick time',
  dateTableLabel: 'pick date',
};

export const DEFAULT_LOCALE = enUSPickers;

export const enUS = getPickersLocalization(enUSPickers);
