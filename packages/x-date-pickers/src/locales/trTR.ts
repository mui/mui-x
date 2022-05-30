import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

// This object is not Partial<PickersLocaleText> because it is the default values
const trTRPickers: PickersLocaleText = {
  previousMonth: 'Önceki ay',
  nextMonth: 'Sonraki ay',
  openPreviousView: 'sonraki görünüm',
  openNextView: 'önceki görünüm',
  cancelButtonLabel: 'iptal',
  clearButtonLabel: 'Temizle',
  okButtonLabel: 'Tamam',
  todayButtonLabel: 'Bugün',
  start: 'Başlangıç',
  end: 'Bitiş',
};

export const trTR = getPickersLocalization(trTRPickers);
