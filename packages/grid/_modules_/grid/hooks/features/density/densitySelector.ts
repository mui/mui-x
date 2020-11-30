import { createSelector } from 'reselect';
import { Size } from '../../../models/gridOptions';
import { GridState } from '../core/gridState';
import { DensityState } from './densityState';

export const densitySelector = (state: GridState) => state.density;

export const densitySizeSelector = createSelector<GridState, DensityState, Size>(
  densitySelector,
  (density) => density.size,
);

export const densityRowHeightSelector = createSelector<GridState, DensityState, number>(
  densitySelector,
  (density) => density.rowHeight,
);

export const densityHeaderHeightSelector = createSelector<GridState, DensityState, number>(
  densitySelector,
  (density) => density.headerHeight,
);
