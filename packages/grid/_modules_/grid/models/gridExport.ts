/**
 * The options to apply on the CSV export.
 */
export interface GridCsvExportOptions {
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
   * The columns exported in the CSV.
   * This should only be used if you want to restrict the columns exports.
   */
  fields?: string[];
  /**
   * If `true`, the hidden columns will also be exported.
   * @default false
   */
  allColumns?: boolean;
  /**
   * If `true, the first row of the CSV will include the headers of the grid.
   * @default true
   */
  includeHeaders?: boolean;
}

/**
 * The options to apply on the Print export.
 */
export interface GridPrintExportOptions {
  /**
   * The value to be used as the print window title.
   * @default The title of the page.
   */
  fileName?: string;
  /**
   * The columns to be printed.
   * This should only be used if you want to restrict the columns exported.
   */
  fields?: string[];
  /**
   * If `true`, the hidden columns will also be printed.
   * @default false
   */
  allColumns?: boolean;
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
