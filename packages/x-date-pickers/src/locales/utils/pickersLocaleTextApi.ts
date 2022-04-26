/**
 * Set the types of the texts in the grid.
 */
export interface PickersLocaleText {
  previousMonth: string;
  nextMonth: string;
  openPreviousView: string;
  openNextView: string;
  cancel: string;
  clear: string;
  ok: string;
  today: string;
  start: string;
  end: string;
}

export type PickersTranslationKeys = keyof PickersLocaleText;
