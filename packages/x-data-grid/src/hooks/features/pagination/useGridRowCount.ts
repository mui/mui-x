'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import useLazyRef from '@mui/utils/useLazyRef';
import { useStoreEffect } from '@mui/x-internals/store';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridPaginationRowCountApi, GridPaginationState } from './gridPaginationInterfaces';
import { gridFilteredTopLevelRowCountSelector } from '../filter';
import { useGridLogger, useGridApiMethod, useGridEvent } from '../../utils';
import { type GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import {
  gridPaginationRowCountSelector,
  gridPaginationMetaSelector,
  gridPaginationModelSelector,
} from './gridPaginationSelector';

export const useGridRowCount = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    'rowCount' | 'initialState' | 'paginationMode' | 'onRowCountChange'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridRowCount');

  const previousPageSize = useLazyRef(() => gridPaginationModelSelector(apiRef).pageSize);

  const onRowCountChangeProp = props.onRowCountChange;

  apiRef.current.registerControlState({
    stateId: 'paginationRowCount',
    propModel: props.rowCount,
    propOnChange: onRowCountChangeProp,
    stateSelector: gridPaginationRowCountSelector,
    changeEvent: 'rowCountChange',
  });

  /**
   * API METHODS
   */
  const setRowCount = React.useCallback<GridPaginationRowCountApi['setRowCount']>(
    (newRowCount) => {
      const rowCountState = gridPaginationRowCountSelector(apiRef);
      if (rowCountState === newRowCount) {
        return;
      }
      logger.debug("Setting 'rowCount' to", newRowCount);

      if (rowCountState == null || rowCountState === -1) {
        const newState = {
          ...apiRef.current.state,
          pagination: {
            ...apiRef.current.state.pagination,
            rowCount: newRowCount,
          },
        };
        apiRef.current.state = newState;
        apiRef.current.store.update(newState);
        apiRef.current.publishEvent('rowCountChange', newRowCount);
        if (onRowCountChangeProp) {
          onRowCountChangeProp(newRowCount);
        }
        return;
      }

      apiRef.current.setState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          rowCount: newRowCount,
        },
      }));
    },
    [apiRef, logger, onRowCountChangeProp],
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
   * EVENTS
   */
  const handlePaginationModelChange = React.useCallback(
    (model: GridPaginationState['paginationModel']) => {
      if (props.paginationMode === 'client' || !previousPageSize.current) {
        return;
      }
      if (model.pageSize !== previousPageSize.current) {
        previousPageSize.current = model.pageSize;
        const rowCountState = gridPaginationRowCountSelector(apiRef);
        if (rowCountState === -1) {
          // Row count unknown and page size changed, reset the page
          apiRef.current.setPage(0);
        }
      }
    },
    [props.paginationMode, previousPageSize, apiRef],
  );

  useGridEvent(apiRef, 'paginationModelChange', handlePaginationModelChange);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.paginationMode === 'server' && props.rowCount != null) {
      apiRef.current.setRowCount(props.rowCount);
    }
  }, [apiRef, props.paginationMode, props.rowCount]);

  useStoreEffect(
    // typings not supported currently, but methods work
    apiRef.current.store as any,
    () => {
      const isLastPage = gridPaginationMetaSelector(apiRef).hasNextPage === false;
      if (isLastPage) {
        return true;
      }
      if (props.paginationMode === 'client') {
        return gridFilteredTopLevelRowCountSelector(apiRef);
      }
      return undefined;
    },
    (_, isLastPageOrRowCount) => {
      const rowCount = gridPaginationRowCountSelector(apiRef);
      if (isLastPageOrRowCount === true && (rowCount == null || rowCount === -1)) {
        const visibleTopLevelRowCount = gridFilteredTopLevelRowCountSelector(apiRef);
        const paginationModel = gridPaginationModelSelector(apiRef);
        apiRef.current.setRowCount(
          paginationModel.pageSize * paginationModel.page + visibleTopLevelRowCount,
        );
      } else if (typeof isLastPageOrRowCount === 'number') {
        apiRef.current.setRowCount(isLastPageOrRowCount);
      }
    },
  );

  React.useEffect(() => {
    if (props.paginationMode === 'client') {
      apiRef.current.setRowCount(gridFilteredTopLevelRowCountSelector(apiRef));
    }
  }, [apiRef, props.paginationMode]);
};
