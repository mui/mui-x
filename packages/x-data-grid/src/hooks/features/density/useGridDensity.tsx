import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridDensitySelector } from './densitySelector';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const densityStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'initialState' | 'density'>
> = (state, props) => ({
  ...state,
  density: props.initialState?.density ?? props.density ?? 'standard',
});

export const useGridDensity = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'density' | 'onDensityChange'>,
): void => {
  const logger = useGridLogger(apiRef, 'useDensity');

  apiRef.current.registerControlState({
    stateId: 'density',
    propModel: props.density,
    propOnChange: props.onDensityChange,
    stateSelector: gridDensitySelector,
    changeEvent: 'densityChange',
  });

  const setDensity = useEventCallback<GridDensityApi['setDensity']>((newDensity): void => {
    const currentDensity = gridDensitySelector(apiRef.current.state);
    if (currentDensity === newDensity) {
      return;
    }

    logger.debug(`Set grid density to ${newDensity}`);

    apiRef.current.setState((state) => ({
      ...state,
      density: newDensity,
    }));
  });

  React.useEffect(() => {
    if (props.density) {
      apiRef.current.setDensity(props.density);
    }
  }, [apiRef, props.density]);

  const densityApi: GridDensityApi = {
    setDensity,
  };

  useGridApiMethod(apiRef, densityApi, 'public');
};
