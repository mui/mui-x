import { createSelector, createRootSelector } from '../../../utils/createSelector';
import type { GridColDef } from '../../../models/colDef';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';
import type { GridPivotingStatePartial } from './gridPivotingInterfaces';

const gridPivotingStateSelector = createRootSelector(
  // @ts-ignore
  (state: GridStateCommunity) => state.pivoting as GridPivotingStatePartial,
);

export const gridPivotActiveSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.active,
);

const emptyColumns = new Map<string, GridColDef>();

export const gridPivotInitialColumnsSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.initialColumns || emptyColumns,
);

export const gridPivotPanelOpenSelector = createSelector(
  gridPivotingStateSelector,
  (pivoting) => pivoting?.panelOpen,
);
