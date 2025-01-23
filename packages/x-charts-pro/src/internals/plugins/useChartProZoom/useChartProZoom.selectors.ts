import {
  ChartRootSelector,
  createSelector,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';
import { creatZoomLookup } from './creatZoomLookup';

export const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature> = (state) =>
  state.zoom;

const selectorChartXZoomOptionsLookup = createSelector(selectorChartRawXAxis, creatZoomLookup);

const selectorChartYZoomOptionsLookup = createSelector(selectorChartRawYAxis, creatZoomLookup);

export const selectorChartZoomOptionsLookup = createSelector(
  [selectorChartXZoomOptionsLookup, selectorChartYZoomOptionsLookup],
  (xLookup, yLookup) => ({ ...xLookup, ...yLookup }),
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
