import { createRootSelector } from '../../utils/createSelector';
import { GridStateCommunity } from '../../models/gridStateCommunity';

/**
 * Get the theme state
 * @category Core
 */
export const gridIsRtlSelector = createRootSelector((state: GridStateCommunity) => state.isRtl);
