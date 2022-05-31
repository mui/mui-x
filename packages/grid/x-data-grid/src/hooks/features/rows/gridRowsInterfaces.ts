import { GridRowId, GridRowsLookup, GridRowTreeConfig } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export interface GridRowTreeCreationParams {
  previousTree: GridRowTreeConfig | null;
  previousTreeDepths: { [depth: number]: number } | null;
  updates: GridRowsPartialUpdates | GridRowsFullUpdate;
  dataRowIdToModelLookup: GridRowsLookup;
  dataRowIdToIdLookup: Record<string, GridRowId>;
}

export interface GridRowTreeCreationValue {
  /**
   * Name of the algorithm used to group the rows
   * It is useful to decide which filtering / sorting algorithm to apply, to avoid applying tree-data filtering on a grouping-by-column dataset for instance.
   */
  groupingName: string;
  tree: GridRowTreeConfig;
  /**
   * Amount of nodes at each depth (including auto-generated ones)
   */
  treeDepths: { [depth: number]: number };
  dataRowIds: GridRowId[];
}

export interface GridRowsInternalCache {
  updates: GridRowsPartialUpdates | GridRowsFullUpdate;
  /**
   * The rows as they were the last time all the rows have been updated at once
   * It is used to avoid processing several time the same set of rows
   */
  rowsBeforePartialUpdates: DataGridProcessedProps['rows'];
  /**
   * The value of the `loading` prop since the last time that the rows state was updated.
   */
  loadingPropBeforePartialUpdates: DataGridProcessedProps['loading'];
  dataRowIdToModelLookup: GridRowsLookup;
  dataRowIdToIdLookup: Record<string, GridRowId>;
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
  dataRowIdToModelLookup: GridRowsLookup;
  dataRowIdToIdLookup: Record<string, GridRowId>;
}

export type GridHydrateRowsValue = Pick<GridRowTreeCreationValue, 'tree' | 'treeDepths'>;

export type GridRowsPartialUpdateAction = 'insert' | 'modify' | 'remove';

export interface GridRowsFullUpdate {
  type: 'full';
  rows: GridRowId[];
}

export interface GridRowsPartialUpdates {
  type: 'partial';
  actions: { [action in GridRowsPartialUpdateAction]: GridRowId[] };
  idToActionLookup: { [id: GridRowId]: GridRowsPartialUpdateAction | undefined };
}
