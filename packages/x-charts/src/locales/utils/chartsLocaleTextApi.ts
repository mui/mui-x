export interface ChartsLocaleText {
  /**
   * Title displayed in the overlay if `loading` is `true`.
   */
  loading: string;
  /**
   * Title displayed in the overlay if there is no data to display.
   */
  noData: string;
  /**
   * Tooltip text shown when hovering over the zoom in button.
   */
  zoomIn: string;
  /**
   * Tooltip text shown when hovering over the zoom out button.
   */
  zoomOut: string;
}

export type ChartsTranslationKeys = keyof ChartsLocaleText;
