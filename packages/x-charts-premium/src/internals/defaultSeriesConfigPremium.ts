import { type ChartSeriesConfig } from '@mui/x-charts/internals';
import { defaultSeriesConfigPro } from '@mui/x-charts-pro/internals';
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
  ...defaultSeriesConfigPro,
  rangeBar: rangeBarSeriesConfig,
  ohlc: ohlcSeriesConfig,
};
