import { ChartsPlugin } from '@mui/x-charts/internals';
import { getBaseExtremum } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPlugin<'heatmap'> = {
  seriesType: 'heatmap',
  seriesFormatter: formatter,
  colorProcessor: getColor,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
};
