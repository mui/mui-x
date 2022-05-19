import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const frFRPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Mois précédent',
  nextMonth: 'Mois suivant',

  // View navigation
  openPreviousView: 'Ouvrir la vue précédente',
  openNextView: 'Ouvrir la vue suivante',

  // DateRange placeholders
  start: 'Début',
  end: 'Fin',

  // Action bar
  cancelButtonLabel: 'Annuler',
  clearButtonLabel: 'Vider',
  okButtonLabel: 'OK',
  todayButtonLabel: "Aujourd'hui",
};

export const frFR = getPickersLocalization(frFRPickers);
