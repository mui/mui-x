import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

// This object is not Partial<PickersLocaleText> because it is the default values

const csCSPickers: PickersLocaleText<any> = {
  // Calendar navigation
  previousMonth: 'Další měsíc',
  nextMonth: 'Předchozí month',

  // View navigation
  openPreviousView: 'otevřít předchozí zobrazení', // 🆗
  openNextView: 'otevřít další zobrazení', // 🆗
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'roční zobrazení otevřeno, přepněte do zobrazení kalendáře' // 🆗
      : 'zobrazení kalendáře otevřeno, přepněte do zobrazení roku', // 🆗

  // DateRange placeholders
  start: 'Začátek',
  end: 'Konec',

  // Action bar
  cancelButtonLabel: 'Zrušit',
  clearButtonLabel: 'Vymazat',
  okButtonLabel: 'Potvrdit',
  todayButtonLabel: 'Dnes',

  // Toolbar titles
  datePickerToolbarTitle: 'Vyberte datum',
  dateTimePickerToolbarTitle: 'Vyberte datum a čas',
  timePickerToolbarTitle: 'Vyberte čas',
  dateRangePickerToolbarTitle: 'Vyberete rozmezí dat',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Vyberte ${view}. ${
      time === null ? 'Není vybrán čas' : `Vybraný čas je ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} hodin`,
  minutesClockNumberText: (minutes) => `${minutes} minut`,
  secondsClockNumberText: (seconds) => `${seconds} sekund`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Týden v roce',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber} týden v roce`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

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

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
};

export const csCS = getPickersLocalization(csCSPickers);