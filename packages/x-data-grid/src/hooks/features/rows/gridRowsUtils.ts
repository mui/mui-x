import * as React from 'react';
import {
  GridAutoGeneratedGroupNode,
  GridAutoGeneratedPinnedRowNode,
  GridFooterNode,
  GridGroupNode,
  GridRowId,
  GridRowIdGetter,
  GridRowModel,
  GridRowModelUpdate,
  GridRowTreeConfig,
  GridSkeletonRowNode,
  GridTreeNode,
} from '../../../models';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiCommunity, GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridRowsFullUpdate,
  GridRowsInternalCache,
  GridRowsPartialUpdates,
  GridRowsState,
  GridRowTreeCreationParams,
  GridRowIdToModelLookup,
  GridRowIdToIdLookup,
  GridRowsPartialUpdateAction,
} from './gridRowsInterfaces';
import { gridPinnedRowsSelector } from './gridRowsSelector';
import { gridDimensionsSelector } from '../dimensions/gridDimensionsSelectors';

export const GRID_ROOT_GROUP_ID: GridRowId = `auto-generated-group-node-root`;
export const GRID_ID_AUTOGENERATED = Symbol('mui.id_autogenerated');

export const buildRootGroup = (): GridGroupNode => ({
  type: 'group',
  id: GRID_ROOT_GROUP_ID,
  depth: -1,
  groupingField: null,
  groupingKey: null,
  isAutoGenerated: true,
  children: [],
  childrenFromPath: {},
  childrenExpanded: true,
  parent: null,
});

/**
 * A helper function to check if the id provided is valid.
 * @param {GridRowId} id Id as [[GridRowId]].
 * @param {GridRowModel | Partial<GridRowModel>} row Row as [[GridRowModel]].
 * @param {string} detailErrorMessage A custom error message to display for invalid IDs
 */
export function checkGridRowIdIsValid(
  id: GridRowId,
  row: GridRowModel | Partial<GridRowModel>,
  detailErrorMessage: string = 'A row was provided without id in the rows prop:',
) {
  if (id == null) {
    throw new Error(
      [
        'MUI X: The data grid component requires all rows to have a unique `id` property.',
        'Alternatively, you can use the `getRowId` prop to specify a custom id for each row.',
        detailErrorMessage,
        JSON.stringify(row),
      ].join('\n'),
    );
  }
}

export const getRowIdFromRowModel = (
  rowModel: GridRowModel,
  getRowId?: GridRowIdGetter,
  detailErrorMessage?: string,
): GridRowId => {
  const id = getRowId ? getRowId(rowModel) : rowModel.id;
  checkGridRowIdIsValid(id, rowModel, detailErrorMessage);
  return id;
};

export const createRowsInternalCache = ({
  rows,
  getRowId,
  loading,
  rowCount,
}: Pick<
  DataGridProcessedProps,
  'rows' | 'getRowId' | 'loading' | 'rowCount'
>): GridRowsInternalCache => {
  const updates: GridRowsFullUpdate = {
    type: 'full',
    rows: [],
  };

  const dataRowIdToModelLookup: GridRowIdToModelLookup = {};
  const dataRowIdToIdLookup: GridRowIdToIdLookup = {};

  for (let i = 0; i < rows.length; i += 1) {
    const model = rows[i];
    const id = getRowIdFromRowModel(model, getRowId);
    dataRowIdToModelLookup[id] = model;
    dataRowIdToIdLookup[id] = id;
    updates.rows.push(id);
  }

  return {
    rowsBeforePartialUpdates: rows,
    loadingPropBeforePartialUpdates: loading,
    rowCountPropBeforePartialUpdates: rowCount,
    updates,
    dataRowIdToIdLookup,
    dataRowIdToModelLookup,
  };
};

export const getTopLevelRowCount = ({
  tree,
  rowCountProp = 0,
}: {
  tree: GridRowTreeConfig;
  rowCountProp: DataGridProcessedProps['rowCount'];
}) => {
  const rootGroupNode = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;

  return Math.max(
    rowCountProp,
    rootGroupNode.children.length + (rootGroupNode.footerId == null ? 0 : 1),
  );
};

