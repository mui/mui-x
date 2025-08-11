import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventWithPosition,
  RecurrenceRule,
} from '../models';
import { Adapter } from './adapter/types';
import { diffIn, mergeDateAndTime } from './date-utils';

export function getEventWithLargestRowIndex(events: CalendarEventWithPosition[]) {
  return (
    events.reduce(
      (maxEvent, event) =>
        (event?.eventRowIndex ?? 0) > (maxEvent.eventRowIndex ?? 0) ? event : maxEvent,
      { eventRowIndex: 0 } as CalendarEventWithPosition,
    ).eventRowIndex || 0
  );
}

export function isDayWithinRange(
  day: SchedulerValidDate,
  eventFirstDay: SchedulerValidDate,
  eventLastDay: SchedulerValidDate,
  adapter: Adapter,
) {
  return (
    adapter.isSameDay(day, eventFirstDay) ||
    adapter.isSameDay(day, eventLastDay) ||
    (adapter.isAfter(day, eventFirstDay) && adapter.isBefore(day, eventLastDay))
  );
}

export function getEventRowIndex(
  event: CalendarEvent,
  day: SchedulerValidDate,
  days: SchedulerValidDate[],
  daysMap: Map<string, { allDayEvents: CalendarEventWithPosition[] }>,
  adapter: Adapter,
): number {
  const dayKey = adapter.format(day, 'keyboardDate');
  const eventFirstDay = adapter.startOfDay(event.start);

  // If the event starts before the current day, we need to find the row index of the first day of the event
  const isBeforeVisibleRange =
    adapter.isBefore(eventFirstDay, day) && !adapter.isSameDay(days[0], day);
  if (isBeforeVisibleRange) {
    const firstDayKey = adapter.format(
      adapter.isBefore(eventFirstDay, days[0]) ? days[0] : eventFirstDay,
      'keyboardDate',
    );

    // Try to find the row index from the original event placement on the first visible day
    const existingRowIndex = daysMap
      .get(firstDayKey)
      ?.allDayEvents.find((currentEvent) => currentEvent.id === event.id)?.eventRowIndex;

    return existingRowIndex ?? 1;
  }

  // Otherwise, we just render the event on the first available row in the column
  const usedIndexes = new Set(
    daysMap.get(dayKey)?.allDayEvents.map((item) => item.eventRowIndex) ?? [],
  );
  let i = 1;
  while (usedIndexes.has(i)) {
    i += 1;
  }
  return i;
}

export function getEventDays(
  event: CalendarEvent,
  days: SchedulerValidDate[],
  adapter: Adapter,
  shouldOnlyRenderEventInOneCell: boolean,
) {
  const eventFirstDay = adapter.startOfDay(event.start);
  const eventLastDay = adapter.endOfDay(event.end);

  if (shouldOnlyRenderEventInOneCell) {
    if (adapter.isBefore(eventFirstDay, days[0])) {
      return [days[0]];
    }
    return [eventFirstDay];
  }
  return days.filter((day) => isDayWithinRange(day, eventFirstDay, eventLastDay, adapter));
}

export function getAllDaySpanDays(adapter: Adapter, event: CalendarEvent): number {
  if (!event.allDay) {
    return 1;
  }
  // +1 so start/end same day = 1 day, spans include last day
  return Math.max(
    1,
    diffIn(adapter, adapter.startOfDay(event.end), adapter.startOfDay(event.start), 'days') + 1,
  );
}

