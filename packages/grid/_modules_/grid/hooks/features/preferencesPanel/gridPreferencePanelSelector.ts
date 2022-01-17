import { GridStateCommunity } from '../../../models/gridState';

export const gridPreferencePanelStateSelector = (state: GridStateCommunity) =>
  state.preferencePanel;
