import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const views = {
  hours: 'Stunden',
  minutes: 'Minuten',
  seconds: 'Sekunden',
};

const deDEPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Letzter Monat',
  nextMonth: 'Nächster Monat',

  // View navigation
  openPreviousView: 'Letzte Ansicht öffnen',
  openNextView: 'Nächste Ansicht öffnen',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'Jahresansicht ist geöffnet, zur Kalenderansicht wechseln'
      : 'Kalenderansicht ist geöffnet, zur Jahresansicht wechseln',

  // DateRange placeholders
  start: 'Beginn',
  end: 'Ende',

  // Action bar
  cancelButtonLabel: 'Abbrechen',
  clearButtonLabel: 'Löschen',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Heute',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${views[view]} auswählen. ${
      time === null
        ? 'Keine Zeit ausgewählt'
        : `Ausgewählte Zeit ist ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} Stunden`,
  minutesClockNumberText: (minutes) => `${minutes} Minuten`,
  secondsClockNumberText: (seconds) => `${seconds} Sekunden`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Datum auswählen, ausgewähltes Datum ist ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Datum auswählen',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Zeit auswählen, ausgewählte Zeit ist ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Zeit auswählen',

  // Table labels
  timeTableLabel: 'Zeit auswählen',
  dateTableLabel: 'Datum auswählen',
};

export const deDE = getPickersLocalization(deDEPickers);
