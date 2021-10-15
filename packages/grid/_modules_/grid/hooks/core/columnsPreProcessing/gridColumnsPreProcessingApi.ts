import { GridColumns } from '../../../models/colDef/gridColDef';

export type GridColumnsPreProcessing = (columns: GridColumns) => GridColumns;

export interface GridColumnsPreProcessingApi {
  /**
   * Register a column pre-processing and emit an event to re-apply all the columns pre-processing
   * @param {string} processingName Name of the pre-processing. Used to clean the previous version of the pre-processing.
   * @param {GridColumnsPreProcessing | null } columnsPreProcessing Pre-processing to register.
   * @ignore - do not document
   */
  UNSTABLE_registerColumnPreProcessing: (
    processingName: string,
    columnsPreProcessing: GridColumnsPreProcessing,
  ) => void;
  /**
   * Apply all the columns pre-processing
   * @param {GridColumns} columns. Columns to pre-process
   * @returns {GridColumns} The pre-processed columns
   * @ignore - do not document
   */
  UNSTABLE_applyAllColumnPreProcessing: (columns: GridColumns) => GridColumns;
}
