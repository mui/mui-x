import { type ChartSeriesConfig, defaultSeriesConfig } from '@mui/x-charts/internals';

/**
 * Default series-config registry shipped with `@mui/x-charts-pro`.
 *
 * Lives in its own file so the premium worker setup helper can import it
 * without pulling React/JSX/license code from `ChartsDataProviderPro.tsx`.
 */
export const defaultSeriesConfigPro: ChartSeriesConfig<'bar' | 'scatter' | 'line' | 'pie'> =
  defaultSeriesConfig;
