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
   * Returns `true` if the occurrence with the given key is the one currently being edited.
   * Unlike {@link isEditedEvent}, this is occurrence-precise, so editing one occurrence of a
   * recurring series does not match its other occurrences.
   */
  isEditedOccurrence: createSelector(
    (state: State) => state.editingOccurrence?.occurrence.key ?? null,
    (editedOccurrenceKey, occurrenceKey: string | undefined) =>
      editedOccurrenceKey != null && editedOccurrenceKey === occurrenceKey,
  ),
  /**
   * The occurrence currently being edited, with the live resize preview applied, or `null`.
   * During a resize the new start/end live on the `internal-resize` placeholder (the occurrence
   * only updates on pointer-up), so surfaces bound to the editing occurrence read this to preview
   * the in-progress times.
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
  visibleDate: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.displayTimezone,
    (adapter, visibleDate, timezone) => adapter.setTimezone(visibleDate, timezone),
  ),
  /**
   * Which face the editing surface shows (`'readonly'` summary or `'edit'` form), or `null` when
   * nothing is being edited. Drives the read-only-vs-form swap and whether the edited event stays
   * resizable.
   */
  editingMode: createSelector((state: State) => state.editingOccurrence?.mode ?? null),
  /**
   * Returns `true` when the occurrence with the given key is being edited through the form
   * (`'edit'` mode). Resizing is disabled in that state — the form is the single way to change times.
   */
  isEditedOccurrenceInEditMode: createSelector(
    (state: State) => state.editingOccurrence?.occurrence.key ?? null,
    (state: State) => state.editingOccurrence?.mode ?? null,
    (editedOccurrenceKey, mode, occurrenceKey: string | undefined) =>
      mode === 'edit' && editedOccurrenceKey != null && editedOccurrenceKey === occurrenceKey,
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
   */
  shouldEventRequireResource: createSelector((state: State) => state.shouldEventRequireResource),
  recurringEventsPlugin: createSelector((state: State) => state.recurringEventsPlugin),
  areRecurringEventsAvailable: createSelector(
    (state: State) => state.recurringEventsPlugin != null,
  ),
  isLoading: createSelector((state: State) => state.isLoading),
  errors: createSelector((state: State) => state.errors),
};
