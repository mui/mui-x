import { GridRowGroupingResult, GridRowId } from '../../../models/gridRows';
import { GridRowsLookup } from '../rows';

export interface GridTreeDataApi {
  /**
   * Create the tree structure for a given set of rows
   * @param {GridRowsLookup} rowsLookup the rows to process
   * @param {GridRowId[]} rowIds the id of each row
   * @returns {GridRowGroupingResult} tree the tree structure containing all the rows
   */
  groupRows: (rowsLookup: GridRowsLookup, rowIds: GridRowId[]) => GridRowGroupingResult;
}
