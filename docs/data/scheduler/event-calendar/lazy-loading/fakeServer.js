/**
 * Fake server for the BasicDataSource demo.
 *
 * Uses `Chance(42)` to generate a deterministic dataset of scheduler events
 * (both recurring and one-time) and exposes a `getEvents` function that
 * filters them by date range — mimicking what a real backend would do.
 */
import { Chance } from 'chance';
import { format } from 'date-fns/format';
import { addDays } from 'date-fns/addDays';
import { addWeeks } from 'date-fns/addWeeks';
import { addMonths } from 'date-fns/addMonths';
import { addYears } from 'date-fns/addYears';

import {
  resources as agendaResources,
  defaultVisibleDate,
} from '../../datasets/personal-agenda';

export { defaultVisibleDate };

// ---------------------------------------------------------------------------
// Seeded random helpers
// ---------------------------------------------------------------------------

const chance = new Chance(42);

function randomInt(min, max) {
  return chance.integer({ min, max });
}

function pick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function randomBool(likelihood) {
  return chance.bool({ likelihood });
}

/** Wall-time ISO string (no trailing Z). */
const str = (date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export const resources = agendaResources.map((r) => ({
  id: r.id,
  title: r.title,
  eventColor: r.eventColor,
}));

// ---------------------------------------------------------------------------
// Recurring events (hand-crafted templates with Chance-generated names)
// ---------------------------------------------------------------------------

const oneOnOneName = chance.name();
const birthdayName = chance.name();

const RECURRING_EVENTS = [
  {
    id: 'rec-standup',
    title: 'Daily Standup',
    start: '2025-01-06T09:00:00',
    end: '2025-01-06T09:30:00',
    resource: 'work',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
  },
  {
    id: 'rec-1on1',
    title: `1-on-1 with ${oneOnOneName}`,
    start: '2025-01-08T10:00:00',
    end: '2025-01-08T10:45:00',
    resource: 'work',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['WE'] },
  },
  {
    id: 'rec-morning-run',
    title: 'Morning Run',
    start: '2025-01-06T07:00:00',
    end: '2025-01-06T07:45:00',
    resource: 'workout',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'WE', 'FR'] },
  },
  {
    id: 'rec-book-club',
    title: 'Book Club',
    start: '2025-01-04T15:00:00',
    end: '2025-01-04T17:00:00',
    resource: 'personal',
    rrule: { freq: 'MONTHLY', byDay: ['1SA'], count: 12 },
  },
  {
    id: 'rec-birthday',
    title: `${birthdayName}'s Birthday`,
    start: '2025-03-14T00:00:00',
    end: '2025-03-14T01:00:00',
    resource: 'birthdays',
    allDay: true,
    readOnly: true,
    rrule: { freq: 'YEARLY' },
  },
];

// ---------------------------------------------------------------------------
// One-time events (generated with Chance)
// ---------------------------------------------------------------------------

const TITLE_TEMPLATES = [
  { weight: 3, gen: () => 'Code Review', resource: 'work' },
  { weight: 2, gen: () => 'Design Review', resource: 'work' },
  { weight: 3, gen: () => 'Client Call', resource: 'work' },
  { weight: 2, gen: () => 'Planning Session', resource: 'work' },
  { weight: 1, gen: () => 'Architecture Discussion', resource: 'work' },
  { weight: 1, gen: () => 'Demo Day', resource: 'work' },
  { weight: 2, gen: () => `Coffee with ${chance.name()}`, resource: 'personal' },
  { weight: 2, gen: () => `Dinner with ${chance.name()}`, resource: 'personal' },
  { weight: 1, gen: () => 'Shopping', resource: 'personal' },
  { weight: 1, gen: () => 'Haircut', resource: 'personal' },
  { weight: 1, gen: () => 'Dentist Appointment', resource: 'medical' },
  { weight: 1, gen: () => 'Doctor Checkup', resource: 'medical' },
];

const WEIGHTED_TEMPLATES = TITLE_TEMPLATES.flatMap((t) =>
  Array.from({ length: t.weight }, () => t),
);

const DURATIONS_MINUTES = [30, 45, 60, 90, 120, 180];

