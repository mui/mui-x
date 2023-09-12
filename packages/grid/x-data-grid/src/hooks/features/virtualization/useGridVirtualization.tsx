import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridVirtualizationApi } from '../../../models/api/gridVirtualizationApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

type RootProps = Pick<DataGridProcessedProps, 'disableVirtualization'>;

export type GridVirtualizationState = {
  enabled: boolean;
  enabledForColumns: boolean;
};

export const virtualizationStateInitializer: GridStateInitializer<RootProps> = (
  state,
  props,
  _apiRef,
) => {
  const virtualization = {
    enabled: !(props.disableVirtualization ?? false),
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

  React.useEffect(() => {
    const disable = props.disableVirtualization ?? false;
    setVirtualization(!disable);
  }, [props.disableVirtualization]);
}