export function expandRecurringEventForVisibleDays(
  event: CalendarEvent,
  days: SchedulerValidDate[],
  adapter: Adapter,
): CalendarEvent[] {
  const rule = event.recurrenceRule!;
  const instances: CalendarEvent[] = [];

  const endGuard = buildEndGuard(rule, event.start, adapter);
  const durationMinutes = diffIn(adapter, event.end, event.start, 'minutes');

  const rangeStart = days[0];
  const rangeEnd = days[days.length - 1];

  const allDaySpanDays = getAllDaySpanDays(adapter, event);

  const scanStart = adapter.addDays(rangeStart, -(allDaySpanDays - 1));

  for (
    let day = adapter.startOfDay(scanStart);
    !adapter.isAfter(day, rangeEnd);
    day = adapter.addDays(day, 1)
  ) {
    // The series is still active on that day
    if (!endGuard(day)) {
      continue;
    }
    // the pattern matches on that day
    if (!matchesRecurrence(rule, day, adapter, event)) {
      continue;
    }

    const occurrenceStart = event.allDay
      ? adapter.startOfDay(day)
      : mergeDateAndTime(adapter, day, event.start);

    const occurrenceEnd = event.allDay
      ? adapter.endOfDay(adapter.addDays(occurrenceStart, allDaySpanDays - 1))
      : adapter.addMinutes(occurrenceStart, durationMinutes);

    const occurrenceId = `${event.id}::${adapter.format(occurrenceStart, 'keyboardDate')}`;

    instances.push({
      ...event,
      id: occurrenceId,
      start: occurrenceStart,
      end: occurrenceEnd,
    });
  }

  return instances;
}

function buildEndGuard(
  rule: RecurrenceRule,
  seriesStart: SchedulerValidDate,
  adapter: Adapter,
): (date: SchedulerValidDate) => boolean {
  if (!rule?.end) {
    return () => true;
  }

  switch (rule.end.type) {
    case 'never':
      return () => true;

    case 'until': {
      const untilEndOfDay = adapter.endOfDay(rule.end.date);
      return (date) => !adapter.isAfter(adapter.startOfDay(date), untilEndOfDay);
    }

    case 'after': {
      return (date) => {
        const occurrencesSoFar = estimateOccurrencesUpTo(adapter, rule, seriesStart, date);
        const ruleEnd = rule.end as { type: 'after'; count: number };
        return occurrencesSoFar < ruleEnd.count;
      };
    }
    default: {
      throw new Error(
        [
          `Unhandled end type: ${JSON.stringify(rule.end)}`,
          'Please ensure the recurrence "end" matches the documented variants: "never", "until", or "after".',
        ].join('\n'),
      );
    }
  }
}

// Checks if the date matches the recurrence pattern, only looking forward (not before seriesStart)
function matchesRecurrence(
  rule: RecurrenceRule,
  date: SchedulerValidDate,
  adapter: Adapter,
  event: CalendarEvent,
): boolean {
  switch (rule.frequency) {
    case 'daily': {
      if (adapter.isBefore(adapter.startOfDay(date), adapter.startOfDay(event.start))) {
        return false;
      }
      const daysDiff = diffIn(
        adapter,
        adapter.startOfDay(date),
        adapter.startOfDay(event.start),
        'days',
      );
      return daysDiff % Math.max(1, rule.interval || 1) === 0;
    }

    case 'weekly': {
      if (adapter.isBefore(adapter.startOfWeek(date), adapter.startOfWeek(event.start))) {
        return false;
      }

      const dow = adapter.getDayOfWeek(date);
      const defaultSeriesDow = adapter.getDayOfWeek(event.start);
      const days = rule.daysOfWeek?.length ? rule.daysOfWeek : [defaultSeriesDow];

      if (!days.includes(dow)) {
        return false;
      }

      const weeksDiff = diffIn(
        adapter,
        adapter.startOfWeek(date),
        adapter.startOfWeek(event.start),
        'weeks',
      );
      return weeksDiff % Math.max(1, rule.interval || 1) === 0;
    }

    case 'monthly': {
      if (!rule.monthly) {
        return false;
      }

      if (!rule.monthly.mode) {
        return false;
      }

      if (adapter.isBefore(adapter.startOfMonth(date), adapter.startOfMonth(event.start))) {
        return false;
      }

      const interval = Math.max(1, rule.interval || 1);
      const monthsDiff = diffIn(
        adapter,
        adapter.startOfMonth(date),
        adapter.startOfMonth(event.start),
        'months',
      );
      if (monthsDiff % interval !== 0) {
        return false;
      }

      switch (rule.monthly.mode) {
        case 'onDate': {
          if (adapter.getDate(date) !== rule.monthly.day) {
            return false;
          }
          return true;
        }
        case 'onWeekday': {
          // TODO: Issue #19128 - Implement support for 'onWeekday' mode.
          return false;
        }
        case 'onLastWeekday': {
          // TODO: Issue #19128 - Implement support for 'onLastWeekday' mode.
          return false;
        }
        default: {
          throw new Error(
            [
              `Unknown monthly mode: ${(rule.monthly as any).mode}`,
              'Expected: "onDate" | "onWeekday" | "onLastWeekday".',
            ].join('\n'),
          );
        }
      }
    }

    case 'yearly': {
      if (adapter.isBefore(adapter.startOfYear(date), adapter.startOfYear(event.start))) {
        return false;
      }
      const sameMD =
        adapter.getDate(date) === adapter.getDate(event.start) &&
        adapter.getMonth(date) === adapter.getMonth(event.start);
      if (!sameMD) {
        return false;
      }
      const yearsDiff = diffIn(
        adapter,
        adapter.startOfYear(date),
        adapter.startOfYear(event.start),
        'years',
      );
      return yearsDiff % Math.max(1, rule.interval || 1) === 0;
    }

    default:
      return false;
  }
}

