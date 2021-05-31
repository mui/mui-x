import * as React from 'react';
import {
  GRID_ROWS_CLEARED,
  GRID_ROWS_SET,
  GRID_ROWS_UPDATED,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridRowApi } from '../../../models/api/gridRowApi';
import {
  checkGridRowIdIsValid,
  GridRowModel,
  GridRowModelUpdate,
  GridRowId,
  GridRowsProp,
  GridRowIdGetter,
  GridRowData,
  GridInsertRowParams,
} from '../../../models/gridRows';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { getInitialGridRowState, InternalGridRowsState } from './gridRowsState';

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
  totalRowCount?: number,
  rowIdGetter?: GridRowIdGetter,
  pagination?: boolean,
): InternalGridRowsState {
  const numberOfRows = totalRowCount && totalRowCount > rows.length ? totalRowCount : rows.length;
  const initialRowState = pagination
    ? getInitialGridRowState()
    : getInitialGridRowState(numberOfRows);
  const state: InternalGridRowsState = {
    ...initialRowState,
    totalRowCount: numberOfRows,
  };

  rows.forEach((rowData, index) => {
    const id = getGridRowId(rowData, rowIdGetter);
    state.allRows[index] = id;
    state.idRowsLookup[id] = rowData;
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
        state.options.pagination,
      );
      return { ...state, rows: internalRowsState.current };
    });
  }, [getRowIdProp, rows, setGridState]);

  const getRowIndexFromId = React.useCallback(
    (id: GridRowId): number => {
      if (apiRef.current.getSortedRowIds) {
        return apiRef.current.getSortedRowIds().indexOf(id);
      }
      return apiRef.current.state.rows.allRows.indexOf(id);
    },
    [apiRef],
  );
  const getRowIdFromRowIndex = React.useCallback(
    (index: number): GridRowId => {
      if (apiRef.current.getSortedRowIds) {
        return apiRef.current.getSortedRowIds()[index];
      }
      return apiRef.current.state.rows.allRows[index];
    },
    [apiRef],
  );
  const getRow = React.useCallback(
    (id: GridRowId): GridRowModel => apiRef.current.state.rows.idRowsLookup[id],
    [apiRef],
  );

  const insertRows = React.useCallback(
    ({ startIndex, pageSize, newRows, rowCount }: GridInsertRowParams) => {
      logger.debug(`Insert rows from index:${startIndex}`);

      const newRowsToState = convertGridRowsPropToState(newRows, newRows.length, getRowIdProp);

      setGridState((state) => {
        // rowCount can be 0
        const allRows =
          rowCount !== undefined ? new Array(rowCount).fill(null) : state.rows.allRows;
        const allRowsUpdated = allRows.map((row, index) => {
          if (index >= startIndex && index < startIndex + pageSize) {
            return newRowsToState.allRows[index - startIndex];
          }
          return row;
        });

        const idRowsLookupUpdated =
          rowCount !== undefined
            ? newRowsToState.idRowsLookup
            : { ...state.rows.idRowsLookup, ...newRowsToState.idRowsLookup };

        internalRowsState.current = {
          allRows: allRowsUpdated,
          idRowsLookup: idRowsLookupUpdated,
          totalRowCount: rowCount !== undefined ? rowCount : state.rows.totalRowCount,
        };
        return { ...state, rows: internalRowsState.current };
      });

      forceUpdate();
      apiRef.current.updateViewport();
      apiRef.current.applySorting();
    },
    [logger, apiRef, getRowIdProp, setGridState, forceUpdate],
  );

  const setRows = React.useCallback(
    (allNewRows: GridRowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);

      if (internalRowsState.current.allRows.length > 0) {
        apiRef.current.publishEvent(GRID_ROWS_CLEARED);
      }

      const allRows: GridRowId[] = [];
      const idRowsLookup = allNewRows.reduce((acc, row) => {
        const id = getGridRowId(row, getRowIdProp);
        acc[id] = row;
        allRows.push(id);
        return acc;
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
      const uniqUpdates = updates.reduce((acc, update) => {
        const id = getGridRowId(
          update,
          getRowIdProp,
          'A row was provided without id when calling updateRows():',
        );
        acc[id] = acc[id] != null ? { ...acc[id!], ...update } : update;
        return acc;
      }, {} as { [id: string]: GridRowModel });

      const addedRows: GridRowModel[] = [];
      const deletedRowIds: GridRowId[] = [];

      Object.entries<GridRowModel>(uniqUpdates).forEach(([id, partialRow]) => {
        // eslint-disable-next-line no-underscore-dangle
        if (partialRow._action === 'delete') {
          deletedRowIds.push(id);
          return;
        }

        const oldRow = getRow(id);
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

      if (deletedRowIds.length > 0 || addedRows.length > 0) {
        deletedRowIds.forEach((id) => {
          delete internalRowsState.current.idRowsLookup[id];
        });
        const newRows = [
          ...Object.values<GridRowModel>(internalRowsState.current.idRowsLookup),
          ...addedRows,
        ];
        setRows(newRows);
      }
      forceUpdate(() => apiRef.current.publishEvent(GRID_ROWS_UPDATED));
    },
    [apiRef, forceUpdate, getRow, getRowIdProp, setGridState, setRows],
  );

  const getRowModels = React.useCallback(
    () =>
      new Map(
        apiRef.current.state.rows.allRows.map((id) => [
          id,
          apiRef.current.state.rows.idRowsLookup[id],
        ]),
      ),
    [apiRef],
  );
  const getRowsCount = React.useCallback(() => apiRef.current.state.rows.totalRowCount, [apiRef]);
  const getAllRowIds = React.useCallback(() => apiRef.current.state.rows.allRows, [apiRef]);

  const rowApi: GridRowApi = {
    getRowIndex: getRowIndexFromId,
    getRowIdFromRowIndex,
    getRow,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
    insertRows,
  };
  useGridApiMethod(apiRef, rowApi, 'GridRowApi');
};
