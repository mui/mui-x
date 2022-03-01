import * as React from 'react';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  useGridLogger,
  useGridSelector,
  useGridApiMethod,
  useGridApiEventHandler,
} from '../../utils';
import { GridEvents, GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPageApi, GridPaginationState } from './gridPaginationInterfaces';
import { gridVisibleTopLevelRowCountSelector } from '../filter';
import { gridPageSelector } from './gridPaginationSelector';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};

const applyValidPage = (paginationState: GridPaginationState): GridPaginationState => {
  if (!paginationState.pageCount) {
    return paginationState;
  }

  return {
    ...paginationState,
    page: Math.max(Math.min(paginationState.page, paginationState.pageCount - 1), 0),
  };
};

const mergeStateWithPage =
  (page: number) =>
  (state: GridStateCommunity): GridStateCommunity => ({
    ...state,
    pagination: applyValidPage({
      ...state.pagination,
      page,
    }),
  });

export const pageStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'initialState' | 'rowCount' | 'page'>
> = (state, props) => ({
  ...state,
  pagination: {
    ...state.pagination!,
    page: props.page ?? props.initialState?.pagination?.page ?? 0,
    pageCount: getPageCount(props.rowCount ?? 0, state.pagination!.pageSize!),
    rowCount: props.rowCount ?? 0,
  },
});

/**
 * @requires useGridPageSize (event)
 */
export const useGridPage = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'page' | 'onPageChange' | 'rowCount' | 'initialState'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridPage');

  const visibleTopLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);

  apiRef.current.unstable_updateControlState({
    stateId: 'page',
    propModel: props.page,
    propOnChange: props.onPageChange,
    stateSelector: gridPageSelector,
    changeEvent: GridEvents.pageChange,
  });

  /**
   * API METHODS
   */
  const setPage = React.useCallback(
    (page) => {
      logger.debug(`Setting page to ${page}`);
      apiRef.current.setState(mergeStateWithPage(page));
      apiRef.current.forceUpdate();
    },
    [apiRef, logger],
  );

  const pageApi: GridPageApi = {
    setPage,
  };

  useGridApiMethod(apiRef, pageApi, 'GridPageApi');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPreProcessor<'exportState'>>(
    (prevState) => {
      const pageToExport = gridPageSelector(apiRef);

      const shouldExportPage =
        // Always export if the page is controlled
        props.page != null ||
        // Always export if the page has been initialized
        props.initialState?.pagination?.page != null ||
        // Export if the page value is not equal to the default value
        pageToExport !== 0;

      if (!shouldExportPage) {
        return prevState;
      }

      return {
        ...prevState,
        pagination: {
          ...prevState.pagination,
          page: pageToExport,
        },
      };
    },
    [apiRef, props.page, props.initialState?.pagination?.page],
  );

  const stateRestorePreProcessing = React.useCallback<GridPreProcessor<'restoreState'>>(
    (params, context) => {
      // We apply the constraint even if the page did not change in case the pageSize changed.
      const page = context.stateToRestore.pagination?.page ?? gridPageSelector(apiRef);
      apiRef.current.setState(mergeStateWithPage(page));
      return params;
    },
    [apiRef],
  );

  useGridRegisterPreProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPreProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handlePageSizeChange: GridEventListener<GridEvents.pageSizeChange> = (pageSize) => {
    apiRef.current.setState((state) => {
      const pageCount = getPageCount(state.pagination.rowCount, pageSize);

      return {
        ...state,
        pagination: applyValidPage({
          ...state.pagination,
          pageCount,
          page: state.pagination.page,
        }),
      };
    });

    apiRef.current.forceUpdate();
  };

  useGridApiEventHandler(apiRef, GridEvents.pageSizeChange, handlePageSizeChange);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    apiRef.current.setState((state) => {
      const rowCount = props.rowCount !== undefined ? props.rowCount : visibleTopLevelRowCount;
      const pageCount = getPageCount(rowCount, state.pagination.pageSize);
      const page = props.page == null ? state.pagination.page : props.page;

      return {
        ...state,
        pagination: applyValidPage({
          ...state.pagination,
          page,
          rowCount,
          pageCount,
        }),
      };
    });
    apiRef.current.forceUpdate();
  }, [visibleTopLevelRowCount, props.rowCount, props.page, apiRef]);
};
