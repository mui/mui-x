/**
 * The options to apply on the CSV export.
 */
export interface GridExportCsvOptions {
  fileName?: string;
  utf8WithBom?: boolean;
}

/**
 * Available export formats.
 */
export type GridExportFormat = 'csv';
