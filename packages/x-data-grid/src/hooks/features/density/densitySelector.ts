import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridDensity } from '../../../models/gridDensity';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;
export const COMPACT_DENSITY_FACTOR_HEADER = 0.8;
export const COMFORTABLE_DENSITY_FACTOR_HEADER = 1.3;

const DENSITY_FACTORS: Record<GridDensity, number> = {
  compact: COMPACT_DENSITY_FACTOR,
  comfortable: COMFORTABLE_DENSITY_FACTOR,
  standard: 1,
};

const HEADER_DENSITY_FACTORS: Record<GridDensity, number> = {
  compact: COMPACT_DENSITY_FACTOR_HEADER,
  comfortable: COMFORTABLE_DENSITY_FACTOR_HEADER,
  standard: 1,
};

export const gridDensitySelector = (state: GridStateCommunity) => state.density;

export const gridDensityFactorSelector = createSelector(
  gridDensitySelector,
  (density) => DENSITY_FACTORS[density],
);

export const gridHeaderDensityFactorSelector = createSelector(
  gridDensitySelector,
  (density) => HEADER_DENSITY_FACTORS[density],
);
