import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

// This object is not Partial<PickersLocaleText> because it is the default values
const enUSPickers: PickersLocaleText = {
  // Calendar navigation
  previousMonth: 'Previous month',
  nextMonth: 'Next month',

  // View navigation
  openPreviousView: 'open previous view',
  openNextView: 'open next view',

  // DateRange placeholders
  start: 'Start',
  end: 'End',

  // Action bar
  cancelButtonLabel: 'Cancel',
  clearButtonLabel: 'Clear',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Today',
};

export const DEFAULT_LOCALE = enUSPickers;

export const enUS = getPickersLocalization(enUSPickers);
