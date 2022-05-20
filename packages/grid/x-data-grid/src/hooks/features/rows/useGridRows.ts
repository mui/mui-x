import * as React from 'react';
import { GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowApi } from '../../../models/api/gridRowApi';
import { GridRowModel, GridRowId, GridRowTreeNodeConfig } from '../../../models/gridRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import {
  gridRowCountSelector,
  gridRowsLookupSelector,
  gridRowTreeSelector,
  gridRowIdsSelector,
  gridRowGroupingNameSelector,
} from './gridRowsSelector';
import { GridSignature, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { gridFilteredRowsLookupSelector } from '../filter/gridFilterSelector';
import { GridRowsInternalCache } from './gridRowsState';
import {
  getTreeNodeDescendants,
  createRowsInternalCache,
  getRowsStateFromCache,
  getRowIdFromRowModel,
} from './gridRowsUtils';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';

export const rowsStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'rows' | 'rowCount' | 'getRowId' | 'loading'>
> = (state, props, apiRef) => {
  apiRef.current.unstable_caches.rows = createRowsInternalCache({
    rows: props.rows,
    getRowId: props.getRowId,
    loading: props.loading,
  });

  return {
    ...state,
    rows: getRowsStateFromCache({
      apiRef,
      previousTree: null,
      rowCountProp: props.rowCount,
      loadingProp: props.loading,
    }),
  };
};

export const useGridRows = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
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
  >,
): void => {
  if (process.env.NODE_ENV !== 'production') {
    // Freeze rows for immutability
    Object.freeze(props.rows);
  }

  const logger = useGridLogger(apiRef, 'useGridRows');
  const currentPage = useGridVisibleRows(apiRef, props);

  const lastUpdateMs = React.useRef(Date.now());
  const timeout = React.useRef<NodeJS.Timeout | null>(null);

  const getRow = React.useCallback<GridRowApi['getRow']>(
    (id) => (gridRowsLookupSelector(apiRef)[id] as any) ?? null,
    [apiRef],
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
    (newCache: GridRowsInternalCache, throttle: boolean) => {
      const run = () => {
        timeout.current = null;
        lastUpdateMs.current = Date.now();
        apiRef.current.setState((state) => ({
          ...state,
          rows: getRowsStateFromCache({
            apiRef,
            previousTree: gridRowTreeSelector(apiRef),
            rowCountProp: props.rowCount,
            loadingProp: props.loading,
          }),
        }));
        apiRef.current.publishEvent('rowsSet');
        apiRef.current.forceUpdate();
      };

      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }

      apiRef.current.unstable_caches.rows = newCache;

      if (!throttle) {
        run();
        return;
      }

      const throttleRemainingTimeMs = props.throttleRowsMs - (Date.now() - lastUpdateMs.current);
      if (throttleRemainingTimeMs > 0) {
        timeout.current = setTimeout(run, throttleRemainingTimeMs);
        return;
      }

      run();
    },
    [props.throttleRowsMs, props.rowCount, props.loading, apiRef],
  );

  /**
   * API METHODS
   */
  const setRows = React.useCallback<GridRowApi['setRows']>(
    (rows) => {
      logger.debug(`Updating all rows, new length ${rows.length}`);
      throttledRowsChange(
        createRowsInternalCache({
          rows,
          getRowId: props.getRowId,
          loading: props.loading,
        }),
        true,
      );
    },
    [logger, props.getRowId, props.loading, throttledRowsChange],
  );

  const updateRows = React.useCallback<GridRowApi['updateRows']>(
    (updates) => {
      if (props.signature === GridSignature.DataGrid && updates.length > 1) {
        // TODO: Add test with direct call to `apiRef.current.updateRows` in DataGrid after enabling the `apiRef` on the free plan.
        throw new Error(
          [
            "MUI: You can't update several rows at once in `apiRef.current.updateRows` on the DataGrid.",
            'You need to upgrade to the DataGridPro component to unlock this feature.',
          ].join('\n'),
        );
      }

      // we remove duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = new Map<GridRowId, GridRowModel>();

      updates.forEach((update) => {
        const id = getRowIdFromRowModel(
          update,
          props.getRowId,
          'A row was provided without id when calling updateRows():',
        );

        if (uniqUpdates.has(id)) {
          uniqUpdates.set(id, { ...uniqUpdates.get(id), ...update });
        } else {
          uniqUpdates.set(id, update);
        }
      });

      const deletedRowIds: GridRowId[] = [];

      const prevCache = apiRef.current.unstable_caches.rows;
      const newCache: GridRowsInternalCache = {
        rowsBeforePartialUpdates: prevCache.rowsBeforePartialUpdates,
        loadingPropBeforePartialUpdates: prevCache.loadingPropBeforePartialUpdates,
        idRowsLookup: { ...prevCache.idRowsLookup },
        idToIdLookup: { ...prevCache.idToIdLookup },
        ids: [...prevCache.ids],
      };

      uniqUpdates.forEach((partialRow, id) => {
        // eslint-disable-next-line no-underscore-dangle
        if (partialRow._action === 'delete') {
          delete newCache.idRowsLookup[id];
          delete newCache.idToIdLookup[id];
          deletedRowIds.push(id);
          return;
        }

        const oldRow = apiRef.current.getRow(id);
        if (!oldRow) {
          newCache.idRowsLookup[id] = partialRow;
          newCache.idToIdLookup[id] = id;
          newCache.ids.push(id);
          return;
        }

        newCache.idRowsLookup[id] = { ...apiRef.current.getRow(id), ...partialRow };
      });

      if (deletedRowIds.length > 0) {
        newCache.ids = newCache.ids.filter((id) => !deletedRowIds.includes(id));
      }

      throttledRowsChange(newCache, true);
    },
    [props.signature, props.getRowId, throttledRowsChange, apiRef],
  );

  const getRowModels = React.useCallback<GridRowApi['getRowModels']>(() => {
    const allRows = gridRowIdsSelector(apiRef);
    const idRowsLookup = gridRowsLookupSelector(apiRef);

    return new Map(allRows.map((id) => [id, idRowsLookup[id]]));
  }, [apiRef]);

  const getRowsCount = React.useCallback<GridRowApi['getRowsCount']>(
    () => gridRowCountSelector(apiRef),
    [apiRef],
  );

  const getAllRowIds = React.useCallback<GridRowApi['getAllRowIds']>(
    () => gridRowIdsSelector(apiRef),
    [apiRef],
  );

  const getRowIndexRelativeToVisibleRows = React.useCallback((id) => lookup[id], [lookup]);

  const setRowChildrenExpansion = React.useCallback<GridRowApi['setRowChildrenExpansion']>(
    (id, isExpanded) => {
      const currentNode = apiRef.current.getRowNode(id);
      if (!currentNode) {
        throw new Error(`MUI: No row with id #${id} found`);
      }
      const newNode: GridRowTreeNodeConfig = { ...currentNode, childrenExpanded: isExpanded };
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
    (id) => gridRowTreeSelector(apiRef)[id] ?? null,
    [apiRef],
  );

  const getRowGroupChildren = React.useCallback<GridRowApi['getRowGroupChildren']>(
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
          const node = tree[id];
          if (!skipAutoGeneratedRows || !node.isAutoGenerated) {
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

  const setRowIndex = React.useCallback<GridRowApi['setRowIndex']>(
    (rowId, targetIndex) => {
      const allRows = gridRowIdsSelector(apiRef);
      const oldIndex = allRows.findIndex((row) => row === rowId);
      if (oldIndex === -1 || oldIndex === targetIndex) {
        return;
      }

      logger.debug(`Moving row ${rowId} to index ${targetIndex}`);

      const updatedRows = [...allRows];
      updatedRows.splice(targetIndex, 0, updatedRows.splice(oldIndex, 1)[0]);

      apiRef.current.setState((state) => ({
        ...state,
        rows: {
          ...state.rows,
          ids: updatedRows,
        },
      }));
      apiRef.current.applySorting();
    },
    [apiRef, logger],
  );

  const rowApi: GridRowApi = {
    getRow,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    setRowIndex,
    updateRows,
    setRowChildrenExpansion,
    getRowNode,
    getRowIndexRelativeToVisibleRows,
    getRowGroupChildren,
  };

  /**
   * EVENTS
   */
  const groupRows = React.useCallback(() => {
    logger.info(`Row grouping pre-processing have changed, regenerating the row tree`);

    let cache: GridRowsInternalCache;
    if (apiRef.current.unstable_caches.rows.rowsBeforePartialUpdates === props.rows) {
      // The `props.rows` did not change since the last row grouping
      // We can use the current rows cache which contains the partial updates done recently.
      cache = apiRef.current.unstable_caches.rows;
    } else {
      // The `props.rows` has changed since the last row grouping
      // We must use the new `props.rows` on the new grouping
      // This occurs because this event is triggered before the `useEffect` on the rows when both the grouping pre-processing and the rows changes on the same render
      cache = createRowsInternalCache({
        rows: props.rows,
        getRowId: props.getRowId,
        loading: props.loading,
      });
    }
    throttledRowsChange(cache, false);
  }, [logger, apiRef, props.rows, props.getRowId, props.loading, throttledRowsChange]);

  const handleStrategyProcessorChange = React.useCallback<
    GridEventListener<'activeStrategyProcessorChange'>
  >(
    (methodName) => {
      if (methodName === 'rowTreeCreation') {
        groupRows();
      }
    },
    [groupRows],
  );

  const handleStrategyActivityChange = React.useCallback<
    GridEventListener<'strategyAvailabilityChange'>
  >(() => {
    // `rowTreeCreation` is the only processor ran when `strategyAvailabilityChange` is fired.
    // All the other processors listen to `rowsSet` which will be published by the `groupRows` method below.
    if (
      apiRef.current.unstable_getActiveStrategy('rowTree') !== gridRowGroupingNameSelector(apiRef)
    ) {
      groupRows();
    }
  }, [apiRef, groupRows]);

  useGridApiEventHandler(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);
  useGridApiEventHandler(apiRef, 'strategyAvailabilityChange', handleStrategyActivityChange);

  /**
   * APPLIERS
   */
  const applyHydrateRowsProcessor = React.useCallback(() => {
    apiRef.current.setState((state) => ({
      ...state,
      rows: {
        ...state.rows,
        ...apiRef.current.unstable_applyPipeProcessors(
          'hydrateRows',
          state.rows.groupingResponseBeforeRowHydration,
        ),
      },
    }));
    apiRef.current.publishEvent('rowsSet');
    apiRef.current.forceUpdate();
  }, [apiRef]);

  useGridRegisterPipeApplier(apiRef, 'hydrateRows', applyHydrateRowsProcessor);

  useGridApiMethod(apiRef, rowApi, 'GridRowApi');

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridRows`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // The new rows have already been applied (most likely in the `'rowGroupsPreProcessingChange'` listener)
    if (
      apiRef.current.unstable_caches.rows.rowsBeforePartialUpdates === props.rows &&
      apiRef.current.unstable_caches.rows!.loadingPropBeforePartialUpdates === props.loading
    ) {
      return;
    }

    logger.debug(`Updating all rows, new length ${props.rows.length}`);
    throttledRowsChange(
      createRowsInternalCache({
        rows: props.rows,
        getRowId: props.getRowId,
        loading: props.loading,
      }),
      false,
    );
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
