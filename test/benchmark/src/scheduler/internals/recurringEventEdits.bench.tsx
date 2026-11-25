import { getTimezoneId } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventRecurrenceRule } from '@mui/x-scheduler-internals/models';
import {
  deleteRecurringEvent,
  updateRecurringEvent,
} from '@mui/x-scheduler-internals-premium/internals';
import { createDate } from 'test/utils/scheduler/dates';
import { createOccurrence, EventBuilder } from 'test/utils/scheduler/event-builder';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

const TIMEZONE = 'America/New_York';

// The timezone of the system, as the store holds it: by its identifier.
const DISPLAY_TIMEZONE = getTimezoneId('default');

/**
 * Long series started in January 2024, edited at an occurrence in June 2026.
 */
const SERIES: { rule: SchedulerEventRecurrenceRule; start: string; occurrence: string }[] = [
  {
    rule: { freq: 'DAILY', count: 2000 },
    start: '2024-01-01T09:00:00',
    occurrence: '2026-06-15T09:00:00',
  },
  {
    rule: { freq: 'WEEKLY', byDay: ['MO', 'WE', 'FR'], count: 600 },
    start: '2024-01-01T09:00:00',
    occurrence: '2026-06-15T09:00:00',
  },
  {
    rule: { freq: 'MONTHLY', byMonthDay: [15], until: '2034-12-31T00:00:00' },
    start: '2024-01-15T09:00:00',
    occurrence: '2026-06-15T09:00:00',
  },
  {
    rule: { freq: 'YEARLY', count: 20 },
    start: '2024-02-29T09:00:00',
    occurrence: '2028-02-29T09:00:00',
  },
];

const getCases = lazy(() =>
  SERIES.map(({ rule, start, occurrence }) => ({
    event: EventBuilder.new().withDataTimezone(TIMEZONE).singleDay(start).rrule(rule).toProcessed(),
    occurrenceStart: createDate(occurrence, TIMEZONE),
  })),
);

timeBenchmark('Recurring event edits - update this and following', () => {
  for (const { event, occurrenceStart } of getCases()) {
    updateRecurringEvent(
      event,
      createOccurrence(event, occurrenceStart, DISPLAY_TIMEZONE),
      { id: event.id, title: 'Renamed' },
      'this-and-following',
      DISPLAY_TIMEZONE,
    );
  }
});

timeBenchmark('Recurring event edits - delete only this', () => {
  for (const { event, occurrenceStart } of getCases()) {
    deleteRecurringEvent(
      event,
      createOccurrence(event, occurrenceStart, DISPLAY_TIMEZONE),
      'only-this',
    );
  }
});

timeBenchmark('Recurring event edits - delete this and following', () => {
  for (const { event, occurrenceStart } of getCases()) {
    deleteRecurringEvent(
      event,
      createOccurrence(event, occurrenceStart, DISPLAY_TIMEZONE),
      'this-and-following',
    );
  }
});
