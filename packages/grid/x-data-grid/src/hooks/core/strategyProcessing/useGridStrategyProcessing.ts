import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridStrategyProcessor,
  GridStrategyProcessorName,
  GridStrategyProcessingApi,
  GridStrategyProcessingLookup,
  GridStrategyGroup,
} from './gridStrategyProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../models/events';

export const GRID_DEFAULT_STRATEGY = 'none';

export const GRID_STRATEGIES_PROCESSORS: {
  [P in GridStrategyProcessorName]: GridStrategyProcessingLookup[P]['group'];
} = {
  rowTreeCreation: 'rowTree',
  filtering: 'rowTree',
  sorting: 'rowTree',
};

type UntypedStrategyProcessors = {
  [strategyName: string]: GridStrategyProcessor<any>;
};

/**
 * Implements a variant of the Strategy Pattern (see https://en.wikipedia.org/wiki/Strategy_pattern)
 *
 * Some plugins contain custom logic that must only be run if the right strategy is active.
 * For instance, the tree data plugin has:
 * - custom row tree creation algorithm.
 * - custom sorting algorithm.
 * - custom filtering algorithm.
 *
 * These plugins must use:
 * - `apiRef.current.unstable_registerStrategyProcessor` to register their processors.
 * - `apiRef.current.unstable_setStrategyAvailability` to tell if their strategy can be used.
 *
 * Some hooks need to run the custom logic of the active strategy.
 * For instance, the `useGridFiltering` wants to run:
 * - the tree data filtering if the tree data is the current way of grouping rows.
 * - the row grouping filtering if the row grouping is the current way of grouping rows.
 * - the flat filtering if there is no grouping of the rows (equivalent to the "none" strategy).
 *
 * These hooks must use:
 * - `apiRef.current.unstable_applyStrategyProcessor` to run a processor.
 * - `GridEvents.strategyAvailabilityChange` to update something when the active strategy changes.
 *    Warning: Be careful not to apply the processor several times.
 *    For instance `GridEvents.rowsSet` is fired by `useGridRows` whenever the active strategy changes.
 *    So listening to both would most likely run your logic twice.
 * - `GridEvents.activeStrategyProcessorChange` to update something when the processor of the active strategy changes
 *
 * Each processor name is part of a strategy group which can only have one active strategy at the time.
 */
export const useGridStrategyProcessing = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const availableStrategies = React.useRef(
    new Map<string, { group: GridStrategyGroup; isAvailable: () => boolean }>(),
  );
  const strategiesCache = React.useRef<{
    [P in GridStrategyProcessorName]?: { [strategyName: string]: GridStrategyProcessor<P> };
  }>({});

  const registerStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_registerStrategyProcessor']
  >(
    (strategyName, processorName, processor: GridStrategyProcessor<any>) => {
      const cleanup = () => {
        const { [strategyName]: removedPreProcessor, ...otherProcessors } =
          strategiesCache.current[processorName]!;
        strategiesCache.current[processorName] = otherProcessors as UntypedStrategyProcessors;
      };

      if (!strategiesCache.current[processorName]) {
        strategiesCache.current[processorName] = {};
      }

      const groupPreProcessors = strategiesCache.current[
        processorName
      ] as UntypedStrategyProcessors;
      const previousProcessor = groupPreProcessors[strategyName];
      groupPreProcessors[strategyName] = processor;

      if (!previousProcessor || previousProcessor === processor) {
        return cleanup;
      }

      if (
        strategyName ===
        apiRef.current.unstable_getActiveStrategy(GRID_STRATEGIES_PROCESSORS[processorName])
      ) {
        apiRef.current.publishEvent(GridEvents.activeStrategyProcessorChange, processorName);
      }

      return cleanup;
    },
    [apiRef],
  );

  const applyStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_applyStrategyProcessor']
  >(
    (processorName, params) => {
      const activeStrategy = apiRef.current.unstable_getActiveStrategy(
        GRID_STRATEGIES_PROCESSORS[processorName],
      );
      if (activeStrategy == null) {
        throw new Error("Can't apply a strategy processor before defining an active strategy");
      }

      const groupCache = strategiesCache.current[processorName];
      if (!groupCache || !groupCache[activeStrategy]) {
        throw new Error(
          `No processor found for processor "${processorName}" on strategy "${activeStrategy}"`,
        );
      }

      const processor = groupCache[activeStrategy] as GridStrategyProcessor<any>;
      return processor(params);
    },
    [apiRef],
  );

  const getActiveStrategy = React.useCallback<
    GridStrategyProcessingApi['unstable_getActiveStrategy']
  >((strategyGroup) => {
    const strategyEntries = Array.from(availableStrategies.current.entries());
    const availableStrategyEntry = strategyEntries.find(([, strategy]) => {
      if (strategy.group !== strategyGroup) {
        return false;
      }

      return strategy.isAvailable();
    });

    return availableStrategyEntry?.[0] ?? GRID_DEFAULT_STRATEGY;
  }, []);

  const setStrategyAvailability = React.useCallback<
    GridStrategyProcessingApi['unstable_setStrategyAvailability']
  >(
    (strategyGroup, strategyName, isAvailable) => {
      availableStrategies.current.set(strategyName, { group: strategyGroup, isAvailable });
      apiRef.current.publishEvent(GridEvents.strategyAvailabilityChange);
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
