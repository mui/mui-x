import * as React from 'react';
import { ROWS_UPDATED, SORT_MODEL_CHANGE } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { RowApi } from '../../../models/api/rowApi';
import { createRowModel, RowData, RowId, RowModel, Rows, RowsProp } from '../../../models/rows';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useRafUpdate } from '../../utils/useRafUpdate';
import { useGridReducer } from './useGridReducer';
import { useGridState } from './useGridState';

export interface InternalRowsState {
  idRowsLookup: Record<RowId, RowModel>;
  allRows: RowId[];
  totalRowCount: number;
}

export const getInitialRowState: ()=> InternalRowsState = ()=> ({
  idRowsLookup: {},
  allRows: [],
  totalRowCount: 0
});

const UPDATE_ROW_STATE = 'UPDATE_ROW_STATE';
type UpdateRowStateAction = {type : 'UPDATE_ROW_STATE', payload: InternalRowsState};
const updateRowStateActionCreator = (state: InternalRowsState): UpdateRowStateAction => ({ type: UPDATE_ROW_STATE , payload: state});

const ROW_PROP_CHANGED_ACTION = 'ROW_PROP_CHANGED';
type RowPropChangedAction = {type : 'ROW_PROP_CHANGED', payload: {rows: RowsProp, totalRowCount?: number}};
const rowPropChangedActionCreator = (rows: RowsProp, totalRowCount?: number): RowPropChangedAction =>
  ({ type: ROW_PROP_CHANGED_ACTION , payload: {rows, totalRowCount} });

function convertRowsPropToState( {rows, totalRowCount}:{rows: RowsProp, totalRowCount?: number}): InternalRowsState {
  const state: InternalRowsState = {allRows: [], idRowsLookup: {}, totalRowCount: 0};
  rows.reduce((idLookup, rowData, index) => {
    const model = createRowModel(rowData);
    state.idRowsLookup[model.id]= model;
    state.allRows = [...state.allRows, model.id];
    state.totalRowCount = totalRowCount && totalRowCount > state.allRows.length ? totalRowCount : state.allRows.length;
    return state;
  }, state);
  return state;
}
type RowsActions = UpdateRowStateAction | RowPropChangedAction;

export const rowReducer = (state: InternalRowsState, action: RowsActions): InternalRowsState => {
  switch(action.type) {
    case ROW_PROP_CHANGED_ACTION:
      return convertRowsPropToState(action.payload);
    case UPDATE_ROW_STATE:
      return {...action.payload};
    default:
      return state;
  }
}

export const useRowsReducer = (
  rows: RowsProp,
  apiRef: ApiRef,
): RowModel[] => {
  const logger = useLogger('useRows');

  const {gridState, dispatch} = useGridReducer<InternalRowsState, RowsActions>(apiRef, 'rows', rowReducer, getInitialRowState());
  // const [gridState, setGridState, forceUpdate ] = useGridState(apiRef);

  React.useEffect(()=> {
    dispatch(rowPropChangedActionCreator(rows, gridState.options?.rowCount));

    // setGridState(oldState => {
    //   const newRows = convertRowsPropToState({rows, totalRowCount: gridState.options?.rowCount});
    //   oldState ={...oldState, rows: newRows};
    //   return oldState;
    // });
    // forceUpdate();

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
       // setGridState(oldState => {
       //   oldState ={...oldState, rows: {idRowsLookup, allRows, totalRowCount}};
       //   console.log(`Rows reducer all rows with rowCount : ${totalRowCount}`);
       //   return oldState;
       // });
      dispatch(updateRowStateActionCreator( {idRowsLookup, allRows, totalRowCount}))


      // if (! gridState.isScrolling) {
      //   logger.info(`Setting row models to new rows with length ${allNewRows.length}`);
      //   // dispatch(updateRowStateActionCreator( gridState.rows))
      //   forceUpdate();
      // }
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

        // setGridState(oldState => {
          Object.assign(newRowsState.idRowsLookup[partialRow.id!], partialRow);
          // oldState ={...oldState, rows: newRowsState};

          // console.log(`Rows reducer updateRowModels with rowCount : ${newRowsState.totalRowCount}`);
          // return oldState;
        // });

      });
      dispatch(updateRowStateActionCreator( newRowsState))

      // if (!apiRef.current.state.isScrolling && !isSortedRef.current) {
      //   forceUpdate();
      // }

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
