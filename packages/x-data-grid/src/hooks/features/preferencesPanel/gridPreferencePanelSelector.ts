import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { createSelector } from '../../../utils/createSelector';
import { GridPreferencePanelsValue } from './gridPreferencePanelsValue';

export const gridPreferencePanelStateSelector = (state: GridStateCommunity) =>
  state.preferencePanel;

export const gridPreferencePanelSelectorWithLabel = createSelector(
  gridPreferencePanelStateSelector,
  (panel, labelId: string) => {
    if (panel.open && panel.labelId === labelId) {
      return true;
    }

    return false;
  },
);
