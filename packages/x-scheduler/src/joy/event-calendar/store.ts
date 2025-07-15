import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { createSelector, createSelectorMemoized, Store } from '../../base-ui-copy/utils/store';
import { SchedulerValidDate } from '../../primitives/models';
import { CalendarEvent } from '../models/events';
import { CalendarResource, CalendarResourceId } from '../models/resource';
import { ViewType } from '../models/views';

const adapter = getAdapter();

export type State = {
  visibleDate: SchedulerValidDate;
  currentView: ViewType;
  views: ViewType[];
  events: CalendarEvent[];
  resources: CalendarResource[];
};

export type EventCalendarStore = Store<State>;

export const selectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  currentView: createSelector((state: State) => state.currentView),
  views: createSelector((state: State) => state.views),
  resources: createSelector((state: State) => state.resources),
  resourcesByIdMap: createSelectorMemoized(
    (state: State) => state.resources,
    (resources) => {
      const map = new Map<CalendarResourceId | undefined, CalendarResource>();
      for (const resource of resources) {
        map.set(resource.id, resource);
      }
      return map;
    },
  ),
  getEventsStartingInDay: createSelectorMemoized(
    (state: State) => state.events,
    (events) => {
      const map = new Map<string, CalendarEvent[]>();
      for (const event of events) {
        const dayKey = adapter.format(event.start, 'keyboardDate');
        if (!map.has(dayKey)) {
          map.set(dayKey, []);
        }
        map.get(dayKey)!.push(event);
      }

      return (day: SchedulerValidDate) => {
        const dayKey = adapter.format(day, 'keyboardDate');
        return map.get(dayKey) || [];
      };
    },
  ),
};
