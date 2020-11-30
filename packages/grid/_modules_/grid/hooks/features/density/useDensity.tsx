import * as React from 'react';
import { useLogger } from '../../utils/useLogger';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { DensityApi } from '../../../models/api/densityApi';
import { Size, SizeTypes } from '../../../models';
import { optionsSelector } from '../../utils/useOptionsProp';
import { DensityState } from './densityState';

const DENSITY_DIVISOR = 2;
const DENSITY_MULTIPLIER = 1.5;

export const useDensity = (apiRef: ApiRef): void => {
  const logger = useLogger('useDensity');
  const { rowHeight, headerHeight } = useGridSelector(apiRef, optionsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const getUpdatedDensityState = React.useCallback(
    (densitySize: Size, newHeaderHeight: number, newRowHeight: number): DensityState => {
      switch (densitySize) {
        case SizeTypes.Small:
          return {
            size: densitySize,
            headerHeight: Math.floor(newHeaderHeight / DENSITY_DIVISOR),
            rowHeight: Math.floor(newRowHeight / DENSITY_DIVISOR),
          };
        case SizeTypes.Large:
          return {
            size: densitySize,
            headerHeight: Math.floor(newHeaderHeight * DENSITY_MULTIPLIER),
            rowHeight: Math.floor(newRowHeight * DENSITY_MULTIPLIER),
          };
        default:
          return {
            size: densitySize,
            headerHeight: newHeaderHeight,
            rowHeight: newRowHeight,
          };
      }
    },
    [],
  );

  const setDensity = React.useCallback(
    (densitySize: Size, newHeaderHeight = headerHeight, newRowHeight = rowHeight): void => {
      logger.debug(`Set grid density to ${densitySize}`);
      setGridState((oldState) => ({
        ...oldState,
        density: {
          ...oldState.density,
          ...getUpdatedDensityState(densitySize, newHeaderHeight, newRowHeight),
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
