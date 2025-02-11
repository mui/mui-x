import { createSelector, createRootSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridPreferencePanelStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.preferencePanel,
);

export const gridPreferencePanelSelectorWithLabel = createSelector(
  gridPreferencePanelStateSelector,
  (panel, labelId: string) => {
    if (panel.open && panel.labelId === labelId) {
      return true;
    }

    return false;
  },
);