function generateOneTimeEvents() {
  const rangeStart = new Date('2025-01-01T00:00:00');
  const rangeDays = 547; // ~18 months
  const count = 80;
  const events = [];

  for (let i = 0; i < count; i += 1) {
    const dayOffset = randomInt(0, rangeDays - 1);
    const eventDate = addDays(rangeStart, dayOffset);

    const template = pick(WEIGHTED_TEMPLATES);
    const allDay = randomBool(12);
    const readOnly = randomBool(10);

    let startStr;
    let endStr;

    if (allDay) {
      const allDayStart = new Date(eventDate);
      allDayStart.setHours(0, 0, 0, 0);
      const spanDays = randomBool(30) ? randomInt(2, 4) : 1;
      const allDayEnd = addDays(allDayStart, spanDays);
      startStr = str(allDayStart);
      endStr = str(allDayEnd);
    } else {
      const hour = randomInt(8, 19);
      const minute = pick([0, 15, 30, 45]);
      eventDate.setHours(hour, minute, 0, 0);

      const durationMinutes = pick(DURATIONS_MINUTES);
      const endDate = new Date(eventDate.getTime() + durationMinutes * 60_000);

      startStr = str(eventDate);
      endStr = str(endDate);
    }

    events.push({
      id: `evt-${i}`,
      title: template.gen(),
      start: startStr,
      end: endStr,
      resource: template.resource,
      allDay,
      readOnly,
    });
  }

  return events;
}

// ---------------------------------------------------------------------------
// Complete dataset
// ---------------------------------------------------------------------------

const ALL_EVENTS = [...RECURRING_EVENTS, ...generateOneTimeEvents()];

// ---------------------------------------------------------------------------
// Range filtering (fake server logic)
// ---------------------------------------------------------------------------

/**
 * Estimate the end date of the last occurrence of a bounded recurring event.
 * Returns `null` for unbounded recurrences or string-format rrules.
 *
 * The estimate is deliberately coarse — it is better to return an event that
 * turns out to be outside the visible range than to accidentally hide one.
 */
function estimateRecurrenceEnd(event) {
  if (typeof event.rrule === 'string' || !event.rrule) {
    return null;
  }

  const { rrule } = event;
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const eventDuration = eventEnd.getTime() - eventStart.getTime();

  if (rrule.until) {
    return new Date(new Date(rrule.until).getTime() + eventDuration);
  }

  if (rrule.count) {
    const interval = rrule.interval ?? 1;
    const totalIntervals = (rrule.count - 1) * interval;

    let lastOccurrenceStart;
    switch (rrule.freq) {
      case 'DAILY':
        lastOccurrenceStart = addDays(eventStart, totalIntervals);
        break;
      case 'WEEKLY':
        lastOccurrenceStart = addWeeks(eventStart, totalIntervals);
        break;
      case 'MONTHLY':
        lastOccurrenceStart = addMonths(eventStart, totalIntervals);
        break;
      case 'YEARLY':
        lastOccurrenceStart = addYears(eventStart, totalIntervals);
        break;
      default:
        return null;
    }
    return new Date(lastOccurrenceStart.getTime() + eventDuration);
  }

  return null;
}

/**
 * Return all events whose occurrences may overlap `[rangeStart, rangeEnd)`.
 *
 * - Non-recurring: included if `eventEnd > rangeStart && eventStart < rangeEnd`.
 * - Recurring: included if the first occurrence starts before `rangeEnd` and
 *   the (estimated) last occurrence has not ended before `rangeStart`.
 */
function getEventsInRange(rangeStart, rangeEnd) {
  return ALL_EVENTS.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    if (!event.rrule) {
      return eventEnd > rangeStart && eventStart < rangeEnd;
    }

    // Recurring: first occurrence must start before the range ends
    if (eventStart >= rangeEnd) {
      return false;
    }

    // If bounded, check whether all occurrences have already ended
    const estimatedEnd = estimateRecurrenceEnd(event);
    if (estimatedEnd !== null && estimatedEnd < rangeStart) {
      return false;
    }

    return true;
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getEvents(start, end) {
  const events = getEventsInRange(start, end);
  return new Promise((resolve) => {
    setTimeout(() => resolve(events), 500);
  });
}

export async function updateEvents(_params) {
  return { success: true };
}
