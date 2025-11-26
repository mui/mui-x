import { createSelectorMemoized } from '@base-ui-components/utils/store';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';

export const schedulerOtherSelectors = {
  visibleDate: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.timezone,
    (adapter, visibleDate, timezone) => adapter.setTimezone(visibleDate, timezone),
  ),
  isScopeDialogOpen: createSelectorMemoized(
    (state: State) => state.pendingUpdateRecurringEventParameters != null,
  ),
};
