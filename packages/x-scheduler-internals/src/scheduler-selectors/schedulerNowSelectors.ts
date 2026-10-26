import { createSelectorMemoized } from '@base-ui/utils/store';
import type { TemporalSupportedObject } from '../models';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { toLocalDayNumber } from '../internals/utils/plain-date-utils/timeZone';

/**
 * The day number of now in the display timezone. It's a number, so the components that only need
 * the current day re-render when it changes, not every minute.
 */
const nowDayNumber = createSelectorMemoized(
  (state: State) => state.adapter,
  (state: State) => state.nowUpdatedEveryMinute,
  (state: State) => state.displayTimezone,
  (adapter, now, timezone) => toLocalDayNumber(adapter.getTime(now), timezone),
);

export const schedulerNowSelectors = {
  showCurrentTimeIndicator: (state: State) => state.showCurrentTimeIndicator,
  nowUpdatedEveryMinute: (state: State) => state.nowUpdatedEveryMinute,
  nowDayNumber,
  isCurrentDay: (state: State, date: TemporalSupportedObject) =>
    toLocalDayNumber(state.adapter.getTime(date), state.displayTimezone) === nowDayNumber(state),
};
