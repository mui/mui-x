import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

// maps TimeView to its translation
const timeViews = {
  hours: 'Óra',
  minutes: 'Perc',
  seconds: 'Másodperc',
};

// maps PickersToolbar["viewType"] to its translation
const pickerViews = {
  calendar: 'naptár',
  clock: 'óra',
};

const huHUPickers: PickersLocaleText<any> = {
  // Calendar navigation
  previousMonth: 'Előző hónap',
  nextMonth: 'Következő hónap',

  // View navigation
  openPreviousView: 'Előző nézet megnyitása',
  openNextView: 'Következő nézet megnyitása',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'az évválasztó már nyitva, váltson a naptárnézetre'
      : 'a naptárnézet már nyitva, váltson az évválasztóra',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) =>
    isKeyboardInputOpen
      ? `szöveges beviteli nézet aktív, váltás ${pickerViews[viewType]} nézetre`
      : `${pickerViews[viewType]} beviteli nézet aktív, váltás szöveges beviteli nézetre`,

  // DateRange placeholders
  start: 'Kezdő dátum',
  end: 'Záró dátum',

  // Action bar
  cancelButtonLabel: 'Mégse',
  clearButtonLabel: 'Törlés',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Ma',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'Dátum kiválasztása',
  dateTimePickerDefaultToolbarTitle: 'Dátum és idő kiválasztása',
  timePickerDefaultToolbarTitle: 'Idő kiválasztása',
  dateRangePickerDefaultToolbarTitle: 'Dátumhatárok kiválasztása',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${timeViews[view] ?? view} kiválasztása. ${
      time === null
        ? 'Nincs kiválasztva idő'
        : `A kiválasztott idő ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} ${timeViews.hours.toLowerCase()}`,
  minutesClockNumberText: (minutes) => `${minutes} ${timeViews.minutes.toLowerCase()}`,
  secondsClockNumberText: (seconds) => `${seconds}  ${timeViews.seconds.toLowerCase()}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Válasszon dátumot, a kiválasztott dátum: ${utils.format(value, 'fullDate')}`
      : 'Válasszon dátumot',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Válasszon időt, a kiválasztott idő: ${utils.format(value, 'fullTime')}`
      : 'Válasszon időt',

  // Table labels
  timeTableLabel: 'válasszon időt',
  dateTableLabel: 'válasszon dátumot',
};

export const huHU = getPickersLocalization(huHUPickers);
