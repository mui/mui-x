import * as React from 'react';
import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridState } from '../core/useGridState';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { GridDensityState } from './densityState';
import { GridComponentProps } from '../../../GridComponentProps';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;

const getUpdatedDensityState = (
  newDensity: GridDensity,
  newHeaderHeight: number,
  newRowHeight: number,
): GridDensityState => {
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
};

export const useGridDensity = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'headerHeight' | 'rowHeight' | 'density'>,
): void => {
  const logger = useGridLogger(apiRef, 'useDensity');
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const setDensity = React.useCallback(
    (
      newDensity: GridDensity,
      newHeaderHeight = props.headerHeight,
      newRowHeight = props.rowHeight,
    ): void => {
      logger.debug(`Set grid density to ${newDensity}`);
      setGridState((state) => ({
        ...state,
        density: {
          ...state.density,
          ...getUpdatedDensityState(newDensity, newHeaderHeight, newRowHeight),
        },
      }));
      forceUpdate();
    },
    [
      logger,
      setGridState,
      forceUpdate,
      getUpdatedDensityState,
      props.headerHeight,
      props.rowHeight,
    ],
  );

  React.useEffect(() => {
    setDensity(props.density, props.headerHeight, props.rowHeight);
  }, [setDensity, props.density, props.rowHeight, props.headerHeight]);

  const densityApi: GridDensityApi = {
    setDensity,
  };

  useGridApiMethod(apiRef, densityApi, 'GridDensityApi');
};
