import * as React from 'react';
import { ROWS_UPDATED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { RowApi } from '../../../models/api/rowApi';
import { createRowModel, RowData, RowId, RowModel, Rows, RowsProp } from '../../../models/rows';
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
    const rowModel = createRowModel(rowData);
    state.allRows.push(rowData.id);
    state.idRowsLookup[rowModel.id] = rowModel;
  });
  return state;
}

export const useRows = (rows: RowsProp, apiRef: ApiRef): RowModel[] => {
  const logger = useLogger('useRows');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const internalRowsState = React.useRef<InternalRowsState>(gridState.rows);

  React.useEffect(() => {
    setGridState((state) => {
      internalRowsState.current = convertRowsPropToState({
        rows,
        totalRowCount: state.options.rowCount,
      });
      return { ...state, rows: internalRowsState.current };
    });
  }, [rows, setGridState]);

  const updateAllRows = React.useCallback(
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

      if (!apiRef.current.state.isScrolling) {
        setGridState((state) => ({ ...state, rows: internalRowsState.current }));
        forceUpdate();
      }
    },
    [logger, gridState.options, apiRef, setGridState, forceUpdate],
  );

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

  const updateRowModels = React.useCallback(
    (updates: Partial<RowModel>[]) => {
      logger.debug(`updating ${updates.length} row models`);
      const addedRows: RowModel[] = [];
      // const newRowsState = { ...apiRef.current.state.rows };

      updates.forEach((partialRow) => {
        if (partialRow.id == null) {
          throw new Error('Material-UI: All rows need an id.');
        }
        if (!getRowFromId(partialRow.id)) {
          // New row?
          addedRows.push(partialRow as RowModel);
          return;
        }

        Object.assign(internalRowsState.current.idRowsLookup[partialRow.id!], partialRow);
      });

      if (!apiRef.current.state.isScrolling) {
        setGridState((state) => ({ ...state, rows: internalRowsState.current }));
        forceUpdate();
      }

      if (addedRows.length > 0) {
        const newRows = [
          ...Object.values<RowModel>(internalRowsState.current.idRowsLookup),
          ...addedRows,
        ];
        updateAllRows(newRows);
      }

      apiRef.current.publishEvent(
        ROWS_UPDATED,
        Object.values<RowModel>(internalRowsState.current.idRowsLookup),
      );
    },
    [logger, apiRef, getRowFromId, setGridState, forceUpdate, updateAllRows],
  );

  const updateRowData = React.useCallback(
    (updates: RowData[]) => {
      logger.debug(`updating rows data`);

      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = updates.reduce((uniq, update) => {
        if (update.id == null) {
          throw new Error(
            [
              'Material-UI: The data grid component requires all rows to have a unique id property.',
              'A row was provided without when calling updateRowData():',
              JSON.stringify(update),
            ].join('\n'),
          );
        }

        uniq[update.id] = uniq[update.id] != null ? { ...uniq[update.id], ...update } : update;
        return uniq;
      }, {} as { [id: string]: any });

      const rowModelUpdates = Object.values<RowData>(uniqUpdates).map((partialRow) => {
        const oldRow = getRowFromId(partialRow.id!);
        if (!oldRow) {
          return createRowModel(partialRow);
        }
        return { ...oldRow, data: { ...oldRow.data, ...partialRow } };
      });
      return updateRowModels(rowModelUpdates);
    },
    [updateRowModels, logger, getRowFromId],
  );

  const getRowModels = React.useCallback(
    () => Object.values<RowModel>(apiRef.current.state.rows.idRowsLookup),
    [apiRef],
  );
  const getRowsCount = React.useCallback(() => apiRef.current.state.rows.totalRowCount, [apiRef]);
  const getAllRowIds = React.useCallback(() => apiRef.current.state.rows.allRows, [apiRef]);
  const setRowModels = React.useCallback((rowsParam: Rows) => updateAllRows(rowsParam), [
    updateAllRows,
  ]);

  const rowApi: RowApi = {
    getRowIndexFromId,
    getRowIdFromRowIndex,
    getRowFromId,
    updateRowModels,
    updateRowData,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRowModels,
  };

  useApiMethod(apiRef, rowApi, 'RowApi');

  const rowModelsState = React.useMemo(() => Object.values<RowModel>(gridState.rows.idRowsLookup), [
    gridState.rows,
  ]);

  return rowModelsState;
};
