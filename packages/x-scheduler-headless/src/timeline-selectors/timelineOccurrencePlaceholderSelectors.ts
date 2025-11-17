import { createSelector } from '@base-ui-components/utils/store';
import { TimelineState as State } from '../use-timeline';
import { SchedulerResourceId, SchedulerValidDate } from '../models';

export const timelineOccurrencePlaceholderSelectors = {
  placeholderInTimeRange: createSelector(
    (
      state: State,
      start: SchedulerValidDate,
      end: SchedulerValidDate,
      resourceId: SchedulerResourceId | null,
    ) => {
      if (
        state.occurrencePlaceholder === null ||
        state.occurrencePlaceholder.surfaceType !== 'timeline' ||
        state.occurrencePlaceholder.isHidden ||
        state.occurrencePlaceholder.resourceId !== resourceId
      ) {
        return null;
      }

      if (
        state.adapter.isBefore(state.occurrencePlaceholder.end, start) ||
        state.adapter.isAfter(state.occurrencePlaceholder.start, end)
      ) {
        return null;
      }

      return state.occurrencePlaceholder;
    },
  ),
};
