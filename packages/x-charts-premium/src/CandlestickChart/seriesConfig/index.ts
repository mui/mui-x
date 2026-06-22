import {
  cartesianSeriesTypes,
  identifierSerializerSeriesIdDataIndex,
  identifierCleanerSeriesIdDataIndex,
  type ChartSeriesTypeConfig,
  createIsHighlighted,
  createIsFaded,
} from '@mui/x-charts/internals';
import { seriesPreviewPlotMap } from '@mui/x-charts-pro/internals';
import { CandlestickPreviewPlot } from '../../ChartsZoomSlider/internals/previews/CandlestickPreviewPlot';
import { getExtremumX, getExtremumY } from './extrema';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipItemPositionGetter from './tooltipPosition';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import { OHLCTooltipContent } from './OHLCTooltipContent';
import descriptionGetter from './descriptionGetter';

export const ohlcSeriesConfig: ChartSeriesTypeConfig<'ohlc'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  ItemTooltipContent: OHLCTooltipContent,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  AxisTooltipContent: OHLCTooltipContent,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};

cartesianSeriesTypes.addType('ohlc');
seriesPreviewPlotMap.set('ohlc', CandlestickPreviewPlot);
