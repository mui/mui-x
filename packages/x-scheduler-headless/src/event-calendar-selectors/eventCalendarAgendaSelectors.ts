import { createSelectorMemoized } from '@base-ui/utils/store';
import type { EventCalendarState as State } from '../use-event-calendar';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';
import { eventCalendarPreferenceSelectors } from './eventCalendarPreferenceSelectors';
import {
  SchedulerEventOccurrence,
  SchedulerOccurrencesByDay,
  SchedulerProcessedDate,
} from '../models';
import { AGENDA_MAX_HORIZON_DAYS, AGENDA_VIEW_DAYS_AMOUNT } from '../constants';
import { getDayList } from '../get-day-list';
import {
  getDaysTheOccurrenceIsVisibleOn,
  getOccurrencesFromEvents,
} from '../internals/utils/event-utils';

interface AgendaCombined {
  days: SchedulerProcessedDate[];
  occurrences: SchedulerOccurrencesByDay;
}

/**
 * Combined memoized selector that builds the agenda's day list AND the matching
 * occurrence index in a single pass — agenda has to expand events to decide which
 * days actually have content (when `showEmptyDaysInAgenda` is off), so reusing the
 * intermediate `occurrencesByDay` saves one full re-expansion versus computing them
 * in two separate selectors.
 */
const agendaCombinedSelector = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerOtherSelectors.visibleDate,
  schedulerOtherSelectors.displayTimezone,
  eventCalendarPreferenceSelectors.showWeekends,
  eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
  schedulerEventSelectors.processedEventList,
  schedulerResourceSelectors.visibleMap,
  schedulerOtherSelectors.plan,
  (
    adapter,
    visibleDate,
    displayTimezone,
    showWeekends,
    showEmptyDaysInAgenda,
    events,
    visibleResources,
    plan,
  ): AgendaCombined => {
    const amount = AGENDA_VIEW_DAYS_AMOUNT;

    // 1. First chunk of days
    let accumulatedDays: SchedulerProcessedDate[] = getDayList({
      adapter,
      start: visibleDate,
      end: adapter.addDays(visibleDate, amount - 1),
      excludeWeekends: !showWeekends,
    });
    let accumulatedOccurrences = computeOccurrencesByDay({
      adapter,
      days: accumulatedDays,
      events,
      visibleResources,
      displayTimezone,
      plan,
    });

    if (showEmptyDaysInAgenda) {
      return { days: accumulatedDays, occurrences: accumulatedOccurrences };
    }

    // 2. Drop empty days, extending forward in chunks until we collect `amount` days
    //    that contain occurrences (or until the horizon limit is reached).
    let daysWithEvents = accumulatedDays
      .filter((day) => (accumulatedOccurrences.keysByDay.get(day.key)?.length ?? 0) > 0)
      .slice(0, amount);

    while (daysWithEvents.length < amount) {
      const first = accumulatedDays[0]?.value;
      const last = accumulatedDays[accumulatedDays.length - 1]?.value;

      if (first && last) {
        const spanDays =
          adapter.differenceInDays(adapter.startOfDay(last), adapter.startOfDay(first)) + 1;
        if (spanDays >= AGENDA_MAX_HORIZON_DAYS) {
          break;
        }
      }

      const nextStart = adapter.addDays(last ?? visibleDate, 1);
      const more = getDayList({
        adapter,
        start: nextStart,
        end: adapter.addDays(nextStart, amount),
        excludeWeekends: !showWeekends,
      });
      accumulatedDays = accumulatedDays.concat(more);
      accumulatedOccurrences = computeOccurrencesByDay({
        adapter,
        days: accumulatedDays,
        events,
        visibleResources,
        displayTimezone,
        plan,
      });
      const keysByDay = accumulatedOccurrences.keysByDay;
      daysWithEvents = accumulatedDays
        .filter((day) => (keysByDay.get(day.key)?.length ?? 0) > 0)
        .slice(0, amount);
    }

    // The agenda only renders the days that survived filtering, so trim the
    // occurrences index to those days too.
    const trimmed = trimOccurrencesToDays(accumulatedOccurrences, daysWithEvents);
    return { days: daysWithEvents, occurrences: trimmed };
  },
);

const visibleDaysSelector = createSelectorMemoized(
  agendaCombinedSelector,
  (combined) => combined.days,
);

const visibleOccurrencesSelector = createSelectorMemoized(
  agendaCombinedSelector,
  (combined) => combined.occurrences,
);

export const eventCalendarAgendaSelectors = {
  visibleDays: visibleDaysSelector,
  visibleOccurrences: visibleOccurrencesSelector,
};

interface ComputeOccurrencesByDayParameters {
  adapter: State['adapter'];
  days: SchedulerProcessedDate[];
  events: ReturnType<typeof schedulerEventSelectors.processedEventList>;
  visibleResources: ReturnType<typeof schedulerResourceSelectors.visibleMap>;
  displayTimezone: ReturnType<typeof schedulerOtherSelectors.displayTimezone>;
  plan: ReturnType<typeof schedulerOtherSelectors.plan>;
}

function computeOccurrencesByDay(
  parameters: ComputeOccurrencesByDayParameters,
): SchedulerOccurrencesByDay {
  const { adapter, days, events, visibleResources, displayTimezone, plan } = parameters;
  const byKey = new Map<string, SchedulerEventOccurrence>();
  const keysByDay = new Map<string, string[]>();
  const dayKeys: string[] = [];
  for (const day of days) {
    keysByDay.set(day.key, []);
    dayKeys.push(day.key);
  }

  if (days.length === 0) {
    return { byKey, keysByDay, dayKeys };
  }

  const start = adapter.startOfDay(days[0].value);
  const end = adapter.endOfDay(days[days.length - 1].value);
  const occurrences = getOccurrencesFromEvents({
    adapter,
    start,
    end,
    events,
    visibleResources,
    displayTimezone,
    plan,
  });

  for (const occurrence of occurrences) {
    byKey.set(occurrence.key, occurrence);
    for (const dayKey of getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter)) {
      keysByDay.get(dayKey)!.push(occurrence.key);
    }
  }

  return { byKey, keysByDay, dayKeys };
}

function trimOccurrencesToDays(
  occurrences: SchedulerOccurrencesByDay,
  days: SchedulerProcessedDate[],
): SchedulerOccurrencesByDay {
  const trimmedKeysByDay = new Map<string, string[]>();
  const trimmedDayKeys: string[] = [];
  const referencedKeys = new Set<string>();
  for (const day of days) {
    const keys = occurrences.keysByDay.get(day.key) ?? [];
    trimmedKeysByDay.set(day.key, keys.slice());
    trimmedDayKeys.push(day.key);
    for (const k of keys) {
      referencedKeys.add(k);
    }
  }

  const trimmedByKey = new Map<string, SchedulerEventOccurrence>();
  for (const k of referencedKeys) {
    const occurrence = occurrences.byKey.get(k);
    if (occurrence) {
      trimmedByKey.set(k, occurrence);
    }
  }

  return {
    byKey: trimmedByKey,
    keysByDay: trimmedKeysByDay,
    dayKeys: trimmedDayKeys,
  };
}
