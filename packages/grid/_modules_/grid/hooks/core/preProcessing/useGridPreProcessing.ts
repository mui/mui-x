import * as React from 'react';
import { GridPrivateApiRef } from '../../../models/api/gridApiRef';
import { GridPreProcessingPrivateApi, PreProcessorCallback } from './gridPreProcessingApi';
import { GridEvents } from '../../../constants/eventsConstants';

export const useGridPreProcessing = (apiRef: GridPrivateApiRef) => {
  const preProcessorsRef = React.useRef<
    Partial<Record<string, Record<string, PreProcessorCallback>>>
  >({});

  const registerPreProcessor = React.useCallback<
    GridPreProcessingPrivateApi['registerPreProcessor']
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

  const applyPreProcessors = React.useCallback<GridPreProcessingPrivateApi['applyPreProcessors']>(
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

  apiRef.current.registerMethod('registerPreProcessor', false, registerPreProcessor);
  apiRef.current.registerMethod('applyPreProcessors', false, applyPreProcessors);
};
