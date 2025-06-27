import type { ChartApi as ChartApiOriginal } from '../context/ChartApi';

export * from './ChartContainer';

/**
 * @deprecated Use `ChartApi` from `@mui/x-charts/context` instead.
 */
export type ChartApi = ChartApiOriginal;
