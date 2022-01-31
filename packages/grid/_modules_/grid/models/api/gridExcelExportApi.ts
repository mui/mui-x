import type { Workbook } from 'exceljs';
import { GridExcelExportOptions } from '../gridExport';

/**
 * The excel export API interface that is available in the grid [[apiRef]].
 */
export interface GridExcelExportApi {
  /**
   * Returns the grid data as an exceljs workbook.
   * This method is used internally by `exportDataAsExcel`.
   * @param {GridExcelExportOptions} options The options to apply on the export.
   * @returns {any} The data in a exceljs workbook object.
   */
  getDataAsExcel: (options?: GridExcelExportOptions) => Promise<Workbook>;
  /**
   * Downloads and exports a excel of the grid's data.
   * @param {GridExcelExportOptions} options The options to apply on the export.
   */
  exportDataAsExcel: (options?: GridExcelExportOptions) => void;
}
