import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type { ChartOptionalRootSelector } from '../../utils/selectors';
import { selectorChartZoomOptionsLookup } from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import type { UseChartBrushSignature } from './useChartBrush.types';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';

export const selectorBrush: ChartOptionalRootSelector<UseChartBrushSignature> = (state) =>
  state.brush;

export const selectorBrushStart = createSelector(selectorBrush, (brush) => brush?.start);

export const selectorBrushCurrent = createSelector(selectorBrush, (brush) => brush?.current);

export const selectorBrushStartX = createSelector(
  selectorBrush,
  (brush) => brush?.start?.x ?? null,
);

export const selectorBrushStartY = createSelector(
  selectorBrush,
  (brush) => brush?.start?.y ?? null,
);

export const selectorBrushCurrentX = createSelector(
  selectorBrush,
  (brush) => brush?.current?.x ?? null,
);

export const selectorBrushCurrentY = createSelector(
  selectorBrush,
  (brush) => brush?.current?.y ?? null,
);

export const selectorBrushState = createSelectorMemoized(
  selectorBrushStartX,
  selectorBrushStartY,
  selectorBrushCurrentX,
  selectorBrushCurrentY,
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

export const selectorBrushConfigNoZoom = createSelector(selectorChartSeriesProcessed, (series) => {
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

export const selectorBrushConfigZoom = createSelector(
  selectorChartZoomOptionsLookup,
  function selectorBrushConfigZoom(optionsLookup) {
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

export const selectorBrushConfig = createSelector(
  selectorBrushConfigNoZoom,
  selectorBrushConfigZoom,
  (configNoZoom, configZoom) => configZoom ?? configNoZoom,
);

export const selectorIsBrushEnabled = createSelector(
  selectorBrush,
  (brush) => brush?.enabled || brush?.isZoomBrushEnabled,
);

export const selectorIsBrushSelectionActive = createSelector(
  selectorIsBrushEnabled,
  selectorBrush,
  (isBrushEnabled, brush) => {
    return isBrushEnabled && brush?.start !== null && brush?.current !== null;
  },
);

export const selectorBrushShouldPreventAxisHighlight = createSelector(
  selectorBrush,
  selectorIsBrushSelectionActive,
  (brush, isBrushSelectionActive) => isBrushSelectionActive && brush?.preventHighlight,
);

export const selectorBrushShouldPreventTooltip = createSelector(
  selectorBrush,
  selectorIsBrushSelectionActive,
  (brush, isBrushSelectionActive) => isBrushSelectionActive && brush?.preventTooltip,
);
