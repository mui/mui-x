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

export type TimeGridRootStore = Store<State>;

export const selectors = {
  placeholderInRange: createSelector(
    (state: State, start: SchedulerValidDate, end: SchedulerValidDate) => {
      if (state.placeholder === null) {
        return null;
      }

      if (
        state.adapter.isBefore(state.placeholder.end, start) ||
        state.adapter.isAfter(state.placeholder.start, end)
      ) {
        return null;
      }

      return state.placeholder;
    },
  ),
};
