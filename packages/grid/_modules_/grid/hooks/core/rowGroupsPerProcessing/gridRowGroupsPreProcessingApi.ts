import { GridRowTreeConfig, GridRowId, GridRowsLookup } from '../../../models/gridRows';

export interface GridRowGroupParams {
  ids: GridRowId[];
  idRowsLookup: GridRowsLookup;
}

export interface GridRowGroupingResult {
  tree: GridRowTreeConfig;
  treeDepth: number;
  ids: GridRowId[];
  idRowsLookup: GridRowsLookup;
}

export type GridRowGroupingPreProcessing = (
  params: GridRowGroupParams,
) => GridRowGroupingResult | null;

export interface GridRowGroupsPreProcessingApi {
  /**
   * Register a column pre-processing and emit an event to re-apply the row grouping pre-processing.
   * @param {string} processingName Name of the pre-processing. Used to clean the previous version of the pre-processing.
   * @param {GridRowGroupingPreProcessing} columnsPreProcessing Pre-processing to register.
   * @ignore - do not document.
   */
  unstable_registerRowGroupsBuilder: (
    processingName: string,
    groupingFunction: GridRowGroupingPreProcessing | null,
  ) => void;

  /**
   * Apply the first row grouping pre-processing that does not return null.
   * @param {GridRowsLookup} rowsLookup. Lookup of the rows to group.
   * @param {GridRowId[]} List of the rows IDs.
   * @returns {GridRowGroupingResult} The grouped rows.
   * @ignore - do not document.
   */
  unstable_groupRows: (params: GridRowGroupParams) => GridRowGroupingResult;
}
