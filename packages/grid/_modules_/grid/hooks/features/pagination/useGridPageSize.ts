import * as React from 'react';
import { GridApiRef } from '../../../models';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPageSizeApi } from './gridPaginationInterfaces';
import { GridEvents } from '../../../models/events';
import {
  useGridLogger,
  useGridApiMethod,
  useGridApiEventHandler,
  useGridSelector,
} from '../../utils';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { gridPageSizeSelector } from './gridPaginationSelector';
import { gridDensityRowHeightSelector } from '../density';
import {
  GridPreProcessingGroup,
  GridPreProcessor,
  useGridRegisterPreProcessor,
} from '../../core/preProcessing';

/**
 * @requires useGridDimensions (event) - can be after
 * @requires useGridFilter (state)
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

  useGridStateInit(apiRef, (state) => {
    let pageSize: number;
    if (props.pageSize != null) {
      pageSize = props.pageSize;
    } else if (props.initialState?.pagination?.pageSize != null) {
      pageSize = props.initialState.pagination.pageSize;
    } else if (props.autoPageSize) {
      pageSize = 0;
    } else {
      pageSize = 100;
    }

    return {
      ...state,
      pagination: {
        pageSize,
      },
    };
  });

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
      if (pageSize === gridPageSizeSelector(apiRef.current.state)) {
        return;
      }

      logger.debug(`Setting page size to ${pageSize}`);

      apiRef.current.setState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          pageSize,
        },
      }));
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
  const stateExportPreProcessing = React.useCallback<
    GridPreProcessor<GridPreProcessingGroup.exportState>
  >(
    (prevState) => {
      return {
        ...prevState,
        pagination: {
          ...prevState.pagination,
          pageSize: gridPageSizeSelector(apiRef.current.state),
        },
      };
    },
    [apiRef],
  );

  /**
   * TODO: Add error if `prop.autoHeight = true`
   */
  const stateRestorePreProcessing = React.useCallback<
    GridPreProcessor<GridPreProcessingGroup.restoreState>
  >((params, context) => {
    if (context.stateToRestore.pagination?.pageSize == null) {
      return params;
    }

    return {
      ...params,
      state: {
        ...params.state,
        pagination: {
          ...params.state.pagination,
          pageSize: context.stateToRestore.pagination.pageSize,
        },
      },
    };
  }, []);

  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.exportState, stateExportPreProcessing);
  useGridRegisterPreProcessor(
    apiRef,
    GridPreProcessingGroup.restoreState,
    stateRestorePreProcessing,
  );

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
