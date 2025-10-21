import { createChartSelector, type ChartOptionalRootSelector } from '../../utils/selectors';
import { selectorChartZoomOptionsLookup } from '../useChartCartesianAxis';
import type { UseChartBrushSignature } from './useChartBrush.types';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';

export const selectorBrush: ChartOptionalRootSelector<UseChartBrushSignature> = (state) =>
  state.brush;

export const selectorBrushStart = createChartSelector([selectorBrush], (brush) => brush?.start);

export const selectorBrushCurrent = createChartSelector([selectorBrush], (brush) => brush?.current);

export const selectorBrushStartX = createChartSelector(
  [selectorBrush],
  (brush) => brush?.start?.x ?? null,
);

export const selectorBrushStartY = createChartSelector(
  [selectorBrush],
  (brush) => brush?.start?.y ?? null,
);

export const selectorBrushCurrentX = createChartSelector(
  [selectorBrush],
  (brush) => brush?.current?.x ?? null,
);

export const selectorBrushCurrentY = createChartSelector(
  [selectorBrush],
  (brush) => brush?.current?.y ?? null,
);

export const selectorBrushState = createChartSelector(
  [selectorBrushStartX, selectorBrushStartY, selectorBrushCurrentX, selectorBrushCurrentY],
  (startX, startY, currentX, currentY) => {
    if (startX === null || startY === null || currentX === null || currentY === null) {
      return null;
    }
    return {
      start: { x: startX, y: startY },
      current: { x: currentX, y: currentY },
    };
  },
);

export const selectorBrushConfigNoZoom = createChartSelector(
  [selectorChartSeriesProcessed],
  (series) => {
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
  },
);

export const selectorBrushConfigZoom = createChartSelector(
  [selectorChartZoomOptionsLookup],
  (optionsLookup) => {
    let hasX = false;
    let hasY = false;
    Object.values(optionsLookup).forEach((options) => {
      if (options.axisDirection === 'y') {
        hasY = true;
      }
      if (options.axisDirection === 'x') {
        hasX = true;
      }
    });
    if (hasX && hasY) {
      return 'xy';
    }
    if (hasY) {
      return 'y';
    }
    if (hasX) {
      return 'x';
    }
    return null;
  },
);

export const selectorBrushConfig = createChartSelector(
  [selectorBrushConfigNoZoom, selectorBrushConfigZoom],
  (configNoZoom, configZoom) => configZoom ?? configNoZoom,
);

export const selectorIsBrushEnabled = createChartSelector(
  [selectorBrush],
  (brush) => brush?.enabled,
);

export const selectorIsBrushSelectionActive = createChartSelector([selectorBrush], (brush) => {
  return brush?.enabled && brush?.start !== null && brush?.current !== null;
});

export const selectorBrushShouldPreventAxisHighlight = createChartSelector(
  [selectorBrush, selectorIsBrushSelectionActive],
  (brush, isBrushSelectionActive) => isBrushSelectionActive && brush?.preventHighlight,
);

export const selectorBrushShouldPreventTooltip = createChartSelector(
  [selectorBrush, selectorIsBrushSelectionActive],
  (brush, isBrushSelectionActive) => isBrushSelectionActive && brush?.preventTooltip,
);
