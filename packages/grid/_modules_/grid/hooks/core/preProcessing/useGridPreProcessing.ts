import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPreProcessingApi, PreProcessorCallback } from './gridPreProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../models/events';

export const useGridPreProcessing = (apiRef: GridApiRef) => {
  const preProcessorsRef = React.useRef<
    Partial<Record<string, Record<string, PreProcessorCallback>>>
  >({});

  const registerPreProcessor = React.useCallback<
    GridPreProcessingApi['unstable_registerPreProcessor']
  >(
    (group, id, callback) => {
      if (!preProcessorsRef.current[group]) {
        preProcessorsRef.current[group] = {};
      }

      const preProcessors = preProcessorsRef.current[group]!;
      const oldCallback = preProcessors[id];
      if (!oldCallback || oldCallback !== callback) {
        preProcessorsRef.current[group] = { ...preProcessors, [id]: callback };
        apiRef.current.publishEvent(GridEvents.preProcessorRegister, group);
      }

      return () => {
        const { [id]: removedPreProcessor, ...otherProcessors } = preProcessorsRef.current[group]!;
        preProcessorsRef.current[group] = otherProcessors;
        apiRef.current.publishEvent(GridEvents.preProcessorUnregister, group);
      };
    },
    [apiRef],
  );

  const applyPreProcessors = React.useCallback<GridPreProcessingApi['unstable_applyPreProcessors']>(
    (group, value, params) => {
      if (!preProcessorsRef.current[group]) {
        return value;
      }

      const preProcessors = Object.values(preProcessorsRef.current[group]!);
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
