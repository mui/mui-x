'use client';
import * as React from 'react';
import { ChartsSeriesProcessorContext } from '@mui/x-charts/internals';
import { useChartsWorkerSeriesProcessor } from './useChartsWorkerSeriesProcessor';

export interface ChartsWorkerSeriesProcessorProviderProps {
  children?: React.ReactNode;
}

/**
 * Wires a Web Worker-backed `ChartSeriesProcessor` into the
 * `ChartsSeriesProcessorContext`. Any chart rendered inside this provider
 * automatically routes its series defaultize step through the worker (if the
 * runtime supports `Worker`); otherwise the chart silently falls back to the
 * default in-process pipeline.
 *
 * In SSR or older browsers without `Worker`, the provider becomes a no-op.
 * @param {ChartsWorkerSeriesProcessorProviderProps} props The provider props.
 * @returns {React.ReactElement} The context provider wrapping `children`.
 */
export function ChartsWorkerSeriesProcessorProvider(
  props: ChartsWorkerSeriesProcessorProviderProps,
) {
  const processor = useChartsWorkerSeriesProcessor();
  return (
    <ChartsSeriesProcessorContext.Provider value={processor}>
      {props.children}
    </ChartsSeriesProcessorContext.Provider>
  );
}
