import { ChartRootSelector, createSelector } from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';

export const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature> = (state) =>
  state.zoom;

export const selectorChartZoomOptionsLookup = createSelector(
  selectorChartZoomState,
  (zoom) => zoom.optionsLookup,
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
  selectorChartZoomOptionsLookup,
  (optionsLookup) => Object.keys(optionsLookup).length > 0,
);
