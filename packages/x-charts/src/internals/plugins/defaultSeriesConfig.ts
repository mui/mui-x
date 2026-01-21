import { barSeriesConfig } from '../../BarChart/seriesConfig';
import { lineSeriesConfig } from '../../LineChart/seriesConfig';
import { pieSeriesConfig } from '../../PieChart/seriesConfig';
import { scatterSeriesConfig } from '../../ScatterChart/seriesConfig';
import type { ChartSeriesConfig } from './models';

export const defaultSeriesConfig: ChartSeriesConfig<'bar' | 'scatter' | 'line' | 'pie'> = {
  bar: barSeriesConfig,
  scatter: scatterSeriesConfig,
  line: lineSeriesConfig,
  pie: pieSeriesConfig,
};
