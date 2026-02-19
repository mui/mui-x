import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

// Warning: Only add selectors here that do not belong to any specific feature.
export const schedulerOtherSelectors = {
  visibleDate: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.displayTimezone,
    (adapter, visibleDate, timezone) => adapter.setTimezone(visibleDate, timezone),
  ),
  isScopeDialogOpen: createSelector(
    (state: State) => state.pendingUpdateRecurringEventParameters != null,
  ),
  /**
   * The default event color used when no color is specified on the event or its resource.
   */
  defaultEventColor: createSelector((state: State) => state.eventColor),
  displayTimezone: createSelector((state: State) => state.displayTimezone),
  plan: createSelector((state: State) => state.plan),
  areRecurringEventsAvailable: createSelector((state: State) => state.plan === 'premium'),
  isLoading: createSelector((state: State) => state.isLoading),
  errors: createSelector((state: State) => state.errors),
};
