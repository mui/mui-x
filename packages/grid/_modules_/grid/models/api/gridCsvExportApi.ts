import { GridExportCsvOptions } from '../gridExport';

/**
 * The CSV export API interface that is available in the grid [[apiRef]].
 */
export interface GridCsvExportApi {
  /**
   * Returns the grid data as a CSV string.
   * This method is used internally by `exportDataAsCsv`.
   * @params GridExportCsvOptions The options to apply on the export.
   * @returns string
   */
  getDataAsCsv: (options?: GridExportCsvOptions) => string;
  /**
   * Downloads and exports a CSV of the grid's data.
   * @params GridExportCsvOptions The options to apply on the export.
   * @returns void
   */
  exportDataAsCsv: (options?: GridExportCsvOptions) => void;
}
