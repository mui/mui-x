import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

// This object is not Partial<PickersLocaleText> because it is the default values

// maps TimeView to its translation
const timeViews = {
  hours: 'Hodiny',
  minutes: 'Minuty',
  seconds: 'Sekundy',
};

const csCZPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Další měsíc',
  nextMonth: 'Předchozí month',

  // View navigation
  openPreviousView: 'otevřít předchozí zobrazení',
  openNextView: 'otevřít další zobrazení',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'roční zobrazení otevřeno, přepněte do zobrazení kalendáře'
      : 'zobrazení kalendáře otevřeno, přepněte do zobrazení roku',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: 'Začátek',
  end: 'Konec',

  // Action bar
  cancelButtonLabel: 'Zrušit',
  clearButtonLabel: 'Vymazat',
  okButtonLabel: 'Potvrdit',
  todayButtonLabel: 'Dnes',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'Vyberte datum',
  dateTimePickerDefaultToolbarTitle: 'Vyberte datum a čas',
  timePickerDefaultToolbarTitle: 'Vyberte čas',
  dateRangePickerDefaultToolbarTitle: 'Vyberete rozmezí dat',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${timeViews[view] ?? view} vybrány. ${
      time === null ? 'Není vybrán čas' : `Vybraný čas je ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} hodin`,
  minutesClockNumberText: (minutes) => `${minutes} minut`,
  secondsClockNumberText: (seconds) => `${seconds} sekund`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Vybrané datum, vybrané datum je ${utils.format(value, 'fullDate')}`
      : 'Vyberte datum',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Vybrané čas, vybraný čas je ${utils.format(value, 'fullTime')}`
      : 'Vyberte čas',

  // Table labels
  timeTableLabel: 'vyberte čas',
  dateTableLabel: 'vyberte datum',
};

export const csCZ = getPickersLocalization(csCZPickers);
