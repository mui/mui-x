import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'le ore',
  minutes: 'i minuti',
  seconds: 'i secondi',
  meridiem: 'il meridiano',
};

const itITPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Mese precedente',
  nextMonth: 'Mese successivo',

  // View navigation
  openPreviousView: 'Apri la vista precedente',
  openNextView: 'Apri la vista successiva',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? "la vista dell'anno è aperta, passare alla vista del calendario"
      : "la vista dell'calendario è aperta, passare alla vista dell'anno",

  // DateRange labels
  start: 'Inizio',
  end: 'Fine',
  startDate: 'Data di inizio',
  startTime: 'Ora di inizio',
  endDate: 'Data di fine',
  endTime: 'Ora di fine',

  // Action bar
  cancelButtonLabel: 'Cancellare',
  clearButtonLabel: 'Sgomberare',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Oggi',

  // Toolbar titles
  datePickerToolbarTitle: 'Seleziona data',
  dateTimePickerToolbarTitle: 'Seleziona data e orario',
  timePickerToolbarTitle: 'Seleziona orario',
  dateRangePickerToolbarTitle: 'Seleziona intervallo di date',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Seleziona ${views[view]}. ${!formattedTime ? 'Nessun orario selezionato' : `L'ora selezionata è ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} ore`,
  minutesClockNumberText: (minutes) => `${minutes} minuti`,
  secondsClockNumberText: (seconds) => `${seconds} secondi`,

  // Digital clock labels
  selectViewText: (view) => `Seleziona ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Numero settimana',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Settimana ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Scegli la data, la data selezionata è ${formattedDate}` : 'Scegli la data',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Scegli l'ora, l'ora selezionata è ${formattedTime}` : "Scegli l'ora",
  fieldClearLabel: 'Cancella valore',

  // Table labels
  timeTableLabel: "scegli un'ora",
  dateTableLabel: 'scegli una data',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'A'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'GG',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'GGGG' : 'GG'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Anno',
  month: 'Mese',
  day: 'Giorno',
  weekDay: 'Giorno della settimana',
  hours: 'Ore',
  minutes: 'Minuti',
  seconds: 'Secondi',
  meridiem: 'Meridiano',

  // Common
  empty: 'Vuoto',
};

export const itIT = getPickersLocalization(itITPickers);
