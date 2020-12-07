import * as React from 'react';
import { RESET_ROWS, ROWS_UPDATED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { RowApi } from '../../../models/api/rowApi';
import { checkRowHasId, RowModel, RowId, RowsProp } from '../../../models/rows';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { InternalRowsState } from './rowsState';

export function convertRowsPropToState({
  rows,
  totalRowCount,
}: {
  rows: RowsProp;
  totalRowCount?: number;
}): InternalRowsState {
  const state: InternalRowsState = {
    allRows: [],
    idRowsLookup: {},
    totalRowCount: totalRowCount && totalRowCount > rows.length ? totalRowCount : rows.length,
  };
  rows.forEach((rowData) => {
    checkRowHasId(rowData);
    state.allRows.push(rowData.id);
    state.idRowsLookup[rowData.id] = rowData;
  });
  return state;
}

export const useRows = (rows: RowsProp, apiRef: ApiRef): void => {
  const logger = useLogger('useRows');
  const [gridState, setGridState, updateComponent] = useGridState(apiRef);
  const updateTimeout = React.useRef<any>();

  const forceUpdate = React.useCallback(
    (callback?: Function) => {
      if (updateTimeout.current == null) {
        updateTimeout.current = setTimeout(() => {
          logger.debug(`Updating component`);
          updateTimeout.current = null;
          updateComponent();
          if (callback) {
            callback();
          }
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
      internalRowsState.current = convertRowsPropToState({
        rows,
        totalRowCount: state.options.rowCount,
      });
      return { ...state, rows: internalRowsState.current };
    });
  }, [rows, setGridState]);

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

      const idRowsLookup = allNewRows.reduce((lookup, row) => {
        lookup[row.id] = row;
        return lookup;
      }, {});
      const allRows = allNewRows.map((row) => row.id);
      const totalRowCount =
        gridState.options &&
        gridState.options.rowCount &&
        gridState.options.rowCount > allRows.length
          ? gridState.options.rowCount
          : allRows.length;

      internalRowsState.current = { idRowsLookup, allRows, totalRowCount };

      setGridState((state) => ({ ...state, rows: internalRowsState.current }));

      apiRef.current.publishEvent(RESET_ROWS);
      forceUpdate();
    },
    [logger, gridState.options, apiRef, setGridState, forceUpdate],
  );

  const updateRows = React.useCallback(
    (updates: Partial<RowModel>[]) => {
      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = updates.reduce((uniq, update) => {
        checkRowHasId(update, 'A row was provided without id when calling updateRows():');
        uniq[update.id!] = uniq[update.id!] != null ? { ...uniq[update.id!], ...update } : update;
        return uniq;
      }, {} as { [id: string]: any });

      const addedRows: RowModel[] = [];

      Object.values<RowModel>(uniqUpdates).forEach((partialRow) => {
        const oldRow = getRowFromId(partialRow.id!);
        if (!oldRow) {
          addedRows.push(partialRow as RowModel);
          return;
        }
        Object.assign(internalRowsState.current.idRowsLookup[partialRow.id!], {
          ...oldRow,
          ...partialRow,
        });
      });

      setGridState((state) => ({ ...state, rows: internalRowsState.current }));

      if (addedRows.length > 0) {
        const newRows = [
          ...Object.values<RowModel>(internalRowsState.current.idRowsLookup),
          ...addedRows,
        ];
        setRows(newRows);
      } else {
        forceUpdate(() => apiRef.current.publishEvent(ROWS_UPDATED));
      }
    },
    [apiRef, forceUpdate, getRowFromId, setGridState, setRows],
  );

  const getRowModels = React.useCallback(
    () => Object.values<RowModel>(apiRef.current.state.rows.idRowsLookup),
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
