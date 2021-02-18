import * as React from 'react';
import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { GridGridDensity } from './densityState';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;

export const useGridDensity = (apiRef: GridApiRef): void => {
  const logger = useLogger('useDensity');
  const { density, rowHeight, headerHeight } = useGridSelector(apiRef, optionsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const getUpdatedDensityState = React.useCallback(
    (newDensity: GridDensity, newHeaderHeight: number, newRowHeight: number): GridGridDensity => {
      switch (newDensity) {
        case GridDensityTypes.Compact:
          return {
            value: newDensity,
            headerHeight: Math.floor(newHeaderHeight * COMPACT_DENSITY_FACTOR),
            rowHeight: Math.floor(newRowHeight * COMPACT_DENSITY_FACTOR),
          };
        case GridDensityTypes.Comfortable:
          return {
            value: newDensity,
            headerHeight: Math.floor(newHeaderHeight * COMFORTABLE_DENSITY_FACTOR),
            rowHeight: Math.floor(newRowHeight * COMFORTABLE_DENSITY_FACTOR),
          };
        default:
          return {
            value: newDensity,
            headerHeight: newHeaderHeight,
            rowHeight: newRowHeight,
          };
      }
    },
    [],
  );

  const setDensity = React.useCallback(
    (newDensity: GridDensity, newHeaderHeight = headerHeight, newRowHeight = rowHeight): void => {
      logger.debug(`Set grid density to ${newDensity}`);
      setGridState((oldState) => ({
        ...oldState,
        density: {
          ...oldState.density,
          ...getUpdatedDensityState(newDensity, newHeaderHeight, newRowHeight),
        },
      }));
      forceUpdate();
    },
    [logger, setGridState, forceUpdate, getUpdatedDensityState, headerHeight, rowHeight],
  );

  React.useEffect(() => {
    setDensity(density, headerHeight, rowHeight);
  }, [setDensity, density, rowHeight, headerHeight]);

  const densityApi: GridDensityApi = {
    setDensity,
  };

  useGridApiMethod(apiRef, densityApi, 'GridDensityApi');
};
