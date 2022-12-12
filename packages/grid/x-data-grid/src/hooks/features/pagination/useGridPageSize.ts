import * as React from 'react';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPageSizeApi } from './gridPaginationInterfaces';
import {
  useGridLogger,
  useGridApiMethod,
  useGridApiEventHandler,
  useGridSelector,
  GridSignature,
} from '../../utils';
import { gridPageSizeSelector } from './gridPaginationSelector';
import { gridDensityRowHeightSelector } from '../density';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { calculatePinnedRowsHeight } from '../rows/gridRowsUtils';

export const defaultPageSize = (autoPageSize: boolean) => (autoPageSize ? 0 : 100);

const MAX_PAGE_SIZE = 100;

export const throwIfPageSizeExceedsTheLimit = (
  pageSize: number,
  signatureProp: DataGridProcessedProps['signature'],
) => {
  if (signatureProp === GridSignature.DataGrid && pageSize > MAX_PAGE_SIZE) {
    throw new Error(
      [
        'MUI: `pageSize` cannot exceed 100 in the MIT version of the DataGrid.',
        'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.',
      ].join('\n'),
    );
  }
};

const mergeStateWithPageSize =
  (pageSize: number) =>
  (state: GridStateCommunity): GridStateCommunity => ({
    ...state,
    pagination: {
      ...state.pagination,
      pageSize,
    },
  });

/**
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPageSize = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    'pageSize' | 'onPageSizeChange' | 'autoPageSize' | 'initialState' | 'signature'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridPageSize');
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

  apiRef.current.registerControlState({
    stateId: 'pageSize',
    propModel: props.pageSize,
    propOnChange: props.onPageSizeChange,
    stateSelector: gridPageSizeSelector,
    changeEvent: 'pageSizeChange',
  });

  /**
   * API METHODS
   */
  const setPageSize = React.useCallback<GridPageSizeApi['setPageSize']>(
    (pageSize) => {
      if (pageSize === gridPageSizeSelector(apiRef)) {
        return;
      }

      throwIfPageSizeExceedsTheLimit(pageSize, props.signature);

      logger.debug(`Setting page size to ${pageSize}`);

      apiRef.current.setState(mergeStateWithPageSize(pageSize));
      apiRef.current.forceUpdate();
    },
    [apiRef, logger, props.signature],
  );

  const pageSizeApi: GridPageSizeApi = {
    setPageSize,
  };

  useGridApiMethod(apiRef, pageSizeApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const pageSizeToExport = gridPageSizeSelector(apiRef);

      const shouldExportPageSize =
        // Always export if the `exportOnlyDirtyModels` property is activated
        !context.exportOnlyDirtyModels ||
        // Always export if the page size is controlled
        props.pageSize != null ||
        // Always export if the page size has been initialized
        props.initialState?.pagination?.pageSize != null ||
        // Export if the page size is not equal to the default value
        pageSizeToExport !== defaultPageSize(props.autoPageSize);

      if (!shouldExportPageSize) {
        return prevState;
      }

      return {
        ...prevState,
        pagination: {
          ...prevState.pagination,
          pageSize: pageSizeToExport,
        },
      };
    },
    [apiRef, props.pageSize, props.initialState?.pagination?.pageSize, props.autoPageSize],
  );

  /**
   * TODO: Add error if `prop.autoHeight = true`
   */
  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const pageSize = context.stateToRestore.pagination?.pageSize;
      if (pageSize != null) {
        throwIfPageSizeExceedsTheLimit(pageSize, props.signature);
        apiRef.current.setState(mergeStateWithPageSize(pageSize));
      }
      return params;
    },
    [apiRef, props.signature],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
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

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.pageSize != null && !props.autoPageSize) {
      apiRef.current.setPageSize(props.pageSize);
    }
  }, [apiRef, props.autoPageSize, props.pageSize]);

  React.useEffect(() => {
    handleUpdateAutoPageSize();
  }, [handleUpdateAutoPageSize]);
};
