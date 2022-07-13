import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

// This object is not Partial<PickersLocaleText> because it is the default values

const nbNOPickers: PickersLocaleText<any> = {
  // Calendar navigation
  previousMonth: 'Forrige måned',
  nextMonth: 'Neste måned',

  // View navigation
  openPreviousView: 'åpne forrige visning',
  openNextView: 'åpne neste visning',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'årsvisning er åpen, bytt til kalendervisning'
      : 'kalendervisning er åpen, bytt til årsvisning',

  // DateRange placeholders
  start: 'Start',
  end: 'Slutt',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Nullstill',
  okButtonLabel: 'OK',
  todayButtonLabel: 'I dag',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Velg ${view}. ${
      time === null ? 'Ingen tid valgt' : `Valgt tid er ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} timer`,
  minutesClockNumberText: (minutes) => `${minutes} minutter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Velg dato, valgt dato er ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Velg dato',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Velg tid, valgt tid er ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Velg tid',

  // Table labels
  timeTableLabel: 'velg tid',
  dateTableLabel: 'velg dato',
};

export const nbNO = getPickersLocalization(nbNOPickers);
