import type { TemporalSupportedObject } from '../models';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

export const schedulerNowSelectors = {
  showCurrentTimeIndicator: (state: State) => state.showCurrentTimeIndicator,
  nowUpdatedEveryMinute: (state: State) => state.nowUpdatedEveryMinute,
  isCurrentDay: (state: State, date: TemporalSupportedObject) =>
    state.adapter.isSameDay(date, state.nowUpdatedEveryMinute),
};
