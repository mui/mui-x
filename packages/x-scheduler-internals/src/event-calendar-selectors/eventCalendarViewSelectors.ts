import type { EventCalendarState as State } from '../use-event-calendar';

export const eventCalendarViewSelectors = {
  view: (state: State) => state.view,
  views: (state: State) => state.views,
  hasDayView: (state: State) => state.views.includes('day'),
  /**
   * The user configuration for a time-grid based view (`day` or `week`), or `null` when none is set.
   */
  timeGridConfig: (state: State, view: 'day' | 'week') => state.viewConfig?.[view] ?? null,
};
