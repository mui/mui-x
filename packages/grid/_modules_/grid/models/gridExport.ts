export interface GridExportCsvOptions {
  utf8WithBom?: boolean;
}
export interface GridExportFormatCsv {
  format: 'csv';
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
export type GridExportOption = GridExportFormat & {
  label: React.ReactNode;
};
