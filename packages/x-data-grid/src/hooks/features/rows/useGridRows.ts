import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowApi, GridRowProApi, GridRowProPrivateApi } from '../../../models/api/gridRowApi';
import { GridRowId, GridGroupNode, GridLeafNode } from '../../../models/gridRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import {
  gridRowCountSelector,
  gridRowsLookupSelector,
  gridRowTreeSelector,
  gridRowGroupingNameSelector,
  gridRowTreeDepthsSelector,
  gridDataRowIdsSelector,
  gridRowsDataRowIdToIdLookupSelector,
  gridRowMaximumTreeDepthSelector,
  gridRowGroupsToFetchSelector,
} from './gridRowsSelector';
import { useTimeout } from '../../utils/useTimeout';
import { GridSignature, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { gridFilteredRowsLookupSelector } from '../filter/gridFilterSelector';
import { GridRowsInternalCache } from './gridRowsInterfaces';
import {
  getTreeNodeDescendants,
  createRowsInternalCache,
  getRowsStateFromCache,
  isAutogeneratedRowNode,
  GRID_ROOT_GROUP_ID,
  GRID_ID_AUTOGENERATED,
  updateCacheWithNewRows,
  getTopLevelRowCount,
  getRowIdFromRowModel,
  computeRowsUpdates,
} from './gridRowsUtils';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';

export const rowsStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'unstable_dataSource' | 'rows' | 'rowCount' | 'getRowId' | 'loading'>
> = (state, props, apiRef) => {
  const isDataSourceAvailable = !!props.unstable_dataSource;
  apiRef.current.caches.rows = createRowsInternalCache({
    rows: isDataSourceAvailable ? [] : props.rows,
    getRowId: props.getRowId,
    loading: props.loading,
    rowCount: props.rowCount,
  });

  return {
    ...state,
    rows: getRowsStateFromCache({
      apiRef,
      rowCountProp: props.rowCount,
      loadingProp: isDataSourceAvailable ? true : props.loading,
      previousTree: null,
      previousTreeDepths: null,
    }),
  };
};

export const useGridRows = (
  apiRef: React.RefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'rows'
    | 'getRowId'
    | 'rowCount'
    | 'throttleRowsMs'
    | 'signature'
    | 'pagination'
    | 'paginationMode'
    | 'loading'
    | 'unstable_dataSource'
  >,
): void => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Freeze the `rows` prop so developers have a fast failure if they try to use Array.prototype.push().
      Object.freeze(props.rows);
    } catch (error) {
      // Sometimes, it's impossible to freeze, so we give up on it.
    }
  }

  const logger = useGridLogger(apiRef, 'useGridRows');
  const currentPage = useGridVisibleRows(apiRef, props);

  const lastUpdateMs = React.useRef(Date.now());
  const lastRowCount = React.useRef(props.rowCount);
  const timeout = useTimeout();

  const getRow = React.useCallback<GridRowApi['getRow']>(
    (id) => {
      const model = gridRowsLookupSelector(apiRef)[id] as any;

      if (model) {
        return model;
      }

      const node = apiRef.current.getRowNode(id);
      if (node && isAutogeneratedRowNode(node)) {
        return { [GRID_ID_AUTOGENERATED]: id };
      }

      return null;
    },
    [apiRef],
  );

  const getRowIdProp = props.getRowId;
  const getRowId = React.useCallback<GridRowApi['getRowId']>(
    (row) => {
      if (GRID_ID_AUTOGENERATED in row) {
        return row[GRID_ID_AUTOGENERATED];
      }
      if (getRowIdProp) {
        return getRowIdProp(row);
      }
      return row.id;
    },
    [getRowIdProp],
  );

  const lookup = React.useMemo(
    () =>
      currentPage.rows.reduce<Record<GridRowId, number>>((acc, { id }, index) => {
        acc[id] = index;
        return acc;
      }, {}),
    [currentPage.rows],
  );

  const throttledRowsChange = React.useCallback(
    ({ cache, throttle }: { cache: GridRowsInternalCache; throttle: boolean }) => {
      const run = () => {
        lastUpdateMs.current = Date.now();
        apiRef.current.setState((state) => ({
          ...state,
          rows: getRowsStateFromCache({
            apiRef,
            rowCountProp: props.rowCount,
            loadingProp: props.loading,
            previousTree: gridRowTreeSelector(apiRef),
            previousTreeDepths: gridRowTreeDepthsSelector(apiRef),
            previousGroupsToFetch: gridRowGroupsToFetchSelector(apiRef),
          }),
        }));
        apiRef.current.publishEvent('rowsSet');
        apiRef.current.forceUpdate();
      };

      timeout.clear();

      apiRef.current.caches.rows = cache;

      if (!throttle) {
        run();
        return;
      }

      const throttleRemainingTimeMs = props.throttleRowsMs - (Date.now() - lastUpdateMs.current);
      if (throttleRemainingTimeMs > 0) {
        timeout.start(throttleRemainingTimeMs, run);
        return;
      }

      run();
    },
    [props.throttleRowsMs, props.rowCount, props.loading, apiRef, timeout],
  );

  /**
   * API METHODS
   */
  const setRows = React.useCallback<GridRowApi['setRows']>(
    (rows) => {
      logger.debug(`Updating all rows, new length ${rows.length}`);
      const cache = createRowsInternalCache({
        rows,
        getRowId: props.getRowId,
        loading: props.loading,
        rowCount: props.rowCount,
      });
      const prevCache = apiRef.current.caches.rows;
      cache.rowsBeforePartialUpdates = prevCache.rowsBeforePartialUpdates;

      throttledRowsChange({ cache, throttle: true });
    },
    [logger, props.getRowId, props.loading, props.rowCount, throttledRowsChange, apiRef],
  );

  const updateRows = React.useCallback<GridRowApi['updateRows']>(
    (updates) => {
      if (props.signature === GridSignature.DataGrid && updates.length > 1) {
        throw new Error(
          [
            'MUI X: You cannot update several rows at once in `apiRef.current.updateRows` on the DataGrid.',
            'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.',
          ].join('\n'),
        );
      }

      const nonPinnedRowsUpdates = computeRowsUpdates(apiRef, updates, props.getRowId);

      const cache = updateCacheWithNewRows({
        updates: nonPinnedRowsUpdates,
        getRowId: props.getRowId,
        previousCache: apiRef.current.caches.rows,
      });

      throttledRowsChange({ cache, throttle: true });
    },
    [props.signature, props.getRowId, throttledRowsChange, apiRef],
  );

  const updateServerRows = React.useCallback<GridRowProPrivateApi['updateServerRows']>(
    (updates, groupKeys) => {
      const nonPinnedRowsUpdates = computeRowsUpdates(apiRef, updates, props.getRowId);

      const cache = updateCacheWithNewRows({
        updates: nonPinnedRowsUpdates,
        getRowId: props.getRowId,
        previousCache: apiRef.current.caches.rows,
        groupKeys: groupKeys ?? [],
      });

      throttledRowsChange({ cache, throttle: false });
    },
    [props.getRowId, throttledRowsChange, apiRef],
  );

  const setLoading = React.useCallback<GridRowApi['setLoading']>(
    (loading) => {
      if (loading === props.loading) {
        return;
      }
      logger.debug(`Setting loading to ${loading}`);
      apiRef.current.setState((state) => ({
        ...state,
        rows: { ...state.rows, loading },
      }));
      apiRef.current.caches.rows.loadingPropBeforePartialUpdates = loading;
    },
    [props.loading, apiRef, logger],
  );

  const getRowModels = React.useCallback<GridRowApi['getRowModels']>(() => {
    const dataRows = gridDataRowIdsSelector(apiRef);
    const idRowsLookup = gridRowsLookupSelector(apiRef);

    return new Map(dataRows.map((id) => [id, idRowsLookup[id] ?? {}]));
  }, [apiRef]);

  const getRowsCount = React.useCallback<GridRowApi['getRowsCount']>(
    () => gridRowCountSelector(apiRef),
    [apiRef],
  );

  const getAllRowIds = React.useCallback<GridRowApi['getAllRowIds']>(
    () => gridDataRowIdsSelector(apiRef),
    [apiRef],
  );

  const getRowIndexRelativeToVisibleRows = React.useCallback<
    GridRowApi['getRowIndexRelativeToVisibleRows']
  >((id) => lookup[id], [lookup]);

  const setRowChildrenExpansion = React.useCallback<GridRowProApi['setRowChildrenExpansion']>(
    (id, isExpanded) => {
      const currentNode = apiRef.current.getRowNode(id);
      if (!currentNode) {
        throw new Error(`MUI X: No row with id #${id} found.`);
      }

      if (currentNode.type !== 'group') {
        throw new Error('MUI X: Only group nodes can be expanded or collapsed.');
      }

      const newNode: GridGroupNode = { ...currentNode, childrenExpanded: isExpanded };
      apiRef.current.setState((state) => {
        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: newNode },
          },
        };
      });
      apiRef.current.forceUpdate();
      apiRef.current.publishEvent('rowExpansionChange', newNode);
    },
    [apiRef],
  );

  const getRowNode = React.useCallback<GridRowApi['getRowNode']>(
    (id) => (gridRowTreeSelector(apiRef)[id] as any) ?? null,
    [apiRef],
  );

  const getRowGroupChildren = React.useCallback<GridRowProApi['getRowGroupChildren']>(
    ({ skipAutoGeneratedRows = true, groupId, applySorting, applyFiltering }) => {
      const tree = gridRowTreeSelector(apiRef);

      let children: GridRowId[];
      if (applySorting) {
        const groupNode = tree[groupId];
        if (!groupNode) {
          return [];
        }

        const sortedRowIds = gridSortedRowIdsSelector(apiRef);
        children = [];

        const startIndex = sortedRowIds.findIndex((id) => id === groupId) + 1;
        for (
          let index = startIndex;
          index < sortedRowIds.length && tree[sortedRowIds[index]].depth > groupNode.depth;
          index += 1
        ) {
          const id = sortedRowIds[index];
          if (!skipAutoGeneratedRows || !isAutogeneratedRowNode(tree[id])) {
            children.push(id);
          }
        }
      } else {
        children = getTreeNodeDescendants(tree, groupId, skipAutoGeneratedRows);
      }

      if (applyFiltering) {
        const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);
        children = children.filter((childId) => filteredRowsLookup[childId] !== false);
      }

      return children;
    },
    [apiRef],
  );

  const setRowIndex = React.useCallback<GridRowProApi['setRowIndex']>(
    (rowId, targetIndex) => {
      const node = apiRef.current.getRowNode(rowId);

      if (!node) {
        throw new Error(`MUI X: No row with id #${rowId} found.`);
      }

      if (node.parent !== GRID_ROOT_GROUP_ID) {
        throw new Error(`MUI X: The row reordering do not support reordering of grouped rows yet.`);
      }

      if (node.type !== 'leaf') {
        throw new Error(
          `MUI X: The row reordering do not support reordering of footer or grouping rows.`,
        );
      }

      apiRef.current.setState((state) => {
        const group = gridRowTreeSelector(state, apiRef.current.instanceId)[
          GRID_ROOT_GROUP_ID
        ] as GridGroupNode;
        const allRows = group.children;
        const oldIndex = allRows.findIndex((row) => row === rowId);
        if (oldIndex === -1 || oldIndex === targetIndex) {
          return state;
        }

        logger.debug(`Moving row ${rowId} to index ${targetIndex}`);

        const updatedRows = [...allRows];
        updatedRows.splice(targetIndex, 0, updatedRows.splice(oldIndex, 1)[0]);

        return {
          ...state,
          rows: {
            ...state.rows,
            tree: {
              ...state.rows.tree,
              [GRID_ROOT_GROUP_ID]: {
                ...group,
                children: updatedRows,
              },
            },
          },
        };
      });
      apiRef.current.publishEvent('rowsSet');
    },
    [apiRef, logger],
  );

  const replaceRows = React.useCallback<GridRowApi['unstable_replaceRows']>(
    (firstRowToRender, newRows) => {
      if (props.signature === GridSignature.DataGrid && newRows.length > 1) {
        throw new Error(
          [
            'MUI X: You cannot replace rows using `apiRef.current.unstable_replaceRows` on the DataGrid.',
            'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.',
          ].join('\n'),
        );
      }

      if (newRows.length === 0) {
        return;
      }

      const treeDepth = gridRowMaximumTreeDepthSelector(apiRef);

      if (treeDepth > 1) {
        throw new Error(
          '`apiRef.current.unstable_replaceRows` is not compatible with tree data and row grouping',
        );
      }

      const tree = { ...gridRowTreeSelector(apiRef) };
      const dataRowIdToModelLookup = { ...gridRowsLookupSelector(apiRef) };
      const dataRowIdToIdLookup = { ...gridRowsDataRowIdToIdLookupSelector(apiRef) };
      const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
      const rootGroupChildren = [...rootGroup.children];
      const seenIds = new Set<GridRowId>();

      for (let i = 0; i < newRows.length; i += 1) {
        const rowModel = newRows[i];
        const rowId = getRowIdFromRowModel(
          rowModel,
          props.getRowId,
          'A row was provided without id when calling replaceRows().',
        );

        const [removedRowId] = rootGroupChildren.splice(firstRowToRender + i, 1, rowId);

        if (!seenIds.has(removedRowId)) {
          delete dataRowIdToModelLookup[removedRowId];
          delete dataRowIdToIdLookup[removedRowId];
          delete tree[removedRowId];
        }

        const rowTreeNodeConfig: GridLeafNode = {
          id: rowId,
          depth: 0,
          parent: GRID_ROOT_GROUP_ID,
          type: 'leaf',
          groupingKey: null,
        };
        dataRowIdToModelLookup[rowId] = rowModel;
        dataRowIdToIdLookup[rowId] = rowId;
        tree[rowId] = rowTreeNodeConfig;

        seenIds.add(rowId);
      }

      tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };

      // Removes potential remaining skeleton rows from the dataRowIds.
      const dataRowIds = rootGroupChildren.filter((childId) => tree[childId]?.type === 'leaf');

      apiRef.current.caches.rows.dataRowIdToModelLookup = dataRowIdToModelLookup;
      apiRef.current.caches.rows.dataRowIdToIdLookup = dataRowIdToIdLookup;

      apiRef.current.setState((state) => ({
        ...state,
        rows: {
          ...state.rows,
          dataRowIdToModelLookup,
          dataRowIdToIdLookup,
          dataRowIds,
          tree,
        },
      }));
      apiRef.current.publishEvent('rowsSet');
    },
    [apiRef, props.signature, props.getRowId],
  );

  const rowApi: GridRowApi = {
    getRow,
    setLoading,
    getRowId,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
    getRowNode,
    getRowIndexRelativeToVisibleRows,
    unstable_replaceRows: replaceRows,
  };

  const rowProApi: GridRowProApi = {
    setRowIndex,
    setRowChildrenExpansion,
    getRowGroupChildren,
  };

  const rowProPrivateApi: GridRowProPrivateApi = {
    updateServerRows,
  };

  /**
   * EVENTS
   */
  const groupRows = React.useCallback(() => {
    logger.info(`Row grouping pre-processing have changed, regenerating the row tree`);

    let cache: GridRowsInternalCache;
    if (apiRef.current.caches.rows.rowsBeforePartialUpdates === props.rows) {
      // The `props.rows` did not change since the last row grouping
      // We can use the current rows cache which contains the partial updates done recently.
      cache = {
        ...apiRef.current.caches.rows,
        updates: {
          type: 'full',
          rows: gridDataRowIdsSelector(apiRef),
        },
      };
    } else {
      // The `props.rows` has changed since the last row grouping
      // We must use the new `props.rows` on the new grouping
      // This occurs because this event is triggered before the `useEffect` on the rows when both the grouping pre-processing and the rows changes on the same render
      cache = createRowsInternalCache({
        rows: props.rows,
        getRowId: props.getRowId,
        loading: props.loading,
        rowCount: props.rowCount,
      });
    }
    throttledRowsChange({ cache, throttle: false });
  }, [
    logger,
    apiRef,
    props.rows,
    props.getRowId,
    props.loading,
    props.rowCount,
    throttledRowsChange,
  ]);

  const previousDataSource = useLazyRef(() => props.unstable_dataSource);
  const handleStrategyProcessorChange = React.useCallback<
    GridEventListener<'activeStrategyProcessorChange'>
  >(
    (methodName) => {
      if (props.unstable_dataSource && props.unstable_dataSource !== previousDataSource.current) {
        previousDataSource.current = props.unstable_dataSource;
        return;
      }
      if (methodName === 'rowTreeCreation') {
        groupRows();
      }
    },
    [groupRows, previousDataSource, props.unstable_dataSource],
  );

  const handleStrategyActivityChange = React.useCallback<
    GridEventListener<'strategyAvailabilityChange'>
  >(() => {
    // `rowTreeCreation` is the only processor ran when `strategyAvailabilityChange` is fired.
    // All the other processors listen to `rowsSet` which will be published by the `groupRows` method below.
    if (apiRef.current.getActiveStrategy('rowTree') !== gridRowGroupingNameSelector(apiRef)) {
      groupRows();
    }
  }, [apiRef, groupRows]);

  useGridApiEventHandler(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);
  useGridApiEventHandler(apiRef, 'strategyAvailabilityChange', handleStrategyActivityChange);

  /**
   * APPLIERS
   */
  const applyHydrateRowsProcessor = React.useCallback(() => {
    apiRef.current.setState((state) => {
      const response = apiRef.current.unstable_applyPipeProcessors('hydrateRows', {
        tree: gridRowTreeSelector(state, apiRef.current.instanceId),
        treeDepths: gridRowTreeDepthsSelector(state, apiRef.current.instanceId),
        dataRowIds: gridDataRowIdsSelector(state, apiRef.current.instanceId),
        dataRowIdToModelLookup: gridRowsLookupSelector(state, apiRef.current.instanceId),
        dataRowIdToIdLookup: gridRowsDataRowIdToIdLookupSelector(state, apiRef.current.instanceId),
      });

      return {
        ...state,
        rows: {
          ...state.rows,
          ...response,
          totalTopLevelRowCount: getTopLevelRowCount({
            tree: response.tree,
            rowCountProp: props.rowCount,
          }),
        },
      };
    });
    apiRef.current.publishEvent('rowsSet');
    apiRef.current.forceUpdate();
  }, [apiRef, props.rowCount]);

  useGridRegisterPipeApplier(apiRef, 'hydrateRows', applyHydrateRowsProcessor);

  useGridApiMethod(apiRef, rowApi, 'public');
  useGridApiMethod(
    apiRef,
    rowProApi,
    props.signature === GridSignature.DataGrid ? 'private' : 'public',
  );
  useGridApiMethod(apiRef, rowProPrivateApi, 'private');

  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridRows`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let isRowCountPropUpdated = false;
    if (props.rowCount !== lastRowCount.current) {
      isRowCountPropUpdated = true;
      lastRowCount.current = props.rowCount;
    }

    const areNewRowsAlreadyInState =
      apiRef.current.caches.rows.rowsBeforePartialUpdates === props.rows;
    const isNewLoadingAlreadyInState =
      apiRef.current.caches.rows.loadingPropBeforePartialUpdates === props.loading;
    const isNewRowCountAlreadyInState =
      apiRef.current.caches.rows.rowCountPropBeforePartialUpdates === props.rowCount;

    // The new rows have already been applied (most likely in the `'rowGroupsPreProcessingChange'` listener)
    if (areNewRowsAlreadyInState) {
      // If the loading prop has changed, we need to update its value in the state because it won't be done by `throttledRowsChange`
      if (!isNewLoadingAlreadyInState) {
        apiRef.current.setState((state) => ({
          ...state,
          rows: { ...state.rows, loading: props.loading },
        }));
        apiRef.current.caches.rows!.loadingPropBeforePartialUpdates = props.loading;
        apiRef.current.forceUpdate();
      }

      if (!isNewRowCountAlreadyInState) {
        apiRef.current.setState((state) => ({
          ...state,
          rows: {
            ...state.rows,
            totalRowCount: Math.max(props.rowCount || 0, state.rows.totalRowCount),
            totalTopLevelRowCount: Math.max(props.rowCount || 0, state.rows.totalTopLevelRowCount),
          },
        }));
        apiRef.current.caches.rows.rowCountPropBeforePartialUpdates = props.rowCount;
        apiRef.current.forceUpdate();
      }
      if (!isRowCountPropUpdated) {
        return;
      }
    }

    logger.debug(`Updating all rows, new length ${props.rows?.length}`);
    throttledRowsChange({
      cache: createRowsInternalCache({
        rows: props.rows,
        getRowId: props.getRowId,
        loading: props.loading,
        rowCount: props.rowCount,
      }),
      throttle: false,
    });
  }, [
    props.rows,
    props.rowCount,
    props.getRowId,
    props.loading,
    logger,
    throttledRowsChange,
    apiRef,
  ]);
};
