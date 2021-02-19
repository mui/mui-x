/**
 * The csv export API interface that is available in the grid [[apiRef]].
 */
export interface GridCsvExportApi {
  /**
   * Get the grid data as CSV.
   * @returns string
   */
  getDataAsCsv: () => string;
  /**
   * Export the grid data as CSV.
   * @returns void
   */
  exportDataAsCsv: () => void;
}
