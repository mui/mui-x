import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridStrategyProcessor,
  GridStrategyProcessingGroup,
  GridStrategyProcessingApi,
} from './gridStrategyProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../models/events';

type GridStrategyCache = {
  [G in GridStrategyProcessingGroup]?: { [strategyName: string]: GridStrategyProcessor<G> };
};

export const useGridStrategyProcessing = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const availableStrategies = React.useRef(new Map<string, boolean>());
  const preProcessorsRef = React.useRef<GridStrategyCache>({});

  const registerStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_registerStrategyProcessor']
  >(
    (group, strategyName, processor: GridStrategyProcessor<any>) => {
      if (!preProcessorsRef.current[group]) {
        preProcessorsRef.current[group] = {};
      }

      const groupPreProcessors = preProcessorsRef.current[group]!;
      if (groupPreProcessors[strategyName] !== processor) {
        groupPreProcessors[strategyName] = processor;
        apiRef.current.publishEvent(GridEvents.strategyProcessorRegister, { group, strategyName });
      }

      return () => {
        const { [strategyName]: removedPreProcessor, ...otherProcessors } =
          preProcessorsRef.current[group]!;
        preProcessorsRef.current[group] = otherProcessors as {
          [strategyName: string]: GridStrategyProcessor<any>;
        };
      };
    },
    [apiRef],
  );

  const applyStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_applyStrategyProcessor']
  >(
    (group, params) => {
      const currentStrategy = apiRef.current.unstable_getCurrentStrategy();
      if (currentStrategy == null) {
        throw new Error("Can't apply a strategy processor before defining an active strategy");
      }

      const groupCache = preProcessorsRef.current[group];
      if (!groupCache || !groupCache[currentStrategy]) {
        throw new Error(`No processor found for group "${group}" on strategy "${currentStrategy}"`);
      }

      const processor = groupCache[currentStrategy] as GridStrategyProcessor<any>;
      return processor(params);
    },
    [apiRef],
  );

  const getCurrentStrategy = React.useCallback<
    GridStrategyProcessingApi['unstable_getCurrentStrategy']
  >(
    () =>
      Array.from(availableStrategies.current.entries()).find(
        ([, isAvailable]) => isAvailable,
      )?.[0] ?? 'none',
    [],
  );

  const setStrategyAvailability = React.useCallback<
    GridStrategyProcessingApi['unstable_setStrategyAvailability']
  >(
    (strategyName, isAvailable) => {
      const currentStrategyBefore = apiRef.current.unstable_getCurrentStrategy();
      availableStrategies.current.set(strategyName, isAvailable);
      const currentStrategyAfter = apiRef.current.unstable_getCurrentStrategy();

      if (currentStrategyAfter !== currentStrategyBefore) {
        apiRef.current.publishEvent(GridEvents.currentStrategyChange);
      }
    },
    [apiRef],
  );

  const strategyProcessingApi: GridStrategyProcessingApi = {
    unstable_registerStrategyProcessor: registerStrategyProcessor,
    unstable_applyStrategyProcessor: applyStrategyProcessor,
    unstable_getCurrentStrategy: getCurrentStrategy,
    unstable_setStrategyAvailability: setStrategyAvailability,
  };

  useGridApiMethod(apiRef, strategyProcessingApi, 'GridStrategyProcessing');
};
