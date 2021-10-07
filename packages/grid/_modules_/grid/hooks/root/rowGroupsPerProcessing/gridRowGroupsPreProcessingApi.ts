import {
  GridRowConfigTree,
  GridRowData,
  GridRowId,
  GridRowsLookup,
} from '../../../models/gridRows';

export type RwoGroupParams = {
  ids: GridRowId[];
  gridRowId: (rowData: GridRowData) => GridRowId;
  idRowsLookup: GridRowsLookup;
};

export interface GridRowGroupingResult {
  tree: GridRowConfigTree;
  paths: Record<GridRowId, string[]>;
  idRowsLookup: GridRowsLookup;
}

export type RowGroupingFunction = (params: RwoGroupParams) => GridRowGroupingResult;

export interface GridRowGroupsPreProcessingApi {
  /**
   * @param {RowGroupingFunction} columnsPreProcessing Pre-processing to register.
   * @ignore - do not document
   */
  registerRowGroupsBuilder: (groupingFunction: RowGroupingFunction | null) => void;

  /**
   * @param {GridRowsLookup} rowsLookup. Lookup of the rows to group
   * @param {GridRowId[]} List of the rows IDs
   * @returns {GridRowGroupingResult} The grouped rows
   * @ignore - do not document
   */
  groupRows: (params: RwoGroupParams) => GridRowGroupingResult;
}
