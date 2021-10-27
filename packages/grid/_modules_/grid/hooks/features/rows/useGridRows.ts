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
} from '../../../models/gridRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../../utils/useGridState';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { GridRowsState } from './gridRowsState';
import {
  gridRowCountSelector,
  gridRowsLookupSelector,
  gridRowIdsSelector,
} from './gridRowsSelector';

export interface GridRowsInternalCache {
  state: GridRowsState;
  timeout: NodeJS.Timeout | null;
  lastUpdateMs: number | null;
}

function getGridRowId(
  rowModel: GridRowModel,
  getRowId?: GridRowIdGetter,
  detailErrorMessage?: string,
): GridRowId {
  const id = getRowId ? getRowId(rowModel) : rowModel.id;
  checkGridRowIdIsValid(id, rowModel, detailErrorMessage);
  return id;
}

export function convertGridRowsPropToState(
  rows: GridRowsProp,
  propRowCount?: number,
  rowIdGetter?: GridRowIdGetter,
): GridRowsState {
  const state: GridRowsState = {
    idRowsLookup: {},
    allRows: [],
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
  if (process.env.NODE_ENV !== 'production') {
    // Freeze rows for immutability
    Object.freeze(props.rows);
  }

  const logger = useGridLogger(apiRef, 'useGridRows');

  const rowsCache = React.useRef<GridRowsInternalCache>({
    state: {
      idRowsLookup: {},
      allRows: [],
      totalRowCount: 0,
    },
    timeout: null,
    lastUpdateMs: Date.now(),
  });

  useGridStateInit(apiRef, (state) => {
    rowsCache.current.state = convertGridRowsPropToState(
      props.rows,
      props.rowCount,
      props.getRowId,
    );

    return { ...state, rows: rowsCache.current.state };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);

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

  const throttledRowsChange = React.useCallback(
    (newState: GridRowsState, throttle: boolean) => {
      const run = () => {
        rowsCache.current.timeout = null;
        rowsCache.current.lastUpdateMs = Date.now();
        setGridState((state) => ({ ...state, rows: rowsCache.current.state }));
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
        rowsCache.current.lastUpdateMs === null
          ? 0
          : props.throttleRowsMs - (Date.now() - rowsCache.current.lastUpdateMs);

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
      let allRows = [...rowsCache.current.state.allRows];

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
          allRows.push(id);
          return;
        }

        idRowsLookup[id] = { ...apiRef.current.getRow(id), ...partialRow };
      });

      if (deletedRowIds.length > 0) {
        allRows = allRows.filter((id) => !deletedRowIds.includes(id));
      }

      const totalRowCount =
        props.rowCount && props.rowCount > allRows.length ? props.rowCount : allRows.length;

      const state: GridRowsState = {
        idRowsLookup,
        allRows,
        totalRowCount,
      };

      throttledRowsChange(state, true);
    },
    [apiRef, props.getRowId, props.rowCount, throttledRowsChange],
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
