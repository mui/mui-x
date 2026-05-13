import { createSelector } from '@mui/x-internals/store';
import { type ChartState } from '@mui/x-charts/internals';
import { type UseGeoProjectionSignature } from './useGeoProjection.types';

export const selectorChartGeoProjectionState = (
  state: ChartState<[], [UseGeoProjectionSignature]>,
) => state.geoProjection;

export const selectorChartRawGeoData = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection) => geoProjection?.geoData ?? null,
);

export const selectorChartRawProjection = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection) => geoProjection?.projection ?? null,
);
