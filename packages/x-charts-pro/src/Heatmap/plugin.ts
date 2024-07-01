import { ChartsPluginType } from '@mui/x-charts/models';
import { getBaseExtremum } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPluginType<'heatmap'> = {
  seriesType: 'heatmap',
  seriesFormatter: formatter,
  colorProcessor: getColor,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
};
