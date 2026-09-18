import { createSelectorMemoized } from '@base-ui/utils/store';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

// Warning: Only add selectors here that do not belong to any specific feature.
export const schedulerOtherSelectors = {
  /**
   * Returns `true` if the occurrence with the given key is the one being edited.
   * Occurrence-precise: editing one occurrence of a recurring series doesn't match its siblings.
   */
  isEditedOccurrence: (state: State, occurrenceKey: string | undefined) => {
    const editedOccurrenceKey = state.editingOccurrence?.occurrence.key ?? null;
    return editedOccurrenceKey != null && editedOccurrenceKey === occurrenceKey;
  },
  /**
   * The occurrence currently being edited (existing or a creation draft), or `null`.
   * The editing surfaces (dialog / drawer) read from here.
   */
  editingOccurrence: (state: State) => state.editingOccurrence?.occurrence ?? null,
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
  editingMode: (state: State) => state.editingOccurrence?.mode ?? null,
  /**
   * Returns `true` when the occurrence with the given key is armed (`'armed'`): it shows its resize
   * handles + action toolbar and no surface is open.
   */
  isEditedOccurrenceArmed: (state: State, occurrenceKey: string | undefined) => {
    const editedOccurrenceKey = state.editingOccurrence?.occurrence.key ?? null;
    return (
      state.editingOccurrence?.mode === 'armed' &&
      editedOccurrenceKey != null &&
      editedOccurrenceKey === occurrenceKey
    );
  },
  /**
   * Returns `true` when the occurrence with the given key is being edited in the form (`'edit'`).
   * Resizing is disabled then — the form is the only way to change times.
   */
  isEditedOccurrenceInEditMode: (state: State, occurrenceKey: string | undefined) => {
    const editedOccurrenceKey = state.editingOccurrence?.occurrence.key ?? null;
    return (
      state.editingOccurrence?.mode === 'edit' &&
      editedOccurrenceKey != null &&
      editedOccurrenceKey === occurrenceKey
    );
  },
  isRecurringScopeDialogOpen: (state: State) => state.pendingRecurringEventOperation != null,
  /**
   * The default event color used when no color is specified on the event or its resource.
   */
  defaultEventColor: (state: State) => state.eventColor,
  displayTimezone: (state: State) => state.displayTimezone,
  /**
   * Whether each event must be assigned to a resource. When true, the resource cannot be cleared in the editing surface and the form cannot be submitted without one.
   * Resolves to `false` when no resources are configured, even if `shouldEventRequireResource` was set to `true`,
   * since that combination is contradictory (the store already warns about it) and would otherwise block
   * submission with no resource picker to fix it from.
   */
  shouldEventRequireResource: (state: State) =>
    state.shouldEventRequireResource && state.resourceIdList.length > 0,
  recurringEventsPlugin: (state: State) => state.recurringEventsPlugin,
  areRecurringEventsAvailable: (state: State) => state.recurringEventsPlugin != null,
  isLoading: (state: State) => state.isLoading,
  errors: (state: State) => state.errors,
};
