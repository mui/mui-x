import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPreProcessingApi, PreProcessorCallback } from './gridPreProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../constants/eventsConstants';

export const useGridPreProcessing = (apiRef: GridApiRef) => {
  const preProcessorsRef = React.useRef(new Map<string, PreProcessorCallback[]>());

  const registerPreProcessor = React.useCallback<
    GridPreProcessingApi['unstable_registerPreProcessor']
  >(
    (name, callback) => {
      if (!preProcessorsRef.current.has(name)) {
        preProcessorsRef.current.set(name, []);
      }

      const preProcessors = preProcessorsRef.current.get(name)!;
      preProcessorsRef.current.set(name, [...preProcessors, callback]);
      apiRef.current.publishEvent(GridEvents.preProcessorRegister, name);

      return () => {
        // The registered pre-processors might have changed since this function was first called
        const latestPreProcessors = preProcessorsRef.current.get(name)!;
        const index = latestPreProcessors.findIndex((preProcessor) => preProcessor === callback);
        const newProcessors = [...latestPreProcessors];
        newProcessors.splice(index, 1);
        preProcessorsRef.current.set(name, newProcessors);
      };
    },
    [apiRef],
  );

  const applyPreProcessors = React.useCallback<GridPreProcessingApi['unstable_applyPreProcessors']>(
    (name, value, params) => {
      if (!preProcessorsRef.current.has(name)) {
        return value;
      }

      const preProcessors = preProcessorsRef.current.get(name)!;
      return preProcessors.reduce((acc, preProcessor) => {
        return preProcessor(acc, params);
      }, value);
    },
    [],
  );

  const preProcessingApi: GridPreProcessingApi = {
    unstable_registerPreProcessor: registerPreProcessor,
    unstable_applyPreProcessors: applyPreProcessors,
  };

  useGridApiMethod(apiRef, preProcessingApi, 'GridPreProcessing');
};
