import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridColDef } from '@mui/x-data-grid';
import type { GridStatePremium } from '../../../models/gridStatePremium';

const gridPivotingStateSelector = createRootSelector((state: GridStatePremium) => state.pivoting);

export const gridPivotModelSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.model,
);

export const gridPivotEnabledSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.enabled,
);

const emptyColumns: GridColDef[] = [];

export const gridPivotInitialColumnsSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.initialColumns || emptyColumns,
);

export const gridPivotPropsOverridesSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => (pivoting?.enabled ? pivoting.propsOverrides : undefined),
);

export const gridPivotPanelOpenSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.panelOpen,
);
