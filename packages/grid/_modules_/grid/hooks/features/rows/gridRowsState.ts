import { GridRowTreeConfig, GridRowId, GridRowsLookup } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: GridRowsLookup;
  rowIds: GridRowId[];
  tree: GridRowTreeConfig;

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
