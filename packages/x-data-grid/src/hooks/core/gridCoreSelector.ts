import { createRootSelector } from '../../utils/createSelector';
import type { GridStateCommunity } from '../../models/gridStateCommunity';

/**
 * Get the theme state
 * @category Core
 */
export const gridIsRtlSelector = createRootSelector((state: GridStateCommunity) => state.isRtl);