export const getRowsStateFromCache = ({
  apiRef,
  rowCountProp = 0,
  loadingProp,
  previousTree,
  previousTreeDepths,
}: Pick<GridRowTreeCreationParams, 'previousTree' | 'previousTreeDepths'> & {
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>;
  rowCountProp: number | undefined;
  loadingProp: boolean | undefined;
}): GridRowsState => {
  const cache = apiRef.current.caches.rows;

  // 1. Apply the "rowTreeCreation" family processing.
  const {
    tree: unProcessedTree,
    treeDepths: unProcessedTreeDepths,
    dataRowIds: unProcessedDataRowIds,
    groupingName,
  } = apiRef.current.applyStrategyProcessor('rowTreeCreation', {
    previousTree,
    previousTreeDepths,
    updates: cache.updates,
    dataRowIdToIdLookup: cache.dataRowIdToIdLookup,
    dataRowIdToModelLookup: cache.dataRowIdToModelLookup,
  });

  // 2. Apply the "hydrateRows" pipe-processing.
  const groupingParamsWithHydrateRows = apiRef.current.unstable_applyPipeProcessors('hydrateRows', {
    tree: unProcessedTree,
    treeDepths: unProcessedTreeDepths,
    dataRowIdToIdLookup: cache.dataRowIdToIdLookup,
    dataRowIds: unProcessedDataRowIds,
    dataRowIdToModelLookup: cache.dataRowIdToModelLookup,
  });

  // 3. Reset the cache updates
  apiRef.current.caches.rows.updates = {
    type: 'partial',
    actions: {
      insert: [],
      modify: [],
      remove: [],
    },
    idToActionLookup: {},
  };

  return {
    ...groupingParamsWithHydrateRows,
    totalRowCount: Math.max(rowCountProp, groupingParamsWithHydrateRows.dataRowIds.length),
    totalTopLevelRowCount: getTopLevelRowCount({
      tree: groupingParamsWithHydrateRows.tree,
      rowCountProp,
    }),
    groupingName,
    loading: loadingProp,
  };
};

export const isAutoGeneratedRow = (
  rowNode: GridTreeNode,
): rowNode is
  | GridFooterNode
  | GridSkeletonRowNode
  | GridAutoGeneratedGroupNode
  | GridAutoGeneratedPinnedRowNode =>
  rowNode.type === 'skeletonRow' ||
  rowNode.type === 'footer' ||
  (rowNode.type === 'group' && rowNode.isAutoGenerated) ||
  (rowNode.type === 'pinnedRow' && rowNode.isAutoGenerated);

export const getTreeNodeDescendants = (
  tree: GridRowTreeConfig,
  parentId: GridRowId,
  skipAutoGeneratedRows: boolean,
) => {
  const node = tree[parentId];
  if (node.type !== 'group') {
    return [];
  }

  const validDescendants: GridRowId[] = [];
  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    if (!skipAutoGeneratedRows || !isAutoGeneratedRow(tree[child])) {
      validDescendants.push(child);
    }
    const childDescendants = getTreeNodeDescendants(tree, child, skipAutoGeneratedRows);
    for (let j = 0; j < childDescendants.length; j += 1) {
      validDescendants.push(childDescendants[j]);
    }
  }

  if (!skipAutoGeneratedRows && node.footerId != null) {
    validDescendants.push(node.footerId);
  }

  return validDescendants;
};

