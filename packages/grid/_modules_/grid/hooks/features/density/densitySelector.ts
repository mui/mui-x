import { createSelector } from 'reselect';
import { GridStateCommunity } from '../../../models/gridState';

export const gridDensitySelector = (state: GridStateCommunity) => state.density;

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

export const gridDensityFactorSelector = createSelector(
  gridDensitySelector,
  (density) => density.factor,
);
