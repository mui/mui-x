import * as React from 'react';
import { useLogger } from '../../utils/useLogger';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { DensityApi } from '../../../models/api/densityApi';
import { Density, DensityTypes } from '../../../models';
import { optionsSelector } from '../../utils/useOptionsProp';
import { DensityState } from './densityState';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;

export const useDensity = (apiRef: ApiRef): void => {
  const logger = useLogger('useDensity');
  const { rowHeight, headerHeight } = useGridSelector(apiRef, optionsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const getUpdatedDensityState = React.useCallback(
    (density: Density, newHeaderHeight: number, newRowHeight: number): DensityState => {
      switch (density) {
        case DensityTypes.Compact:
          return {
            value: density,
            headerHeight: Math.floor(newHeaderHeight * COMPACT_DENSITY_FACTOR),
            rowHeight: Math.floor(newRowHeight * COMPACT_DENSITY_FACTOR),
          };
        case DensityTypes.Comfortable:
          return {
            value: density,
            headerHeight: Math.floor(newHeaderHeight * COMFORTABLE_DENSITY_FACTOR),
            rowHeight: Math.floor(newRowHeight * COMFORTABLE_DENSITY_FACTOR),
          };
        default:
          return {
            value: density,
            headerHeight: newHeaderHeight,
            rowHeight: newRowHeight,
          };
      }
    },
    [],
  );

  const setDensity = React.useCallback(
    (density: Density, newHeaderHeight = headerHeight, newRowHeight = rowHeight): void => {
      logger.debug(`Set grid density to ${density}`);
      setGridState((oldState) => ({
        ...oldState,
        density: {
          ...oldState.density,
          ...getUpdatedDensityState(density, newHeaderHeight, newRowHeight),
        },
      }));
      forceUpdate();
    },
    [logger, setGridState, forceUpdate, getUpdatedDensityState, headerHeight, rowHeight],
  );

  const densityApi: DensityApi = {
    setDensity,
  };

  useApiMethod(apiRef, densityApi, 'DensityApi');
};
