import { GridRowId, GridRowModel, GridRowConfigTree } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
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
