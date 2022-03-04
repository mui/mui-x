import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridThemeSelector = (state: GridStateCommunity) => state?.theme;

export const gridThemePaletteSelector = createSelector(gridThemeSelector, (theme) => {
  return theme?.palette;
});
