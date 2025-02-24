import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridColDef } from '@mui/x-data-grid';
import type { GridStatePremium } from '../../../models/gridStatePremium';

const gridPivotingStateSelector = createRootSelector((state: GridStatePremium) => state.pivoting);

export const gridPivotModelSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.pivotModel,
);

export const gridPivotModeSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.pivotMode,
);

const emptyColumns: GridColDef[] = [];

export const gridPivotInitialColumnsSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.initialColumns || emptyColumns,
);

export const gridPivotPropsOverridesSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => (pivoting?.pivotMode ? pivoting.propsOverrides : undefined),
);

export const gridPivotPanelOpenSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.pivotPanelOpen,
);
