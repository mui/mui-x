import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const frFRPickers: Partial<PickersLocaleText<any>> = {
  previousMonth: 'Mois précédent',
  nextMonth: 'Mois suivant',
  openPreviousView: 'Ouvrir la vue précédente',
  openNextView: 'Ouvrir la vue suivante',
  cancelButtonLabel: 'Annuler',
  clearButtonLabel: 'Vider',
  okButtonLabel: 'OK',
  todayButtonLabel: "Aujourd'hui",
  start: 'Début',
  end: 'Fin',
};

export const frFR = getPickersLocalization(frFRPickers);
