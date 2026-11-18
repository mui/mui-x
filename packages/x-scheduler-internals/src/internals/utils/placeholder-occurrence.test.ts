import { describe, it, expect } from 'vitest';
import { EventBuilder } from 'test/utils/scheduler';
import type {
  EventSurfaceType,
  SchedulerOccurrencePlaceholderCreation,
  SchedulerOccurrencePlaceholderExternalDrag,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
  SchedulerProcessedEvent,
} from '../../models';
import { getPlaceholderOccurrence } from './placeholder-occurrence';

const TIMEZONE = 'America/New_York';
// July 3rd, 2025, from 09:00 to 10:30 in New York.
const START = Date.parse('2025-07-03T13:00:00Z');
const END = Date.parse('2025-07-03T14:30:00Z');
// July 3rd, 2025, as a whole day in New York, with an exclusive end.
const DAY_START = Date.parse('2025-07-03T04:00:00Z');
const DAY_END = Date.parse('2025-07-04T04:00:00Z');

/** A creation from July 3rd, 2025, 09:00 to 10:30, on `room-b`. */
function createCreation(surfaceType: EventSurfaceType): SchedulerOccurrencePlaceholderCreation {
  return { type: 'creation', surfaceType, start: START, end: END, resourceId: 'room-b' };
}

/** A timed drag of the `meeting` event to July 3rd, 2025, 09:00 to 10:30, on `room-b`. */
function createInternalDrag(
  surfaceType: EventSurfaceType,
  overrides: Partial<SchedulerOccurrencePlaceholderInternalDragOrResize> = {},
): SchedulerOccurrencePlaceholderInternalDragOrResize {
  return {
    type: 'internal-drag',
    surfaceType,
    start: START,
    end: END,
    resourceId: 'room-b',
    allDay: false,
    eventId: 'meeting',
    occurrenceKey: 'meeting-key',
    originalOccurrence: EventBuilder.new().id('meeting').toOccurrence(),
    sourceResourceId: 'room-a',
    ...overrides,
  };
}

/** A timed external event dropped on July 3rd, 2025, 09:00 to 10:30, on `room-b`. */
function createExternalDrag(
  surfaceType: EventSurfaceType,
  overrides: Partial<SchedulerOccurrencePlaceholderExternalDrag> = {},
): SchedulerOccurrencePlaceholderExternalDrag {
  return {
    type: 'external-drag',
    surfaceType,
    start: START,
    end: END,
    resourceId: 'room-b',
    eventData: { id: 'dropped', title: 'Dropped', allDay: false },
    ...overrides,
  };
}

function createOriginalEvent(allDay: boolean): SchedulerProcessedEvent {
  return EventBuilder.new()
    .id('meeting')
    .title('Meeting')
    .resource({ id: 'room-a', title: 'Room A' })
    .span(
      allDay ? '2025-07-01' : '2025-07-01T13:00:00Z',
      allDay ? '2025-07-02' : '2025-07-01T14:00:00Z',
      { allDay },
    )
    .withDisplayTimezone(TIMEZONE)
    .toProcessed();
}

/** The bounds of an occurrence placeholder, as ISO strings. */
function boundsOf(occurrence: ReturnType<typeof getPlaceholderOccurrence>) {
  return [occurrence.start.timestamp, occurrence.end.timestamp].map((ms) =>
    new Date(ms).toISOString(),
  );
}

describe('getPlaceholderOccurrence', () => {
  describe('day grid', () => {
    it('should render a creation as an all-day placeholder spanning whole days', () => {
      const occurrence = getPlaceholderOccurrence(createCreation('day-grid'), null, TIMEZONE);

      expect(occurrence.allDay).to.equal(true);
      expect(occurrence.title).to.equal('');
      expect(occurrence.id).to.equal('occurrence-placeholder');
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T04:00:00.000Z',
        '2025-07-04T04:00:00.000Z',
      ]);
    });

    it.each([false, true])(
      'should use the destination all-day flag %s and the dragged title',
      (allDay) => {
        const occurrence = getPlaceholderOccurrence(
          createInternalDrag('day-grid', { allDay, start: DAY_START, end: DAY_END }),
          createOriginalEvent(!allDay),
          TIMEZONE,
        );

        expect(occurrence.allDay).to.equal(allDay);
        expect(occurrence.title).to.equal('Meeting');
        expect(occurrence.id).to.equal('meeting');
        expect(boundsOf(occurrence)).to.deep.equal([
          '2025-07-03T04:00:00.000Z',
          '2025-07-04T04:00:00.000Z',
        ]);
        expect('resource' in occurrence).to.equal(false);
      },
    );

    it('should keep the bounds of an external event and read its all-day flag and title', () => {
      const occurrence = getPlaceholderOccurrence(createExternalDrag('day-grid'), null, TIMEZONE);

      expect(occurrence.allDay).to.equal(false);
      expect(occurrence.title).to.equal('Dropped');
      expect(occurrence.id).to.equal('occurrence-placeholder');
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T13:00:00.000Z',
        '2025-07-03T14:30:00.000Z',
      ]);
    });

    it('should keep the id of the resized event when the store no longer has it', () => {
      const occurrence = getPlaceholderOccurrence(
        createInternalDrag('day-grid', { type: 'internal-resize' }),
        null,
        TIMEZONE,
      );

      expect(occurrence.id).to.equal('meeting');
      expect(occurrence.title).to.equal('');
    });
  });

  describe('time grid', () => {
    it('should keep the bounds and leave out the all-day flag', () => {
      const occurrence = getPlaceholderOccurrence(
        createInternalDrag('time-grid'),
        createOriginalEvent(true),
        TIMEZONE,
      );

      expect('allDay' in occurrence).to.equal(false);
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T13:00:00.000Z',
        '2025-07-03T14:30:00.000Z',
      ]);
    });
  });

  describe('timeline', () => {
    it('should not render a creation as all-day', () => {
      const occurrence = getPlaceholderOccurrence(createCreation('timeline'), null, TIMEZONE);

      expect(occurrence.allDay).to.equal(undefined);
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T13:00:00.000Z',
        '2025-07-03T14:30:00.000Z',
      ]);
    });

    it('should keep the all-day flag of the dragged event and carry the target resource', () => {
      const occurrence = getPlaceholderOccurrence(
        createInternalDrag('timeline', { allDay: false, start: DAY_START, end: DAY_END }),
        createOriginalEvent(true),
        TIMEZONE,
      );

      expect(occurrence.allDay).to.equal(true);
      expect(occurrence.resource).to.equal('room-b');
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T04:00:00.000Z',
        '2025-07-04T04:00:00.000Z',
      ]);
    });

    it('should read the all-day flag and the title of an external event and carry the target resource', () => {
      const occurrence = getPlaceholderOccurrence(
        createExternalDrag('timeline', {
          start: DAY_START,
          end: DAY_END,
          eventData: { id: 'dropped', title: 'Dropped', allDay: true },
        }),
        null,
        TIMEZONE,
      );

      expect(occurrence.allDay).to.equal(true);
      expect(occurrence.title).to.equal('Dropped');
      expect(occurrence.id).to.equal('occurrence-placeholder');
      expect(occurrence.resource).to.equal('room-b');
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T04:00:00.000Z',
        '2025-07-04T04:00:00.000Z',
      ]);
    });

    it('should fall back to the resource of the dragged event outside of any resource', () => {
      const occurrence = getPlaceholderOccurrence(
        createInternalDrag('timeline', { resourceId: null }),
        createOriginalEvent(false),
        TIMEZONE,
      );

      expect(occurrence.resource).to.equal('room-a');
    });
  });
});
