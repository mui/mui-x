import { createSelector } from '@base-ui/utils/store';
import { TemporalSupportedObject } from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';

export const schedulerNowSelectors = {
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
  nowUpdatedEveryMinute: createSelector((state: State) => state.nowUpdatedEveryMinute),
  isCurrentDay: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, date: TemporalSupportedObject) => adapter.isSameDay(date, now),
  ),
};
