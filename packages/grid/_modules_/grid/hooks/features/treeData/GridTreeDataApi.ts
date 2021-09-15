import { GridRowId, GridRowIdTree } from '../../../models/gridRows';
import { GridRowsLookup } from '../rows';

export interface GridTreeDataApi {
  /**
   * Create the tree structure for a given set of rows
   * @param {GridRowsLookup} rowsLookup the rows to process
   * @param {GridRowId[]} rowIds the id of each row
   * @returns {GridRowIdTree} tree the tree structure containing all the rows
   */
  groupRows: (rowsLookup: GridRowsLookup, rowIds: GridRowId[]) => GridRowIdTree;

  /**
   * Toggle the expansion of a tree data row
   * @param {GridRowId} id the ID of the row to toggle
   */
  toggleTreeDataRow: (id: GridRowId) => void;

  /**
   * Determines if a row is expanded in the tree data or not.
   * @param {GridRowId} id The id of the row.
   * @returns {boolean} A boolean indicating if the row is expanded.
   */
  isTreeDataRowExpanded: (id: GridRowId) => boolean;
}
