/**
 * Available export formats. To be extended in future.
 */
export type ExportFormat = 'csv';

/**
 * Export option interface
 */
export interface ExportOption {
  label: string;
  format: ExportFormat;
}
