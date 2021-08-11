import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';

export const densitySelector = (state: GridState) => state.density;

export const gridDensityValueSelector = createSelector(densitySelector, (density) => density.value);

export const gridDensityRowHeightSelector = createSelector(
  densitySelector,
  (density) => density.rowHeight,
);

export const gridDensityHeaderHeightSelector = createSelector(
  densitySelector,
  (density) => density.headerHeight,
);
