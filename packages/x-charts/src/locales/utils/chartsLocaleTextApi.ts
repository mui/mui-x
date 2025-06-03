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
  /**
   * Text for the export button tooltip in the toolbar.
   */
  toolbarExport: string;
  /**
   * Text for the print button in the toolbar's export menu.
   */
  toolbarExportPrint: string;
  /**
   * Text for the "Export as PNG" button in the toolbar's export menu.
   */
  toolbarExportPng: string;
}

export type ChartsTranslationKeys = keyof ChartsLocaleText;
