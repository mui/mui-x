import {
  AxisId,
  ChartRootSelector,
  createChartSelector,
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';

export const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature> = (state) =>
  state.zoom;

export const selectorChartZoomIsInteracting = createChartSelector(
  [selectorChartZoomState],
  (zoom) => zoom.isInteracting,
);

export const selectorChartZoomIsEnabled = createChartSelector(
  [selectorChartZoomOptionsLookup],
  (optionsLookup) => Object.keys(optionsLookup).length > 0,
);

export const selectorChartAxisZoomData = createChartSelector(
  [selectorChartZoomMap],
  (zoomMap, axisId: AxisId) => zoomMap?.get(axisId),
);

export const selectorChartCanZoomOut = createChartSelector(
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

export const selectorChartCanZoomIn = createChartSelector(
  [selectorChartZoomState, selectorChartZoomOptionsLookup],
  (zoomState, zoomOptions) => {
    return zoomState.zoomData.every((zoomData) => {
      const span = zoomData.end - zoomData.start;
      const options = zoomOptions[zoomData.axisId];
      return span === options.minSpan;
    });
  },
);