export const updateCacheWithNewRows = ({
  previousCache,
  getRowId,
  updates,
}: {
  previousCache: GridRowsInternalCache;
  getRowId: DataGridProcessedProps['getRowId'];
  updates: GridRowModelUpdate[];
}): GridRowsInternalCache => {
  if (previousCache.updates.type === 'full') {
    throw new Error(
      'MUI X: Unable to prepare a partial update if a full update is not applied yet.',
    );
  }

  // Remove duplicate updates.
  // A server can batch updates, and send several updates for the same row in one fn call.
  const uniqueUpdates = new Map<GridRowId, GridRowModel>();

  updates.forEach((update) => {
    const id = getRowIdFromRowModel(
      update,
      getRowId,
      'A row was provided without id when calling updateRows():',
    );

    if (uniqueUpdates.has(id)) {
      uniqueUpdates.set(id, { ...uniqueUpdates.get(id), ...update });
    } else {
      uniqueUpdates.set(id, update);
    }
  });

  const partialUpdates: GridRowsPartialUpdates = {
    type: 'partial',
    actions: {
      insert: [...(previousCache.updates.actions.insert ?? [])],
      modify: [...(previousCache.updates.actions.modify ?? [])],
      remove: [...(previousCache.updates.actions.remove ?? [])],
    },
    idToActionLookup: { ...previousCache.updates.idToActionLookup },
  };
  const dataRowIdToModelLookup = { ...previousCache.dataRowIdToModelLookup };
  const dataRowIdToIdLookup = { ...previousCache.dataRowIdToIdLookup };

  const alreadyAppliedActionsToRemove: Record<
    GridRowsPartialUpdateAction,
    { [id: GridRowId]: true }
  > = { insert: {}, modify: {}, remove: {} };

  // Depending on the action already applied to the data row,
  // We might want drop the already-applied-update.
  // For instance:
  // - if you delete then insert, then you don't want to apply the deletion in the tree.
  // - if you insert, then modify, then you just want to apply the insertion in the tree.
  uniqueUpdates.forEach((partialRow, id) => {
    const actionAlreadyAppliedToRow = partialUpdates.idToActionLookup[id];

    // Action === "delete"
    // eslint-disable-next-line no-underscore-dangle
    if (partialRow._action === 'delete') {
      // If the data row has been removed since the last state update,
      // Then do nothing.
      if (actionAlreadyAppliedToRow === 'remove' || !dataRowIdToModelLookup[id]) {
        return;
      }

      // If the data row has been inserted / modified since the last state update,
      // Then drop this "insert" / "modify" update.
      if (actionAlreadyAppliedToRow != null) {
        alreadyAppliedActionsToRemove[actionAlreadyAppliedToRow][id] = true;
      }

      // Remove the data row from the lookups and add it to the "delete" update.
      partialUpdates.actions.remove.push(id);
      delete dataRowIdToModelLookup[id];
      delete dataRowIdToIdLookup[id];
      return;
    }

    const oldRow = dataRowIdToModelLookup[id];

    // Action === "modify"
    if (oldRow) {
      // If the data row has been removed since the last state update,
      // Then drop this "remove" update and add it to the "modify" update instead.
      if (actionAlreadyAppliedToRow === 'remove') {
        alreadyAppliedActionsToRemove.remove[id] = true;
        partialUpdates.actions.modify.push(id);
      }
      // If the date has not been inserted / modified since the last state update,
      // Then add it to the "modify" update (if it has been inserted it should just remain "inserted").
      else if (actionAlreadyAppliedToRow == null) {
        partialUpdates.actions.modify.push(id);
      }

      // Update the data row lookups.
      dataRowIdToModelLookup[id] = { ...oldRow, ...partialRow };
      return;
    }

    // Action === "insert"
    // If the data row has been removed since the last state update,
    // Then drop the "remove" update and add it to the "insert" update instead.
    if (actionAlreadyAppliedToRow === 'remove') {
      alreadyAppliedActionsToRemove.remove[id] = true;
      partialUpdates.actions.insert.push(id);
    }
    // If the data row has not been inserted since the last state update,
    // Then add it to the "insert" update.
    // `actionAlreadyAppliedToRow` can't be equal to "modify", otherwise we would have an `oldRow` above.
    else if (actionAlreadyAppliedToRow == null) {
      partialUpdates.actions.insert.push(id);
    }

    // Update the data row lookups.
    dataRowIdToModelLookup[id] = partialRow;
    dataRowIdToIdLookup[id] = id;
  });

  const actionTypeWithActionsToRemove = Object.keys(
    alreadyAppliedActionsToRemove,
  ) as GridRowsPartialUpdateAction[];
  for (let i = 0; i < actionTypeWithActionsToRemove.length; i += 1) {
    const actionType = actionTypeWithActionsToRemove[i];
    const idsToRemove = alreadyAppliedActionsToRemove[actionType];
    if (Object.keys(idsToRemove).length > 0) {
      partialUpdates.actions[actionType] = partialUpdates.actions[actionType].filter(
        (id) => !idsToRemove[id],
      );
    }
  }

  return {
    dataRowIdToModelLookup,
    dataRowIdToIdLookup,
    updates: partialUpdates,
    rowsBeforePartialUpdates: previousCache.rowsBeforePartialUpdates,
    loadingPropBeforePartialUpdates: previousCache.loadingPropBeforePartialUpdates,
    rowCountPropBeforePartialUpdates: previousCache.rowCountPropBeforePartialUpdates,
  };
};

export function calculatePinnedRowsHeight(apiRef: React.MutableRefObject<GridApiCommunity>) {
  const pinnedRows = gridPinnedRowsSelector(apiRef);
  const topPinnedRowsHeight =
    pinnedRows?.top?.reduce((acc, value) => {
      acc += apiRef.current.unstable_getRowHeight(value.id);
      return acc;
    }, 0) || 0;

  const bottomPinnedRowsHeight =
    pinnedRows?.bottom?.reduce((acc, value) => {
      acc += apiRef.current.unstable_getRowHeight(value.id);
      return acc;
    }, 0) || 0;

  return {
    top: topPinnedRowsHeight,
    bottom: bottomPinnedRowsHeight,
  };
}

export function getMinimalContentHeight(apiRef: React.MutableRefObject<GridApiCommunity>) {
  const dimensions = gridDimensionsSelector(apiRef.current.state);
  return `var(--DataGrid-overlayHeight, ${2 * dimensions.rowHeight}px)`;
}
