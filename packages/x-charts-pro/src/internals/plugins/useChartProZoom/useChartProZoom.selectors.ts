import {
  AxisId,
  ChartRootSelector,
  createSelector,
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';

export const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature> = (state) =>
  state.zoom;

export const selectorChartZoomIsInteracting = createSelector(
  [selectorChartZoomState],
  (zoom) => zoom.isInteracting,
);

export const selectorChartZoomIsEnabled = createSelector(
  [selectorChartZoomOptionsLookup],
  (optionsLookup) => Object.keys(optionsLookup).length > 0,
);

export const selectorChartAxisZoomData = createSelector(
  [selectorChartZoomMap, (state, axisId: AxisId) => axisId],
  (zoomMap, axisId) => zoomMap?.get(axisId),
);

export const selectorChartCanZoomOut = createSelector(
  [selectorChartZoomState, selectorChartZoomOptionsLookup],
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
  [selectorChartZoomState, selectorChartZoomOptionsLookup],
  (zoomState, zoomOptions) => {
    return zoomState.zoomData.every((zoomData) => {
      const span = zoomData.end - zoomData.start;
      const options = zoomOptions[zoomData.axisId];
      return span === options.minSpan;
    });
  },
);

const selectorChartBrushState = createSelector([selectorChartZoomState], (zoom) => zoom.brushState);

export const selectorChartBrushStartX = createSelector(
  [selectorChartBrushState],
  (brushState) => brushState.start?.x ?? null,
);

export const selectorChartBrushStartY = createSelector(
  [selectorChartBrushState],
  (brushState) => brushState.start?.y ?? null,
);

export const selectorChartBrushCurrentX = createSelector(
  [selectorChartBrushState],
  (brushState) => brushState.current?.x ?? null,
);

export const selectorChartBrushCurrentY = createSelector(
  [selectorChartBrushState],
  (brushState) => brushState.current?.y ?? null,
);
