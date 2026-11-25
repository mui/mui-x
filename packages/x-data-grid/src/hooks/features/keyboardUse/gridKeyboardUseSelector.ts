import { createRootSelector } from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';

/**
 * Whether the user is using the keyboard in the grid.
 */
export const gridKeyboardUseActiveSelector = createRootSelector(
  (state: GridStateCommunity) => state.keyboardUse.active,
);
