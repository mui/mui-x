import type * as Excel from 'exceljs';
import {
  GridFileExportOptions,
  GridExportFormat as GridExportFormatCommunity,
  GridExportExtension as GridExportExtensionCommunity,
  GridToolbarExportProps as GridToolbarExportPropsCommunity,
  GridExportDisplayOptions,
} from '@mui/x-data-grid-pro';

export type GridExportFormat = GridExportFormatCommunity | 'excel';
export type GridExportExtension = GridExportExtensionCommunity | 'xlsx';

export interface GridExceljsProcessInput {
  workbook: Excel.Workbook;
  worksheet: Excel.Worksheet;
}

export interface ColumnsStylesInterface {
  [field: string]: Partial<Excel.Style>;
}

/**
 * The options to apply on the Excel export.
 * @demos
 *   - [Excel export](/x/react-data-grid/export/#excel-export)
 */
export interface GridExcelExportOptions extends GridFileExportOptions {
  /**
   * Function to return the Worker instance to be called.
   * @returns {() => Worker} A Worker instance.
   */
  worker?: () => Worker;
  /**
   * Name given to the worksheet containing the columns valueOptions.
   * valueOptions are added to this worksheet if they are provided as an array.
   */
  valueOptionsSheetName?: string;
  /**
   * Method called before adding the rows to the workbook.
   * Not supported when `worker` is set.
   * To use with web workers, use the option in `setupExcelExportWebWorker`.
   * @param {GridExceljsProcessInput} processInput object containing the workbook and the worksheet.
   * @returns {Promise<void>} A promise which resolves after processing the input.
   * */
  exceljsPreProcess?: (processInput: GridExceljsProcessInput) => Promise<void>;
  /**
   * Method called after adding the rows to the workbook.
   * Not supported when `worker` is set.
   * To use with web workers, use the option in `setupExcelExportWebWorker`.
   * @param {GridExceljsProcessInput} processInput object containing the workbook and the worksheet.
   * @returns {Promise<void>} A promise which resolves after processing the input.
   * */
  exceljsPostProcess?: (processInput: GridExceljsProcessInput) => Promise<void>;
  /**
   * Object mapping column field to Exceljs style
   * */
  columnsStyles?: ColumnsStylesInterface;
  /**
   * If `true`, the headers of the column groups will be added into the file.
   * @default true
   */
  includeColumnGroupsHeaders?: boolean;
}

export interface GridToolbarExportProps extends GridToolbarExportPropsCommunity {
  excelOptions: GridExcelExportOptions & GridExportDisplayOptions;
}

/**
 * The excel export API interface that is available in the grid [[apiRef]].
 */
export interface GridExcelExportApi {
  /**
   * Returns the grid data as an exceljs workbook.
   * This method is used internally by `exportDataAsExcel`.
   * @param {GridExcelExportOptions} options The options to apply on the export.
   * @returns {Promise<Excel.Workbook>} The data in a exceljs workbook object.
   */
  getDataAsExcel: (options?: GridExcelExportOptions) => Promise<Excel.Workbook> | null;
  /**
   * Downloads and exports an Excel file of the grid's data.
   * @param {GridExcelExportOptions} options The options to apply on the export.
   * @returns {Promise<void>} A promise which resolves after exporting to Excel.
   */
  exportDataAsExcel: (options?: GridExcelExportOptions) => Promise<void>;
}
