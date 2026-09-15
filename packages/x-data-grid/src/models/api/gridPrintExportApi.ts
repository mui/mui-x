import type { GridPrintExportOptions } from '../gridExport';

/**
 * The Print export API interface that is available in the grid [[apiRef]].
 */
export interface GridPrintExportApi {
  /**
   * Print the grid's data.
   * @param {GridPrintExportOptions} options The options to apply on the export.
   * @returns {Promise<void>} A promise that resolves once the print dialog is opened, and rejects if the print fails, for example when `onStylesheetError` stops it.
   */
  exportDataAsPrint: (options?: GridPrintExportOptions) => Promise<void>;
}
