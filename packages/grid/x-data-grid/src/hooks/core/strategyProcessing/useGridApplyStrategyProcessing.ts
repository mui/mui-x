import * as React from 'react';
import { GridEventListener, GridEvents } from '../../../models/events';
import { GridApiCommon } from '../../../models/api';
import {
  GridStrategyProcessingGroup,
  GridStrategyProcessingLookup,
} from './gridStrategyProcessingApi';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';

export const useGridApplyStrategyProcessing = <
  Api extends GridApiCommon,
  G extends GridStrategyProcessingGroup,
>(
  apiRef: React.MutableRefObject<Api>,
  group: G,
  /**
   * Callback fired when the processor of the registered strategy changes
   */
  onStrategyProcessorChange: () => void,
) => {
  const strategy = React.useCallback(
    (params: GridStrategyProcessingLookup[G]['params']) =>
      apiRef.current.unstable_applyStrategyProcessor(group, params),
    [apiRef, group],
  );

  const setStrategyName = React.useCallback(
    (newStrategyName: string) => {
      if (newStrategyName !== apiRef.current.unstable_getStrategyName(group)) {
        apiRef.current.unstable_setStrategyName(group, newStrategyName);
      }
    },
    [group, apiRef],
  );

  const handleStrategyProcessorChange = React.useCallback<
    GridEventListener<GridEvents.strategyProcessorRegister>
  >(
    (params) => {
      if (
        params.group !== group ||
        params.strategyName !== apiRef.current.unstable_getStrategyName(group)
      ) {
        return;
      }

      onStrategyProcessorChange();
    },
    [apiRef, group, onStrategyProcessorChange],
  );

  useGridApiEventHandler(
    apiRef,
    GridEvents.strategyProcessorRegister,
    handleStrategyProcessorChange,
  );

  return [strategy, setStrategyName] as const;
};
