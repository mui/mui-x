import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import {
  adapter,
  DEFAULT_EVENT_CALENDAR_STATE,
  EventBuilder,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { eventCalendarOccurrencePlaceholderSelectors } from './eventCalendarOccurrencePlaceholderSelectors';
import type { EventCalendarState } from '../use-event-calendar';
import { processDate } from '../process-date';
import {
  createAdapterDate,
  createProcessedDate,
} from '../internals/utils/plain-date-utils/adapter';

// A UTC creation placeholder on December 30th, 2011, on a Pacific/Apia system, which skipped that
// date: the adapter's `isSameDay()` counts it as the same day as December 31st.
// The values are built from timestamps, as the adapter also parses the dates of that day wrong.
// Browsers cannot change their timezone through process.env.TZ.
function getStateInUTCOnApiaSystem() {
  setSystemTimezone('Pacific/Apia');
  // A new adapter, as adapters cache data computed in the current system timezone.
  const systemAdapter = new TemporalAdapterDateFns();
  const state: EventCalendarState = {
    ...DEFAULT_EVENT_CALENDAR_STATE,
    adapter: systemAdapter,
    displayTimezone: 'UTC',
    occurrencePlaceholder: {
      type: 'creation',
      surfaceType: 'day-grid',
      start: createAdapterDate(systemAdapter, Date.UTC(2011, 11, 30), 'UTC'),
      end: createAdapterDate(systemAdapter, Date.UTC(2011, 11, 30, 23, 59, 59), 'UTC'),
      resourceId: null,
    },
  };
  const december30 = createProcessedDate(systemAdapter, Date.UTC(2011, 11, 30), 'UTC');
  const december31 = createProcessedDate(systemAdapter, Date.UTC(2011, 11, 31), 'UTC');
  return { state, december30, december31 };
}

describe('eventCalendarOccurrencePlaceholderSelectors', () => {
  describe('placeholderInDayCell', () => {
    it.skipIf(!isJSDOM)(
      'should only match the day of the placeholder on a system that skips a date',
      () => {
        const { state, december30, december31 } = getStateInUTCOnApiaSystem();
        // The row starts before the placeholder, so only its start can match.
        const rowStart = createAdapterDate(state.adapter, Date.UTC(2011, 11, 25), 'UTC');
        expect(
          eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(
            state,
            december30,
            rowStart,
          ),
        ).to.equal(state.occurrencePlaceholder);
        expect(
          eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(
            state,
            december31,
            rowStart,
          ),
        ).to.equal(null);
      },
    );
  });

  describe('placeholderInTimeRange', () => {
    const day = adapter.date('2024-01-15', 'default');
    const dayStart = adapter.startOfDay(day);
    const dayEnd = adapter.endOfDay(day);

    it('should return the placeholder when it crosses into the range from the previous day', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.setHours(adapter.addDays(dayStart, -1), 22),
          end: adapter.setHours(dayStart, 6),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(state, dayStart, dayEnd),
      ).to.equal(state.occurrencePlaceholder);
    });

    it('should return null when the placeholder ends exactly at the start of the range', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.setHours(adapter.addDays(dayStart, -1), 16),
          end: dayStart,
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(state, dayStart, dayEnd),
      ).to.equal(null);
    });

    it('should return null when the placeholder starts exactly at the end of the range', () => {
      const rangeStart = adapter.setHours(dayStart, 8);
      const rangeEnd = adapter.setHours(dayStart, 20);
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: rangeEnd,
          end: adapter.setHours(adapter.addDays(dayStart, 1), 4),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(
          state,
          rangeStart,
          rangeEnd,
        ),
      ).to.equal(null);
    });
  });

  describe('isCreatingInDayCell', () => {
    const day = adapter.date('2024-01-15', 'default');
    const processedDay = processDate(day, adapter);

    it('should return false when there is no placeholder', () => {
      const state = DEFAULT_EVENT_CALENDAR_STATE;
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, processedDay),
      ).to.equal(false);
    });

    it('should return false when surfaceType is not "day-grid"', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.startOfDay(day),
          end: adapter.endOfDay(day),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, processedDay),
      ).to.equal(false);
    });

    it('should return false when the placeholder type is not "creation"', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'internal-drag',
          eventId: 'event-id',
          occurrenceKey: 'event-id-key',
          surfaceType: 'day-grid',
          start: adapter.startOfDay(day),
          end: adapter.endOfDay(day),
          resourceId: null,
          sourceResourceId: null,
          originalOccurrence: EventBuilder.new().id('event-id').toOccurrence(),
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, processedDay),
      ).to.equal(false);
    });

    it('should return true when creating on the same day', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: adapter.startOfDay(day),
          end: adapter.endOfDay(day),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, processedDay),
      ).to.equal(true);
    });

    it('should return false when day does not match placeholder.start day', () => {
      const otherDay = adapter.addDays(day, 1);
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: adapter.startOfDay(otherDay),
          end: adapter.endOfDay(otherDay),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, processedDay),
      ).to.equal(false);
    });

    it.skipIf(!isJSDOM)(
      'should only match the day of the placeholder on a system that skips a date',
      () => {
        const { state, december30, december31 } = getStateInUTCOnApiaSystem();
        expect(
          eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, december30),
        ).to.equal(true);
        expect(
          eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, december31),
        ).to.equal(false);
      },
    );
  });

  describe('isCreatingInTimeRange', () => {
    const day = adapter.date('2024-01-15', 'default');
    const dayStart = adapter.startOfDay(day);
    const dayEnd = adapter.endOfDay(day);

    it('should return false when there is no placeholder', () => {
      const state = DEFAULT_EVENT_CALENDAR_STATE;
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(state, dayStart, dayEnd),
      ).to.equal(false);
    });

    it('should return false when surfaceType is not "time-grid"', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: adapter.setHours(dayStart, 10),
          end: adapter.setHours(dayStart, 11),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(state, dayStart, dayEnd),
      ).to.equal(false);
    });

    it('should return false when the type is not "creating"', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'internal-drag',
          eventId: 'event-id',
          occurrenceKey: 'event-id-key',
          surfaceType: 'time-grid',
          start: adapter.startOfDay(day),
          end: adapter.endOfDay(day),
          resourceId: null,
          sourceResourceId: null,
          originalOccurrence: EventBuilder.new().id('event-id').toOccurrence(),
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(state, dayStart, dayEnd),
      ).to.equal(false);
    });

    it('should return false when placeholder.start is not the same day as dayStart', () => {
      const nextDay = adapter.addDays(day, 1);
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.setHours(adapter.startOfDay(nextDay), 9),
          end: adapter.setHours(adapter.startOfDay(nextDay), 10),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(state, dayStart, dayEnd),
      ).to.equal(false);
    });

    it('should return true when placeholder overlaps [dayStart, dayEnd] strictly (start < dayEnd && end > dayStart)', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.setHours(dayStart, 10), // < dayEnd
          end: adapter.setHours(dayStart, 11), // > dayStart
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(state, dayStart, dayEnd),
      ).to.equal(true);
    });

    it('should return false when start == dayEnd', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: dayEnd, // start < dayEnd is false
          end: adapter.addMinutes(dayEnd, 30),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(state, dayStart, dayEnd),
      ).to.equal(false);
    });

    it('should return false when end == dayStart', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.addMinutes(dayStart, -60),
          end: dayStart, // end > dayStart is false
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(state, dayStart, dayEnd),
      ).to.equal(false);
    });
  });
});
