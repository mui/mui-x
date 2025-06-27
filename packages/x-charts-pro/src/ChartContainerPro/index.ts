import '../typeOverloads';

import type { ChartProApi as ChartProApiOriginal } from '../context/ChartProApi';

export * from './ChartContainerPro';

/**
 * @deprecated Use `ChartProApi` from `@mui/x-charts/context` instead.
 */
export type ChartProApi = ChartProApiOriginal;
