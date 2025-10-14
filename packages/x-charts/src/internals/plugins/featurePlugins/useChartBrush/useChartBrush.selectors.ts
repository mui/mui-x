import { selectorChartSeriesProcessed } from '../../../../internals/plugins/corePlugins/useChartSeries';
import { ChartRootSelector, createSelector } from '../../utils/selectors';
import type { UseChartBrushSignature } from './useChartBrush.types';

export const selectorChartBrushState: ChartRootSelector<UseChartBrushSignature, 'brush'> = (
  state,
) => state.brush;

export const selectorChartBrushStart = createSelector(
  [selectorChartBrushState],
  (brush) => brush.start,
);

export const selectorChartBrushCurrent = createSelector(
  [selectorChartBrushState],
  (brush) => brush.current,
);

export const selectorChartBrushStartX = createSelector(
  [selectorChartBrushState],
  (brush) => brush.start?.x ?? null,
);

export const selectorChartBrushStartY = createSelector(
  [selectorChartBrushState],
  (brush) => brush.start?.y ?? null,
);

export const selectorChartBrushCurrentX = createSelector(
  [selectorChartBrushState],
  (brush) => brush.current?.x ?? null,
);

export const selectorChartBrushCurrentY = createSelector(
  [selectorChartBrushState],
  (brush) => brush.current?.y ?? null,
);

export const selectorChartBrushConfig = createSelector([selectorChartSeriesProcessed], (series) => {
  let hasHorizontal = false;
  let isBothDirections = false;
  if (series) {
    Object.entries(series).forEach(([seriesType, seriesData]) => {
      if (Object.values(seriesData.series).some((s) => s.layout === 'horizontal')) {
        hasHorizontal = true;
      }
      if (seriesType === 'scatter' && seriesData.seriesOrder.length > 0) {
        isBothDirections = true;
      }
    });
  }
  if (isBothDirections) {
    return 'xy';
  }
  if (hasHorizontal) {
    return 'y';
  }
  return 'x';
});
