export interface GridExportCsvOptions {
  utf8WithBom?: boolean;
  disabled?: boolean;
}
export interface GridExportFormatCsv {
  name: 'csv';
  options?: GridExportCsvOptions;
}

/**
 * Available export formats. To be extended in future.
 */
export type GridExportFormatExtension = 'csv';
export type GridExportFormat = GridExportFormatCsv;
export interface GridExportConfiguration {
  fileName?: string;
  csv?: GridExportCsvOptions;
}

/**
 * Export option interface
 */
export interface GridExportOption {
  label: React.ReactNode;
  format: GridExportFormat;
}
