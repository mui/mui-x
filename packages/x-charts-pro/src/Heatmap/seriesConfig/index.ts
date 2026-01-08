import {
  type ChartSeriesTypeConfig,
  identifierCompareSeriesIdDataIndex,
  identifierSerializerSeriesIdDataIndex,
} from '@mui/x-charts/internals';
import { getBaseExtremum } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';

export const heatmapSeriesConfig: ChartSeriesTypeConfig<'heatmap'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter: () => [],
  tooltipGetter,
  tooltipItemPositionGetter,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
  getSeriesWithDefaultValues,
  identifierCompare: identifierCompareSeriesIdDataIndex,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
};
