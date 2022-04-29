/**
 * Set the types of the texts in the grid.
 */
export interface PickersLocaleText {
  previousMonth: string;
  nextMonth: string;
  openPreviousView: string;
  openNextView: string;
  cancelButtonLabel: string;
  clearButtonLabel: string;
  okButtonLabel: string;
  todayButtonLabel: string;
  start: string;
  end: string;
}

export type PickersTranslationKeys = keyof PickersLocaleText;
