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

/**
 * Implements the Strategy Pattern (see https://en.wikipedia.org/wiki/Strategy_pattern)
 * For now, this hook only handles one active strategy at the time,
 * All our use-cases are related to the row tree management.
 * But in the future, it could support several strategies if we wanted to apply the same pattern to another use-case.
 */
export const useGridStrategyProcessing = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const availableStrategies = React.useRef(new Map<string, () => boolean>());
  const strategiesCache = React.useRef<GridStrategyCache>({});

  const registerStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_registerStrategyProcessor']
  >(
    (strategyName, group, processor: GridStrategyProcessor<any>) => {
      if (!strategiesCache.current[group]) {
        strategiesCache.current[group] = {};
      }

      const groupPreProcessors = strategiesCache.current[group]!;
      if (groupPreProcessors[strategyName] !== processor) {
        groupPreProcessors[strategyName] = processor;
        apiRef.current.publishEvent(GridEvents.strategyProcessorRegister, { group, strategyName });
      }

      return () => {
        const { [strategyName]: removedPreProcessor, ...otherProcessors } =
          strategiesCache.current[group]!;
        strategiesCache.current[group] = otherProcessors as {
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
      const currentStrategy = apiRef.current.unstable_getActiveStrategy();
      if (currentStrategy == null) {
        throw new Error("Can't apply a strategy processor before defining an active strategy");
      }

      const groupCache = strategiesCache.current[group];
      if (!groupCache || !groupCache[currentStrategy]) {
        throw new Error(`No processor found for group "${group}" on strategy "${currentStrategy}"`);
      }

      const processor = groupCache[currentStrategy] as GridStrategyProcessor<any>;
      return processor(params);
    },
    [apiRef],
  );

  const getActiveStrategy = React.useCallback<
    GridStrategyProcessingApi['unstable_getActiveStrategy']
  >(() => {
    const strategyEntries = Array.from(availableStrategies.current.entries());
    const availableStrategyEntry = strategyEntries.find(([, isStrategyAvailable]) =>
      isStrategyAvailable(),
    );

    return availableStrategyEntry?.[0] ?? 'none';
  }, []);

  const setStrategyAvailability = React.useCallback<
    GridStrategyProcessingApi['unstable_setStrategyAvailability']
  >(
    (strategyName, isAvailable) => {
      availableStrategies.current.set(strategyName, isAvailable);
      apiRef.current.publishEvent(GridEvents.strategyActivityChange);
    },
    [apiRef],
  );

  const strategyProcessingApi: GridStrategyProcessingApi = {
    unstable_registerStrategyProcessor: registerStrategyProcessor,
    unstable_applyStrategyProcessor: applyStrategyProcessor,
    unstable_getActiveStrategy: getActiveStrategy,
    unstable_setStrategyAvailability: setStrategyAvailability,
  };

  useGridApiMethod(apiRef, strategyProcessingApi, 'GridStrategyProcessing');
};
