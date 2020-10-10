import * as React from 'react';

import {useGridReducer} from "./useGridReducer";
import {ApiRef, RowApi} from "../../../models/api";
import {createRowModel, GridOptions, RowData, RowId, RowModel, Rows, RowsProp} from "../../../models";
import {ROWS_UPDATED, SCROLLING_START, SCROLLING_STOP, SORT_MODEL_CHANGE} from "../../../constants";
import {useLogger, useRafUpdate} from "../../utils";
import {useApiEventHandler, useApiMethod} from "../../root";
import {useGridState} from "./useGridState";

// type IdLookup = { [key: string]: number };
export interface InternalRowsState {
  idRowsLookup: Record<RowId, RowModel>;
  allRows: RowId[];
  totalRowCount: number;
}

export const INITIAL_ROW_STATE: InternalRowsState = {
  idRowsLookup: {},
  allRows: [],
  totalRowCount: 0
}
const UPDATE_ROW_STATE = 'UPDATE_ROW_STATE';
type UpdateRowStateAction = {type : 'UPDATE_ROW_STATE', payload: InternalRowsState};
const updateRowStateActionCreator = (state: InternalRowsState): UpdateRowStateAction => ({ type: UPDATE_ROW_STATE , payload: state});

const ROW_PROP_CHANGED_ACTION = 'ROW_PROP_CHANGED';
type RowPropChangedAction = {type : 'ROW_PROP_CHANGED', payload: {rows: RowsProp, totalRowCount?: number}};
const rowPropChangedActionCreator = (rows: RowsProp, totalRowCount?: number): RowPropChangedAction =>
  ({ type: ROW_PROP_CHANGED_ACTION , payload: {rows, totalRowCount} });

function convertRowsPropToState( {rows, totalRowCount}:{rows: RowsProp, totalRowCount?: number}): InternalRowsState {
  const state: InternalRowsState = {...INITIAL_ROW_STATE};
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
export const rowReducer = (state: InternalRowsState = INITIAL_ROW_STATE, action: RowsActions): InternalRowsState => {
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

  const {state, dispatch} = useGridReducer<InternalRowsState, RowsActions>(apiRef, 'rows', rowReducer, INITIAL_ROW_STATE);
  const [gridState, setGridState ] = useGridState(apiRef);

  React.useEffect(()=> {
    dispatch(rowPropChangedActionCreator(rows, gridState.options?.rowCount));
  }, [rows, gridState.options?.rowCount, dispatch]);

  const [, forceUpdate] = React.useState();
  const [rafUpdate] = useRafUpdate(() => forceUpdate((p: any) => !p));

  // const isScrollingRef = React.useRef<boolean>(false);
  const isSortedRef = React.useRef<boolean>(false);
  //
  // const setIsScrolling = React.useCallback(
  //   (v: boolean) => {
  //     isScrollingRef.current = v;
  //   },
  //   [isScrollingRef],
  // );

  const updateAllRows = React.useCallback(
    (allNewRows: RowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);


      const idRowsLookup = allNewRows.reduce((lookup, row, index) => {
        lookup[row.id] = row;
        return lookup;
      }, {});
      const allRows = allNewRows.map(row=> row.id);
      const totalRowCount =  gridState.options &&  gridState.options.rowCount &&  gridState.options.rowCount > gridState.rows.allRows.length ?  gridState.options.rowCount : gridState.rows.allRows.length;
      setGridState({rows: {idRowsLookup, allRows, totalRowCount}});

      if (! gridState.isScrolling) {
        logger.info(`Setting row models to new rows with length ${allNewRows.length}`);
        // setRowModelsState(() => allNewRows);
        dispatch(updateRowStateActionCreator( gridState.rows))
      }
    },
    [logger, gridState.options, gridState.rows, gridState.isScrolling, setGridState, dispatch],
  );

  // React.useEffect(() => {
  //   logger.info('Updating Rows.');
  //   isScrollingRef.current = false;
  //   updateAllRows(rowModels);
  // }, [rows, logger, rowModels, updateAllRows]);

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
        //todo use setState here but first need to refactor event handler
        // Object.assign(apiRef.current.state.rows.idRowsLookup[partialRow.id], partialRow);
        const newRowsState = {...gridState.rows};
        Object.assign(newRowsState.idRowsLookup[partialRow.id], partialRow);
        setGridState({rows: newRowsState});
      });

      if (!apiRef.current.state.isScrolling && !isSortedRef.current) {
        rafUpdate();
      }

      if (addedRows.length > 0) {
        const newRows = [...Object.values<RowModel>(apiRef.current.state.rows.idRowsLookup), ...addedRows];
        updateAllRows(newRows);
      }

      apiRef.current.publishEvent(ROWS_UPDATED, Object.values<RowModel>(apiRef.current.state.rows.idRowsLookup));
    },
    [apiRef, updateAllRows, rafUpdate, getRowIndexFromId, logger],
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

  const rowModelsState = React.useMemo(()=> Object.values<RowModel>(state.idRowsLookup), [state]);

  return rowModelsState;
};
