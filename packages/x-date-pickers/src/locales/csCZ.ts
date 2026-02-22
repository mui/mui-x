import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';
import { DEFAULT_FIELD_PLACEHOLDERS } from './utils/defaultLocaleHelpers';

// maps TimeView to its translation
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'Hodiny',
  minutes: 'Minuty',
  seconds: 'Sekundy',
  meridiem: 'Odpoledne',
};

const csCZPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Předchozí měsíc',
  nextMonth: 'Další měsíc',

  // View navigation
  openPreviousView: 'Otevřít předchozí zobrazení',
  openNextView: 'Otevřít další zobrazení',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'roční zobrazení otevřeno, přepněte do zobrazení kalendáře'
      : 'zobrazení kalendáře otevřeno, přepněte do zobrazení roku',

  // DateRange labels
  start: 'Začátek',
  end: 'Konec',
  startDate: 'Datum začátku',
  startTime: 'Čas začátku',
  endDate: 'Datum konce',
  endTime: 'Čas konce',

  // Action bar
  cancelButtonLabel: 'Zrušit',
  clearButtonLabel: 'Vymazat',
  okButtonLabel: 'Potvrdit',
  todayButtonLabel: 'Dnes',
  nextStepButtonLabel: 'Další',

  // Toolbar titles
  datePickerToolbarTitle: 'Vyberte datum',
  dateTimePickerToolbarTitle: 'Vyberte datum a čas',
  timePickerToolbarTitle: 'Vyberte čas',
  dateRangePickerToolbarTitle: 'Vyberte rozmezí dat',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `${timeViews[view] ?? view} vybrány. ${!formattedTime ? 'Není vybrán čas' : `Vybraný čas je ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} hodin`,
  minutesClockNumberText: (minutes) => `${minutes} minut`,
  secondsClockNumberText: (seconds) => `${seconds} sekund`,

  // Digital clock labels
  selectViewText: (view) => `Vyberte ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Týden v roce',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber} týden v roce`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Vyberte datum, vybrané datum je ${formattedDate}` : 'Vyberte datum',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Vyberte čas, vybraný čas je ${formattedTime}` : 'Vyberte čas',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Vymazat',

  // Table labels
  timeTableLabel: 'vyberte čas',
  dateTableLabel: 'vyberte datum',

  // Field section placeholders
  ...DEFAULT_FIELD_PLACEHOLDERS,
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),

  // View names
  year: 'Rok',
  month: 'Měsíc',
  day: 'Den',
  weekDay: 'Pracovní den',
  hours: 'Hodiny',
  minutes: 'Minuty',
  seconds: 'Sekundy',
  meridiem: 'Odpoledne',

  // Common
  empty: 'Prázdný',
};

export const csCZ = getPickersLocalization(csCZPickers);
