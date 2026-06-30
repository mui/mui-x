import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

// Warning: Only add selectors here that do not belong to any specific feature.
export const schedulerOtherSelectors = {
  /**
   * Returns `true` if the occurrence with the given key is the one being edited.
   * Occurrence-precise: editing one occurrence of a recurring series doesn't match its siblings.
   */
  isEditedOccurrence: createSelector(
    (state: State) => state.editingOccurrence?.occurrence.key ?? null,
    (editedOccurrenceKey, occurrenceKey: string | undefined) =>
      editedOccurrenceKey != null && editedOccurrenceKey === occurrenceKey,
  ),
  /**
   * The occurrence currently being edited (existing or a creation draft), or `null`.
   * The editing surfaces (dialog / drawer) read from here.
   */
  editingOccurrence: createSelector((state: State) => state.editingOccurrence?.occurrence ?? null),
  visibleDate: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.displayTimezone,
    (adapter, visibleDate, timezone) => adapter.setTimezone(visibleDate, timezone),
  ),
  /**
   * Which face the edited occurrence is in (`'armed'` toolbar or `'edit'` surface), or `null` when idle.
   * Drives the toolbar-vs-surface swap and whether the edited event stays resizable.
   */
  editingMode: createSelector((state: State) => state.editingOccurrence?.mode ?? null),
  /**
   * Returns `true` when the occurrence with the given key is armed (`'armed'`): it shows its resize
   * handles + action toolbar and no surface is open.
   */
  isEditedOccurrenceArmed: createSelector(
    (state: State) => state.editingOccurrence?.occurrence.key ?? null,
    (state: State) => state.editingOccurrence?.mode ?? null,
    (editedOccurrenceKey, mode, occurrenceKey: string | undefined) =>
      mode === 'armed' && editedOccurrenceKey != null && editedOccurrenceKey === occurrenceKey,
  ),
  /**
   * Returns `true` when the occurrence with the given key is being edited in the form (`'edit'`).
   * Resizing is disabled then — the form is the only way to change times.
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
