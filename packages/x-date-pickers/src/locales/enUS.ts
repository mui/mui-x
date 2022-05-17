import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

// This object is not Partial<PickersLocaleText> because it is the default values
const enUSPickers: PickersLocaleText = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  openPreviousView: 'open previous view',
  openNextView: 'open next view',
  cancelButtonLabel: 'Cancel',
  clearButtonLabel: 'Clear',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Today',
  start: 'Start',
  end: 'End',
};

export const DEFAULT_LOCALE = enUSPickers;

export const enUS = getPickersLocalization(enUSPickers);
