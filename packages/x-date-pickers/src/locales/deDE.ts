import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

// maps ClockPickerView to its translation
const clockViews = {
  hours: 'Stunden',
  minutes: 'Minuten',
  seconds: 'Sekunden',
};

// maps PickersToolbar["viewType"] to its translation
const pickerViews = {
  calendar: 'Kalenderansicht',
  clock: 'Uhransicht',
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
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') =>
    isKeyboardInputOpen
      ? `Texteingabeansicht ist geöffnet, zur ${pickerViews[viewType]} wechseln`
      : `${pickerViews[viewType]} ist geöffnet, zur Texteingabeansicht wechseln`,

  // DateRange placeholders
  start: 'Beginn',
  end: 'Ende',

  // Action bar
  cancelButtonLabel: 'Abbrechen',
  clearButtonLabel: 'Löschen',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Heute',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'Datum auswählen',
  dateTimePickerDefaultToolbarTitle: 'Datum & Uhrzeit auswählen',
  timePickerDefaultToolbarTitle: 'Uhrzeit auswählen',
  dateRangePickerDefaultToolbarTitle: 'Datumsbereich auswählen',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${clockViews[view] ?? view} auswählen. ${
      time === null
        ? 'Keine Uhrzeit ausgewählt'
        : `Gewählte Uhrzeit ist ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} ${clockViews.hours}`,
  minutesClockNumberText: (minutes) => `${minutes} ${clockViews.minutes}`,
  secondsClockNumberText: (seconds) => `${seconds}  ${clockViews.seconds}`,

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
