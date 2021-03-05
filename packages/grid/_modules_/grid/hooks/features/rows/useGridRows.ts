import * as React from 'react';
import {
  GRID_ROWS_CLEARED,
  GRID_ROWS_SET,
  GRID_ROWS_UPDATED,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridRowApi } from '../../../models/api/gridRowApi';
import {
  checkGridRowHasId,
  GridRowModel,
  GridRowModelUpdate,
  GridRowId,
  GridRowsProp,
  GridRowIdGetter,
  GridRowData,
} from '../../../models/gridRows';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { getInitialGridRowState, InternalGridRowsState } from './gridRowsState';

export function addGridRowId(rowData: GridRowData, getRowId?: GridRowIdGetter): GridRowModel {
  return getRowId == null ? (rowData as GridRowModel) : { id: getRowId(rowData), ...rowData };
}

export function convertGridRowsPropToState(
  rows: GridRowsProp,
  totalRowCount?: number,
  rowIdGetter?: GridRowIdGetter,
): InternalGridRowsState {
  const state: InternalGridRowsState = {
    ...getInitialGridRowState(),
    totalRowCount: totalRowCount && totalRowCount > rows.length ? totalRowCount : rows.length,
  };

  rows.forEach((rowData) => {
    const row = addGridRowId(rowData, rowIdGetter);
    checkGridRowHasId(row);
    state.allRows.push(row.id);
    state.idRowsLookup[row.id] = row;
  });

  return state;
}

export const useGridRows = (
  apiRef: GridApiRef,
  rows: GridRowsProp,
  getRowIdProp?: GridRowIdGetter,
): void => {
  const logger = useLogger('useGridRows');
  const [gridState, setGridState, updateComponent] = useGridState(apiRef);
  const updateTimeout = React.useRef<any>();

  const forceUpdate = React.useCallback(
    (preUpdateCallback?: Function) => {
      if (updateTimeout.current == null) {
        updateTimeout.current = setTimeout(() => {
          logger.debug(`Updating component`);
          updateTimeout.current = null;
          if (preUpdateCallback) {
            preUpdateCallback();
          }
          updateComponent();
        }, 100);
      }
    },
    [logger, updateComponent],
  );

  const internalRowsState = React.useRef<InternalGridRowsState>(gridState.rows);

  React.useEffect(() => {
    return () => clearTimeout(updateTimeout!.current);
  }, []);

  React.useEffect(() => {
    setGridState((state) => {
      internalRowsState.current = convertGridRowsPropToState(
        rows,
        state.options.rowCount,
        getRowIdProp,
      );
      return { ...state, rows: internalRowsState.current };
    });
  }, [getRowIdProp, rows, setGridState]);

  const getRowIndexFromId = React.useCallback(
    (id: GridRowId): number => apiRef.current.state.rows.allRows.indexOf(id),
    [apiRef],
  );
  const getRowIdFromRowIndex = React.useCallback(
    (index: number): GridRowId => apiRef.current.state.rows.allRows[index],
    [apiRef],
  );
  const getRowFromId = React.useCallback(
    (id: GridRowId): GridRowModel => apiRef.current.state.rows.idRowsLookup[id],
    [apiRef],
  );

  const setRows = React.useCallback(
    (allNewRows: GridRowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);

      if (internalRowsState.current.allRows.length > 0) {
        apiRef.current.publishEvent(GRID_ROWS_CLEARED);
      }

      const allRows: GridRowId[] = [];
      const idRowsLookup = allNewRows.reduce((lookup, row) => {
        row = addGridRowId(row, getRowIdProp);
        checkGridRowHasId(row);
        lookup[row.id] = row;
        allRows.push(row.id);
        return lookup;
      }, {});

      const totalRowCount =
        gridState.options &&
        gridState.options.rowCount &&
        gridState.options.rowCount > allRows.length
          ? gridState.options.rowCount
          : allRows.length;

      internalRowsState.current = { idRowsLookup, allRows, totalRowCount };

      setGridState((state) => ({ ...state, rows: internalRowsState.current }));

      forceUpdate(() => apiRef.current.publishEvent(GRID_ROWS_SET));
    },
    [logger, gridState.options, setGridState, forceUpdate, apiRef, getRowIdProp],
  );

  const updateRows = React.useCallback(
    (updates: GridRowModelUpdate[]) => {
      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = updates.reduce((uniq, update) => {
        const udpateWithId = addGridRowId(update, getRowIdProp);
        const id = udpateWithId.id;
        checkGridRowHasId(udpateWithId, 'A row was provided without id when calling updateRows():');
        uniq[id] = uniq[id] != null ? { ...uniq[id!], ...udpateWithId } : udpateWithId;
        return uniq;
      }, {} as { [id: string]: GridRowModel });

      const addedRows: GridRowModel[] = [];
      const deletedRows: GridRowModel[] = [];

      Object.entries<GridRowModel>(uniqUpdates).forEach(([id, partialRow]) => {
        // eslint-disable-next-line no-underscore-dangle
        if (partialRow._action === 'delete') {
          deletedRows.push(partialRow);
          return;
        }

        const oldRow = getRowFromId(id);
        if (!oldRow) {
          addedRows.push(partialRow);
          return;
        }
        const lookup = { ...internalRowsState.current.idRowsLookup };

        lookup[id] = {
          ...oldRow,
          ...partialRow,
        };
        internalRowsState.current.idRowsLookup = lookup;
      });

      setGridState((state) => ({ ...state, rows: { ...internalRowsState.current } }));

      if (deletedRows.length > 0 || addedRows.length > 0) {
        deletedRows.forEach((row) => {
          delete internalRowsState.current.idRowsLookup[row.id];
        });
        const newRows = [
          ...Object.values<GridRowModel>(internalRowsState.current.idRowsLookup),
          ...addedRows,
        ];
        setRows(newRows);
      }
      forceUpdate(() => apiRef.current.publishEvent(GRID_ROWS_UPDATED));
    },
    [apiRef, forceUpdate, getRowFromId, getRowIdProp, setGridState, setRows],
  );

  const getRowModels = React.useCallback(
    () => apiRef.current.state.rows.allRows.map((id) => apiRef.current.state.rows.idRowsLookup[id]),
    [apiRef],
  );
  const getRowsCount = React.useCallback(() => apiRef.current.state.rows.totalRowCount, [apiRef]);
  const getAllRowIds = React.useCallback(() => apiRef.current.state.rows.allRows, [apiRef]);

  const rowApi: GridRowApi = {
    getRowIndexFromId,
    getRowIdFromRowIndex,
    getRowFromId,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
  };
  useGridApiMethod(apiRef, rowApi, 'GridRowApi');
};
