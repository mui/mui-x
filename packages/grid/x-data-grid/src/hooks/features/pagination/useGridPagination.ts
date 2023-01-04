import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridPaginationApi, GridPaginationState } from './gridPaginationInterfaces';
import { GridEventListener } from '../../../models/events';
import { GridPaginationModel } from '../../../models/gridPaginationProps';
import { gridVisibleTopLevelRowCountSelector } from '../filter';
import { gridDensityFactorSelector } from '../density';
import {
  useGridLogger,
  useGridSelector,
  useGridApiMethod,
  useGridApiEventHandler,
} from '../../utils';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { gridPaginationModelSelector } from './gridPaginationSelector';
import { calculatePinnedRowsHeight } from '../rows/gridRowsUtils';
import {
  getPageCount,
  noRowCountInServerMode,
  defaultPageSize,
  throwIfPageSizeExceedsTheLimit,
  getDefaultGridPaginationModel,
  getValidPage,
} from './gridPaginationUtils';

export const paginationStateInitializer: GridStateInitializer<
  Pick<
    DataGridProcessedProps,
    'paginationModel' | 'rowCount' | 'initialState' | 'autoPageSize' | 'signature'
  >
> = (state, props) => {
  const paginationModel = {
    ...getDefaultGridPaginationModel(props.autoPageSize),
    ...(props.paginationModel ?? props.initialState?.pagination?.paginationModel),
  };

  throwIfPageSizeExceedsTheLimit(paginationModel.pageSize, props.signature);

  return {
    ...state,
    pagination: {
      paginationModel,
      pageCount: getPageCount(props.rowCount ?? 0, paginationModel.pageSize),
      rowCount: props.rowCount ?? 0,
    },
  };
};

const mergeStateWithPaginationModel =
  (
    rowCount: number,
    autoPageSize: DataGridProcessedProps['autoPageSize'],
    signature: DataGridProcessedProps['signature'],
    model?: GridPaginationModel,
  ) =>
  (paginationState: GridPaginationState) => {
    let paginationModel = paginationState.paginationModel;
    const pageSize = model?.pageSize ?? paginationModel.pageSize;
    const pageCount = getPageCount(rowCount, pageSize);

    if (model && model !== paginationModel) {
      const page = model.page ?? paginationModel.page;
      const validPage = getValidPage(page, pageCount);
      throwIfPageSizeExceedsTheLimit(model.pageSize, signature);
      paginationModel = validPage !== model.page ? { page: validPage, pageSize } : model;
    }

    return {
      pageCount,
      rowCount,
      paginationModel,
    };
  };

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPagination = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'paginationModel'
    | 'onPaginationModelChange'
    | 'autoPageSize'
    | 'rowCount'
    | 'initialState'
    | 'paginationMode'
    | 'signature'
    | 'rowHeight'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridPagination');

  const visibleTopLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const rowHeight = Math.floor(props.rowHeight * densityFactor);

  apiRef.current.registerControlState({
    stateId: 'pagination',
    propModel: props.paginationModel,
    propOnChange: props.onPaginationModelChange,
    stateSelector: gridPaginationModelSelector,
    changeEvent: 'paginationModelChange',
  });

  /**
   * API METHODS
   */
  const setPage = React.useCallback<GridPaginationApi['setPage']>(
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

  const setPageSize = React.useCallback<GridPaginationApi['setPageSize']>(
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

  const setPaginationModel = React.useCallback<GridPaginationApi['setPaginationModel']>(
    (paginationModel) => {
      const currentModel = gridPaginationModelSelector(apiRef);
      if (paginationModel === currentModel) {
        return;
      }
      logger.debug("Setting 'paginationModel' to", paginationModel);

      apiRef.current.updateControlState(
        'pagination',
        mergeStateWithPaginationModel(
          props.rowCount ?? visibleTopLevelRowCount,
          props.autoPageSize,
          props.signature,
          paginationModel,
        ),
        'setPaginationModel',
      );
      apiRef.current.forceUpdate();
    },
    [apiRef, logger, props.autoPageSize, props.rowCount, props.signature, visibleTopLevelRowCount],
  );

  const pageApi: GridPaginationApi = {
    setPage,
    setPageSize,
    setPaginationModel,
  };

  useGridApiMethod(apiRef, pageApi, 'public');

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
        props.paginationModel != null ||
        // Always export if the `paginationModel` has been initialized
        props.initialState?.pagination?.paginationModel != null ||
        // Export if `page` or `pageSize` is not equal to the default value
        (paginationModel.page !== 0 &&
          paginationModel.pageSize !== defaultPageSize(props.autoPageSize));

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
    [
      apiRef,
      props.paginationModel,
      props.initialState?.pagination?.paginationModel,
      props.autoPageSize,
    ],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const paginationModel = context.stateToRestore.pagination?.paginationModel
        ? {
            ...getDefaultGridPaginationModel(props.autoPageSize),
            ...context.stateToRestore.pagination?.paginationModel,
          }
        : gridPaginationModelSelector(apiRef);
      apiRef.current.updateControlState(
        'pagination',
        mergeStateWithPaginationModel(
          props.rowCount ?? visibleTopLevelRowCount,
          props.autoPageSize,
          props.signature,
          paginationModel,
        ),
        'stateRestorePreProcessing',
      );
      return params;
    },
    [apiRef, props.autoPageSize, props.rowCount, props.signature, visibleTopLevelRowCount],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handlePaginationModelChange: GridEventListener<'paginationModelChange'> = () => {
    const paginationModel = gridPaginationModelSelector(apiRef);
    apiRef.current.scrollToIndexes({
      rowIndex: paginationModel.page * paginationModel.pageSize,
    });

    apiRef.current.forceUpdate();
  };

  const handleUpdateAutoPageSize = React.useCallback(() => {
    const dimensions = apiRef.current.getRootDimensions();
    if (!props.autoPageSize || !dimensions) {
      return;
    }

    const pinnedRowsHeight = calculatePinnedRowsHeight(apiRef);

    const maximumPageSizeWithoutScrollBar = Math.floor(
      (dimensions.viewportInnerSize.height - pinnedRowsHeight.top - pinnedRowsHeight.bottom) /
        rowHeight,
    );

    apiRef.current.setPageSize(maximumPageSizeWithoutScrollBar);
  }, [apiRef, props.autoPageSize, rowHeight]);

  useGridApiEventHandler(apiRef, 'viewportInnerSizeChange', handleUpdateAutoPageSize);
  useGridApiEventHandler(apiRef, 'paginationModelChange', handlePaginationModelChange);

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
    apiRef.current.updateControlState(
      'pagination',
      mergeStateWithPaginationModel(
        props.rowCount ?? visibleTopLevelRowCount,
        props.autoPageSize,
        props.signature,
        props.paginationModel,
      ),
    );
  }, [
    apiRef,
    props.paginationModel,
    props.rowCount,
    props.paginationMode,
    props.autoPageSize,
    visibleTopLevelRowCount,
    props.signature,
  ]);

  React.useEffect(() => {
    handleUpdateAutoPageSize();
  }, [handleUpdateAutoPageSize]);
};
