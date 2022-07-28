import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

// maps ClockPickerView to its translation
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
    `${views[view] ?? view} auswählen. ${
      time === null
        ? 'Keine Uhrzeit ausgewählt'
        : `Gewählte Uhrzeit ist ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} ${views.hours}`,
  minutesClockNumberText: (minutes) => `${minutes} ${views.minutes}`,
  secondsClockNumberText: (seconds) => `${seconds}  ${views.seconds}`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Datum auswählen, gewähltes Datum ist ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Datum auswählen',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Uhrzeit auswählen, gewählte Uhrzeit ist ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Uhrzeit auswählen',

  // Table labels
  timeTableLabel: 'Uhrzeit auswählen',
  dateTableLabel: 'Datum auswählen',
};

export const deDE = getPickersLocalization(deDEPickers);
