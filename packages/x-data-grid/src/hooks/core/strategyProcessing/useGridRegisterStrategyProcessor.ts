import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useFirstRender } from '../../utils/useFirstRender';
import { GridPrivateApiCommon } from '../../../models/api/gridApiCommon';
import { GridStrategyProcessorName, GridStrategyProcessor } from './gridStrategyProcessingApi';

export const useGridRegisterStrategyProcessor = <
  Api extends GridPrivateApiCommon,
  G extends GridStrategyProcessorName,
>(
  apiRef: RefObject<Api>,
  strategyName: string,
  group: G,
  processor: GridStrategyProcessor<G>,
) => {
  const cleanup = React.useRef<(() => void) | null>(null);
  const registerPreProcessor = React.useCallback(() => {
    cleanup.current = apiRef.current.registerStrategyProcessor(strategyName, group, processor);
  }, [apiRef, processor, group, strategyName]);

  useFirstRender(() => {
    registerPreProcessor();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      console.error(
        `useGridRegisterStrategyProcessor: preProcessor for ${group} changed after the first render – unstable preProcessors might lead to unexpected behaviors.`,
        processor,
      );
      registerPreProcessor();
    }

    // Avoid cleanups in development/testing please StrictMode, yet still be able to use `useFirstRender` that
    if (process.env.NODE_ENV !== 'production') {
      return () => {
        if (cleanup.current) {
          cleanup.current();
          cleanup.current = null;
        }
      };
    }
    return undefined;
  }, [registerPreProcessor]);
};
