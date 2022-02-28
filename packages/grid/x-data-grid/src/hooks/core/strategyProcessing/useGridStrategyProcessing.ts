import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridStrategyProcessor,
  GridStrategyProcessorName,
  GridStrategyProcessingApi,
} from './gridStrategyProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../models/events';

export const GRID_DEFAULT_STRATEGY = 'none';

/**
 * Implements a variant of the Strategy Pattern (see https://en.wikipedia.org/wiki/Strategy_pattern)
 *
 * Some plugins contain custom logic that that must only be run if the right strategy is active.
 * For instance, the tree data plugin has custom filtering behavior.
 * These plugins must use:
 * - `apiRef.current.unstable_registerStrategyProcessor` to register their processors
 * - `apiRef.current.unstable_setStrategyAvailability` to tell if their strategy can be used
 *
 * Some hooks need to run the custom logic of the active strategy.
 * For instance, the `useGridFiltering` wants to run
 * - the tree data filtering if the tree data is the current way of grouping rows
 * - the row grouping filtering if the row grouping is the current way of grouping rows
 * - the flat filtering if there is no grouping of the rows (equivalent to the "none" strategy)
 * These hooks must use:
 * - `apiRef.current.unstable_applyStrategyProcessor` to run a processor
 * - `GridEvents.strategyActivityChange` to update something when the active strategy changes
 *    Warning: Do not listen to it if you are already indirectly, for instance via `Grid.rowsSet`
 * - `GridEvents.activeStrategyProcessorChange` to update something when the processor of the active strategy changes
 *
 * For now, this hook is only compatible with row grouping related strategies.
 * In the future, it could support several type of strategies if we wanted to apply the same pattern to another set of processors.
 */
export const useGridStrategyProcessing = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const availableStrategies = React.useRef(new Map<string, () => boolean>());
  const strategiesCache = React.useRef<{
    [P in GridStrategyProcessorName]?: { [strategyName: string]: GridStrategyProcessor<P> };
  }>({});

  const registerStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_registerStrategyProcessor']
  >(
    (strategyName, group, processor: GridStrategyProcessor<any>) => {
      if (!strategiesCache.current[group]) {
        strategiesCache.current[group] = {};
      }

      const groupPreProcessors = strategiesCache.current[group]!;
      const previousProcessor = groupPreProcessors[strategyName];
      if (previousProcessor !== processor) {
        groupPreProcessors[strategyName] = processor;

        if (
          (previousProcessor as GridStrategyProcessor<any> | undefined) &&
          strategyName === apiRef.current.unstable_getActiveStrategy()
        ) {
          apiRef.current.publishEvent(GridEvents.activeStrategyProcessorChange, group);
        }
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

    return availableStrategyEntry?.[0] ?? GRID_DEFAULT_STRATEGY;
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
