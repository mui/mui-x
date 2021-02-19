/**
 * Available export formats. To be extended in future.
 */
export type GridExportFormat = 'csv';

/**
 * Export option interface
 */
export interface GridExportOption {
  label: React.ReactNode;
  format: GridExportFormat;
}
