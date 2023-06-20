import * as React from 'react';
import { GridPrivateApiCommon } from '../../../models/api/gridApiCommon';
import {
  GridStrategyProcessor,
  GridStrategyProcessorName,
  GridStrategyProcessingApi,
  GridStrategyProcessingLookup,
  GridStrategyGroup,
} from './gridStrategyProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

export const GRID_DEFAULT_STRATEGY = 'none';

export const GRID_STRATEGIES_PROCESSORS: {
  [P in GridStrategyProcessorName]: GridStrategyProcessingLookup[P]['group'];
} = {
  rowTreeCreation: 'rowTree',
  filtering: 'rowTree',
  sorting: 'rowTree',
  visibleRowsLookupCreation: 'rowTree',
};

type UntypedStrategyProcessors = {
  [strategyName: string]: GridStrategyProcessor<any>;
};

/**
 * Implements a variant of the Strategy Pattern (see https://en.wikipedia.org/wiki/Strategy_pattern)
 *
 * More information and detailed example in (TODO add link to technical doc when ready)
 *
 * Some plugins contains custom logic that must only be applied if the right strategy is active.
 * For instance, the row grouping plugin has a custom filtering algorithm.
 * This algorithm must be applied by the filtering plugin if the row grouping is the current way of grouping rows,
 * but not if the tree data is the current way of grouping rows.
 *
 * =====================================================================================================================
 *
 * The plugin containing the custom logic must use:
 *
 * - `useGridRegisterStrategyProcessor` to register their processor.
 *   When the processor of the active strategy changes, it will fire `"activeStrategyProcessorChange"` to re-apply the processor.
 *
 * - `apiRef.current.setStrategyAvailability` to tell if their strategy can be used.
 *
 * =====================================================================================================================
 *
 * The plugin or component that needs to apply the custom logic of the current strategy must use:
 *
 * - `apiRef.current.applyStrategyProcessor` to run the processor of the active strategy for a given processor name.
 *
 * - the "strategyAvailabilityChange" event to update something when the active strategy changes.
 *    Warning: Be careful not to apply the processor several times.
 *    For instance "rowsSet" is fired by `useGridRows` whenever the active strategy changes.
 *    So listening to both would most likely run your logic twice.
 *
 * - The "activeStrategyProcessorChange" event to update something when the processor of the active strategy changes.
 *
 * =====================================================================================================================
 *
 * Each processor name is part of a strategy group which can only have one active strategy at the time.
 * For now, there is only one strategy group named `rowTree` which customize
 * - row tree creation algorithm.
 * - sorting algorithm.
 * - filtering algorithm.
 */
export const useGridStrategyProcessing = (apiRef: React.MutableRefObject<GridPrivateApiCommon>) => {
  const availableStrategies = React.useRef(
    new Map<string, { group: GridStrategyGroup; isAvailable: () => boolean }>(),
  );
  const strategiesCache = React.useRef<{
    [P in GridStrategyProcessorName]?: { [strategyName: string]: GridStrategyProcessor<any> };
  }>({});

  const registerStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['registerStrategyProcessor']
  >(
    (strategyName, processorName, processor: GridStrategyProcessor<any>) => {
      const cleanup = () => {
        const { [strategyName]: removedPreProcessor, ...otherProcessors } =
          strategiesCache.current[processorName]!;
        strategiesCache.current[processorName] = otherProcessors;
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
        strategyName === apiRef.current.getActiveStrategy(GRID_STRATEGIES_PROCESSORS[processorName])
      ) {
        apiRef.current.publishEvent('activeStrategyProcessorChange', processorName);
      }

      return cleanup;
    },
    [apiRef],
  );

  const applyStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['applyStrategyProcessor']
  >(
    (processorName, params) => {
      const activeStrategy = apiRef.current.getActiveStrategy(
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

  const getActiveStrategy = React.useCallback<GridStrategyProcessingApi['getActiveStrategy']>(
    (strategyGroup) => {
      const strategyEntries = Array.from(availableStrategies.current.entries());
      const availableStrategyEntry = strategyEntries.find(([, strategy]) => {
        if (strategy.group !== strategyGroup) {
          return false;
        }

        return strategy.isAvailable();
      });

      return availableStrategyEntry?.[0] ?? GRID_DEFAULT_STRATEGY;
    },
    [],
  );

  const setStrategyAvailability = React.useCallback<
    GridStrategyProcessingApi['setStrategyAvailability']
  >(
    (strategyGroup, strategyName, isAvailable) => {
      availableStrategies.current.set(strategyName, { group: strategyGroup, isAvailable });
      apiRef.current.publishEvent('strategyAvailabilityChange');
    },
    [apiRef],
  );

  const strategyProcessingApi: GridStrategyProcessingApi = {
    registerStrategyProcessor,
    applyStrategyProcessor,
    getActiveStrategy,
    setStrategyAvailability,
  };

  useGridApiMethod(apiRef, strategyProcessingApi, 'private');
};
