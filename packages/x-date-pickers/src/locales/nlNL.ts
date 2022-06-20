import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const nlNLPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Vorige maand',
  nextMonth: 'Volgende maand',

  // View navigation
  openPreviousView: 'open vorige view',
  openNextView: 'open volgende view',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'jaarweergave is geopend, schakel over naar kalenderweergave'
      : 'kalenderweergave is geopend, switch naar jaarweergave',

  // DateRange placeholders
  start: 'Start',
  end: 'Einde',

  // Action bar
  cancelButtonLabel: 'Annuleren',
  clearButtonLabel: 'Resetten',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Vandaag',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Selecteer ${view}. ${
      time === null
        ? 'Geen tijd geselecteerd'
        : `Geselecteerde tijd is ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} uren`,
  minutesClockNumberText: (minutes) => `${minutes} minuten`,
  secondsClockNumberText: (seconds) => `${seconds} seconden`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Kies datum, geselecteerde datum is ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Kies datum',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Kies tijd, geselecteerde tijd is ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Kies tijd',

  // Table labels
  timeTableLabel: 'kies tijd',
  dateTableLabel: 'kies datum',
};

export const nlNL = getPickersLocalization(nlNLPickers);
