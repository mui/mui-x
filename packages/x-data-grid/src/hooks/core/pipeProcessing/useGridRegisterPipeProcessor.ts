'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { useOnFirstRender } from '@base-ui/utils/useOnFirstRender';
import type { GridPrivateApiCommon } from '../../../models/api/gridApiCommon';
import type { GridPipeProcessorGroup, GridPipeProcessor } from './gridPipeProcessingApi';

export const useGridRegisterPipeProcessor = <
  PrivateApi extends GridPrivateApiCommon,
  G extends GridPipeProcessorGroup,
>(
  apiRef: RefObject<PrivateApi>,
  group: G,
  callback: GridPipeProcessor<G>,
  enabled: boolean = true,
) => {
  const cleanup = React.useRef<(() => void) | null>(null);
  const id = React.useRef(`mui-${Math.round(Math.random() * 1e9)}`);

  const registerPreProcessor = React.useCallback(() => {
    cleanup.current = apiRef.current.registerPipeProcessor(group, id.current, callback);
  }, [apiRef, callback, group]);

  useOnFirstRender(() => {
    if (enabled) {
      registerPreProcessor();
    }
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else if (enabled) {
      registerPreProcessor();
    }

    return () => {
      if (cleanup.current) {
        cleanup.current();
        cleanup.current = null;
      }
    };
  }, [registerPreProcessor, enabled]);
};
