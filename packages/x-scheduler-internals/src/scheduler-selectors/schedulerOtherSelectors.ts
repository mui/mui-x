import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

// Warning: Only add selectors here that do not belong to any specific feature.
export const schedulerOtherSelectors = {
  /**
   * Returns `true` if the occurrence with the given key is the currently active occurrence.
   */
  isEditedOccurrence: createSelector(
    (state: State) => state.editedOccurrenceKey,
    (editedOccurrenceKey, occurrenceKey: string | undefined) =>
      editedOccurrenceKey === occurrenceKey,
  ),
  visibleDate: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.displayTimezone,
    (adapter, visibleDate, timezone) => adapter.setTimezone(visibleDate, timezone),
  ),
  isRecurringScopeDialogOpen: createSelector(
    (state: State) => state.pendingRecurringEventOperation != null,
  ),
  /**
   * The default event color used when no color is specified on the event or its resource.
   */
  defaultEventColor: createSelector((state: State) => state.eventColor),
  displayTimezone: createSelector((state: State) => state.displayTimezone),
  /**
   * Whether each event must be assigned to a resource. When true, the resource cannot be cleared in the edit dialog and the form cannot be submitted without one.
   * Resolves to `false` when no resources are configured, even if `shouldEventRequireResource` was set to `true`,
   * since that combination is contradictory (the store already warns about it) and would otherwise block
   * submission with no resource picker to fix it from.
   */
  shouldEventRequireResource: createSelector(
    (state: State) => state.shouldEventRequireResource,
    (state: State) => state.resourceIdList,
    (shouldEventRequireResource, resourceIdList) =>
      shouldEventRequireResource && resourceIdList.length > 0,
  ),
  recurringEventsPlugin: createSelector((state: State) => state.recurringEventsPlugin),
  areRecurringEventsAvailable: createSelector(
    (state: State) => state.recurringEventsPlugin != null,
  ),
  isLoading: createSelector((state: State) => state.isLoading),
  errors: createSelector((state: State) => state.errors),
};
