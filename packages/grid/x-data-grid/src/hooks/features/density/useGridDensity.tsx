import * as React from 'react';
import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { GridDensityState } from './densityState';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridDensitySelector } from './densitySelector';
import { isDeepEqual } from '../../../utils/utils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;

// Math.floor(height * COMPACT_DENSITY_FACTOR)
const getUpdatedDensityState = (newDensity: GridDensity): GridDensityState => {
  switch (newDensity) {
    case GridDensityTypes.Compact:
      return {
        value: newDensity,
        factor: COMPACT_DENSITY_FACTOR,
      };
    case GridDensityTypes.Comfortable:
      return {
        value: newDensity,
        factor: COMFORTABLE_DENSITY_FACTOR,
      };
    default:
      return {
        value: newDensity,
        factor: 1,
      };
  }
};

export const densityStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'density' | 'headerHeight' | 'rowHeight'>
> = (state, props) => ({
  ...state,
  density: getUpdatedDensityState(props.density),
});

export const useGridDensity = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'headerHeight' | 'rowHeight' | 'density'>,
): void => {
  const logger = useGridLogger(apiRef, 'useDensity');

  const setDensity = React.useCallback<GridDensityApi['setDensity']>(
    (newDensity): void => {
      logger.debug(`Set grid density to ${newDensity}`);
      apiRef.current.setState((state) => {
        const currentDensityState = gridDensitySelector(state);
        const newDensityState = getUpdatedDensityState(newDensity);

        if (isDeepEqual(currentDensityState, newDensityState)) {
          return state;
        }

        return {
          ...state,
          density: newDensityState,
        };
      });
      apiRef.current.forceUpdate();
    },
    [logger, apiRef],
  );

  React.useEffect(() => {
    apiRef.current.setDensity(props.density);
  }, [apiRef, props.density]);

  const densityApi: GridDensityApi = {
    setDensity,
  };

  useGridApiMethod(apiRef, densityApi, 'public');
};
