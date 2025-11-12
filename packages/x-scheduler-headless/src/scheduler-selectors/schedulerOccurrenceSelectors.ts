import { createSelector } from '@base-ui-components/utils/store';
import { SchedulerProcessedDate } from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';

export const schedulerOccurrenceSelectors = {
  // TODO: Pass the occurrence key instead of the start and end dates once the occurrences are stored in the state.
  isStartedOrEnded: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, start: SchedulerProcessedDate, end: SchedulerProcessedDate) => {
      return {
        started: adapter.isBefore(start.value, now) || adapter.isEqual(start.value, now),
        ended: adapter.isBefore(end.value, now),
      };
    },
  ),
};
