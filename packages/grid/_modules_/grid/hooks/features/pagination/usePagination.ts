import * as React from 'react';
import {useLogger} from '../../utils';
import {PAGE_CHANGED, PAGESIZE_CHANGED, RESIZE, ROWS_UPDATED} from '../../../constants/eventsConstants';
import {useApiMethod} from '../../root/useApiMethod';
import {useApiEventHandler} from '../../root/useApiEventHandler';
import {PageChangeParams} from '../../../models/params/pageChangeParams';
import {Rows} from '../../../models/rows';
import {InternalColumns} from '../../../models/colDef/colDef';
import {GridOptions} from '../../../models/gridOptions';
import {PaginationApi} from '../../../models/api/paginationApi';
import {ApiRef} from '../../../models/api';
import {
  getPageCount,
  paginationReducer,
  PaginationState,
  setPageActionCreator,
  setPageSizeActionCreator,
  setPaginationModeActionCreator,
  setRowCountActionCreator
} from "./usePaginationReducer";

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

// // eslint-disable
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const useGridState = (apiRef: ApiRef) => {
//   // const gridStateRef =  React.useRef({});
//   const [newGridState,  ] = React.useState();
//   //  const [runSetState] = useRafUpdate(setState);
//   // const constructState = React.useCallback(()=> {
//   //    const newState = apiRef.current.getState();
//   //   runSetState(()=> newState);
//   // }, [apiRef, runSetState]);
//   // //
//   // useApiEventHandler(apiRef, 'StateUpdate',  constructState);
//
//   return newGridState as any;
// }
//
// export const useGridReducer = <T>(apiRef: ApiRef, stateId, reducer, initialState) =>  {
//   // const hookStateRef =  React.useRef(initialState);
//
//   // if(!apiRef.current.state) {
//   //   apiRef.current.state = {};
//   // }
//
//   // if(apiRef.current.state[stateId] != null) {
//   //   throw new Error(`StateId ${stateId} already declared.`);
//   // }
//
//   const [state, dispatch] = React.useReducer(reducer, initialState);
//   const [runRafDispatch] = useRafUpdate(dispatch);
//   // const updateGridContextState = React.useCallback(()=> {
//   // //   apiRef.current.state[stateId]= state;
//   // apiRef.current.publishEvent('StateUpdate', {apiRef});
//   // }, [apiRef]);
//   // //
//   // const [runUpdateState] = useRafUpdate(updateGridContextState);
//
//   // React.useEffect(()=> {
//   //   // apiRef.current.state[stateId] = state;
//   //   hookStateRef.current = state;
//   //   // apiRef.current.publishEvent('StateUpdate', {apiRef});
//   //   runUpdateState();
//   //
//   // }, [runUpdateState]);
//   //
//   // const constructState = React.useCallback((stateRef)=> {
//   //   stateRef.current[stateId] = hookStateRef.current;
//   // }, [stateId]);
//   //
//   // useApiEventHandler(apiRef, 'GetState', constructState);
//
//   return [state as T, runRafDispatch ];
//
//
//   //combine reducers
//   //combine state
//   //return state
//
//   //Attach to apiRef => not good, as it rerender the whole react tree
//
//   //use reselect to get the state
// }
// // export const useGridState = (state: any) =>  {
// //
// //   apiRef.current.getState();
// // }

export const usePagination = (
  rows: Rows,
  columns: InternalColumns,
  options: GridOptions,
  apiRef: ApiRef,
): PaginationProps => {
  const logger = useLogger('usePagination');

  const initialState: PaginationState = {
    paginationMode: options.paginationMode!,
    pageSize: options.pageSize || 0,
    rowCount: options.rowCount == null ? rows.length : options.rowCount,
    page: options.page || 1,
    pageCount: getPageCount(
      options.pageSize,
      options.rowCount == null ? rows.length : options.rowCount,
    ),
  };
  // const [state, dispatch] = useGridReducer(apiRef, 'pagination', paginationReducer, initialState);
  const [state, dispatch] = React.useReducer(paginationReducer, initialState);

  const setPage = React.useCallback(
    (page: number) => {
      dispatch(setPageActionCreator(page, apiRef));
    },
    [apiRef],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      dispatch(setPageSizeActionCreator(pageSize, apiRef));
    },
    [apiRef],
  );

  const onPageChange = React.useCallback(
    (handler: (param: PageChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(PAGE_CHANGED, handler);
    },
    [apiRef],
  );
  const onPageSizeChange = React.useCallback(
    (handler: (param: PageChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(PAGESIZE_CHANGED, handler);
    },
    [apiRef],
  );

  const resetAutopageSize = React.useCallback(() => {
    if (options.autoPageSize) {
      const containerProps = apiRef?.current?.getContainerPropsState();
      const autoPagesize = containerProps?.viewportPageSize;
      if (autoPagesize) {
        logger.debug(`Setting autoPagesize to ${autoPagesize}`);
        setPageSize(autoPagesize);
      }
    }
  }, [options.autoPageSize, apiRef, logger, setPageSize]);

  useApiEventHandler(apiRef, RESIZE, resetAutopageSize);
  useApiEventHandler(apiRef, PAGE_CHANGED, options.onPageChange);
  useApiEventHandler(apiRef, PAGESIZE_CHANGED, options.onPageSizeChange);

  const onRowsUpdated = React.useCallback((rowModels: any[] )=> {
    logger.info(`rowsSize changed ${rowModels.length}`);
    dispatch(setRowCountActionCreator({rowCount: rowModels.length, totalRowCount: options.rowCount, apiRef}));
  }, [apiRef, logger, options.rowCount]);

  useApiEventHandler(apiRef, ROWS_UPDATED, onRowsUpdated);

  React.useEffect(() => {
    onRowsUpdated(rows);
  }, [onRowsUpdated, rows.length]);

  React.useEffect(() => {
    dispatch(setPaginationModeActionCreator(options.paginationMode!));
  }, [options.paginationMode]);

  React.useEffect(() => {
    setPage(options.page != null ? options.page : 1);
  }, [options.page, setPage]);

  React.useEffect(() => {
    if (
      !options.autoPageSize &&
      options.pageSize
    ) {
      setPageSize(options.pageSize);
    }
  }, [options.autoPageSize, options.pageSize, logger, setPageSize]);

  React.useEffect(() => {
    if (options.autoPageSize && columns.visible.length > 0) {
      resetAutopageSize();
    }
  }, [options.autoPageSize, resetAutopageSize, columns.visible.length]);

  React.useEffect(() => {
    if (apiRef.current?.isInitialised) {
      apiRef.current.publishEvent(PAGE_CHANGED, state);
    }
  }, [apiRef, apiRef.current.isInitialised, state]);

  const paginationApi: PaginationApi = {
    setPageSize,
    setPage,
    onPageChange,
    onPageSizeChange,
  };

  useApiMethod(apiRef, paginationApi, 'paginationApi');

  return {
    ...state,
    setPage,
    setPageSize,
  };
};
