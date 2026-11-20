import { createRootSelector, createSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';
import type { GridSidebarValue } from './gridSidebarInterfaces';

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

/**
 * Get the id of the sidebar element when it is open with the given panel value.
 * @ignore - do not document.
 */
export const gridSidebarPanelIdSelector = createSelector(
  gridSidebarStateSelector,
  (sidebarState, value: GridSidebarValue) =>
    sidebarState.open && sidebarState.value === value ? sidebarState.sidebarId : undefined,
);
