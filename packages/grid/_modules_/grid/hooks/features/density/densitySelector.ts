import { createSelector } from 'reselect';
import { GridDensity } from '../../../models/gridDensity';
import { GridState } from '../core/gridState';
import { GridGridDensity } from './densityState';

export const densitySelector = (state: GridState) => state.density;

export const gridDensityValueSelector = createSelector<GridState, GridGridDensity, GridDensity>(
  densitySelector,
  (density) => density.value,
);

export const gridDensityRowHeightSelector = createSelector<GridState, GridGridDensity, number>(
  densitySelector,
  (density) => density.rowHeight,
);

export const gridDensityHeaderHeightSelector = createSelector<GridState, GridGridDensity, number>(
  densitySelector,
  (density) => density.headerHeight,
);
