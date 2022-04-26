import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const enUSPickers: Partial<PickersLocaleText> = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  openPreviousView: 'open previous view',
  openNextView: 'open next view',
  cancel: 'Cancel',
  clear: 'Clear',
  ok: 'OK',
  today: 'Today',
  start: 'Start',
  end: 'End',
};

export const enUS = getPickersLocalization(enUSPickers);
