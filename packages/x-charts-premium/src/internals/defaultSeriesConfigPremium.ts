import { type ChartSeriesConfig, defaultSeriesConfig } from '@mui/x-charts/internals';
import { rangeBarSeriesConfig } from '../BarChartPremium/RangeBar/seriesConfig';
import { ohlcSeriesConfig } from '../CandlestickChart/seriesConfig';

/**
 * Default series-config registry shipped with `@mui/x-charts-premium`.
 *
 * Lives in its own file so the worker setup helper can import it without
 * pulling React/JSX from `ChartsDataProviderPremium.tsx`.
 */
export const defaultSeriesConfigPremium: ChartSeriesConfig<
  'bar' | 'rangeBar' | 'scatter' | 'line' | 'pie' | 'ohlc'
> = {
  ...defaultSeriesConfig,
  rangeBar: rangeBarSeriesConfig,
  ohlc: ohlcSeriesConfig,
};
