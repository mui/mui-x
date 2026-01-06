import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';

const gridHistoryStateSelector = createRootSelector((state: GridStatePremium) => state.history);

export const gridHistoryEnabledSelector = createSelector(
  gridHistoryStateSelector,
  (history) => history.enabled,
);

export const gridHistoryStackSelector = createSelector(
  gridHistoryStateSelector,
  (history) => history.stack,
);

export const gridHistoryCurrentPositionSelector = createSelector(
  gridHistoryStateSelector,
  (history) => history.currentPosition,
);

export const gridHistoryCanUndoSelector = createSelector(
  gridHistoryCurrentPositionSelector,
  (currentPosition) => currentPosition >= 0,
);

export const gridHistoryCanRedoSelector = createSelector(
  gridHistoryStackSelector,
  gridHistoryCurrentPositionSelector,
  (stack, currentPosition) => currentPosition < stack.length - 1,
);
