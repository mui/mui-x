import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridStrategyProcessor,
  GridStrategyProcessingGroup,
  GridStrategyProcessingApi,
} from './gridStrategyProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../models/events';

interface StrategyGroupCache {
  strategies: { [strategyName: string]: GridStrategyProcessor<any> };
  strategyName: string | null;
}

export const useGridStrategyProcessing = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const preProcessorsRef = React.useRef<
    Partial<Record<GridStrategyProcessingGroup, StrategyGroupCache>>
  >({});

  const registerStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_registerStrategyProcessor']
  >(
    (group, strategyName, processor) => {
      if (!preProcessorsRef.current[group]) {
        preProcessorsRef.current[group] = {
          strategies: {},
          strategyName: null,
        };
      }

      const groupPreProcessors = preProcessorsRef.current[group]!.strategies;
      if (groupPreProcessors[strategyName] !== processor) {
        groupPreProcessors[strategyName] = processor;
        apiRef.current.publishEvent(GridEvents.strategyProcessorRegister, { group, strategyName });
      }

      return () => {
        const { [strategyName]: removedPreProcessor, ...otherProcessors } =
          preProcessorsRef.current[group]!.strategies;
        preProcessorsRef.current[group]!.strategies = otherProcessors;
      };
    },
    [apiRef],
  );

  const applyStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_applyStrategyProcessor']
  >((group, params) => {
    const groupCache = preProcessorsRef.current[group];
    if (
      !groupCache ||
      groupCache.strategyName == null ||
      !groupCache.strategies[groupCache.strategyName]
    ) {
      throw new Error(`No processor found for group ${group}`);
    }

    return groupCache.strategies[groupCache.strategyName](params);
  }, []);

  const getStrategyName = React.useCallback<GridStrategyProcessingApi['unstable_getStrategyName']>(
    (group) => preProcessorsRef.current[group]?.strategyName ?? null,
    [],
  );

  const setStrategyName = React.useCallback<GridStrategyProcessingApi['unstable_setStrategyName']>(
    (group, strategyName) => {
      if (!preProcessorsRef.current[group]) {
        preProcessorsRef.current[group] = {
          strategies: {},
          strategyName,
        };
      } else {
        preProcessorsRef.current[group]!.strategyName = strategyName;
      }
    },
    [],
  );

  const strategyProcessingApi: GridStrategyProcessingApi = {
    unstable_registerStrategyProcessor: registerStrategyProcessor,
    unstable_applyStrategyProcessor: applyStrategyProcessor,
    unstable_getStrategyName: getStrategyName,
    unstable_setStrategyName: setStrategyName,
  };

  useGridApiMethod(apiRef, strategyProcessingApi, 'GridStrategyProcessing');
};
