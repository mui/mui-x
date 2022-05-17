import {
  GridRowId,
  GridRowsLookup,
  GridRowsProp,
  GridRowTreeConfig,
} from '../../../models/gridRows';

export interface GridRowTreeCreationParams {
  ids: GridRowId[];
  idRowsLookup: GridRowsLookup;
  idToIdLookup: Record<string, GridRowId>;
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
  idToIdLookup: Record<string, GridRowId>;
}

export type GridRowInternalCacheValue = Omit<GridRowTreeCreationParams, 'previousTree'>;

export interface GridRowsInternalCache {
  value: GridRowInternalCacheValue;
  /**
   * The rows as they were the last time all the rows have been updated at once
   * It is used to avoid processing several time the same set of rows
   */
  rowsBeforePartialUpdates: GridRowsProp;
}

export interface GridRowsState extends GridRowTreeCreationValue {
  /**
   * Matches the value of the `loading` prop.
   */
  loading?: boolean;
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
  /**
   * Tree returned by the `rowTreeCreation` strategy processor.
   * It is used to re-apply the `hydrateRows` pipe processor without having to recreate the tree.
   */
  groupingResponseBeforeRowHydration: GridRowTreeCreationValue;
}

export type GridHydrateRowsValue = GridRowTreeCreationValue;
