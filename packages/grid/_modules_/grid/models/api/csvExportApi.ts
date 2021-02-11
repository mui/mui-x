/**
 * The csv export API interface that is available in the grid [[apiRef]].
 */
export interface CsvExportApi {
  /**
   * Export the grid data as CSV.
   * @returns void
   */
  exportDataAsCsv: () => void;
  /**
   * Get the grid data as CSV.
   * @returns
   */
  getDataAsCsv: () => any;
}
