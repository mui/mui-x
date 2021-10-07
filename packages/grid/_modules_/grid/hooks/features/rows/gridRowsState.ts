import { GridRowId, GridRowConfigTree, GridRowsLookup } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: GridRowsLookup;
  tree: GridRowConfigTree;

  /**
   * Path in the tree to access a given row
   */
  paths: Record<GridRowId, string[]>;

  /**
   * Amount of rows before applying the filtering
   * It also count the expanded and collapsed children rows
   */
  totalRowCount: number;

  /**
   * Amount of rows before applying the filtering
   * It does not count the expanded children rows
   */
  totalTopLevelRowCount: number;
}
