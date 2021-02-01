import * as React from 'react';
import { ROWS_CLEARED, ROWS_SET, ROWS_UPDATED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { RowApi } from '../../../models/api/rowApi';
import { checkRowHasId, RowModel, RowId, RowsProp, RowIdGetter, RowData } from '../../../models/rows';
import { useApiMethod } from '../../root/useApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { getInitialRowState, InternalRowsState } from './rowsState';

export function addRowId(getRowId: RowIdGetter, rowData: RowData): RowModel {
  // checkRowHasId(rowData, getRowId);
  return {...rowData, id: getRowId(rowData) };
}

export function convertRowsPropToState(rows: RowsProp, rowIdGetter: RowIdGetter,  totalRowCount?: number,): InternalRowsState {
  const state: InternalRowsState = {
    ...getInitialRowState(),
    totalRowCount: totalRowCount && totalRowCount > rows.length ? totalRowCount : rows.length,
  };

  rows.forEach((rowData) => {
    const row = addRowId(rowIdGetter, rowData);
    state.allRows.push(row.id);
    state.idRowsLookup[row.id] = row;
  });

  return state;
}

export const useRows = (rows: RowsProp, apiRef: ApiRef): void => {
  const logger = useLogger('useRows');
  const [gridState, setGridState, updateComponent] = useGridState(apiRef);
  const {getRowId} = gridState.options; //useGridSelector(apiRef, optionsSelector);
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
      internalRowsState.current = convertRowsPropToState(rows, getRowId, state.options.rowCount);
      return { ...state, rows: internalRowsState.current };
    });
  }, [getRowId, rows, setGridState]);

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

      const idRowsLookup = allNewRows.reduce((lookup, row) => {
        row = addRowId(getRowId, row)
        lookup[row.id] = row;
        return lookup;
      }, {});
      const allRows = allNewRows.map((row) => getRowId(row));
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
    [logger, gridState.options, setGridState, forceUpdate, apiRef, getRowId],
  );

  const updateRows = React.useCallback(
    (updates: Partial<RowModel>[]) => {
      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = updates.reduce((uniq, update) => {
        checkRowHasId(update, getRowId, 'A row was provided without id when calling updateRows():');
        const id = getRowId(update);
        uniq[id] = uniq[id] != null ? { ...uniq[id!], ...update } : update;
        return uniq;
      }, {} as { [id: string]: any });

      const addedRows: RowModel[] = [];

      Object.entries<RowModel>(uniqUpdates).forEach(([id, partialRow]) => {
        const oldRow = getRowFromId(id);
        if (!oldRow) {
          addedRows.push(partialRow as RowModel);
          return;
        }
        Object.assign(internalRowsState.current.idRowsLookup[id], {
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
      }

      forceUpdate(() => apiRef.current.publishEvent(ROWS_UPDATED));
    },
    [apiRef, forceUpdate, getRowFromId, getRowId, setGridState, setRows],
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
