import { createRootSelector, createSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';

export const gridSidebarStateSelector = createRootSelector(
  (state: GridStatePremium) => state.sidebar,
);

export const gridSidebarOpenSelector = createSelector(
  gridSidebarStateSelector,
  (state) => state.open,
);

export const gridSidebarContentSelector = createSelector(
  gridSidebarStateSelector,
  ({ sidebarId, labelId, value }) => ({
    sidebarId,
    labelId,
    value,
  }),
);
