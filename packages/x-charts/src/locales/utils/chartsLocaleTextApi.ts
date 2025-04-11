export interface ChartsLocaleText {
  /**
   * Title displayed in the overlay if `loading` is `true`.
   */
  loading: string;
  /**
   * Title displayed in the overlay if their is no data to display.
   */
  noData: string;
}

export type ChartsTranslationKeys = keyof ChartsLocaleText;