function estimateOccurrencesUpTo(
  adapter: Adapter,
  rule: RecurrenceRule,
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  if (adapter.isBefore(adapter.startOfDay(date), adapter.startOfDay(seriesStart))) {
    return 0;
  }

  const interval = Math.max(1, rule.interval);

  switch (rule.frequency) {
    case 'daily': {
      const totalDays = diffIn(
        adapter,
        adapter.startOfDay(date),
        adapter.startOfDay(seriesStart),
        'days',
      );
      return Math.floor(totalDays / interval) + 1;
    }
    case 'weekly': {
      return countWeeklyOccurrencesUpToExact(adapter, rule, seriesStart, date);
    }
    case 'monthly': {
      const totalMonths = diffIn(
        adapter,
        adapter.startOfMonth(date),
        adapter.startOfMonth(seriesStart),
        'months',
      );
      return Math.floor(totalMonths / interval) + 1;
    }
    case 'yearly': {
      const totalYears = diffIn(
        adapter,
        adapter.startOfYear(date),
        adapter.startOfYear(seriesStart),
        'years',
      );
      return Math.floor(totalYears / interval) + 1;
    }
    default:
      return 0;
  }
}

// Counts exact WEEKLY occurrences up to `date` (inclusive) respecting interval and daysOfWeek
export function countWeeklyOccurrencesUpToExact(
  adapter: Adapter,
  rule: { interval: number; daysOfWeek?: number[] },
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  const startDay = adapter.startOfDay(seriesStart);
  const targetDay = adapter.startOfDay(date);
  if (adapter.isBefore(targetDay, startDay)) {
    return 0;
  }

  const defaultSeriesDow = adapter.getDayOfWeek(seriesStart);
  const days = rule.daysOfWeek?.length ? rule.daysOfWeek : [defaultSeriesDow];

  const interval = Math.max(1, rule.interval || 1);
  const w0 = adapter.startOfWeek(seriesStart);
  const wD = adapter.startOfWeek(targetDay);

  let count = 0;

  // Iterate only through valid weeks: w = w0 + k * interval
  for (let k = 0; ; k += interval) {
    const weekStart = adapter.addWeeks(w0, k);
    if (adapter.isAfter(weekStart, wD)) {
      break;
    }

    const weekStartDow = adapter.getDayOfWeek(weekStart);

    for (const dowRule of days) {
      const delta = (((dowRule - weekStartDow) % 7) + 7) % 7;
      const occDay = adapter.startOfDay(adapter.addDays(weekStart, delta));

      if (adapter.isBefore(occDay, startDay)) {
        continue;
      }
      if (adapter.isAfter(occDay, targetDay)) {
        continue;
      }

      count += 1;
    }
  }

  return count;
}
