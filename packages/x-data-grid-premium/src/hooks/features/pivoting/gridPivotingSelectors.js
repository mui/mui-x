import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import { gridSidebarStateSelector, GridSidebarValue } from '../sidebar';
const gridPivotingStateSelector = createRootSelector((state) => state.pivoting);
export const gridPivotPanelOpenSelector = createSelector(gridSidebarStateSelector, (sidebar) => sidebar.value === GridSidebarValue.Pivot && sidebar.open);
export const gridPivotModelSelector = createSelector(gridPivotingStateSelector, (pivoting) => pivoting?.model);
export const gridPivotPropsOverridesSelector = createSelector(gridPivotingStateSelector, (pivoting) => (pivoting?.active ? pivoting.propsOverrides : undefined));
export { gridPivotActiveSelector, gridPivotInitialColumnsSelector, } from '@mui/x-data-grid/internals';
