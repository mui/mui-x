import { createSelector } from '@base-ui/utils/store';
import { selectorChartZoomMap, selectorChartZoomOptionsLookup } from '@mui/x-charts/internals';
import type { AxisId, ChartRootSelector, ZoomData } from '@mui/x-charts/internals';
import type { UseChartProZoomSignature } from './useChartProZoom.types';

export const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature, 'zoom'> = (
  state,
) => state.zoom;

// Keep references to the exported selectors' state types in declarations instead of expanding
// them into imports of private Community modules that are not package entry points.
export const selectorChartZoomIsInteracting: (
  state: Parameters<typeof selectorChartZoomState>[0],
) => boolean = createSelector(selectorChartZoomState, (zoom) => zoom.isInteracting);

export const selectorChartZoomIsEnabled: (
  state: Parameters<typeof selectorChartZoomOptionsLookup>[0],
) => boolean = createSelector(
  selectorChartZoomOptionsLookup,
  (optionsLookup) => Object.keys(optionsLookup).length > 0,
);

export const selectorChartAxisZoomData: (
  state: Parameters<typeof selectorChartZoomMap>[0],
  axisId: AxisId,
) => ZoomData | undefined = createSelector(selectorChartZoomMap, (zoomMap, axisId: AxisId) =>
  zoomMap?.get(axisId),
);

export const selectorChartCanZoomOut: (
  state: Parameters<typeof selectorChartZoomState>[0],
) => boolean = createSelector(
  selectorChartZoomState,
  selectorChartZoomOptionsLookup,
  (zoomState, zoomOptions) => {
    return !zoomState.zoomData.every((zoomData) => {
      const span = zoomData.end - zoomData.start;
      const options = zoomOptions[zoomData.axisId];
      return (
        (zoomData.start === options.minStart && zoomData.end === options.maxEnd) ||
        span === options.maxSpan
      );
    });
  },
);

export const selectorChartCanZoomIn: (
  state: Parameters<typeof selectorChartZoomState>[0],
) => boolean = createSelector(
  selectorChartZoomState,
  selectorChartZoomOptionsLookup,
  (zoomState, zoomOptions) => {
    return !zoomState.zoomData.every((zoomData) => {
      const span = zoomData.end - zoomData.start;
      const options = zoomOptions[zoomData.axisId];
      return span === options.minSpan;
    });
  },
);
