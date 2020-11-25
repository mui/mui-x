import * as React from 'react';
import { useLogger } from '../../utils/useLogger';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { DensityConfig, DensityPickerApi } from '../../../models/api/densityPickerApi';
import { Density, DensityTypes } from '../../../models';
import { optionsSelector } from '../../utils/useOptionsProp';

const DENSITY_DIVISOR = 2;
const DENSITY_MULTIPLIER = 1.5;

export const useDensityPicker = (apiRef: ApiRef): void => {
  const logger = useLogger('useDensityPicker');
  const options = useGridSelector(apiRef, optionsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const initialDensityConfig = React.useRef<DensityConfig>({
    density: options.density,
    headerHeight: options.headerHeight,
    rowHeight: options.rowHeight,
  });

  const getUpdatedDensityConfig = React.useCallback(
    (density: Density): DensityConfig => {
      switch (density) {
        case DensityTypes.Small:
          return {
            density,
            headerHeight: Math.floor(initialDensityConfig.current.headerHeight / DENSITY_DIVISOR),
            rowHeight: Math.floor(initialDensityConfig.current.rowHeight / DENSITY_DIVISOR),
          };
        case DensityTypes.Large:
          return {
            density,
            headerHeight: Math.floor(
              initialDensityConfig.current.headerHeight * DENSITY_MULTIPLIER,
            ),
            rowHeight: Math.floor(initialDensityConfig.current.rowHeight * DENSITY_MULTIPLIER),
          };
        default:
          return {
            ...initialDensityConfig.current,
            density,
          };
      }
    },
    [initialDensityConfig],
  );

  const setDensity = React.useCallback(
    (density: Density): void => {
      logger.debug(`Set grid density to ${density}`);
      setGridState((oldState) => ({
        ...oldState,
        options: {
          ...oldState.options,
          ...getUpdatedDensityConfig(density),
        },
      }));
      forceUpdate();
    },
    [logger, setGridState, forceUpdate, getUpdatedDensityConfig],
  );

  React.useEffect(() => {
    if (initialDensityConfig.current.density !== DensityTypes.Medium) {
      setDensity(initialDensityConfig.current.density);
    }
  }, [setDensity]);

  const densityPickerApi: DensityPickerApi = {
    setDensity,
  };

  useApiMethod(apiRef, densityPickerApi, 'DensityPickerApi');
};
