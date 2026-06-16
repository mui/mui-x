import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { SchedulerEventId } from '../models';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { processDate } from '../process-date';

// Warning: Only add selectors here that do not belong to any specific feature.
export const schedulerOtherSelectors = {
  /**
   * Returns `true` if the event with the given ID is the one currently being edited.
   */
  isEditedEvent: createSelector(
    (state: State) => state.editingOccurrence?.occurrence.id ?? null,
    (editedEventId, eventId: SchedulerEventId | undefined) =>
      editedEventId != null && editedEventId === eventId,
  ),
  /**
   * The occurrence currently being edited (an existing occurrence or a creation draft), or `null`.
   */
  editingOccurrence: createSelector((state: State) => state.editingOccurrence),
  /**
   * The occurrence currently being edited, with the live resize preview applied, or `null`.
   *
   * While the user resizes the edited occurrence by touch, the new start/end live on the
   * `internal-resize` placeholder (the committed occurrence only updates on pointer-up). Surfaces
   * bound to the editing occurrence (e.g. the compact drawer) read this selector so they preview
   * the in-progress times instead of the stale committed ones.
   */
  editingOccurrenceWithResizePreview: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.editingOccurrence?.occurrence ?? null,
    (state: State) => state.occurrencePlaceholder,
    (adapter, occurrence, placeholder) => {
      if (
        occurrence == null ||
        placeholder?.type !== 'internal-resize' ||
        placeholder.occurrenceKey !== occurrence.key
      ) {
        return occurrence;
      }

      return {
        ...occurrence,
        displayTimezone: {
          ...occurrence.displayTimezone,
          start: processDate(placeholder.start, adapter),
          end: processDate(placeholder.end, adapter),
        },
      };
    },
  ),
  /**
   * The key of the occurrence currently being edited, or `null` when nothing is being edited.
   */
  editingOccurrenceKey: createSelector(
    (state: State) => state.editingOccurrence?.occurrence.key ?? null,
  ),
  /**
   * Returns `true` when an occurrence is currently being edited.
   */
  isEditing: createSelector((state: State) => state.editingOccurrence != null),
  visibleDate: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.displayTimezone,
    (adapter, visibleDate, timezone) => adapter.setTimezone(visibleDate, timezone),
  ),
  isRecurringScopeOpen: createSelector(
    (state: State) => state.pendingRecurringEventOperation != null,
  ),
  /**
   * The default event color used when no color is specified on the event or its resource.
   */
  defaultEventColor: createSelector((state: State) => state.eventColor),
  displayTimezone: createSelector((state: State) => state.displayTimezone),
  /**
   * Whether each event must be assigned to a resource. When true, the resource cannot be cleared in the edit dialog and the form cannot be submitted without one.
   */
  shouldEventRequireResource: createSelector((state: State) => state.shouldEventRequireResource),
  recurringEventsPlugin: createSelector((state: State) => state.recurringEventsPlugin),
  areRecurringEventsAvailable: createSelector(
    (state: State) => state.recurringEventsPlugin != null,
  ),
  isLoading: createSelector((state: State) => state.isLoading),
  errors: createSelector((state: State) => state.errors),
};
