import {
  ChartRootSelector,
  createSelector,
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';

export const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature> = (state) =>
  state.zoom;

export const selectorChartZoomIsInteracting = createSelector(
  selectorChartZoomState,
  (zoom) => zoom.isInteracting,
);

export const selectorChartZoomIsEnabled = createSelector(
  selectorChartZoomOptionsLookup,
  (optionsLookup) => Object.keys(optionsLookup).length > 0,
);

export const selectorChartAxisZoomData = createSelector(
  [selectorChartZoomMap, (state, axisId: string) => axisId],
  (zoomMap, axisId) => zoomMap?.get(axisId),
);
