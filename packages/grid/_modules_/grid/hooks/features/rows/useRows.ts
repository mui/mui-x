import * as React from 'react';
import { ROWS_CLEARED, ROWS_SET, ROWS_UPDATED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { RowApi } from '../../../models/api/rowApi';
import {
  checkRowHasId,
  RowModel,
  RowModelUpdate,
  RowId,
  RowsProp,
  RowIdGetter,
  RowData,
} from '../../../models/rows';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { getInitialRowState, InternalRowsState } from './rowsState';

export function addRowId(rowData: RowData, getRowId?: RowIdGetter): RowModel {
  return getRowId == null ? (rowData as RowModel) : { id: getRowId(rowData), ...rowData };
}

export function convertRowsPropToState(
  rows: RowsProp,
  totalRowCount?: number,
  rowIdGetter?: RowIdGetter,
): InternalRowsState {
  const state: InternalRowsState = {
    ...getInitialRowState(),
    totalRowCount: totalRowCount && totalRowCount > rows.length ? totalRowCount : rows.length,
  };

  rows.forEach((rowData) => {
    const row = addRowId(rowData, rowIdGetter);
    checkRowHasId(row);
    state.allRows.push(row.id);
    state.idRowsLookup[row.id] = row;
  });

  return state;
}

export const useRows = (apiRef: ApiRef, rows: RowsProp, getRowIdProp?: RowIdGetter): void => {
  const logger = useLogger('useRows');
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

  const internalRowsState = React.useRef<InternalRowsState>(gridState.rows);

  React.useEffect(() => {
    return () => clearTimeout(updateTimeout!.current);
  }, []);

  React.useEffect(() => {
    setGridState((state) => {
      internalRowsState.current = convertRowsPropToState(
        rows,
        state.options.rowCount,
        getRowIdProp,
      );
      return { ...state, rows: internalRowsState.current };
    });
  }, [getRowIdProp, rows, setGridState]);

  const getRowIndexFromId = React.useCallback(
    (id: RowId): number => apiRef.current.state.rows.allRows.indexOf(id),
    [apiRef],
  );
  const getRowIdFromRowIndex = React.useCallback(
    (index: number): RowId => apiRef.current.state.rows.allRows[index],
    [apiRef],
  );
  const getRowFromId = React.useCallback(
    (id: RowId): RowModel => apiRef.current.state.rows.idRowsLookup[id],
    [apiRef],
  );

  const setRows = React.useCallback(
    (allNewRows: RowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);

      if (internalRowsState.current.allRows.length > 0) {
        apiRef.current.publishEvent(ROWS_CLEARED);
      }

      const allRows: RowId[] = [];
      const idRowsLookup = allNewRows.reduce((lookup, row) => {
        row = addRowId(row, getRowIdProp);
        checkRowHasId(row);
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

      forceUpdate(() => apiRef.current.publishEvent(ROWS_SET));
    },
    [logger, gridState.options, setGridState, forceUpdate, apiRef, getRowIdProp],
  );

  const updateRows = React.useCallback(
    (updates: RowModelUpdate[]) => {
      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = updates.reduce((uniq, update) => {
        const udpateWithId = addRowId(update, getRowIdProp);
        const id = udpateWithId.id;
        checkRowHasId(udpateWithId, 'A row was provided without id when calling updateRows():');
        uniq[id] = uniq[id] != null ? { ...uniq[id!], ...udpateWithId } : udpateWithId;
        return uniq;
      }, {} as { [id: string]: RowModel });

      const addedRows: RowModel[] = [];
      const deletedRows: RowModel[] = [];

      Object.entries<RowModel>(uniqUpdates).forEach(([id, partialRow]) => {
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
        Object.assign(internalRowsState.current.idRowsLookup[id], {
          ...oldRow,
          ...partialRow,
        });
      });

      setGridState((state) => ({ ...state, rows: internalRowsState.current }));

      if (deletedRows.length > 0 || addedRows.length > 0) {
        deletedRows.forEach((row) => {
          delete internalRowsState.current.idRowsLookup[row.id];
        });
        const newRows = [
          ...Object.values<RowModel>(internalRowsState.current.idRowsLookup),
          ...addedRows,
        ];
        setRows(newRows);
      }
      forceUpdate(() => apiRef.current.publishEvent(ROWS_UPDATED));
    },
    [apiRef, forceUpdate, getRowFromId, getRowIdProp, setGridState, setRows],
  );

  const getRowModels = React.useCallback(
    () => apiRef.current.state.rows.allRows.map((id) => apiRef.current.state.rows.idRowsLookup[id]),
    [apiRef],
  );
  const getRowsCount = React.useCallback(() => apiRef.current.state.rows.totalRowCount, [apiRef]);
  const getAllRowIds = React.useCallback(() => apiRef.current.state.rows.allRows, [apiRef]);

  const rowApi: RowApi = {
    getRowIndexFromId,
    getRowIdFromRowIndex,
    getRowFromId,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
  };
  useApiMethod(apiRef, rowApi, 'RowApi');
};
