import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const views = {
  hours: 'heures',
  minutes: 'minutes',
  seconds: 'secondes',
};

const frFRPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Mois précédent',
  nextMonth: 'Mois suivant',

  // View navigation
  openPreviousView: 'Ouvrir la vue précédente',
  openNextView: 'Ouvrir la vue suivante',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'La vue année est ouverte, ouvrir la vue calendrier'
      : 'La vue calendrier est ouverte, ouvrir la vue année',

  // DateRange placeholders
  start: 'Début',
  end: 'Fin',

  // Action bar
  cancelButtonLabel: 'Annuler',
  clearButtonLabel: 'Vider',
  okButtonLabel: 'OK',
  todayButtonLabel: "Aujourd'hui",

  // Toolbar titles
  // datePickerToolbarTitle: 'Select date',
  // dateTimePickerToolbarTitle: 'Select date & time',
  // timePickerToolbarTitle: 'Select time',
  // dateRangePickerToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Choix des ${views[view]}. ${
      time === null
        ? 'Aucune heure choisie'
        : `L'heure choisie est ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} heures`,
  minutesClockNumberText: (minutes) => `${minutes} minutes`,
  secondsClockNumberText: (seconds) => `${seconds} secondes`,

  // Calendar labels
  // calendarWeekNumberHeaderLabel: 'Week number',
  // calendarWeekNumberHeaderText: '#',
  // calendarWeekNumberAriaLabelText: weekNumber => `Week ${weekNumber}`,
  // calendarWeekNumberText: weekNumber => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Choisir la date, la date sélectionnée est ${utils.format(value, 'fullDate')}`
      : 'Choisir la date',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Choisir l'heure, l'heure sélectionnée est ${utils.format(value, 'fullTime')}`
      : "Choisir l'heure",

  // Table labels
  timeTableLabel: "choix de l'heure",
  dateTableLabel: 'choix de la date',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const frFR = getPickersLocalization(frFRPickers);
