import { createSelector } from '@base-ui/utils/store';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { isInternalDragOrResizePlaceholder } from '../internals/utils/drag-utils';

export const schedulerOccurrencePlaceholderSelectors = {
  value: createSelector((state: State) => state.occurrencePlaceholder),
  isDefined: createSelector((state: State) => state.occurrencePlaceholder !== null),
  /**
   * Returns `true` while a new event is being created (a `creation` placeholder is active).
   * Selecting this boolean (instead of the placeholder object) avoids re-rendering on every
   * placeholder mutation, e.g. each move of a creation-placeholder resize.
   */
  isCreating: createSelector((state: State) => state.occurrencePlaceholder?.type === 'creation'),
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
