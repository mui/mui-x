import { createSelector } from '@base-ui/utils/store';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { isInternalDragOrResizePlaceholder } from '../internals/utils/drag-utils';

export const schedulerOccurrencePlaceholderSelectors = {
  value: createSelector((state: State) => state.occurrencePlaceholder),
  isDefined: createSelector((state: State) => state.occurrencePlaceholder !== null),
  /**
   * Returns `true` while a `creation` placeholder is active.
   * Selecting a boolean instead of the placeholder object avoids re-rendering on every mutation.
   */
  isCreating: createSelector((state: State) => state.occurrencePlaceholder?.type === 'creation'),
  /**
   * The type of the active placeholder, or `undefined` if none.
   * Selecting the primitive avoids re-rendering on every mutation (e.g. each drag/resize move).
   */
  type: createSelector((state: State) => state.occurrencePlaceholder?.type),
  actionForOccurrence: createSelector((state: State, occurrenceKey: string) => {
    const placeholder = state.occurrencePlaceholder;
    if (
      isInternalDragOrResizePlaceholder(placeholder) &&
      placeholder.occurrenceKey === occurrenceKey
    ) {
      return placeholder.type;
    }

    return null;
  }),
};
