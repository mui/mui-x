import { createSelectorMemoized, Store } from '@base-ui-components/utils/store';
import { EventCalendarState, EventCalendarState as State } from './EventCalendarStore.types';
import { selectors } from './EventCalendarStore.selectors';
import { EventCalendarStore } from './EventCalendarStore';
import { Adapter } from '../utils/adapter/types';
import { CalendarEventOccurrence, CalendarProcessedDate } from '../models';
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
 * It should be called once per view to get the occurrences for all the visible days in one go.
 * The returned value is a Map where the key is the day key and the value is the list of occurrences for that day.
 */
export function getEventOccurrencesGroupedByDay(
  adapter: Adapter,
  days: CalendarProcessedDate[],
  occurrences: CalendarEventOccurrence[],
): Map<string, CalendarEventOccurrence[]> {
  // Create a Map of the occurrences grouped by day
  const occurrencesGroupedByDay = new Map<
    string,
    Record<'allDay' | 'nonAllDay', CalendarEventOccurrence[]>
  >(days.map((day) => [day.key, { allDay: [], nonAllDay: [] }]));

  for (const occurrence of occurrences) {
    const eventDays = getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter, 'every-day');
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

/**
 * Makes sure the event occurrences lookups are always in sync with the rest of the state.
 */
// TODO: Support partial updates of the map when only the visible days change.
function syncEventOccurrencesLookups(store: EventCalendarStore) {
  runStoreEffect(
    store,
    createSelectorMemoized(
      selectors.events,
      selectors.visibleDate,
      selectors.visibleResourcesMap,
      (state: State) => state.adapter,
      (state: State) => state.viewConfig,
      (state: State) => state.preferences.showWeekends,
      (
        events,
        visibleDate,
        visibleResourcesMap,
        adapter,
        viewConfig,
        showWeekends,
      ): Pick<EventCalendarState, 'occurrencesLookup' | 'occurrencesGroupedByDayLookup'> | null => {
        if (viewConfig == null) {
          return null;
        }

        const visibleDays = viewConfig.getVisibleDays({
          adapter,
          visibleDate,
          showWeekends,
        });

        const occurrences = getOccurrencesFromEvents({
          adapter,
          start: adapter.startOfDay(visibleDays[0].value),
          end: adapter.endOfDay(visibleDays[visibleDays.length - 1].value),
          events,
          visibleResources: visibleResourcesMap,
        });

        const occurrencesLookup: Map<string, CalendarEventOccurrence> = new Map();
        for (const occurrence of occurrences) {
          occurrencesLookup.set(occurrence.key, occurrence);
        }

        const occurrencesGroupedByDayLookup = getEventOccurrencesGroupedByDay(
          adapter,
          visibleDays,
          occurrences,
        );

        return { occurrencesLookup, occurrencesGroupedByDayLookup };
      },
    ),
    (_previous, next) => {
      if (next == null) {
        return;
      }

      // TODO: Remove queueMicrotask once the state handles nested updates
      queueMicrotask(() => store.apply(next));
    },
  );
}

export function runEventCalendarStoreEffects(store: EventCalendarStore) {
  syncEventOccurrencesLookups(store);
}
