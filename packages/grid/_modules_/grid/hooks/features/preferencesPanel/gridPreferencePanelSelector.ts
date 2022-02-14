import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridPreferencePanelStateSelector = (state: GridStateCommunity) =>
  state.preferencePanel;
