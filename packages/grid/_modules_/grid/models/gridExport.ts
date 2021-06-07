/**
 * Available CSV delimiter characters.
 * @default ','
 */
export type CsvDelimiterCharacter = ',' | ';';

/**
 * The options to apply on the CSV export.
 */
export interface GridExportCsvOptions {
  fileName?: string;
  utf8WithBom?: boolean;
  delimiter?: CsvDelimiterCharacter;
}

/**
 * Available export formats.
 */
export type GridExportFormat = 'csv';
