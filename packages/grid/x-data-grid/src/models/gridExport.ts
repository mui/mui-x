import * as React from 'react';
import { GridRowId } from './gridRows';
import type { GridApiCommon } from './api';
import type { GridApiCommunity } from './api/gridApiCommunity';

/**
 * The options applicable to any export format.
 */
export interface GridExportOptions {
  /**
   * The columns exported.
   * This should only be used if you want to restrict the columns exports.
   */
  fields?: string[];
  /**
   * If `true`, the hidden columns will also be exported.
   * @default false
   */
  allColumns?: boolean;
}

/**
 * The options applicable to any document export format (CSV and Excel).
 */
export interface GridFileExportOptions<Api extends GridApiCommon = GridApiCommunity>
  extends GridExportOptions {
  /**
   * The string used as the file name.
   * @default `document.title`
   */
  fileName?: string;
  /**
   * If `true`, the first row of the file will include the headers of the grid.
   * @default true
   */
  includeHeaders?: boolean;
  /**
   * Function that returns the id of the rows to export on the order they should be exported.
   * @param {GridGetRowsToExportParams} params With all properties from [[GridGetRowsToExportParams]].
   * @returns {GridRowId[]} The id of the rows to export.
   */
  getRowsToExport?: (params: GridGetRowsToExportParams<Api>) => GridRowId[];
}

export interface GridGetRowsToExportParams<Api extends GridApiCommon = GridApiCommunity> {
  /**
   * The API of the grid.
   */
  apiRef: React.MutableRefObject<Api>;
}

export interface GridCsvGetRowsToExportParams<Api extends GridApiCommon = GridApiCommunity>
  extends GridGetRowsToExportParams<Api> {}

/**
 * The options to apply on the CSV export.
 * @demos
 *   - [CSV export](/x/react-data-grid/export/#csv-export)
 */
export interface GridCsvExportOptions extends GridFileExportOptions {
  /**
   * The character used to separate fields.
   * @default ','
   */
  delimiter?: string;
  /**
   * The string used as the file name.
   * @default `document.title`
   */
  fileName?: string;
  /**
   * If `true`, the UTF-8 Byte Order Mark (BOM) prefixes the exported file.
   * This can allow Excel to automatically detect file encoding as UTF-8.
   * @default false
   */
  utf8WithBom?: boolean;
  /**
   * If `true`, the CSV will include the column headers and column groups.
   * Use `includeColumnGroupsHeaders` to control whether the column groups are included.
   * @default true
   */
  includeHeaders?: boolean;
  /**
   * If `true`, the CSV will include the column groups.
   * @see See {@link https://mui.com/x/react-data-grid/column-groups/ column groups docs} for more details.
   * @default true
   */
  includeColumnGroupsHeaders?: boolean;
  /**
   * Function that returns the id of the rows to export on the order they should be exported.
   * @param {GridCsvGetRowsToExportParams} params With all properties from [[GridCsvGetRowsToExportParams]].
   * @returns {GridRowId[]} The id of the rows to export.
   */
  getRowsToExport?: (params: GridCsvGetRowsToExportParams) => GridRowId[];
}

/**
 * The options to apply on the Print export.
 * @demos
 *   - [Print export](/x/react-data-grid/export/#print-export)
 */
export interface GridPrintExportOptions extends GridExportOptions {
  /**
   * The value to be used as the print window title.
   * @default The title of the page.
   */
  fileName?: string;
  /**
   * If `true`, the toolbar is removed for when printing.
   * @default false
   */
  hideToolbar?: boolean;
  /**
   * If `true`, the footer is removed for when printing.
   * @default false
   */
  hideFooter?: boolean;
  /**
   * If `false`, all <style> and <link type="stylesheet" /> tags from the <head> will not be copied
   * to the print window.
   * @default true
   */
  copyStyles?: boolean;
  /**
   * One or more classes passed to the print window.
   */
  bodyClassName?: string;
  /**
   * Provide Print specific styles to the print window.
   */
  pageStyle?: string | Function;
}

/**
 * Available export formats.
 */
export type GridExportFormat = 'csv' | 'print';

/**
 * Available export extensions.
 */
export type GridExportExtension = 'csv';
