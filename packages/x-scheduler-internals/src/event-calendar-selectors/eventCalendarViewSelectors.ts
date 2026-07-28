import { createSelector } from '@base-ui/utils/store';
import type { EventCalendarState as State } from '../use-event-calendar';

export const eventCalendarViewSelectors = {
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
  /**
   * The user configuration for a time-grid based view (`day` or `week`), or `null` when none is set.
   */
  timeGridConfig: createSelector(
    (state: State, view: 'day' | 'week') => state.viewConfig?.[view] ?? null,
  ),
};
