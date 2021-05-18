import { GridExportCsvOptions } from '../gridExport';

/**
 * The csv export API interface that is available in the grid [[apiRef]].
 */
export interface GridCsvExportApi {
  /**
   * Returns the grid data formatted as CSV.
   * @returns {string} The data as CSV.
   */
  getDataAsCsv: () => string;
  /**
   * Exports the grid data as CSV and sends it to the user.
   */
  exportDataAsCsv: (options?: GridExportCsvOptions, fileName?: string) => void;
}
