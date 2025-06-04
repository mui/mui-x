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
   * Text for an "Export as {image type}" button in the toolbar's export menu.
   * The only format supported in all browsers is 'image/png'.
   *
   * @param {string} mimeType The MIME type of the image to export, e.g., 'image/png'.
   * @returns {string} The localized string for an export image button.
   */
  toolbarExportImage: (mimeType: 'image/png' | string) => string;
}

export type ChartsTranslationKeys = keyof ChartsLocaleText;
