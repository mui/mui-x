import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridRowApi } from '../../../models/api/gridRowApi';
import {
  checkGridRowIdIsValid,
  GridRowModel,
  GridRowId,
  GridRowsProp,
  GridRowIdGetter,
  GridRowData,
} from '../../../models/gridRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../../utils/useGridState';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { GridRowsState } from './gridRowsState';
import {
  gridRowCountSelector,
  gridRowsLookupSelector,
  gridRowTreeSelector,
  gridRowIdsSelector,
} from './gridRowsSelector';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';

export type GridRowsInternalCacheState = Omit<
  GridRowsState,
  'tree' | 'totalRowCount' | 'totalTopLevelRowCount'
> & {
  rowIds: GridRowId[];

  /**
   * The rowCount property when the internal cache was created
   * We are storing it instead of accessing it directly when storing the cache to avoid synchronization issues
   */
  propRowCount?: number;

  /**
   * The getRowId property when the internal cache was created
   * We are storing it instead of accessing it directly when storing the cache to avoid synchronization issues
   */
  propGetRowId?: GridRowIdGetter;

  inputRows: GridRowsProp;
};

export interface GridRowsInternalCache {
  state: GridRowsInternalCacheState;
  timeout: NodeJS.Timeout | null;
  lastUpdateMs: number;
}

function getGridRowId(
  rowData: GridRowData,
  getRowId?: GridRowIdGetter,
  detailErrorMessage?: string,
): GridRowId {
  const id = getRowId ? getRowId(rowData) : rowData.id;
  checkGridRowIdIsValid(id, rowData, detailErrorMessage);
  return id;
}

export function convertGridRowsPropToState(
  inputRows: GridRowsProp,
  propRowCount?: number,
  propGetRowId?: GridRowIdGetter,
): GridRowsInternalCacheState {
  const state: GridRowsInternalCacheState = {
    idRowsLookup: {},
    rowIds: [],
    propRowCount,
    propGetRowId,
    inputRows,
  };

  inputRows.forEach((rowData) => {
    const id = getGridRowId(rowData, propGetRowId);
    state.idRowsLookup[id] = rowData;
    state.rowIds.push(id);
  });

  return state;
}

const getRowsStateFromCache = (
  rowsCache: GridRowsInternalCache,
  apiRef: GridApiRef,
): GridRowsState => {
  const { rowIds, idRowsLookup, propRowCount = 0 } = rowsCache.state;

  const groupingResponse = apiRef.current.UNSTABLE_groupRows({
    idRowsLookup,
    ids: rowIds,
  });

  const dataTopLevelRowCount = Object.values(groupingResponse.tree).filter(
    (node) => node.parent == null,
  ).length;
  const totalRowCount = propRowCount > rowIds.length ? propRowCount : rowIds.length;
  const totalTopLevelRowCount =
    propRowCount > dataTopLevelRowCount ? propRowCount : dataTopLevelRowCount;

  return { ...groupingResponse, rowIds, totalRowCount, totalTopLevelRowCount };
};

// The cache is always redefined synchronously in `useGridStateInit` so this object don't need to be regenerated across DataGrid instances.
const INITIAL_GRID_ROWS_INTERNAL_CACHE: GridRowsInternalCache = {
  state: {
    idRowsLookup: {},
    propRowCount: undefined,
    propGetRowId: undefined,
    rowIds: [],
    inputRows: [],
  },
  timeout: null,
  lastUpdateMs: 0,
};

/**
 * @requires useGridRowGroupsPreProcessing (method)
 * @requires useGridSorting (method) - can be after, async only (TODO: Remove after moving the 2 methods to useGridSorting)
 */
