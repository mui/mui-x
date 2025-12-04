import { createSelector } from '@mui/x-internals/store';
import {
  type AxisId,
  type ChartRootSelector,
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { type UseChartProZoomSignature } from './useChartProZoom.types';

export const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature, 'zoom'> = (
  state,
) => state.zoom;

export const selectorChartZoomIsInteracting = createSelector(
  selectorChartZoomState,
  (zoom) => zoom.isInteracting,
);

export const selectorChartZoomIsEnabled = createSelector(
  selectorChartZoomOptionsLookup,
  (optionsLookup) => Object.keys(optionsLookup).length > 0,
);

export const selectorChartAxisZoomData = createSelector(
  selectorChartZoomMap,
  (zoomMap, axisId: AxisId) => zoomMap?.get(axisId),
);

export const selectorChartCanZoomOut = createSelector(
  selectorChartZoomState,
  selectorChartZoomOptionsLookup,
  (zoomState, zoomOptions) => {
    return zoomState.zoomData.every((zoomData) => {
      const span = zoomData.end - zoomData.start;
      const options = zoomOptions[zoomData.axisId];
      return (
        (zoomData.start === options.minStart && zoomData.end === options.maxEnd) ||
        span === options.maxSpan
      );
    });
  },
);

export const selectorChartCanZoomIn = createSelector(
  selectorChartZoomState,
  selectorChartZoomOptionsLookup,
  (zoomState, zoomOptions) => {
    return zoomState.zoomData.every((zoomData) => {
      const span = zoomData.end - zoomData.start;
      const options = zoomOptions[zoomData.axisId];
      return span === options.minSpan;
    });
  },
);
