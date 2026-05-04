import { createSelector } from '@base-ui/utils/store';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { isInternalDragOrResizePlaceholder } from '../internals/utils/drag-utils';

export const schedulerOccurrencePlaceholderSelectors = {
  value: createSelector((state: State) => state.occurrencePlaceholder),
  isDefined: createSelector((state: State) => state.occurrencePlaceholder !== null),
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
