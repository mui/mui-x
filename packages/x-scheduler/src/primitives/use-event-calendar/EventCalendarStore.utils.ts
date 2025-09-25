import { createSelectorMemoized, Store } from '@base-ui-components/utils/store';
import { EventCalendarState as State } from './EventCalendarStore.types';
import { selectors } from './EventCalendarStore.selectors';
import { EventCalendarStore } from './EventCalendarStore';
import { Adapter } from '../utils/adapter/types';
import { CalendarEvent, CalendarEventOccurrence, CalendarProcessedDate } from '../models';
import { getDaysTheOccurrenceIsVisibleOn, getOccurrencesFromEvents } from '../utils/event-utils';

function runStoreEffect<State, Value>(
  store: Store<State>,
  selector: (state: State) => Value,
  effect: (previous: Value, next: Value) => void,
) {
  let previousState = selector(store.getSnapshot());
  store.subscribe((state) => {
    const nextState = selector(state);
    effect(previousState, nextState);
    previousState = nextState;
  });
}

/**
 * Gets all the event occurrences for the given days.
 * For recurring events, it expands them to get all the occurrences that fall within the given days.
 * It should be called once per view to get the occurrences for all the visible days in one go.
 * The returned value is a Map where the key is the day key and the value is the list of occurrences for that day.
 */
export function getEventOccurrencesGroupedByDay(
  adapter: Adapter,
  days: CalendarProcessedDate[],
  renderEventIn: 'first-day' | 'every-day',
  events: CalendarEvent[],
  visibleResources: Map<string, boolean>,
): Map<string, CalendarEventOccurrence[]> {
  // Create a Map of the occurrences grouped by day
  const occurrencesGroupedByDay = new Map<
    string,
    Record<'allDay' | 'nonAllDay', CalendarEventOccurrence[]>
  >(days.map((day) => [day.key, { allDay: [], nonAllDay: [] }]));

  const start = adapter.startOfDay(days[0].value);
  const end = adapter.endOfDay(days[days.length - 1].value);
  const occurrences = getOccurrencesFromEvents({ adapter, start, end, events, visibleResources });

  for (const occurrence of occurrences) {
    const eventDays = getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter, renderEventIn);
    for (const dayKey of eventDays) {
      const occurrenceType = occurrence.allDay ? 'allDay' : 'nonAllDay';
      occurrencesGroupedByDay.get(dayKey)![occurrenceType].push(occurrence);
    }
  }

  // Make sure the all-day events are before the non-all-day events
  const cleanMap = new Map<string, CalendarEventOccurrence[]>();
  occurrencesGroupedByDay.forEach((value, key) => {
    cleanMap.set(key, [...value.allDay, ...value.nonAllDay]);
  });

  return cleanMap;
}

function syncEventOccurrencesMap(store: EventCalendarStore) {
  runStoreEffect(
    store,
    createSelectorMemoized(
      selectors.events,
      selectors.visibleDate,
      selectors.visibleResourcesMap,
      (state: State) => state.adapter,
      (state: State) => state.viewConfig,
      (state: State) => state.preferences.showWeekends,
      (events, visibleDate, visibleResourcesMap, adapter, viewConfig, showWeekends) => {
        if (viewConfig == null) {
          return null;
        }

        const visibleDays = viewConfig.getVisibleDays({
          adapter,
          visibleDate,
          showWeekends,
        });

        return getEventOccurrencesGroupedByDay(
          adapter,
          visibleDays,
          viewConfig.renderEventIn,
          events,
          visibleResourcesMap,
        );
      },
    ),
    (_previous, next) => {
      if (next == null) {
        return;
      }

      // TODO: Remove queueMicrotask once the state handles nested updates
      queueMicrotask(() => store.set('tempEventOccurrencesMap', next));
    },
  );
}

export function runEventCalendarStoreEffects(store: EventCalendarStore) {
  syncEventOccurrencesMap(store);
}