export const useGridRows = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'rows' | 'getRowId' | 'rowCount' | 'throttleRowsMs'>,
): void => {
  if (process.env.NODE_ENV !== 'production') {
    // Freeze rows for immutability
    Object.freeze(props.rows);
  }

  const logger = useGridLogger(apiRef, 'useGridRows');
  const rowsCache = React.useRef(INITIAL_GRID_ROWS_INTERNAL_CACHE);

  useGridStateInit(apiRef, (state) => {
    rowsCache.current.state = convertGridRowsPropToState(
      props.rows,
      props.rowCount,
      props.getRowId,
    );
    rowsCache.current.lastUpdateMs = Date.now();

    return { ...state, rows: getRowsStateFromCache(rowsCache.current, apiRef) };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  // TODO: Move in useGridSorting
  const getRowIndex = React.useCallback<GridRowApi['getRowIndex']>(
    (id) => apiRef.current.getSortedRowIds().indexOf(id),
    [apiRef],
  );

  // TODO: Move in useGridSorting
  const getRowIdFromRowIndex = React.useCallback<GridRowApi['getRowIdFromRowIndex']>(
    (index) => apiRef.current.getSortedRowIds()[index],
    [apiRef],
  );

  const getRow = React.useCallback<GridRowApi['getRow']>(
    (id) => gridRowsLookupSelector(apiRef.current.state)[id] ?? null,
    [apiRef],
  );

  const throttledRowsChange = React.useCallback(
    (newState: GridRowsInternalCacheState, throttle: boolean) => {
      const run = () => {
        rowsCache.current.timeout = null;
        rowsCache.current.lastUpdateMs = Date.now();
        setGridState((state) => ({
          ...state,
          rows: getRowsStateFromCache(rowsCache.current, apiRef),
        }));
        apiRef.current.publishEvent(GridEvents.rowsSet);
        forceUpdate();
      };

      if (rowsCache.current.timeout) {
        clearTimeout(rowsCache.current.timeout);
      }

      rowsCache.current.state = newState;
      rowsCache.current.timeout = null;

      if (!throttle) {
        run();
        return;
      }

      const throttleRemainingTimeMs =
        props.throttleRowsMs - (Date.now() - rowsCache.current.lastUpdateMs);
      if (throttleRemainingTimeMs > 0) {
        rowsCache.current.timeout = setTimeout(run, throttleRemainingTimeMs);
        return;
      }

      run();
    },
    [apiRef, forceUpdate, setGridState, rowsCache, props.throttleRowsMs],
  );

  const setRows = React.useCallback<GridRowApi['setRows']>(
    (rows) => {
      logger.debug(`Updating all rows, new length ${rows.length}`);
      throttledRowsChange(convertGridRowsPropToState(rows, props.rowCount, props.getRowId), true);
    },
    [logger, throttledRowsChange, props.rowCount, props.getRowId],
  );

  const updateRows = React.useCallback<GridRowApi['updateRows']>(
    (updates) => {
      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = new Map<GridRowId, GridRowModel>();

      updates.forEach((update) => {
        const id = getGridRowId(
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

      const idRowsLookup = { ...rowsCache.current.state.idRowsLookup };
      let rowIds = [...rowsCache.current.state.rowIds];

      uniqUpdates.forEach((partialRow, id) => {
        // eslint-disable-next-line no-underscore-dangle
        if (partialRow._action === 'delete') {
          delete idRowsLookup[id];
          deletedRowIds.push(id);
          return;
        }

        const oldRow = apiRef.current.getRow(id);
        if (!oldRow) {
          idRowsLookup[id] = partialRow;
          rowIds.push(id);
          return;
        }

        idRowsLookup[id] = { ...apiRef.current.getRow(id), ...partialRow };
      });

      if (deletedRowIds.length > 0) {
        rowIds = rowIds.filter((id) => !deletedRowIds.includes(id));
      }

      const state: GridRowsInternalCacheState = {
        ...rowsCache.current.state,
        idRowsLookup,
        rowIds,
        inputRows: rowIds.map((rowId) => idRowsLookup[rowId]),
      };

      throttledRowsChange(state, true);
    },
    [apiRef, props.getRowId, throttledRowsChange],
  );

  const getRowModels = React.useCallback<GridRowApi['getRowModels']>(() => {
    const allRows = gridRowIdsSelector(apiRef.current.state);
    const idRowsLookup = gridRowsLookupSelector(apiRef.current.state);

    return new Map(allRows.map((id) => [id, idRowsLookup[id]]));
  }, [apiRef]);

  const getRowsCount = React.useCallback<GridRowApi['getRowsCount']>(
    () => gridRowCountSelector(apiRef.current.state),
    [apiRef],
  );

  const getAllRowIds = React.useCallback<GridRowApi['getAllRowIds']>(
    () => gridRowIdsSelector(apiRef.current.state),
    [apiRef],
  );

  const setRowExpansion = React.useCallback<GridRowApi['UNSTABLE_setRowExpansion']>(
    (id, isExpanded) => {
      setGridState((state) => {
        const node = apiRef.current.UNSTABLE_getRowNode(id);
        if (!node) {
          throw new Error(`MUI: No row with id #${id} found`);
        }

        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: { ...node, expanded: isExpanded } },
          },
        };
      });
      forceUpdate();
      apiRef.current.publishEvent(GridEvents.rowsSet);
    },
    [apiRef, setGridState, forceUpdate],
  );

  const getRowNode = React.useCallback<GridRowApi['UNSTABLE_getRowNode']>(
    (id) => gridRowTreeSelector(apiRef.current.state)[id] ?? null,
    [apiRef],
  );

  React.useEffect(() => {
    return () => {
      if (rowsCache.current.timeout !== null) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(rowsCache.current.timeout);
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

    logger.debug(`Updating all rows, new length ${props.rows.length}`);
    throttledRowsChange(
      convertGridRowsPropToState(props.rows, props.rowCount, props.getRowId),
      false,
    );
  }, [props.rows, props.rowCount, props.getRowId, logger, throttledRowsChange]);

  const handleGroupRows = React.useCallback(() => {
    logger.info(`Row grouping pre-processing have changed, regenerating the row tree`);
    throttledRowsChange(
      convertGridRowsPropToState(rowsCache.current.state.inputRows, props.rowCount, props.getRowId),
      false,
    );
  }, [logger, throttledRowsChange, props.rowCount, props.getRowId]);

  useGridApiEventHandler(apiRef, GridEvents.rowGroupsPreProcessingChange, handleGroupRows);

  const rowApi: GridRowApi = {
    getRowIndex,
    getRowIdFromRowIndex,
    getRow,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
    UNSTABLE_setRowExpansion: setRowExpansion,
    UNSTABLE_getRowNode: getRowNode,
  };

  useGridApiMethod(apiRef, rowApi, 'GridRowApi');
};
