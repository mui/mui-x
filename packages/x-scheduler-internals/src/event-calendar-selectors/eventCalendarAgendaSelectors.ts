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
 *
 * When `showEmptyDaysInAgenda` is `false`, the result may contain fewer than
 * `AGENDA_VIEW_DAYS_AMOUNT` days: the chunked search stops once the horizon
 * (`AGENDA_MAX_HORIZON_DAYS`) is reached or once a chunk yields no new days
 * (e.g. `showWeekends=false` with no weekday events ahead).
 */
const agendaCombinedSelector = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerOtherSelectors.visibleDate,
  schedulerOtherSelectors.displayTimezone,
  eventCalendarPreferenceSelectors.showWeekends,
  eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
  schedulerEventSelectors.processedEventList,
  schedulerResourceSelectors.visibleMap,
  schedulerOtherSelectors.recurringEventsPlugin,
  (
    adapter,
    visibleDate,
    displayTimezone,
    showWeekends,
    showEmptyDaysInAgenda,
    events,
    visibleResources,
    recurringEventsPlugin,
  ): AgendaCombined => {
    const amount = AGENDA_VIEW_DAYS_AMOUNT;

    // Each chunk extension appends to these maps in place, avoiding a full re-expansion
    // of events for the entire `accumulatedDays` window.
    const accumulatedDays: SchedulerProcessedDate[] = [];
    const byKey = new Map<string, SchedulerEventOccurrence>();
    const keysByDay = new Map<string, string[]>();
    const dayKeys: string[] = [];

    appendChunk({
      adapter,
      chunk: getDayList({
        adapter,
        start: visibleDate,
        end: adapter.addDays(visibleDate, amount - 1),
        excludeWeekends: !showWeekends,
      }),
      events,
      visibleResources,
      displayTimezone,
      recurringEventsPlugin,
      accumulatedDays,
      byKey,
      keysByDay,
      dayKeys,
    });

    if (showEmptyDaysInAgenda) {
      sortKeysByDayInPlace(keysByDay, byKey);
      return {
        days: accumulatedDays,
        occurrences: { byKey, keysByDay, dayKeys },
      };
    }

    // Drop empty days, extending forward in chunks until we collect `amount` days that
    // contain occurrences (or until the horizon limit is reached).
    let daysWithEvents = accumulatedDays
      .filter((day) => (keysByDay.get(day.key)?.length ?? 0) > 0)
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
      // No new days were generated for this chunk — extending further would just spin.
      if (more.length === 0) {
        break;
      }
      // Expand events for the new chunk only and merge into the existing maps.
      // Re-expanding `accumulatedDays + more` each iteration is O(events × span)
      // and dominates cost when events are sparse.
      appendChunk({
        adapter,
        chunk: more,
        events,
        visibleResources,
        displayTimezone,
        recurringEventsPlugin,
        accumulatedDays,
        byKey,
        keysByDay,
        dayKeys,
      });
      daysWithEvents = accumulatedDays
        .filter((day) => (keysByDay.get(day.key)?.length ?? 0) > 0)
        .slice(0, amount);
    }

    // The agenda only renders the days that survived filtering, so trim the
    // occurrences index to those days too. Sort before trimming so the sliced
    // per-day arrays inherit the chronological order.
    sortKeysByDayInPlace(keysByDay, byKey);
    const trimmed = trimOccurrencesToDays({ byKey, keysByDay, dayKeys }, daysWithEvents);
    return { days: daysWithEvents, occurrences: trimmed };
  },
);

// Order each day's occurrence keys by their start timestamp so the agenda renders them
// chronologically without re-sorting on every render. `appendChunk` produces keys in
// event-iteration order, which has no relation to occurrence start.
function sortKeysByDayInPlace(
  keysByDay: Map<string, string[]>,
  byKey: ReadonlyMap<string, SchedulerEventOccurrence>,
): void {
  for (const [dayKey, keys] of keysByDay) {
    if (keys.length < 2) {
      continue;
    }
    keys.sort((a, b) => {
      const occA = byKey.get(a);
      const occB = byKey.get(b);
      if (!occA || !occB) {
        const missingKey = !occA ? a : b;
        throw new Error(
          `MUI X Scheduler: occurrence "${missingKey}" referenced by day "${dayKey}" is missing from \`byKey\`. ` +
            "The agenda's occurrence index was built inconsistently, so it cannot be sorted. " +
            'Make sure every key listed in `keysByDay` resolves in `byKey`.',
        );
      }
      return (
        occA.displayTimezone.start.timestamp - occB.displayTimezone.start.timestamp ||
        occB.displayTimezone.end.timestamp - occA.displayTimezone.end.timestamp
      );
    });
  }
}

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

