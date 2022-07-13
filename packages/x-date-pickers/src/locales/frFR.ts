import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

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
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
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

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Choisir la date, la date sélectionnée est ${utils.format(
          utils.date(rawValue)!,
          'fullDate',
        )}`
      : 'Choisir la date',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Choisir l'heure, l'heure sélectionnée est ${utils.format(
          utils.date(rawValue)!,
          'fullTime',
        )}`
      : "Choisir l'heure",

  // Table labels
  timeTableLabel: "choix de l'heure",
  dateTableLabel: 'choix de la date',
};

export const frFR = getPickersLocalization(frFRPickers);
