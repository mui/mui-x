import { createSelector } from '../../../utils/createSelector';
import { GridDensity } from '../../../models/gridDensity';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;

const DENSITY_FACTORS: Record<GridDensity, number> = {
  compact: COMPACT_DENSITY_FACTOR,
  comfortable: COMFORTABLE_DENSITY_FACTOR,
  standard: 1,
};

export const gridDensitySelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.density;

export const gridDensityFactorSelector = createSelector(
  gridDensitySelector,
  (density) => DENSITY_FACTORS[density],
);
