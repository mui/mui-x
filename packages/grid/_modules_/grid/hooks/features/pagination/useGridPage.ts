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
import { useGridStateInit } from '../../utils/useGridStateInit';
import { gridPageSelector } from './gridPaginationSelector';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { buildWarning } from '../../../utils/warning';

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

const noRowCountInServerMode = buildWarning([
  "MUI: the 'rowCount' prop is undefined will using paginationMode='server'",
]);

/**
 * @requires useGridPageSize (state, event)
 * @requires useGridFilter (state)
 */
export const useGridPage = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    'page' | 'onPageChange' | 'rowCount' | 'initialState' | 'paginationMode'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridPage');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    pagination: {
      ...state.pagination!,
      page: props.page ?? props.initialState?.pagination?.page ?? 0,
      pageCount: getPageCount(props.rowCount ?? 0, state.pagination!.pageSize!),
      rowCount: props.rowCount ?? 0,
    },
  }));

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
      if (pageToExport === 0) {
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
    [apiRef],
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
    if (process.env.NODE_ENV !== 'production') {
      if (props.paginationMode === 'server' && props.rowCount == null) {
        noRowCountInServerMode();
      }
    }
  }, [props.rowCount, props.paginationMode]);

  React.useEffect(() => {
    apiRef.current.setState((state) => {
      let rowCount;
      if (props.rowCount !== undefined) {
        rowCount = props.rowCount;
      } else if (props.paginationMode === 'server') {
        rowCount = state.pagination.rowCount;
      } else {
        rowCount = visibleTopLevelRowCount;
      }

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
  }, [visibleTopLevelRowCount, props.rowCount, props.page, props.paginationMode, apiRef]);
};
