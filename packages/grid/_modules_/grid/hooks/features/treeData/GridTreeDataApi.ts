import { GridRowsLookup } from '../rows/gridRowsSelector';
import { GridRowTree } from '../../../models/gridRows';

export interface GridTreeDataApi {
  /**
   * Create the tree structure for a given set of rows
   * @param {GridRowsLookup} rowsLookup the rows to process
   * @returns {GridRowTree} tree the tree structure containing all the rows
   */
  groupRows: (rowsLookup: GridRowsLookup) => GridRowTree;
}
