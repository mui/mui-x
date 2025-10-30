import { createSelector } from '@base-ui-components/utils/store';
import { SchedulerValidDate } from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';

export const schedulerOtherSelectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
  nowUpdatedEveryMinute: createSelector((state: State) => state.nowUpdatedEveryMinute),
  isScopeDialogOpen: createSelector(
    (state: State) => state.pendingUpdateRecurringEventParameters != null,
  ),
  isCurrentDay: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, date: SchedulerValidDate) => adapter.isSameDay(date, now),
  ),
};
