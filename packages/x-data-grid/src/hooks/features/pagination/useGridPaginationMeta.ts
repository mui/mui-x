import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPaginationMetaApi } from './gridPaginationInterfaces';
import { useGridLogger, useGridSelector, useGridApiMethod } from '../../utils';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { gridPaginationMetaSelector } from './gridPaginationSelector';

export const useGridPaginationMeta = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    'paginationMeta' | 'initialState' | 'paginationMode' | 'onPaginationMetaChange'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridPaginationMeta');

  const paginationMeta = useGridSelector(apiRef, gridPaginationMetaSelector);

  apiRef.current.registerControlState({
    stateId: 'paginationMeta',
    propModel: props.paginationMeta,
    propOnChange: props.onPaginationMetaChange,
    stateSelector: gridPaginationMetaSelector,
    changeEvent: 'paginationMetaChange',
  });

  /**
   * API METHODS
   */
  const setPaginationMeta = React.useCallback<GridPaginationMetaApi['setPaginationMeta']>(
    (newPaginationMeta) => {
      if (paginationMeta === newPaginationMeta) {
        return;
      }
      logger.debug("Setting 'paginationMeta' to", newPaginationMeta);

      apiRef.current.setState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          meta: newPaginationMeta,
        },
      }));
    },
    [apiRef, logger, paginationMeta],
  );

  const paginationMetaApi: GridPaginationMetaApi = {
    setPaginationMeta,
  };

  useGridApiMethod(apiRef, paginationMetaApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const exportedPaginationMeta = gridPaginationMetaSelector(apiRef);

      const shouldExportRowCount =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the `paginationMeta` is controlled
        props.paginationMeta != null ||
        // Always export if the `paginationMeta` has been initialized
        props.initialState?.pagination?.meta != null;

      if (!shouldExportRowCount) {
        return prevState;
      }

      return {
        ...prevState,
        pagination: {
          ...prevState.pagination,
          meta: exportedPaginationMeta,
        },
      };
    },
    [apiRef, props.paginationMeta, props.initialState?.pagination?.meta],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const restoredPaginationMeta = context.stateToRestore.pagination?.meta
        ? context.stateToRestore.pagination.meta
        : gridPaginationMetaSelector(apiRef);
      apiRef.current.setState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          meta: restoredPaginationMeta,
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
    if (props.paginationMeta) {
      apiRef.current.setPaginationMeta(props.paginationMeta);
    }
  }, [apiRef, props.paginationMeta]);
};
