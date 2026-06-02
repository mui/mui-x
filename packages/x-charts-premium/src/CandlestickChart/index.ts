import { CandlestickChart } from './CandlestickChart';
import { CandlestickPlot } from './CandlestickPlot';

/**
 * @deprecated candlestick chart is now stable, import `ChartsCandlestickChart` instead
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Unstable_CandlestickChart = CandlestickChart;

/**
 * @deprecated candlestick plot is now stable, import `ChartsCandlestickPlot` instead
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Unstable_CandlestickPlot = CandlestickPlot;

export {
  CandlestickChart,
  type CandlestickChartProps,
  type CandlestickChartSlots,
  type CandlestickChartSlotProps,
  type OHLCSeries,
} from './CandlestickChart';

export { CandlestickPlot, type CandlestickPlotProps } from './CandlestickPlot';
