import {
  GridRowEntry,
  GridRowId,
  GridRowTreeConfig,
  GridValidRowModel,
} from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export interface GridRowsInternalCache {
  /**
   * The rows as they were the last time all the rows have been updated at once
   * It is used to avoid processing several time the same set of rows
   */
  rowsBeforePartialUpdates: DataGridProcessedProps['rows'];
  /**
   * The value of the `loading` prop since the last time that the rows state was updated.
   */
  loadingPropBeforePartialUpdates: DataGridProcessedProps['loading'];
  /**
   * The value of the `rowCount` prop since the last time that the rows state was updated.
   */
  rowCountPropBeforePartialUpdates: DataGridProcessedProps['rowCount'];
  /**
   * Lookup containing the latest model at all time (even those not stored in the state yet).
   */
  dataRowIdToModelLookup: GridRowIdToModelLookup;
  /**
   * List of updates (partial or full) applied since the last time the state was synced with the cache.
   * It is used to build the tree.
   * If the update is a full update, we rebuild the tree from scratch.
   * If the update is a partial update, we only modify the impacted nodes.
   */
  updates: GridRowsPartialUpdates | GridRowsFullUpdate;
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
   * The loading status of the rows.
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
  additionalRowGroups?: {
    pinnedRows?: GridPinnedRowsState;
  };
  /**
   * Contains some values of type `GridRowId` that have been requested to be fetched
   * either by `defaultGroupingExpansionDepth` or `isGroupExpandedByDefault` props.
   * Applicable with server-side grouped data and `unstable_dataSource` only.
   */
  groupsToFetch?: GridRowId[];
}

export interface GridRowTreeCreationParams {
  previousTree: GridRowTreeConfig | null;
  previousTreeDepths: GridTreeDepths | null;
  updates: GridRowsPartialUpdates | GridRowsFullUpdate;
  dataRowIdToModelLookup: GridRowIdToModelLookup;
  previousGroupsToFetch?: GridRowId[];
}

export type GridRowTreeUpdateGroupAction = 'removeChildren' | 'insertChildren' | 'modifyChildren';

export type GridRowTreeUpdatedGroupsValue = {
  [groupId: GridRowId]: { [action in GridRowTreeUpdateGroupAction]?: boolean };
};

export type GridRowTreeUpdatedGroupsManager = {
  value: GridRowTreeUpdatedGroupsValue;
  addAction: (groupId: GridRowId, action: GridRowTreeUpdateGroupAction) => void;
};

export type GridRowTreeCreationValue = Pick<
  GridRowsState,
  'groupingName' | 'tree' | 'treeDepths' | 'dataRowIds' | 'groupsToFetch'
> & {
  updatedGroupsManager?: GridRowTreeUpdatedGroupsManager;
};

export type GridHydrateRowsValue = Pick<
  GridRowsState,
  'tree' | 'treeDepths' | 'dataRowIds' | 'dataRowIdToModelLookup' | 'additionalRowGroups'
>;

export type GridRowsPartialUpdateAction = 'insert' | 'modify' | 'remove';

export type GridRowIdToModelLookup<R extends GridValidRowModel = GridValidRowModel> = Record<
  string,
  R
>;

export type GridTreeDepths = { [depth: number]: number };

export interface GridRowsFullUpdate {
  type: 'full';
  rows: GridRowId[];
}

export interface GridRowsPartialUpdates {
  type: 'partial';
  actions: { [action in GridRowsPartialUpdateAction]: GridRowId[] };
  idToActionLookup: { [id: GridRowId]: GridRowsPartialUpdateAction | undefined };
  groupKeys?: string[];
}

export interface GridPinnedRowsState {
  top?: GridRowEntry[];
  bottom?: GridRowEntry[];
}

export type GridPinnedRowsPosition = keyof GridPinnedRowsState;
