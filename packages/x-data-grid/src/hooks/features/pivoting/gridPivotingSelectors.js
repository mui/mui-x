import { createSelector, createRootSelector } from '../../../utils/createSelector';
const gridPivotingStateSelector = createRootSelector(
// @ts-ignore
(state) => state.pivoting);
export const gridPivotActiveSelector = createSelector(gridPivotingStateSelector, (pivoting) => pivoting?.active);
const emptyColumns = new Map();
export const gridPivotInitialColumnsSelector = createSelector(gridPivotingStateSelector, (pivoting) => pivoting?.initialColumns || emptyColumns);
