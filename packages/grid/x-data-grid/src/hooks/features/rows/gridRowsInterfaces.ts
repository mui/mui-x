import { GridRowId, GridRowTreeConfig, GridValidRowModel } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

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
  dataRowIdToModelLookup: GridRowIdToModelLookup;
  dataRowIdToIdLookup: GridRowIdToIdLookup;
}

export interface GridRowsState {
  /**
   * Name of the algorithm used to group the rows
   * It is useful to decide which filtering / sorting algorithm to apply, to avoid applying tree-data filtering on a grouping-by-column dataset for instance.
   */
  groupingName: string;
  tree: GridRowTreeConfig;
  /**
   * Amount of nodes at each depth (including auto-generated ones)
   */
  treeDepths: GridTreeDepths;
  dataRowIds: GridRowId[];
  /**
   * Matches the value of the `loading` prop.
   */
  loading?: boolean;
  /**
   * Amount of data rows provided to the grid.
   * Includes the filtered and collapsed rows.
   * Does not include the auto-generated rows (auto generated groups and footers).
   */
  totalRowCount: number;
  /**
   * Amount of top level rows.
   * Includes the filtered rows and the auto-generated root footer if any.
   * Does not include the rows of depth > 0 (rows inside a group).
   */
  totalTopLevelRowCount: number;
  dataRowIdToModelLookup: GridRowIdToModelLookup;
  dataRowIdToIdLookup: GridRowIdToIdLookup;
}

export interface GridRowTreeCreationParams {
  previousTree: GridRowTreeConfig | null;
  previousTreeDepths: GridTreeDepths | null;
  updates: GridRowsPartialUpdates | GridRowsFullUpdate;
  dataRowIdToIdLookup: GridRowIdToIdLookup;
  dataRowIdToModelLookup: GridRowIdToModelLookup;
}

export type GridRowTreeCreationValue = Pick<
  GridRowsState,
  'groupingName' | 'tree' | 'treeDepths' | 'dataRowIds'
>;

export type GridHydrateRowsValue = Pick<GridRowsState, 'tree' | 'treeDepths'>;

export type GridRowsPartialUpdateAction = 'insert' | 'modify' | 'remove';

export type GridRowIdToModelLookup<R extends GridValidRowModel = any> = Record<string, R>;

export type GridRowIdToIdLookup = Record<string, GridRowId>;

export type GridTreeDepths = { [depth: number]: number };

export interface GridRowsFullUpdate {
  type: 'full';
  rows: GridRowId[];
}

export interface GridRowsPartialUpdates {
  type: 'partial';
  actions: { [action in GridRowsPartialUpdateAction]: GridRowId[] };
  idToActionLookup: { [id: GridRowId]: GridRowsPartialUpdateAction | undefined };
}
