import {
  type ChartSeriesTypeConfig,
  identifierSerializerSeriesIdDataIndex,
} from '@mui/x-charts/internals';
import { getBaseExtremum } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import getItemAtPosition from './getItemAtPosition';
import type { HeatmapPluginSignatures } from '../Heatmap.plugins';

export const heatmapSeriesConfig: ChartSeriesTypeConfig<'heatmap', HeatmapPluginSignatures> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter: () => [],
  tooltipGetter,
  tooltipItemPositionGetter,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
  getSeriesWithDefaultValues,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  getItemAtPosition,
};
