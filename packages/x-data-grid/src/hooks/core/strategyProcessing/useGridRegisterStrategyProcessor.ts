'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { useFirstRender } from '../../utils/useFirstRender';
import type { GridPrivateApiCommon } from '../../../models/api/gridApiCommon';
import type { GridStrategyProcessorName, GridStrategyProcessor } from './gridStrategyProcessingApi';

export const useGridRegisterStrategyProcessor = <
  Api extends GridPrivateApiCommon,
  G extends GridStrategyProcessorName,
>(
  apiRef: RefObject<Api>,
  strategyName: string,
  group: G,
  processor: GridStrategyProcessor<G>,
) => {
  const registerPreProcessor = React.useCallback(() => {
    // NOTE: the unregister fn is intentionally discarded. Unlike pipe processors
    // (which are additive), a strategy processor is required for as long as its
    // strategy is active — `applyStrategyProcessor` throws if the active strategy's
    // processor is missing — so it must outlive the registering component. The cache
    // keeps a single entry per (processor, strategy) and is reclaimed with the grid
    // api, so nothing leaks; `void` documents the deliberate discard.
    void apiRef.current.registerStrategyProcessor(strategyName, group, processor);
  }, [apiRef, processor, group, strategyName]);

  useFirstRender(() => {
    registerPreProcessor();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      registerPreProcessor();
    }
  }, [registerPreProcessor]);
};
