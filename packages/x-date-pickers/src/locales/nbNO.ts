import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';
import { DEFAULT_FIELD_PLACEHOLDERS } from './utils/defaultLocaleHelpers';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'timer',
  minutes: 'minutter',
  seconds: 'sekunder',
  meridiem: 'meridiem',
};

const nbNOPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Forrige måned',
  nextMonth: 'Neste måned',

  // View navigation
  openPreviousView: 'Åpne forrige visning',
  openNextView: 'Åpne neste visning',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'årsvisning er åpen, bytt til kalendervisning'
      : 'kalendervisning er åpen, bytt til årsvisning',

  // DateRange labels
  start: 'Start',
  end: 'Slutt',
  startDate: 'Startdato',
  startTime: 'Starttid',
  endDate: 'Sluttdato',
  endTime: 'Slutttid',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Fjern',
  okButtonLabel: 'OK',
  todayButtonLabel: 'I dag',
  nextStepButtonLabel: 'Neste',

  // Toolbar titles
  datePickerToolbarTitle: 'Velg dato',
  dateTimePickerToolbarTitle: 'Velg dato & klokkeslett',
  timePickerToolbarTitle: 'Velg klokkeslett',
  dateRangePickerToolbarTitle: 'Velg datoperiode',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Velg ${timeViews[view]}. ${!formattedTime ? 'Ingen tid valgt' : `Valgt tid er ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} timer`,
  minutesClockNumberText: (minutes) => `${minutes} minutter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Digital clock labels
  selectViewText: (view) => `Velg ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Ukenummer',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Uke ${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Velg dato, valgt dato er ${formattedDate}` : 'Velg dato',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Velg tid, valgt tid er ${formattedTime}` : 'Velg tid',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Slett',

  // Table labels
  timeTableLabel: 'velg tid',
  dateTableLabel: 'velg dato',

  // Field section placeholders
  ...DEFAULT_FIELD_PLACEHOLDERS,
  fieldYearPlaceholder: (params) => 'Å'.repeat(params.digitAmount),
  fieldHoursPlaceholder: () => 'tt',

  // View names
  year: 'År',
  month: 'Måned',
  day: 'Dag',
  weekDay: 'Ukedag',
  hours: 'Timer',
  minutes: 'Minutter',
  seconds: 'Sekunder',
  meridiem: 'Meridiem',

  // Common
  empty: 'Tøm',
};

export const nbNO = getPickersLocalization(nbNOPickers);
