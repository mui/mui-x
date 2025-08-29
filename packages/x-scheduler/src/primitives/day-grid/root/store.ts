import { createSelector, Store } from '@base-ui-components/utils/store';
import { CalendarEventId, CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
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
  isDraggingEvent: (state: State, eventId: CalendarEventId) =>
    state.placeholder?.eventId === eventId,
  placeholderInDay: createSelector(
    (
      state: State,
      day: SchedulerValidDate,
      rowStart: SchedulerValidDate,
      rowEnd: SchedulerValidDate,
    ) => {
      if (state.placeholder === null) {
        return null;
      }

      let shouldRenderPlaceholder = false;

      if (state.adapter.isSameDay(day, state.placeholder.start)) {
        shouldRenderPlaceholder = true;
      } else if (
        state.adapter.isSameDay(day, rowStart) &&
        state.adapter.isWithinRange(rowStart, [state.placeholder.start, state.placeholder.end])
      ) {
        shouldRenderPlaceholder = true;
      }

      if (shouldRenderPlaceholder) {
        return {
          ...state.placeholder,
          start: day,
          end: state.adapter.isAfter(state.placeholder.end, rowEnd)
            ? rowEnd
            : state.placeholder.end,
        };
      }

      return null;
    },
  ),
  hasPlaceholder: (state: State) => state.placeholder !== null,
};
