import { createSelector } from '@base-ui-components/utils/store';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';

// Warining: Only add selectors here that do not belong to any specific feature.
export const schedulerOtherSelectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  isScopeDialogOpen: createSelector(
    (state: State) => state.pendingUpdateRecurringEventParameters != null,
  ),
};
