import { createSelector } from 'reselect';
import { Density } from '../../../models/density';
import { GridState } from '../core/gridState';
import { DensityState } from './densityState';

export const densitySelector = (state: GridState) => state.density;

export const densityValueSelector = createSelector<GridState, DensityState, Density>(
  densitySelector,
  (density) => density.value,
);

export const densityRowHeightSelector = createSelector<GridState, DensityState, number>(
  densitySelector,
  (density) => density.rowHeight,
);

export const densityHeaderHeightSelector = createSelector<GridState, DensityState, number>(
  densitySelector,
  (density) => density.headerHeight,
);
