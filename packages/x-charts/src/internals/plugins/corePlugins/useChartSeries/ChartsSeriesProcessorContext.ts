'use client';
import * as React from 'react';
import type { ChartSeriesProcessor } from './useChartSeries.types';

/**
 * Context that lets a parent component plug in an off-thread series
 * processor (e.g. the Web Worker-backed processor from
 * `@mui/x-charts-premium`). The `useChartSeries` plugin reads this
 * automatically — when a value is present, it's used in place of the
 * default in-process defaultize step. When absent, the plugin falls back
 * to running `defaultizeSeries` locally on the next task tick.
 *
 * Community charts leave the context unset; premium packages provide a
 * worker-backed processor via `<ChartsSeriesProcessorProvider>` (also
 * automatically wired into premium chart components).
 */
export const ChartsSeriesProcessorContext = React.createContext<
  ChartSeriesProcessor | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  ChartsSeriesProcessorContext.displayName = 'ChartsSeriesProcessorContext';
}
