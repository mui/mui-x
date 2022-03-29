import {
  GridRowId,
  GridRowsLookup,
  GridRowsProp,
  GridRowTreeConfig,
} from '../../../models/gridRows';

export interface GridRowTreeCreationParams {
  ids: GridRowId[];
  idRowsLookup: GridRowsLookup;
  previousTree: GridRowTreeConfig | null;
}

export interface GridRowTreeCreationValue {
  /**
   * Name of the algorithm used to group the rows
   * It is useful to decide which filtering / sorting algorithm to apply, to avoid applying tree-data filtering on a grouping-by-column dataset for instance.
   */
  groupingName: string;
  tree: GridRowTreeConfig;
  treeDepth: number;
  ids: GridRowId[];
  idRowsLookup: GridRowsLookup;
}

export type GridRowInternalCacheValue = Omit<GridRowTreeCreationParams, 'previousTree'>;

export interface GridRowsInternalCacheState {
  value: GridRowInternalCacheValue;
  /**
   * The rows as they were the last time all the rows have been updated at once
   * It is used to avoid processing several time the same set of rows
   */
  rowsBeforePartialUpdates: GridRowsProp;
}

export interface GridRowsInternalCache {
  state: GridRowsInternalCacheState;
  timeout: NodeJS.Timeout | null;
  lastUpdateMs: number;
}

export interface GridRowsState extends GridRowTreeCreationValue {
  /**
   * Amount of rows before applying the filtering.
   * It also counts the expanded and collapsed children rows.
   */
  totalRowCount: number;
  /**
   * Amount of rows before applying the filtering.
   * It does not count the expanded children rows.
   */
  totalTopLevelRowCount: number;
}
