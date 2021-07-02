/**
 * Available CSV delimiter characters used to separate fields.
 */
export type GridExportCsvDelimiter = string;

/**
 * The options to apply on the CSV export.
 */
export interface GridExportCsvOptions {
  /**
   * The character used to separate fields.
   * @default ','
   */
  delimiter?: GridExportCsvDelimiter;
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
}

/**
 * Available export formats.
 */
export type GridExportFormat = 'csv';
