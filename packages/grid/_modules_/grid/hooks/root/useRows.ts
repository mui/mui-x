import * as React from 'react';
import {
  createRowModel,
  GridOptions,
  RowData,
  RowId,
  RowModel,
  Rows,
  RowsProp,
  ApiRef,
} from '../../models';
import { useLogger } from '../utils/useLogger';
import { useRafUpdate } from '../utils';
import {
  ROWS_UPDATED,
  SCROLLING_START,
  SCROLLING_STOP,
  SORT_MODEL_CHANGE,
} from '../../constants/eventsConstants';
import { useApiMethod } from './useApiMethod';
import { useApiEventHandler } from './useApiEventHandler';
import { RowApi } from '../../models/api/rowApi';
// import {useGridReducer} from "../features";

type IdLookup = { [key: string]: number };

// interface RowsState {
//   rowModels: RowModel[];
//   visibleRowModels: RowModel[];
//   idLookup: IdLookup;
// }
//
// const INITIAL_STATE = {}


const HIDE_FIRST_ROW = 'HIDE_FIRST_ROW';
// REDUCER
export function rowsReducer(
  state: RowModel[],
  action: { type: string; payload?: any },
) {
  switch (action.type) {
    case HIDE_FIRST_ROW:
      if(state.length > 0) {
        state[0] = {...state[0], ...{isHidden: true}};
      }

      return [...state];

    case 'Update':
      return [...action.payload];
    default:
      throw new Error(`Material-UI: Action ${action.type} not found.`);
  }
}


export const useRows = (
  options: GridOptions,
  rows: RowsProp,
  initialised: boolean,
  apiRef: ApiRef,
): RowModel[] => {
  const logger = useLogger('useRows');
  const rowModels = React.useMemo(() => rows.map(createRowModel), [rows]);

  // eslint-disable-next-line
  // const [state, dispatch] = useGridReducer(apiRef, 'rows', rowsReducer, rowModels);
  // React.useEffect(()=> {
  //   // eslint-disable-next-line no-console
  //   console.log('Row state changed', state.rows?.length, dispatch.toString());
  // }, [dispatch, state]);

  // React.useEffect(()=> {
  //   // eslint-disable-next-line no-console
  //   console.log('globalState state changed', globalState.pagination);
  // }, [globalState.pagination]);
  // setTimeout(()=> dispatch({type:HIDE_FIRST_ROW}), 500);

  const [rowModelsState, setRowModelsState] = React.useState<RowModel[]>(rowModels);
  const [, forceUpdate] = React.useState();
  const [rafUpdate] = useRafUpdate(() => forceUpdate((p: any) => !p));

  const idLookupRef = React.useRef({});
  const rowModelsRef = React.useRef<RowModel[]>(rowModels);
  const visibleRowModelsRef = React.useRef<RowModel[]>(rowModels);
  const isScrollingRef = React.useRef<boolean>(false);
  const isSortedRef = React.useRef<boolean>(false);

  const setIsScrolling = React.useCallback(
    (v: boolean) => {
      isScrollingRef.current = v;
    },
    [isScrollingRef],
  );

  const updateAllRows = React.useCallback(
    (allNewRows: RowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);
      idLookupRef.current = allNewRows.reduce((lookup, row, index) => {
        lookup[row.id] = index;
        return lookup;
      }, {} as IdLookup);
      rowModelsRef.current = allNewRows;
      visibleRowModelsRef.current = allNewRows.filter(row=> !row.isHidden);
      if (!isScrollingRef.current) {
        logger.info(`Setting row models to new rows with length ${allNewRows.length}`);
        setRowModelsState(() => allNewRows);
        // dispatch({type:'Update', payload:  rowModelsRef.current});
      }
    },
    [logger, rowModelsRef, setRowModelsState],
  );

  React.useEffect(() => {
    logger.info('Updating Rows.');
    isScrollingRef.current = false;
    updateAllRows(rowModels);
  }, [rows, logger, rowModels, updateAllRows]);

  const getRowsLookup = React.useCallback(() => idLookupRef.current as IdLookup, []);
  const getRowIndexFromId = React.useCallback((id: RowId): number => getRowsLookup()[id], [
    getRowsLookup,
  ]);
  const getRowIdFromRowIndex = React.useCallback(
    (index: number): RowId => Object.entries(getRowsLookup())[index][0],
    [getRowsLookup],
  );
  const getRowFromId = React.useCallback(
    (id: RowId): RowModel => rowModelsRef.current[getRowIndexFromId(id)],
    [rowModelsRef, getRowIndexFromId],
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
        if (idx == null) {
          // New row?
          addedRows.push(partialRow as RowModel);
          return;
        }
        Object.assign(rowModelsRef.current[idx], partialRow);
      });

      if (!isScrollingRef.current && !isSortedRef.current) {
        rafUpdate();
        updateAllRows(rowModelsRef.current);
      }

      if (addedRows.length > 0) {
        const newRows = [...rowModelsRef.current, ...addedRows];
        updateAllRows(newRows);
      }

      apiRef.current.publishEvent(ROWS_UPDATED, rowModelsRef.current);
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

  const getRowModels = React.useCallback(() => rowModelsRef.current, [rowModelsRef]);
  const getVisibleRowModels = React.useCallback(() => visibleRowModelsRef.current, [visibleRowModelsRef]);
  const getRowsCount = React.useCallback((isVisibleRows = false) => (isVisibleRows ? visibleRowModelsRef : rowModelsRef).current.length, [rowModelsRef]);
  const getAllRowIds = React.useCallback(() => rowModelsRef.current.map((r) => r.id), [
    rowModelsRef,
  ]);
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
    getVisibleRowModels,
    getRowsCount,
    getAllRowIds,
    setRowModels,
  };

  useApiMethod(apiRef, rowApi, 'RowApi');

  const startScrollingHandler = React.useCallback(() => setIsScrolling(true), [setIsScrolling]);
  const stopScrollingHandler = React.useCallback(() => setIsScrolling(false), [setIsScrolling]);

  useApiEventHandler(apiRef, SCROLLING_START, startScrollingHandler);
  useApiEventHandler(apiRef, SCROLLING_STOP, stopScrollingHandler);
  useApiEventHandler(apiRef, SORT_MODEL_CHANGE, onSortModelUpdated);

  return rowModelsState;
};
