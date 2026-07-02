import type { SeriesLayoutGetter, ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import { tooltipGetter } from './tooltipGetter';
import { calculateTreemapLayout } from '../calculateTreemapLayout';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import identifierSerializer from './identifierSerializer';
import identifierCleaner from './identifierCleaner';
import { createTreemapIsHighlighted } from './createIsHighlighted';
import { createTreemapIsFaded } from './createIsFaded';
import descriptionGetter from './descriptionGetter';

// Colors are resolved per-node in `getSeriesWithDefaultValues`, so these are passthroughs.
const seriesProcessor = (series: any) => series;
const colorProcessor = (series: any) => series;
const legendGetter = () => [];

const seriesLayout: SeriesLayoutGetter<'treemap'> = (series, drawingArea) => {
  if (series.seriesOrder.length === 0) {
    return {};
  }
  const id = series.seriesOrder[0];
  return {
    [id]: { treemapLayout: calculateTreemapLayout(series.series[id], drawingArea) },
  };
};

export const treemapSeriesConfig: ChartSeriesTypeConfig<'treemap'> = {
  seriesProcessor,
  seriesLayout,
  colorProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierSerializer,
  identifierCleaner,
  descriptionGetter,
  isHighlightedCreator: createTreemapIsHighlighted,
  isFadedCreator: createTreemapIsFaded,
};
