import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';

export const gridDensitySelector = (state: GridState) => state.density;

export const gridDensityValueSelector = createSelector(
  gridDensitySelector,
  (density) => density.value,
);

export const gridDensityRowHeightSelector = createSelector(
  gridDensitySelector,
  (density) => density.rowHeight,
);

export const gridDensityHeaderHeightSelector = createSelector(
  gridDensitySelector,
  (density) => density.headerHeight,
);
