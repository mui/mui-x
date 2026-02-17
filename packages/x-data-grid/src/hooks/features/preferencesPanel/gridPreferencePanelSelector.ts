import { createSelector, createRootSelector } from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridPreferencePanelStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.preferencePanel,
);

export const gridPreferencePanelSelectorWithLabel = createSelector(
  gridPreferencePanelStateSelector,
  (panel, labelId: string | undefined) => {
    if (panel.open && panel.labelId === labelId) {
      return true;
    }

    return false;
  },
);
