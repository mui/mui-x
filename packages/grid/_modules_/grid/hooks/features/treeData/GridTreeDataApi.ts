import { GridRowIdTree } from '../../../models/gridRows';
import { GridRowsLookup } from '../rows';

export interface GridTreeDataApi {
  /**
   * Create the tree structure for a given set of rows
   * @param {GridRowsLookup} rowsLookup the rows to process
   * @returns {GridRowIdTree} tree the tree structure containing all the rows
   */
  groupRows: (rowsLookup: GridRowsLookup) => GridRowIdTree;
}
