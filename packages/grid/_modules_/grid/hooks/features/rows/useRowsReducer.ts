import * as React from 'react';
import { ROWS_UPDATED, SORT_MODEL_CHANGE } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { RowApi } from '../../../models/api/rowApi';
import { createRowModel, RowData, RowId, RowModel, Rows, RowsProp } from '../../../models/rows';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridReducer } from '../core/useGridReducer';
import {
  getInitialRowState,
  InternalRowsState,
  rowPropChangedActionCreator,
  rowReducer,
  RowsActions,
  updateRowStateActionCreator,
} from './rowsReducer';

export const useRowsReducer = (
  rows: RowsProp,
  apiRef: ApiRef,
): RowModel[] => {
  const logger = useLogger('useRows');

  const {gridState, dispatch} = useGridReducer<InternalRowsState, RowsActions>(apiRef, 'rows', rowReducer, getInitialRowState());

  React.useEffect(()=> {
    dispatch(rowPropChangedActionCreator(rows, gridState.options?.rowCount));
  }, [rows, gridState.options?.rowCount, dispatch]);

  const isSortedRef = React.useRef<boolean>(false);

  const updateAllRows = React.useCallback(
    (allNewRows: RowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);

      const idRowsLookup = allNewRows.reduce((lookup, row, index) => {
        lookup[row.id] = row;
        return lookup;
      }, {});
      const allRows = allNewRows.map(row=> row.id);
      const totalRowCount =  gridState.options &&  gridState.options.rowCount &&  gridState.options.rowCount > allRows.length ?  gridState.options.rowCount : allRows.length;

      dispatch(updateRowStateActionCreator( {idRowsLookup, allRows, totalRowCount}))

    },
    [logger, gridState.options, dispatch],
  );

  const getRowIndexFromId = React.useCallback((id: RowId): number =>
    apiRef.current.state.rows.allRows.indexOf(id), [apiRef]);
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
      const newRowsState = {...apiRef.current.state.rows};

      updates.forEach((partialRow) => {
        if (partialRow.id == null) {
          throw new Error('Material-UI: All rows need an id.');
        }
        const idx = getRowIndexFromId(partialRow.id);
        if (idx === -1) {
          // New row?
          addedRows.push(partialRow as RowModel);
          return;
        }

          Object.assign(newRowsState.idRowsLookup[partialRow.id!], partialRow);
      });
      dispatch(updateRowStateActionCreator( newRowsState))

      if (addedRows.length > 0) {
        const newRows = [...Object.values<RowModel>(newRowsState.idRowsLookup), ...addedRows];
        updateAllRows(newRows);
      }

      apiRef.current.publishEvent(ROWS_UPDATED, Object.values<RowModel>(newRowsState.idRowsLookup));
    },
    [logger, apiRef, dispatch, getRowIndexFromId, updateAllRows],
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

  const onSortModelUpdated = React.useCallback(({ sortModel }: any) => {
    isSortedRef.current = sortModel.length > 0;
  }, []);

  const getRowModels = React.useCallback(() => Object.values<RowModel>(apiRef.current.state.rows.idRowsLookup), [apiRef]);
  const getRowsCount = React.useCallback(() => apiRef.current.state.rows.totalRowCount, [apiRef]);
  const getAllRowIds = React.useCallback(() => apiRef.current.state.rows.allRows, [apiRef]);
  const setRowModels = React.useCallback((rowsParam: Rows) => updateAllRows(rowsParam), [updateAllRows]);

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
  useApiEventHandler(apiRef, SORT_MODEL_CHANGE, onSortModelUpdated);

  const rowModelsState = React.useMemo(()=> Object.values<RowModel>(gridState.rows.idRowsLookup), [gridState.rows]);

  return rowModelsState;
};
