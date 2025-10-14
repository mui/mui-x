import { selectorChartSeriesProcessed } from '../../../../internals/plugins/corePlugins/useChartSeries';
import { ChartRootSelector, createSelector } from '../../utils/selectors';
import type { UseChartBrushSignature } from './useChartBrush.types';

export const selectorBrush: ChartRootSelector<UseChartBrushSignature, 'brush'> = (state) =>
  state.brush;

export const selectorBrushStart = createSelector([selectorBrush], (brush) => brush.start);

export const selectorBrushCurrent = createSelector([selectorBrush], (brush) => brush.current);

export const selectorBrushStartX = createSelector(
  [selectorBrush],
  (brush) => brush.start?.x ?? null,
);

export const selectorBrushStartY = createSelector(
  [selectorBrush],
  (brush) => brush.start?.y ?? null,
);

export const selectorBrushCurrentX = createSelector(
  [selectorBrush],
  (brush) => brush.current?.x ?? null,
);

export const selectorBrushCurrentY = createSelector(
  [selectorBrush],
  (brush) => brush.current?.y ?? null,
);

export const selectorBrushState = createSelector(
  [selectorBrushStartX, selectorBrushStartY, selectorBrushCurrentX, selectorBrushCurrentY],
  (startX, startY, currentX, currentY) => ({
    start: { x: startX, y: startY },
    current: { x: currentX, y: currentY },
  }),
);

export const selectorBrushConfig = createSelector([selectorChartSeriesProcessed], (series) => {
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

export const selectorIsBrushEnabled = createSelector([selectorBrush], (brush) => brush.enabled);
