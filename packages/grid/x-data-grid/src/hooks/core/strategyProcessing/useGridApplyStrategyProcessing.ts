import * as React from 'react';
import { GridEventListener, GridEvents } from '../../../models/events';
import { GridApiCommon } from '../../../models/api';
import { GridStrategyProcessingGroup, GridStrategyProcessor } from './gridStrategyProcessingApi';
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
  const strategyName = React.useRef<string | null>(null);
  const strategy = React.useRef<GridStrategyProcessor<G> | null>();

  const updateStrategy = React.useCallback(() => {
    if (strategyName.current == null) {
      return;
    }
    strategy.current = (params) =>
      apiRef.current.unstable_applyStrategyProcessor(group, strategyName.current!, params);
  }, [apiRef, group]);

  const setStrategyName = React.useCallback(
    (newStrategyName: string) => {
      if (newStrategyName !== strategyName.current) {
        strategyName.current = newStrategyName;
        updateStrategy();
      }
    },
    [updateStrategy],
  );

  const handleStrategyChange = React.useCallback<
    GridEventListener<GridEvents.strategyProcessorRegister>
  >(
    (params) => {
      if (params.group !== group || params.strategyName !== strategyName.current) {
        return;
      }

      updateStrategy();
      onStrategyProcessorChange();
    },
    [updateStrategy, group, onStrategyProcessorChange],
  );

  useGridApiEventHandler(apiRef, GridEvents.strategyProcessorRegister, handleStrategyChange);

  return [strategy, setStrategyName] as const;
};
