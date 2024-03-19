import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPaginationRowCountApi } from './gridPaginationInterfaces';
import { gridFilteredTopLevelRowCountSelector } from '../filter';
import { useGridLogger, useGridSelector, useGridApiMethod } from '../../utils';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { gridPaginationRowCountSelector } from './gridPaginationSelector';
import { noRowCountInServerMode } from './gridPaginationUtils';

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridRowCount = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    'rowCount' | 'initialState' | 'paginationMode' | 'onRowCountChange'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridRowCount');

  const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  const rowCount = useGridSelector(apiRef, gridPaginationRowCountSelector);

  apiRef.current.registerControlState({
    stateId: 'paginationRowCount',
    propModel: props.rowCount,
    propOnChange: props.onRowCountChange,
    stateSelector: gridPaginationRowCountSelector,
    changeEvent: 'rowCountChange',
  });

  /**
   * API METHODS
   */
  const setRowCount = React.useCallback<GridPaginationRowCountApi['setRowCount']>(
    (newRowCount) => {
      if (rowCount === newRowCount) {
        return;
      }
      logger.debug("Setting 'rowCount' to", newRowCount);

      apiRef.current.setState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          rowCount: newRowCount,
        },
      }));
    },
    [apiRef, logger, rowCount],
  );

  const paginationRowCountApi: GridPaginationRowCountApi = {
    setRowCount,
  };

  useGridApiMethod(apiRef, paginationRowCountApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const exportedRowCount = gridPaginationRowCountSelector(apiRef);

      const shouldExportRowCount =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the `rowCount` is controlled
        props.rowCount != null ||
        // Always export if the `rowCount` has been initialized
        props.initialState?.pagination?.rowCount != null;

      if (!shouldExportRowCount) {
        return prevState;
      }

      return {
        ...prevState,
        pagination: {
          ...prevState.pagination,
          rowCount: exportedRowCount,
        },
      };
    },
    [apiRef, props.rowCount, props.initialState?.pagination?.rowCount],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const restoredRowCount = context.stateToRestore.pagination?.rowCount
        ? context.stateToRestore.pagination.rowCount
        : gridPaginationRowCountSelector(apiRef);
      apiRef.current.setState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          rowCount: restoredRowCount,
        },
      }));
      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

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
    if (props.paginationMode === 'client') {
      apiRef.current.setRowCount(visibleTopLevelRowCount);
    } else if (props.rowCount != null) {
      apiRef.current.setRowCount(props.rowCount);
    }
  }, [apiRef, visibleTopLevelRowCount, props.paginationMode, props.rowCount]);
};
