import * as React from 'react';
import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridState } from '../../utils/useGridState';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { GridDensityState } from './densityState';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { gridDensitySelector } from './densitySelector';
import { isDeepEqual } from '../../../utils/utils';

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

  useGridStateInit(apiRef, (state) => ({
    ...state,
    density: getUpdatedDensityState(props.density, props.headerHeight, props.rowHeight),
  }));

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const setDensity = React.useCallback(
    (
      newDensity: GridDensity,
      newHeaderHeight = props.headerHeight,
      newRowHeight = props.rowHeight,
    ): void => {
      logger.debug(`Set grid density to ${newDensity}`);
      setGridState((state) => {
        const currentDensityState = gridDensitySelector(state);
        const newDensityState = getUpdatedDensityState(newDensity, newHeaderHeight, newRowHeight);

        if (isDeepEqual(currentDensityState, newDensityState)) {
          return state;
        }

        return {
          ...state,
          density: newDensityState,
        };
      });
      forceUpdate();
    },
    [logger, setGridState, forceUpdate, props.headerHeight, props.rowHeight],
  );

  React.useEffect(() => {
    apiRef.current.setDensity(props.density, props.headerHeight, props.rowHeight);
  }, [apiRef, props.density, props.rowHeight, props.headerHeight]);

  const densityApi: GridDensityApi = {
    setDensity,
  };

  useGridApiMethod(apiRef, densityApi, 'GridDensityApi');
};
