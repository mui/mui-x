'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import useEventCallback from '@mui/utils/useEventCallback';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridDensitySelector } from './densitySelector';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';

export const densityStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'initialState' | 'density'>
> = (state, { initialState, density }) => ({
  ...state,
  density: initialState?.density ?? density ?? 'standard',
});

export const useGridDensity = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'density' | 'onDensityChange' | 'initialState'>,
): void => {
  const { density, onDensityChange, initialState } = props;
  const logger = useGridLogger(apiRef, 'useDensity');

  apiRef.current.registerControlState({
    stateId: 'density',
    propModel: density,
    propOnChange: onDensityChange,
    stateSelector: gridDensitySelector,
    changeEvent: 'densityChange',
  });

  const setDensity = useEventCallback<GridDensityApi['setDensity']>((newDensity): void => {
    const currentDensity = gridDensitySelector(apiRef);
    if (currentDensity === newDensity) {
      return;
    }

    logger.debug(`Set grid density to ${newDensity}`);

    apiRef.current.setState((state) => ({
      ...state,
      density: newDensity,
    }));
  });

  const densityApi: GridDensityApi = {
    setDensity,
  };

  useGridApiMethod(apiRef, densityApi, 'public');

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const exportedDensity = gridDensitySelector(apiRef);

      const shouldExportRowCount =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the `density` is controlled
        density != null ||
        // Always export if the `density` has been initialized
        initialState?.density != null;

      if (!shouldExportRowCount) {
        return prevState;
      }

      return {
        ...prevState,
        density: exportedDensity,
      };
    },
    [apiRef, density, initialState?.density],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const restoredDensity = context.stateToRestore?.density
        ? context.stateToRestore.density
        : gridDensitySelector(apiRef);
      apiRef.current.setState((state) => ({
        ...state,
        density: restoredDensity,
      }));
      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  React.useEffect(() => {
    if (density) {
      apiRef.current.setDensity(density);
    }
  }, [apiRef, density]);
};
