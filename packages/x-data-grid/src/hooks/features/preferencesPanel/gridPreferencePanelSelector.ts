import { RefObject } from '@mui/x-internals/types';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { createSelector } from '../../../utils/createSelector';

export const gridPreferencePanelStateSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.preferencePanel;

export const gridPreferencePanelSelectorWithLabel = createSelector(
  gridPreferencePanelStateSelector,
  (panel, labelId: string) => {
    if (panel.open && panel.labelId === labelId) {
      return true;
    }

    return false;
  },
);
