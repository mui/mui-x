import { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getBaseExtremum } from './extremums';
import formatter from './formatter';
import getColor from './getColor';
import tooltipGetter from './tooltip';

export const plugin: ChartSeriesTypeConfig<'heatmap'> = {
  seriesProcessor: formatter,
  colorProcessor: getColor,
  legendGetter: () => [],
  tooltipGetter,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
};
