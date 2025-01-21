import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { createSelectorV8 } from '../../../utils/createSelector';

export const gridPreferencePanelStateSelector = (state: GridStateCommunity) =>
  state.preferencePanel;

export const gridPreferencePanelSelectorWithLabel = createSelectorV8(
  gridPreferencePanelStateSelector,
  (panel, labelId: string) => {
    if (panel.open && panel.labelId === labelId) {
      return true;
    }

    return false;
  },
);
