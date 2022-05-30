import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const deDEPickers: Partial<PickersLocaleText<any>> = {
  previousMonth: 'Letzter Monat',
  nextMonth: 'Nächster Monat',
  openPreviousView: 'Letzte Ansicht öffnen',
  openNextView: 'Nächste Ansicht öffnen',
  cancelButtonLabel: 'Abbrechen',
  clearButtonLabel: 'Löschen',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Heute',
  start: 'Beginn',
  end: 'Ende',
};

export const deDE = getPickersLocalization(deDEPickers);
