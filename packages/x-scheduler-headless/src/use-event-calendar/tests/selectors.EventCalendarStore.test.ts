import { adapter } from 'test/utils/scheduler';
import { selectors } from './../EventCalendarStore.selectors';
import { EventCalendarState as State } from '../EventCalendarStore.types';

describe('EventCalendarStore.selectors', () => {
  const baseState = (overrides: Partial<State> = {}) =>
    ({
      adapter,
      occurrencePlaceholder: null,
      ...overrides,
    }) as State;

  describe('isEventDraggable', () => {
    // TODO
  });

  describe('isEventResizable', () => {
    // TODO
  });
  describe('occurrencePlaceholderToRenderInDayCell', () => {
    // TODO
  });

  describe('occurrencePlaceholderToRenderInTimeRange', () => {
    // TODO
  });

  describe('isCreatingNewEventInDayGridCell', () => {
    const day = adapter.date('2024-01-15');

    it('should return false when there is no placeholder', () => {
      const state = baseState();
      expect(selectors.isCreatingNewEventInDayCell(state, day)).to.equal(false);
    });

    it('should return false when surfaceType is not "day-grid"', () => {
      const state = baseState({
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.startOfDay(day),
          end: adapter.endOfDay(day),
        },
      });
      expect(selectors.isCreatingNewEventInDayCell(state, day)).to.equal(false);
    });

    it('should return false when the placeholder type is not "creation"', () => {
      const state = baseState({
        occurrencePlaceholder: {
          type: 'internal-drag-or-resize',
          eventId: 'event-id',
          occurrenceKey: 'event-id-key',
          surfaceType: 'day-grid',
          start: adapter.startOfDay(day),
          end: adapter.endOfDay(day),
          originalOccurrence: {
            key: 'event-id-key',
            id: 'event-id',
            title: 'Event',
            start: adapter.startOfDay(day),
            end: adapter.endOfDay(day),
          },
        },
      });
      expect(selectors.isCreatingNewEventInDayCell(state, day)).to.equal(false);
    });

    it('should return true when creating on the same day', () => {
      const state = baseState({
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: adapter.startOfDay(day),
          end: adapter.endOfDay(day),
        },
      });
      expect(selectors.isCreatingNewEventInDayCell(state, day)).to.equal(true);
    });

    it('should return false when day does not match placeholder.start day', () => {
      const otherDay = adapter.addDays(day, 1);
      const state = baseState({
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: adapter.startOfDay(otherDay),
          end: adapter.endOfDay(otherDay),
        },
      });
      expect(selectors.isCreatingNewEventInDayCell(state, day)).to.equal(false);
    });
  });

  describe('isCreatingNewEventInTimeRange', () => {
    const day = adapter.date('2024-01-15');
    const dayStart = adapter.startOfDay(day);
    const dayEnd = adapter.endOfDay(day);

    it('should return false when there is no placeholder', () => {
      const state = baseState();
      expect(selectors.isCreatingNewEventInTimeRange(state, dayStart, dayEnd)).to.equal(false);
    });

    it('should return false when surfaceType is not "time-grid"', () => {
      const state = baseState({
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'day-grid',
          start: adapter.setHours(dayStart, 10),
          end: adapter.setHours(dayStart, 11),
        },
      });
      expect(selectors.isCreatingNewEventInTimeRange(state, dayStart, dayEnd)).to.equal(false);
    });

    it('should return false when eventId is not null (editing mode)', () => {
      const state = baseState({
        occurrencePlaceholder: {
          type: 'internal-drag-or-resize',
          eventId: 'event-id',
          occurrenceKey: 'event-id-key',
          surfaceType: 'time-grid',
          start: adapter.startOfDay(day),
          end: adapter.endOfDay(day),
          originalOccurrence: {
            id: 'event-id',
            key: 'event-id-key',
            title: 'Event',
            start: adapter.startOfDay(day),
            end: adapter.endOfDay(day),
          },
        },
      });
      expect(selectors.isCreatingNewEventInTimeRange(state, dayStart, dayEnd)).to.equal(false);
    });

    it('should return false when placeholder.start is not the same day as dayStart', () => {
      const nextDay = adapter.addDays(day, 1);
      const state = baseState({
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.setHours(adapter.startOfDay(nextDay), 9),
          end: adapter.setHours(adapter.startOfDay(nextDay), 10),
        },
      });
      expect(selectors.isCreatingNewEventInTimeRange(state, dayStart, dayEnd)).to.equal(false);
    });

    it('should return true when placeholder overlaps [dayStart, dayEnd] strictly (start < dayEnd && end > dayStart)', () => {
      const state = baseState({
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.setHours(dayStart, 10), // < dayEnd
          end: adapter.setHours(dayStart, 11), // > dayStart
        },
      });
      expect(selectors.isCreatingNewEventInTimeRange(state, dayStart, dayEnd)).to.equal(true);
    });

    it('should return false when start == dayEnd', () => {
      const state = baseState({
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: dayEnd, // start < dayEnd is false
          end: adapter.addMinutes(dayEnd, 30),
        },
      });
      expect(selectors.isCreatingNewEventInTimeRange(state, dayStart, dayEnd)).to.equal(false);
    });

    it('should return false when end == dayStart', () => {
      const state = baseState({
        occurrencePlaceholder: {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.addMinutes(dayStart, -60),
          end: dayStart, // end > dayStart is false
        },
      });
      expect(selectors.isCreatingNewEventInTimeRange(state, dayStart, dayEnd)).to.equal(false);
    });
  });
});
