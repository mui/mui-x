import * as React from 'react';
import { GridDensity } from '../../../models/gridDensity';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridDensitySelector } from './densitySelector';
import { isDeepEqual } from '../../../utils/utils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;

const DENSITY_FACTORS: Record<GridDensity, number> = {
  compact: COMPACT_DENSITY_FACTOR,
  comfortable: COMFORTABLE_DENSITY_FACTOR,
  standard: 1,
};

export const densityStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'density'>
> = (state, props) => ({
  ...state,
  density: { value: props.density, factor: DENSITY_FACTORS[props.density] },
});

export const useGridDensity = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'density'>,
): void => {
  const logger = useGridLogger(apiRef, 'useDensity');

  const setDensity = React.useCallback<GridDensityApi['setDensity']>(
    (newDensity): void => {
      logger.debug(`Set grid density to ${newDensity}`);
      apiRef.current.setState((state) => {
        const currentDensityState = gridDensitySelector(state);
        const newDensityState = { value: newDensity, factor: DENSITY_FACTORS[newDensity] };

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
