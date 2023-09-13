import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

type RootProps = Pick<DataGridProcessedProps, 'disableVirtualization'>;

export type GridVirtualizationState = {
  enabled: boolean;
  enabledForColumns: boolean;
};

export const virtualizationStateInitializer: GridStateInitializer<RootProps> = (state, props) => {
  const virtualization = {
    enabled: !props.disableVirtualization,
    enabledForColumns: true,
  };

  return {
    ...state,
    virtualization,
  };
};

export function useGridVirtualization(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: RootProps,
): void {
  /*
   * API METHODS
   */

  const setVirtualization = (enabled: boolean) => {
    apiRef.current.setState((state) => ({
      ...state,
      virtualization: {
        ...state.virtualization,
        enabled,
      },
    }));
  };

  const setColumnVirtualization = (enabled: boolean) => {
    apiRef.current.setState((state) => ({
      ...state,
      virtualization: {
        ...state.virtualization,
        enabledForColumns: enabled,
      },
    }));
  };

  const api = {
    unstable_setVirtualization: setVirtualization,
    unstable_setColumnVirtualization: setColumnVirtualization,
  };

  useGridApiMethod(apiRef, api, 'public');

  /*
   * EFFECTS
   */

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    setVirtualization(!props.disableVirtualization);
  }, [props.disableVirtualization]);
  /* eslint-enable react-hooks/exhaustive-deps */
}
