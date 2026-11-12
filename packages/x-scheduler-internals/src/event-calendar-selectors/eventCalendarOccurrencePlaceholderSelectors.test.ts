import {
  adapter,
  DEFAULT_EVENT_CALENDAR_STATE,
  EventBuilder,
  processDay,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { eventCalendarOccurrencePlaceholderSelectors } from './eventCalendarOccurrencePlaceholderSelectors';
import type { EventCalendarState } from '../use-event-calendar';

// A UTC creation placeholder on December 30th, 2011, on a Pacific/Apia system, which skipped that
// date: read in the timezone of the system, it falls on December 31st.
// Browsers cannot change their timezone through process.env.TZ.
function getStateInUTCOnApiaSystem() {
  setSystemTimezone('Pacific/Apia');
  const state: EventCalendarState = {
    ...DEFAULT_EVENT_CALENDAR_STATE,
    displayTimezone: 'UTC',
    occurrencePlaceholder: {
      type: 'creation',
      surfaceType: 'day-grid',
      start: Date.UTC(2011, 11, 30),
      end: Date.UTC(2011, 11, 30, 23, 59, 59),
      resourceId: null,
    },
  };
  const december30 = processDay(new Date(Date.UTC(2011, 11, 30)), 'UTC');
  const december31 = processDay(new Date(Date.UTC(2011, 11, 31)), 'UTC');
  return { state, december30, december31 };
}

describe('eventCalendarOccurrencePlaceholderSelectors', () => {
  describe('placeholderInDayCell', () => {
    it.skipIf(!isJSDOM)(
      'should only match the day of the placeholder on a system that skips a date',
      () => {
        const { state, december30, december31 } = getStateInUTCOnApiaSystem();
        // The row starts before the placeholder, so only its start can match.
        const rowStart = Date.UTC(2011, 11, 25);
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

    // A placeholder from Monday, January 8th to Wednesday, January 17th, 2024, across two rows.
    const state: EventCalendarState = {
      ...DEFAULT_EVENT_CALENDAR_STATE,
      displayTimezone: 'UTC',
      occurrencePlaceholder: {
        type: 'creation',
        surfaceType: 'day-grid',
        start: Date.UTC(2024, 0, 8, 9),
        end: Date.UTC(2024, 0, 17, 18),
        resourceId: null,
      },
    };
    // The second row starts on Sunday, January 14th.
    const rowStart = Date.UTC(2024, 0, 14);

    it('should render a placeholder from a previous row on the first day of the row', () => {
      const firstDay = processDay(new Date(rowStart), 'UTC');
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(state, firstDay, rowStart),
      ).to.equal(state.occurrencePlaceholder);
    });

    it('should not render a placeholder from a previous row on the other days of the row', () => {
      const secondDay = processDay(new Date(Date.UTC(2024, 0, 15)), 'UTC');
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(
          state,
          secondDay,
          rowStart,
        ),
      ).to.equal(null);
    });

    it('should not render a placeholder on the first day of a row that starts after it', () => {
      // The third row starts on Sunday, January 21st, after the placeholder ended.
      const nextRowStart = Date.UTC(2024, 0, 21);
      const firstDay = processDay(new Date(nextRowStart), 'UTC');
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(
          state,
          firstDay,
          nextRowStart,
        ),
      ).to.equal(null);
    });
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
          start: adapter.getTime(adapter.setHours(adapter.addDays(dayStart, -1), 22)),
          end: adapter.getTime(adapter.setHours(dayStart, 6)),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(
          state,
          adapter.getTime(dayStart),
          adapter.getTime(dayEnd),
        ),
      ).to.equal(state.occurrencePlaceholder);
    });

    it('should return null when the placeholder ends exactly at the start of the range', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.getTime(adapter.setHours(adapter.addDays(dayStart, -1), 16)),
          end: adapter.getTime(dayStart),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(
          state,
          adapter.getTime(dayStart),
          adapter.getTime(dayEnd),
        ),
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
          start: adapter.getTime(rangeEnd),
          end: adapter.getTime(adapter.setHours(adapter.addDays(dayStart, 1), 4)),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(
          state,
          adapter.getTime(rangeStart),
          adapter.getTime(rangeEnd),
        ),
      ).to.equal(null);
    });
  });

  describe('isCreatingInDayCell', () => {
    const day = adapter.date('2024-01-15', 'default');
    const processedDay = processDay(day);

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
          start: adapter.getTime(adapter.startOfDay(day)),
          end: adapter.getTime(adapter.endOfDay(day)),
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
          start: adapter.getTime(adapter.startOfDay(day)),
          end: adapter.getTime(adapter.endOfDay(day)),
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
          start: adapter.getTime(adapter.startOfDay(day)),
          end: adapter.getTime(adapter.endOfDay(day)),
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
          start: adapter.getTime(adapter.startOfDay(otherDay)),
          end: adapter.getTime(adapter.endOfDay(otherDay)),
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
    const plainDate = processDay(day).plainDate;

    it('should return false when there is no placeholder', () => {
      const state = DEFAULT_EVENT_CALENDAR_STATE;
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          adapter.getTime(dayStart),
          adapter.getTime(dayEnd),
        ),
      ).to.equal(false);
    });

    it('should return false when surfaceType is not "time-grid"', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: adapter.getTime(adapter.setHours(dayStart, 10)),
          end: adapter.getTime(adapter.setHours(dayStart, 11)),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          adapter.getTime(dayStart),
          adapter.getTime(dayEnd),
        ),
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
          start: adapter.getTime(adapter.startOfDay(day)),
          end: adapter.getTime(adapter.endOfDay(day)),
          resourceId: null,
          sourceResourceId: null,
          originalOccurrence: EventBuilder.new().id('event-id').toOccurrence(),
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          adapter.getTime(dayStart),
          adapter.getTime(dayEnd),
        ),
      ).to.equal(false);
    });

    it('should return false when the placeholder overlaps the range but starts the previous day', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.getTime(adapter.setHours(adapter.addDays(dayStart, -1), 22)),
          end: adapter.getTime(adapter.setHours(dayStart, 6)),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          adapter.getTime(dayStart),
          adapter.getTime(dayEnd),
        ),
      ).to.equal(false);
    });

    it('should return true when placeholder overlaps [dayStart, dayEnd] strictly (start < dayEnd && end > dayStart)', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.getTime(adapter.setHours(dayStart, 10)), // < dayEnd
          end: adapter.getTime(adapter.setHours(dayStart, 11)), // > dayStart
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          adapter.getTime(dayStart),
          adapter.getTime(dayEnd),
        ),
      ).to.equal(true);
    });

    it('should return false when start == dayEnd', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.getTime(dayEnd), // start < dayEnd is false
          end: adapter.getTime(adapter.addMinutes(dayEnd, 30)),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          adapter.getTime(dayStart),
          adapter.getTime(dayEnd),
        ),
      ).to.equal(false);
    });

    it('should return false when end == dayStart', () => {
      // A time grid that starts at 08:00 passes it as the start of the range, so a placeholder of
      // the same day can end exactly where the range starts.
      const windowStart = adapter.setHours(dayStart, 8);
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.getTime(adapter.setHours(dayStart, 7)),
          end: adapter.getTime(windowStart), // end > dayStart is false
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          adapter.getTime(windowStart),
          adapter.getTime(dayEnd),
        ),
      ).to.equal(false);
    });
  });
});
