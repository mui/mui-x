import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';

const gridPivotingStateSelector = createRootSelector((state: GridStatePremium) => state.pivoting);

export const gridPivotModelSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.model,
);

export const gridPivotPropsOverridesSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => (pivoting?.enabled ? pivoting.propsOverrides : undefined),
);

export {
  gridPivotEnabledSelector,
  gridPivotInitialColumnsSelector,
  gridPivotPanelOpenSelector,
} from '@mui/x-data-grid/internals';
