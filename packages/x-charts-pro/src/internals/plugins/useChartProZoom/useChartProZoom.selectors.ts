import { ChartRootSelector, createSelector } from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';

export const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature> = (state) =>
  state.zoom;

export const selectorChartZoomOptions = createSelector(
  selectorChartZoomState,
  (zoom) => zoom.options,
);

export const selectorChartZoomData = createSelector(
  selectorChartZoomState,
  (zoom) => zoom.zoomData,
);

export const selectorChartZoomIsInteracting = createSelector(
  selectorChartZoomState,
  (zoom) => zoom.isInteracting,
);

export const selectorChartZoomIsEnabled = createSelector(
  selectorChartZoomOptions,
  (options) => Object.keys(options).length > 0,
);
