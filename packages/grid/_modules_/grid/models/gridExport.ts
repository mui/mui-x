/**
 * Available CSV delimiter characters used to separate fields.
 * @default ','
 */
export type CsvDelimiterCharacter = ',' | ';';

/**
 * The options to apply on the CSV export.
 */
export interface GridExportCsvOptions {
  /**
   * If `true`, the comma character used to separate the integer part from the fractional part of a number.
   * This flag also changes the delimiter from `,` to `;`.
   * @default false
   */
  commaAsDecimalSeparator?: boolean;
  /**
   * The character used to separate fields.
   * @default ','
   */
  delimiter?: CsvDelimiterCharacter;
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
