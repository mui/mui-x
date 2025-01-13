import * as React from 'react';
import { GridRenderContext } from '../../../models';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

type RootProps = Pick<DataGridProcessedProps, 'disableVirtualization' | 'autoHeight'>;

export type GridVirtualizationState = {
  enabled: boolean;
  enabledForColumns: boolean;
  enabledForRows: boolean;
  renderContext: GridRenderContext;
};

export const EMPTY_RENDER_CONTEXT = {
  firstRowIndex: 0,
  lastRowIndex: 0,
  firstColumnIndex: 0,
  lastColumnIndex: 0,
};

export const virtualizationStateInitializer: GridStateInitializer<RootProps> = (state, props) => {
  const { disableVirtualization, autoHeight } = props;

  const virtualization = {
    enabled: !disableVirtualization,
    enabledForColumns: !disableVirtualization,
    enabledForRows: !disableVirtualization && !autoHeight,
    renderContext: EMPTY_RENDER_CONTEXT,
  };

  return {
    ...state,
    virtualization,
  };
};

export function useGridVirtualization(
  apiRef: React.RefObject<GridPrivateApiCommunity>,
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
        enabledForColumns: enabled,
        enabledForRows: enabled && !props.autoHeight,
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
  }, [props.disableVirtualization, props.autoHeight]);
  /* eslint-enable react-hooks/exhaustive-deps */
}
