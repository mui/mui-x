import { adapter, DEFAULT_EVENT_CALENDAR_STATE, EventBuilder } from 'test/utils/scheduler';
import { eventCalendarOccurrencePlaceholderSelectors } from './eventCalendarOccurrencePlaceholderSelectors';
import { EventCalendarState } from '../use-event-calendar';

describe('eventCalendarOccurrencePlaceholderSelectors', () => {
  describe('placeholderInDayCell', () => {
    // TODO
  });

  describe('placeholderInTimeRange', () => {
    // TODO
  });

  describe('isCreatingInDayCell', () => {
    const day = adapter.date('2024-01-15', 'default');

    it('should return false when there is no placeholder', () => {
      const state = DEFAULT_EVENT_CALENDAR_STATE;
      expect(eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, day)).to.equal(
        false,
      );
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
      expect(eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, day)).to.equal(
        false,
      );
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
          originalOccurrence: EventBuilder.new().id('event-id').toOccurrence(),
        },
      };
      expect(eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, day)).to.equal(
        false,
      );
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
      expect(eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, day)).to.equal(
        true,
      );
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
      expect(eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, day)).to.equal(
        false,
      );
    });
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
