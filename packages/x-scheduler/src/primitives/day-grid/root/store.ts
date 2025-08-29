import { createSelector, Store } from '@base-ui-components/utils/store';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import { Adapter } from '../../utils/adapter/types';

export type State = {
  /**
   * The adapter of the date library.
   * Not publicly exposed, is only set in state to avoid passing it to the selectors.
   */
  adapter: Adapter;
  placeholder: CalendarPrimitiveEventData | null;
};

export type DayGridRootStore = Store<State>;

export const selectors = {
  placeholderInDay: createSelector(
    (state: State, day: SchedulerValidDate, rowStart: SchedulerValidDate) => {
      if (state.placeholder === null) {
        return null;
      }

      if (state.adapter.isSameDay(day, state.placeholder.start)) {
        return state.placeholder;
      }

      if (
        state.adapter.isSameDay(day, rowStart) &&
        state.adapter.isWithinRange(rowStart, [state.placeholder.start, state.placeholder.end])
      ) {
        return state.placeholder;
      }

      return null;
    },
  ),
  hasPlaceholder: (state: State) => state.placeholder !== null,
};
