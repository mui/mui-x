import {
  addDays,
  addMinutes,
  createDate,
  DEFAULT_EVENT_CALENDAR_STATE,
  endOfDay,
  EventBuilder,
  processDay,
  setSystemTimezone,
  startOfDay,
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

    it('should render a placeholder from a previous row when it ends before it starts', () => {
      const reversedState: EventCalendarState = {
        ...state,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: Date.UTC(2024, 0, 17, 18),
          end: Date.UTC(2024, 0, 8, 9),
          resourceId: null,
        },
      };
      const firstDay = processDay(new Date(rowStart), 'UTC');
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(
          reversedState,
          firstDay,
          rowStart,
        ),
      ).to.equal(reversedState.occurrencePlaceholder);
    });

    it('should not render a placeholder from a previous row on the other days of the row', () => {
      // Its last day, which only its end falls on.
      const lastDay = processDay(new Date(Date.UTC(2024, 0, 17)), 'UTC');
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(state, lastDay, rowStart),
      ).to.equal(null);
    });

    it('should not render a placeholder on the first day of a row that starts before it', () => {
      // The first row starts on Sunday, January 7th, before the placeholder started.
      const previousRowStart = Date.UTC(2024, 0, 7);
      const firstDay = processDay(new Date(previousRowStart), 'UTC');
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(
          state,
          firstDay,
          previousRowStart,
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
    const day = createDate('2024-01-15');
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    it('should return the placeholder when it crosses into the range from the previous day', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: createDate('2024-01-14T22:00:00').getTime(),
          end: createDate('2024-01-15T06:00:00').getTime(),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(
          state,
          dayStart.getTime(),
          dayEnd.getTime(),
        ),
      ).to.equal(state.occurrencePlaceholder);
    });

    it('should return null when the placeholder ends exactly at the start of the range', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: createDate('2024-01-14T16:00:00').getTime(),
          end: dayStart.getTime(),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(
          state,
          dayStart.getTime(),
          dayEnd.getTime(),
        ),
      ).to.equal(null);
    });

    it('should return null when the placeholder starts exactly at the end of the range', () => {
      const rangeStart = createDate('2024-01-15T08:00:00');
      const rangeEnd = createDate('2024-01-15T20:00:00');
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: rangeEnd.getTime(),
          end: createDate('2024-01-16T04:00:00').getTime(),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange(
          state,
          rangeStart.getTime(),
          rangeEnd.getTime(),
        ),
      ).to.equal(null);
    });
  });

  describe('isCreatingInDayCell', () => {
    const day = createDate('2024-01-15');
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
          start: startOfDay(day).getTime(),
          end: endOfDay(day).getTime(),
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
          start: startOfDay(day).getTime(),
          end: endOfDay(day).getTime(),
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
          start: startOfDay(day).getTime(),
          end: endOfDay(day).getTime(),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, processedDay),
      ).to.equal(true);
    });

    it('should return false when day does not match placeholder.start day', () => {
      // The placeholder starts the day before and ends on the day.
      const previousDay = addDays(day, -1);
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: startOfDay(previousDay).getTime(),
          end: endOfDay(day).getTime(),
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
    const day = createDate('2024-01-15');
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const plainDate = processDay(day).plainDate;

    it('should return false when there is no placeholder', () => {
      const state = DEFAULT_EVENT_CALENDAR_STATE;
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          dayStart.getTime(),
          dayEnd.getTime(),
        ),
      ).to.equal(false);
    });

    it('should return false when surfaceType is not "time-grid"', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: createDate('2024-01-15T10:00:00').getTime(),
          end: createDate('2024-01-15T11:00:00').getTime(),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          dayStart.getTime(),
          dayEnd.getTime(),
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
          start: startOfDay(day).getTime(),
          end: endOfDay(day).getTime(),
          resourceId: null,
          sourceResourceId: null,
          originalOccurrence: EventBuilder.new().id('event-id').toOccurrence(),
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          dayStart.getTime(),
          dayEnd.getTime(),
        ),
      ).to.equal(false);
    });

    it('should return false when the placeholder overlaps the range but starts the previous day', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: createDate('2024-01-14T22:00:00').getTime(),
          end: createDate('2024-01-15T06:00:00').getTime(),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          dayStart.getTime(),
          dayEnd.getTime(),
        ),
      ).to.equal(false);
    });

    it('should return true when placeholder overlaps [dayStart, dayEnd] strictly (start < dayEnd && end > dayStart)', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: createDate('2024-01-15T10:00:00').getTime(), // < dayEnd
          end: createDate('2024-01-15T11:00:00').getTime(), // > dayStart
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          dayStart.getTime(),
          dayEnd.getTime(),
        ),
      ).to.equal(true);
    });

    it('should return false when start == dayEnd', () => {
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: dayEnd.getTime(), // start < dayEnd is false
          end: addMinutes(dayEnd, 30).getTime(),
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          dayStart.getTime(),
          dayEnd.getTime(),
        ),
      ).to.equal(false);
    });

    it('should return false when end == dayStart', () => {
      // A time grid that starts at 08:00 passes it as the start of the range, so a placeholder of
      // the same day can end exactly where the range starts.
      const windowStart = createDate('2024-01-15T08:00:00');
      const state: EventCalendarState = {
        ...DEFAULT_EVENT_CALENDAR_STATE,
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: createDate('2024-01-15T07:00:00').getTime(),
          end: windowStart.getTime(), // end > dayStart is false
          resourceId: null,
        },
      };
      expect(
        eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange(
          state,
          plainDate,
          windowStart.getTime(),
          dayEnd.getTime(),
        ),
      ).to.equal(false);
    });
  });
});
