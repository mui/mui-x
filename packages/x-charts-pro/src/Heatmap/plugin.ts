import { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getBaseExtremum } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartSeriesTypeConfig<'heatmap'> = {
  seriesProcessor: formatter,
  colorProcessor: getColor,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
};
