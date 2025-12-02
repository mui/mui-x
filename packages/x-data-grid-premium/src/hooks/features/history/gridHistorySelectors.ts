import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';

const gridHistoryStateSelector = createRootSelector((state: GridStatePremium) => state.history);

export const gridHistoryQueueSelector = createSelector(
  gridHistoryStateSelector,
  (history) => history.queue,
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
  gridHistoryQueueSelector,
  gridHistoryCurrentPositionSelector,
  (queue, currentPosition) => currentPosition < queue.length - 1,
);
