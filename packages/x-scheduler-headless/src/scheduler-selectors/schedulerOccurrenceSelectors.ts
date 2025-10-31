import { createSelector } from '@base-ui-components/utils/store';
import { SchedulerValidDate } from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';

export const schedulerOccurrenceSelectors = {
  // TODO: Pass the occurrence key instead of the start and end dates once the occurrences are stored in the state.
  isStartedOrEnded: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, start: SchedulerValidDate, end: SchedulerValidDate) => {
      return {
        started: adapter.isBefore(start, now) || adapter.isEqual(start, now),
        ended: adapter.isBefore(end, now),
      };
    },
  ),
};
