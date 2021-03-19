import * as React from 'react';
import { GRID_PAGE_CHANGED, GRID_PAGESIZE_CHANGED } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPaginationApi } from '../../../models/api/gridPaginationApi';
import { GridPageChangeParams } from '../../../models/params/gridPageChangeParams';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridReducer } from '../core/useGridReducer';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridRowCountSelector } from '../filter/gridFilterSelector';
import {
  GRID_INITIAL_PAGINATION_STATE,
  PaginationActions,
  gridPaginationReducer,
  PaginationState,
  setGridPageActionCreator,
  setGridPageSizeActionCreator,
  setGridPaginationModeActionCreator,
  setGridRowCountActionCreator,
} from './gridPaginationReducer';

const PAGINATION_STATE_ID = 'pagination';

export const useGridPagination = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridPagination');

  const { dispatch } = useGridReducer<PaginationState, PaginationActions>(
    apiRef,
    PAGINATION_STATE_ID,
    gridPaginationReducer,
    { ...GRID_INITIAL_PAGINATION_STATE },
  );
  const options = useGridSelector(apiRef, optionsSelector);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

  const setPage = React.useCallback(
    (page: number) => {
      logger.debug(`Setting page to ${page}`);
      dispatch(setGridPageActionCreator(page));

      // we use getState here to avoid adding a dependency on gridState as a dispatch change the state, it would change this method and create an infinite loop
      const params: GridPageChangeParams = apiRef.current.getState<PaginationState>(
        PAGINATION_STATE_ID,
      ) as GridPageChangeParams;
      apiRef.current.publishEvent(GRID_PAGE_CHANGED, params);
    },
    [apiRef, dispatch, logger],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      dispatch(setGridPageSizeActionCreator(pageSize));
      apiRef.current.publishEvent(
        GRID_PAGESIZE_CHANGED,
        apiRef.current.getState<PaginationState>(PAGINATION_STATE_ID) as GridPageChangeParams,
      );
    },
    [apiRef, dispatch],
  );

  const onPageChange = React.useCallback(
    (handler: (param: GridPageChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_PAGE_CHANGED, handler);
    },
    [apiRef],
  );
  const onPageSizeChange = React.useCallback(
    (handler: (param: GridPageChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_PAGESIZE_CHANGED, handler);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_PAGE_CHANGED, options.onPageChange);
  useGridApiEventHandler(apiRef, GRID_PAGESIZE_CHANGED, options.onPageSizeChange);

  React.useEffect(() => {
    dispatch(setGridPaginationModeActionCreator({ paginationMode: options.paginationMode! }));
  }, [apiRef, dispatch, options.paginationMode]);

  React.useEffect(() => {
    const newPage = options.page != null ? options.page : 0;
    dispatch(setGridPageActionCreator(newPage));
  }, [dispatch, options.page]);

  React.useEffect(() => {
    if (!options.autoPageSize && options.pageSize) {
      dispatch(setGridPageSizeActionCreator(options.pageSize));
    }
  }, [options.autoPageSize, options.pageSize, logger, dispatch]);

  React.useEffect(() => {
    if (options.autoPageSize && containerSizes && containerSizes?.viewportPageSize > 0) {
      dispatch(setGridPageSizeActionCreator(containerSizes?.viewportPageSize));
    }
  }, [containerSizes, dispatch, options.autoPageSize]);

  React.useEffect(() => {
    dispatch(setGridRowCountActionCreator({ totalRowCount: visibleRowCount }));
  }, [apiRef, dispatch, visibleRowCount]);

  const paginationApi: GridPaginationApi = {
    setPageSize,
    setPage,
    onPageChange,
    onPageSizeChange,
  };

  useGridApiMethod(apiRef, paginationApi, 'paginationApi');
};
