import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';
import { gridSidebarStateSelector, GridSidebarValue } from '../sidebar';

const gridPivotingStateSelector = createRootSelector((state: GridStatePremium) => state.pivoting);

export const gridPivotPanelOpenSelector = createSelector(
  gridSidebarStateSelector,
  (sidebar) => sidebar.openedValue === GridSidebarValue.pivot && sidebar.open,
);

export const gridPivotModelSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.model,
);

export const gridPivotPropsOverridesSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => (pivoting?.active ? pivoting.propsOverrides : undefined),
);

export {
  gridPivotActiveSelector,
  gridPivotInitialColumnsSelector,
} from '@mui/x-data-grid/internals';
