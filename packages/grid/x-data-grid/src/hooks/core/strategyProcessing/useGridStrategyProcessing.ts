import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridStrategyProcessor,
  GridStrategyProcessingGroup,
  GridStrategyProcessingApi,
} from './gridStrategyProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../models/events';

export const useGridStrategyProcessing = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const preProcessorsRef = React.useRef<
    Partial<
      Record<
        GridStrategyProcessingGroup,
        {
          strategies: { [strategyName: string]: GridStrategyProcessor<any> };
          lastStrategyApplied: GridStrategyProcessor<any> | null;
        }
      >
    >
  >({});

  const registerStrategyProcessor = React.useCallback<
    GridStrategyProcessingApi['unstable_registerStrategyProcessor']
  >(
    (group, strategyName, processor) => {
      if (!preProcessorsRef.current[group]) {
        preProcessorsRef.current[group] = {
          strategies: {},
          lastStrategyApplied: null,
        };
      }

      const groupPreProcessors = preProcessorsRef.current[group]!;
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
  >((group, strategyName, params) => {
    const processor = preProcessorsRef.current[group]?.[strategyName];
    if (!processor) {
      throw new Error(`No processor found for strategy ${strategyName} of group ${group}`);
    }

    return processor(params);
  }, []);

  const strategyProcessingApi: GridStrategyProcessingApi = {
    unstable_registerStrategyProcessor: registerStrategyProcessor,
    unstable_applyStrategyProcessor: applyStrategyProcessor,
  };

  useGridApiMethod(apiRef, strategyProcessingApi, 'GridStrategyProcessing');
};
