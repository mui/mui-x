'use client';
import * as React from 'react';
import debounce from '@mui/utils/debounce';
import { RefObject } from '@mui/x-internals/types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPaginationModelApi, GridPaginationState } from './gridPaginationInterfaces';
import { GridEventListener } from '../../../models/events';
import { GridPaginationModel } from '../../../models/gridPaginationProps';
import { GridFilterModel } from '../../../models/gridFilterModel';
import {
  gridFilterModelSelector,
  gridFilterActiveItemsSelector,
} from '../filter/gridFilterSelector';
import { gridDensityFactorSelector } from '../density';
import { useGridLogger, useGridSelector, useGridApiMethod, useGridEvent } from '../../utils';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { gridPageCountSelector, gridPaginationModelSelector } from './gridPaginationSelector';
import {
  getPageCount,
  defaultPageSize,
  throwIfPageSizeExceedsTheLimit,
  getDefaultGridPaginationModel,
  getValidPage,
} from './gridPaginationUtils';

export const getDerivedPaginationModel = (
  paginationState: GridPaginationState,
  signature: DataGridProcessedProps['signature'],
  paginationModelProp?: GridPaginationModel,
) => {
  let paginationModel = paginationState.paginationModel;
  const rowCount = paginationState.rowCount;
  const pageSize = paginationModelProp?.pageSize ?? paginationModel.pageSize;
  const page = paginationModelProp?.page ?? paginationModel.page;
  const pageCount = getPageCount(rowCount, pageSize, page);

  if (
    paginationModelProp &&
    (paginationModelProp?.page !== paginationModel.page ||
      paginationModelProp?.pageSize !== paginationModel.pageSize)
  ) {
    paginationModel = paginationModelProp;
  }

  const validPage = pageSize === -1 ? 0 : getValidPage(paginationModel.page, pageCount);
  if (validPage !== paginationModel.page) {
    paginationModel = { ...paginationModel, page: validPage };
  }

  throwIfPageSizeExceedsTheLimit(paginationModel.pageSize, signature);

  return paginationModel;
};

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPaginationModel = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'paginationModel'
    | 'onPaginationModelChange'
    | 'autoPageSize'
    | 'initialState'
    | 'paginationMode'
    | 'pagination'
    | 'signature'
    | 'rowHeight'
  >,
) => {
  const {
    paginationModel: paginationModelProp,
    onPaginationModelChange,
    autoPageSize,
    initialState,
    paginationMode,
    pagination,
    signature,
    rowHeight: rowHeightProp,
  } = props;
  const logger = useGridLogger(apiRef, 'useGridPaginationModel');
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const previousFilterModel = React.useRef<GridFilterModel>(gridFilterModelSelector(apiRef));

  const rowHeight = Math.floor(rowHeightProp * densityFactor);
  apiRef.current.registerControlState({
    stateId: 'paginationModel',
    propModel: paginationModelProp,
    propOnChange: onPaginationModelChange,
    stateSelector: gridPaginationModelSelector,
    changeEvent: 'paginationModelChange',
  });

  /**
   * API METHODS
   */
  const setPage = React.useCallback<GridPaginationModelApi['setPage']>(
    (page) => {
      const currentModel = gridPaginationModelSelector(apiRef);
      if (page === currentModel.page) {
        return;
      }
      logger.debug(`Setting page to ${page}`);
      apiRef.current.setPaginationModel({ page, pageSize: currentModel.pageSize });
    },
    [apiRef, logger],
  );

  const debouncedSetPage = React.useMemo(() => debounce(setPage, 0), [setPage]);

  const setPageSize = React.useCallback<GridPaginationModelApi['setPageSize']>(
    (pageSize) => {
      const currentModel = gridPaginationModelSelector(apiRef);
      if (pageSize === currentModel.pageSize) {
        return;
      }

      logger.debug(`Setting page size to ${pageSize}`);
      apiRef.current.setPaginationModel({ pageSize, page: currentModel.page });
    },
    [apiRef, logger],
  );

  const setPaginationModel = React.useCallback<GridPaginationModelApi['setPaginationModel']>(
    (paginationModel) => {
      const currentModel = gridPaginationModelSelector(apiRef);
      if (paginationModel === currentModel) {
        return;
      }
      logger.debug("Setting 'paginationModel' to", paginationModel);

      apiRef.current.setState(
        (state) => ({
          ...state,
          pagination: {
            ...state.pagination,
            paginationModel: getDerivedPaginationModel(
              state.pagination,
              signature,
              paginationModel,
            ),
          },
        }),
        'setPaginationModel',
      );
    },
    [apiRef, logger, signature],
  );

  const paginationModelApi: GridPaginationModelApi = {
    setPage,
    setPageSize,
    setPaginationModel,
  };

  useGridApiMethod(apiRef, paginationModelApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const paginationModel = gridPaginationModelSelector(apiRef);

      const shouldExportPaginationModel =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the `paginationModel` is controlled
        paginationModelProp != null ||
        // Always export if the `paginationModel` has been initialized
        initialState?.pagination?.paginationModel != null ||
        // Export if `page` or `pageSize` is not equal to the default value
        (paginationModel.page !== 0 && paginationModel.pageSize !== defaultPageSize(autoPageSize));

      if (!shouldExportPaginationModel) {
        return prevState;
      }

      return {
        ...prevState,
        pagination: {
          ...prevState.pagination,
          paginationModel,
        },
      };
    },
    [apiRef, paginationModelProp, initialState?.pagination?.paginationModel, autoPageSize],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const paginationModel = context.stateToRestore.pagination?.paginationModel
        ? {
            ...getDefaultGridPaginationModel(autoPageSize),
            ...context.stateToRestore.pagination?.paginationModel,
          }
        : gridPaginationModelSelector(apiRef);
      apiRef.current.setState(
        (state) => ({
          ...state,
          pagination: {
            ...state.pagination,
            paginationModel: getDerivedPaginationModel(
              state.pagination,
              signature,
              paginationModel,
            ),
          },
        }),
        'stateRestorePreProcessing',
      );
      return params;
    },
    [apiRef, autoPageSize, signature],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handlePaginationModelChange: GridEventListener<'paginationModelChange'> = () => {
    const paginationModel = gridPaginationModelSelector(apiRef);
    if (apiRef.current.virtualScrollerRef?.current) {
      apiRef.current.scrollToIndexes({
        rowIndex: paginationModel.page * paginationModel.pageSize,
      });
    }
  };

  const handleUpdateAutoPageSize = React.useCallback(() => {
    if (!autoPageSize) {
      return;
    }

    const dimensions = apiRef.current.getRootDimensions();

    const maximumPageSizeWithoutScrollBar = Math.max(
      1,
      Math.floor(dimensions.viewportInnerSize.height / rowHeight),
    );

    apiRef.current.setPageSize(maximumPageSizeWithoutScrollBar);
  }, [apiRef, autoPageSize, rowHeight]);

  const handleRowCountChange = React.useCallback(
    (newRowCount: GridPaginationState['rowCount']) => {
      if (newRowCount == null) {
        return;
      }

      const paginationModel = gridPaginationModelSelector(apiRef);
      if (paginationModel.page === 0) {
        return;
      }

      const pageCount = gridPageCountSelector(apiRef);
      if (paginationModel.page > pageCount - 1) {
        queueMicrotask(() => {
          debouncedSetPage(Math.max(0, pageCount - 1));
        });
      }
    },
    [apiRef, debouncedSetPage],
  );

  /**
   * Goes to the first row of the grid
   */
  const navigateToStart = React.useCallback(() => {
    const paginationModel = gridPaginationModelSelector(apiRef);
    if (paginationModel.page !== 0) {
      debouncedSetPage(0);
    }

    // If the page was not changed it might be needed to scroll to the top
    const scrollPosition = apiRef.current.getScrollPosition();
    if (scrollPosition.top !== 0) {
      apiRef.current.scroll({ top: 0 });
    }
  }, [apiRef, debouncedSetPage]);

  const debouncedNavigateToStart = React.useMemo(
    () => debounce(navigateToStart, 0),
    [navigateToStart],
  );

  /**
   * Resets the page only if the active items or quick filter has changed from the last time.
   * This is to avoid resetting the page when the filter model is changed
   * because of and update of the operator from an item that does not have the value
   * or reseting when the filter panel is just opened
   */
  const handleFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (filterModel) => {
      const currentActiveFilters = {
        ...filterModel,
        // replace items with the active items
        items: gridFilterActiveItemsSelector(apiRef),
      };

      if (isDeepEqual(currentActiveFilters, previousFilterModel.current)) {
        return;
      }

      previousFilterModel.current = currentActiveFilters;
      debouncedNavigateToStart();
    },
    [apiRef, debouncedNavigateToStart],
  );

  useGridEvent(apiRef, 'viewportInnerSizeChange', handleUpdateAutoPageSize);
  useGridEvent(apiRef, 'paginationModelChange', handlePaginationModelChange);
  useGridEvent(apiRef, 'rowCountChange', handleRowCountChange);
  useGridEvent(apiRef, 'sortModelChange', debouncedNavigateToStart);
  useGridEvent(apiRef, 'filterModelChange', handleFilterModelChange);

  /**
   * EFFECTS
   */
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!pagination) {
      return;
    }
    apiRef.current.setState((state) => ({
      ...state,
      pagination: {
        ...state.pagination,
        paginationModel: getDerivedPaginationModel(
          state.pagination,
          signature,
          paginationModelProp,
        ),
      },
    }));
  }, [apiRef, paginationModelProp, signature, pagination]);

  React.useEffect(() => {
    apiRef.current.setState((state) => {
      const isEnabled = pagination === true;
      if (
        state.pagination.paginationMode === paginationMode &&
        state.pagination.enabled === isEnabled
      ) {
        return state;
      }

      return {
        ...state,
        pagination: {
          ...state.pagination,
          paginationMode,
          enabled: isEnabled,
        },
      };
    });
  }, [apiRef, paginationMode, pagination]);

  React.useEffect(handleUpdateAutoPageSize, [handleUpdateAutoPageSize]);
};
