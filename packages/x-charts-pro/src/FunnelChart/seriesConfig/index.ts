import {
  type ChartSeriesTypeConfig,
  identifierSerializerSeriesIdDataIndex,
} from '@mui/x-charts/internals';
import { getExtremumX, getExtremumY } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import type { FunnelChartPluginSignatures } from '../FunnelChart.plugins';
import keyboardFocusHandler from './keyboardFocusHandler';

export const funnelSeriesConfig: ChartSeriesTypeConfig<'funnel', FunnelChartPluginSignatures> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
};
