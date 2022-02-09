import * as React from 'react';
import { GridApiRef, GridState } from '../../../models';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPageSizeApi } from './gridPaginationInterfaces';
import { GridEvents } from '../../../models/events';
import {
  useGridLogger,
  useGridApiMethod,
  useGridApiEventHandler,
  useGridSelector,
} from '../../utils';
import { gridPageSizeSelector } from './gridPaginationSelector';
import { gridDensityRowHeightSelector } from '../density';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

const defaultPageSize = (autoPageSize: boolean) => (autoPageSize ? 0 : 100);

export const pageSizeStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'pageSize' | 'initialState' | 'autoPageSize'>
> = (state, props) => {
  let pageSize: number;
  if (props.pageSize != null) {
    pageSize = props.pageSize;
  } else if (props.initialState?.pagination?.pageSize != null) {
    pageSize = props.initialState.pagination.pageSize;
  } else {
    pageSize = defaultPageSize(props.autoPageSize);
  }

  return {
    ...state,
    pagination: {
      pageSize,
    },
  };
};

const mergeStateWithPageSize =
  (pageSize: number) =>
  (state: GridState): GridState => ({
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
  apiRef: GridApiRef,
  props: Pick<
    DataGridProcessedProps,
    'pageSize' | 'onPageSizeChange' | 'autoPageSize' | 'initialState'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridPageSize');
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

  apiRef.current.unstable_updateControlState({
    stateId: 'pageSize',
    propModel: props.pageSize,
    propOnChange: props.onPageSizeChange,
    stateSelector: gridPageSizeSelector,
    changeEvent: GridEvents.pageSizeChange,
  });

  /**
   * API METHODS
   */
  const setPageSize = React.useCallback<GridPageSizeApi['setPageSize']>(
    (pageSize) => {
      if (pageSize === gridPageSizeSelector(apiRef)) {
        return;
      }

      logger.debug(`Setting page size to ${pageSize}`);

      apiRef.current.setState(mergeStateWithPageSize(pageSize));
      apiRef.current.forceUpdate();
    },
    [apiRef, logger],
  );

  const pageSizeApi: GridPageSizeApi = {
    setPageSize,
  };

  useGridApiMethod(apiRef, pageSizeApi, 'GridPageSizeApi');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPreProcessor<'exportState'>>(
    (prevState) => {
      const pageSizeToExport = gridPageSizeSelector(apiRef);
      if (pageSizeToExport === defaultPageSize(props.autoPageSize)) {
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
    [apiRef, props.autoPageSize],
  );

  /**
   * TODO: Add error if `prop.autoHeight = true`
   */
  const stateRestorePreProcessing = React.useCallback<GridPreProcessor<'restoreState'>>(
    (params, context) => {
      const pageSize = context.stateToRestore.pagination?.pageSize;
      if (pageSize != null) {
        apiRef.current.setState(mergeStateWithPageSize(pageSize));
      }
      return params;
    },
    [apiRef],
  );

  useGridRegisterPreProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPreProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handleUpdateAutoPageSize = React.useCallback(() => {
    const dimensions = apiRef.current.getRootDimensions();
    if (!props.autoPageSize || !dimensions) {
      return;
    }

    const maximumPageSizeWithoutScrollBar = Math.floor(
      dimensions.viewportInnerSize.height / rowHeight,
    );
    apiRef.current.setPageSize(maximumPageSizeWithoutScrollBar);
  }, [apiRef, props.autoPageSize, rowHeight]);

  useGridApiEventHandler(apiRef, GridEvents.viewportInnerSizeChange, handleUpdateAutoPageSize);

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