interface AppendChunkParameters {
  adapter: State['adapter'];
  chunk: SchedulerProcessedDate[];
  events: ReturnType<typeof schedulerEventSelectors.processedEventList>;
  visibleResources: ReturnType<typeof schedulerResourceSelectors.visibleMap>;
  displayTimezone: ReturnType<typeof schedulerOtherSelectors.displayTimezone>;
  recurringEventsPlugin: ReturnType<typeof schedulerOtherSelectors.recurringEventsPlugin>;
  accumulatedDays: SchedulerProcessedDate[];
  byKey: Map<string, SchedulerEventOccurrence>;
  keysByDay: Map<string, string[]>;
  dayKeys: string[];
}

/**
 * Expands occurrences for `chunk` and merges them into the running maps in place.
 * Each chunk's events are expanded once over its own `[start, end]` window — never
 * across chunks already processed.
 */
function appendChunk(parameters: AppendChunkParameters): void {
  const {
    adapter,
    chunk,
    events,
    visibleResources,
    displayTimezone,
    recurringEventsPlugin,
    accumulatedDays,
    byKey,
    keysByDay,
    dayKeys,
  } = parameters;

  for (const day of chunk) {
    keysByDay.set(day.key, []);
    dayKeys.push(day.key);
    accumulatedDays.push(day);
  }

  if (chunk.length === 0) {
    return;
  }

  const start = adapter.startOfDay(chunk[0].value);
  const end = adapter.endOfDay(chunk[chunk.length - 1].value);
  const occurrences = getOccurrencesFromEvents({
    adapter,
    start,
    end,
    events,
    visibleResources,
    displayTimezone,
    recurringEventsPlugin,
  });

  for (const occurrence of occurrences) {
    byKey.set(occurrence.key, occurrence);
    for (const dayKey of getDaysTheOccurrenceIsVisibleOn(occurrence, chunk, adapter)) {
      keysByDay.get(dayKey)!.push(occurrence.key);
    }
  }
}

function trimOccurrencesToDays(
  occurrences: SchedulerOccurrencesByDay,
  days: SchedulerProcessedDate[],
): SchedulerOccurrencesByDay {
  const trimmedKeysByDay = new Map<string, string[]>();
  const trimmedDayKeys: string[] = [];
  const referencedKeys = new Set<string>();
  for (const day of days) {
    const keys = occurrences.keysByDay.get(day.key);
    if (keys === undefined) {
      throw new Error(
        `MUI X Scheduler: day "${day.key}" passed to \`trimOccurrencesToDays\` is missing from \`keysByDay\`. ` +
          "The agenda's day list and occurrence index are out of sync, so the trim cannot proceed. " +
          'Make sure every day passed to the trim is one that `appendChunk` already registered.',
      );
    }
    trimmedKeysByDay.set(day.key, keys.slice());
    trimmedDayKeys.push(day.key);
    for (const k of keys) {
      referencedKeys.add(k);
    }
  }

  const trimmedByKey = new Map<string, SchedulerEventOccurrence>();
  for (const k of referencedKeys) {
    const occurrence = occurrences.byKey.get(k);
    if (!occurrence) {
      throw new Error(
        `MUI X Scheduler: occurrence "${k}" referenced by \`keysByDay\` is missing from \`byKey\`. ` +
          "The agenda's occurrence index was built inconsistently, so it cannot be trimmed. " +
          'Make sure every key listed in `keysByDay` resolves in `byKey`.',
      );
    }
    trimmedByKey.set(k, occurrence);
  }

  return {
    byKey: trimmedByKey,
    keysByDay: trimmedKeysByDay,
    dayKeys: trimmedDayKeys,
  };
}
