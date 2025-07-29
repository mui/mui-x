import { createSelector, createRootSelector, OutputSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridPreferencePanelState } from './gridPreferencePanelState';

export const gridPreferencePanelStateSelector: OutputSelector<
  GridStateCommunity,
  unknown,
  GridPreferencePanelState
> = createRootSelector((state: GridStateCommunity) => state.preferencePanel);

export const gridPreferencePanelSelectorWithLabel = createSelector(
  gridPreferencePanelStateSelector,
  (panel, labelId: string | undefined) => {
    if (panel.open && panel.labelId === labelId) {
      return true;
    }

    return false;
  },
);
