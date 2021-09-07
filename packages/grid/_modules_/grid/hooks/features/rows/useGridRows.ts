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
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../core/useGridState';
import {getInitialGridRowState, GridRowsInternalCache, GridRowsState} from './gridRowsState';
import {
  gridRowCountSelector,
  gridRowsLookupSelector,
  unorderedGridRowIdsSelector,
} from './gridRowsSelector';

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
  rows: GridRowsProp,
  propRowCount?: number,
  rowIdGetter?: GridRowIdGetter,
): GridRowsState {
  const state: GridRowsState = {
    ...getInitialGridRowState(),
    totalRowCount: propRowCount && propRowCount > rows.length ? propRowCount : rows.length,
  };

  rows.forEach((rowData) => {
    const id = getGridRowId(rowData, rowIdGetter);
    state.allRows.push(id);
    state.idRowsLookup[id] = rowData;
  });

  return state;
}

/**
 * @requires useGridSorting (method)
 * TODO: Impossible priority - useGridSorting also needs to be after useGridRows (which causes all the existence check for apiRef.current.apiRef.current.getSortedRowIds)
 */
export const useGridRows = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'rows' | 'getRowId' | 'rowCount' | 'throttleRowsMs'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridRows');
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const rowsCache = React.useRef() as React.MutableRefObject<GridRowsInternalCache>;

  if (!rowsCache.current) {
    rowsCache.current = {
      state: getInitialGridRowState(),
      timeout: null,
      lastUpdateMs: 0,
    }
  }

  const getRowIndex = React.useCallback<GridRowApi['getRowIndex']>(
    (id) => {
      if (apiRef.current.getSortedRowIds) {
        return apiRef.current.getSortedRowIds().indexOf(id);
      }
      return apiRef.current.state.rows.allRows.indexOf(id);
    },
    [apiRef],
  );

  const getRowIdFromRowIndex = React.useCallback<GridRowApi['getRowIdFromRowIndex']>(
    (index) => {
      if (apiRef.current.getSortedRowIds) {
        return apiRef.current.getSortedRowIds()[index];
      }
      return apiRef.current.state.rows.allRows[index];
    },
    [apiRef],
  );

  const getRow = React.useCallback<GridRowApi['getRow']>(
    (id) => gridRowsLookupSelector(apiRef.current.state)[id] ?? null,
    [apiRef],
  );

  const throttledRowsChange = React.useCallback((newState: GridRowsState, throttle: boolean) => {
    const run = () => {
      rowsCache.current.timeout = null;
      rowsCache.current.lastUpdateMs = Date.now()
      setGridState((state) => ({ ...state, rows: rowsCache.current.state }));
      apiRef.current.publishEvent(GridEvents.rowsSet)
      forceUpdate();
    }

    if (rowsCache.current.timeout) {
      clearTimeout(rowsCache.current.timeout)
    }

    rowsCache.current.state = newState
    rowsCache.current.timeout = null

    const throttleRemainingTimeMs = props.throttleRowsMs - (Date.now() - rowsCache.current.lastUpdateMs)

    if (throttle && throttleRemainingTimeMs > 0) {
      rowsCache.current.timeout = setTimeout(run, throttleRemainingTimeMs)
    } else {
      run()
    }

  }, [apiRef, forceUpdate, setGridState, rowsCache, props.throttleRowsMs])

  const setRows = React.useCallback<GridRowApi['setRows']>(
    (rows) => {
      logger.debug(`Updating all rows, new length ${rows.length}`);
      throttledRowsChange(convertGridRowsPropToState(rows, props.rowCount, props.getRowId), true)
    },
    [logger, throttledRowsChange, props.rowCount, props.getRowId],
  );

  const updateRows = React.useCallback<GridRowApi['updateRows']>(
    (updates) => {
      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = updates.reduce<{ [id: string]: GridRowModel }>((acc, update) => {
        const id = getGridRowId(
          update,
          props.getRowId,
          'A row was provided without id when calling updateRows():',
        );
        acc[id] = acc[id] != null ? { ...acc[id!], ...update } : update;
        return acc;
      }, {});

      const addedRows: [GridRowId, GridRowModel][] = [];
      const modifiedRows: [GridRowId, GridRowModel][] = []
      const deletedRowIds: GridRowId[] = [];

      Object.entries(uniqUpdates).forEach(([id, partialRow]) => {
        // eslint-disable-next-line no-underscore-dangle
        if (partialRow._action === 'delete') {
          deletedRowIds.push(id);
          return;
        }

        const oldRow = apiRef.current.getRow(id);
        if (!oldRow) {
          addedRows.push([id, partialRow]);
          return;
        }

        modifiedRows.push([id, partialRow])
      });

      if (deletedRowIds.length > 0) {
        deletedRowIds.forEach(id => {
          delete rowsCache.current.state.idRowsLookup[id]
        })
      }

      const state = { ...rowsCache.current.state }

      if (addedRows.length > 0) {
        state.idRowsLookup = {
          ...state.idRowsLookup,
          ...Object.fromEntries(addedRows)
        }
      }

      if (modifiedRows.length > 0) {
        state.idRowsLookup = {
          ...state.idRowsLookup,
          ...Object.fromEntries(modifiedRows.map(([id, partialRow]) => [id, { ...apiRef.current.getRow(id), ...partialRow}]))
        }
      }

      state.allRows = Object.keys(rowsCache.current.state.idRowsLookup)
      state.totalRowCount = props.rowCount && props.rowCount > state.allRows.length ? props.rowCount : state.allRows.length

      throttledRowsChange(state, true)
    },
    [apiRef, props.getRowId, props.rowCount, throttledRowsChange],
  );

  const getRowModels = React.useCallback<GridRowApi['getRowModels']>(() => {
    const allRows = unorderedGridRowIdsSelector(apiRef.current.state);
    const idRowsLookup = gridRowsLookupSelector(apiRef.current.state);

    return new Map(allRows.map((id) => [id, idRowsLookup[id]]));
  }, [apiRef]);

  const getRowsCount = React.useCallback<GridRowApi['getRowsCount']>(
    () => gridRowCountSelector(apiRef.current.state),
    [apiRef],
  );

  const getAllRowIds = React.useCallback<GridRowApi['getAllRowIds']>(
    () => unorderedGridRowIdsSelector(apiRef.current.state),
    [apiRef],
  );

  React.useEffect(() => {
    return () => {
      if (rowsCache.current.timeout !== null) {
        clearTimeout(rowsCache.current.timeout);
      }
    };
  }, []);

  React.useEffect(() => {
    logger.debug(`Updating all rows, new length ${props.rows.length}`);
    throttledRowsChange(convertGridRowsPropToState(props.rows, props.rowCount, props.getRowId), false)
  }, [props.rows, props.rowCount, props.getRowId, logger, throttledRowsChange]);

  const rowApi: GridRowApi = {
    getRowIndex,
    getRowIdFromRowIndex,
    getRow,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
  };

  useGridApiMethod(apiRef, rowApi, 'GridRowApi');
};
