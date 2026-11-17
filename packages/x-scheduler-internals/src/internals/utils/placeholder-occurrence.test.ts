import { describe, it, expect } from 'vitest';
import { EventBuilder } from 'test/utils/scheduler';
import type {
  EventSurfaceType,
  SchedulerOccurrencePlaceholder,
  SchedulerProcessedEvent,
} from '../../models';
import { getPlaceholderOccurrence } from './placeholder-occurrence';

const TIMEZONE = 'America/New_York';
// July 3rd, 2025, from 09:00 to 10:30 in New York.
const START = Date.parse('2025-07-03T13:00:00Z');
const END = Date.parse('2025-07-03T14:30:00Z');

function createPlaceholder(
  surfaceType: EventSurfaceType,
  type: SchedulerOccurrencePlaceholder['type'],
  overrides: Partial<SchedulerOccurrencePlaceholder> = {},
): SchedulerOccurrencePlaceholder {
  const base = { surfaceType, start: START, end: END, resourceId: 'room-b' };
  if (type === 'creation') {
    return { ...base, type, ...overrides } as SchedulerOccurrencePlaceholder;
  }
  if (type === 'external-drag') {
    return {
      ...base,
      type,
      eventData: { title: 'Dropped', allDay: true },
      ...overrides,
    } as SchedulerOccurrencePlaceholder;
  }
  return {
    ...base,
    type,
    eventId: 'meeting',
    occurrenceKey: 'meeting-key',
    originalOccurrence: {} as any,
    sourceResourceId: 'room-a',
    ...overrides,
  } as SchedulerOccurrencePlaceholder;
}

function createOriginalEvent(allDay: boolean): SchedulerProcessedEvent {
  return EventBuilder.new()
    .id('meeting')
    .title('Meeting')
    .resource({ id: 'room-a', title: 'Room A' })
    .span('2025-07-01T13:00:00Z', '2025-07-01T14:00:00Z', { allDay })
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
      const occurrence = getPlaceholderOccurrence(
        createPlaceholder('day-grid', 'creation'),
        null,
        TIMEZONE,
      );

      expect(occurrence.allDay).to.equal(true);
      expect(occurrence.title).to.equal('');
      expect(occurrence.id).to.equal('occurrence-placeholder');
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T04:00:00.000Z',
        '2025-07-04T04:00:00.000Z',
      ]);
    });

    it('should read the all-day flag and the title of the dragged event', () => {
      const occurrence = getPlaceholderOccurrence(
        createPlaceholder('day-grid', 'internal-drag'),
        createOriginalEvent(false),
        TIMEZONE,
      );

      expect(occurrence.allDay).to.equal(false);
      expect(occurrence.title).to.equal('Meeting');
      expect(occurrence.id).to.equal('meeting');
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T13:00:00.000Z',
        '2025-07-03T14:30:00.000Z',
      ]);
      expect('resource' in occurrence).to.equal(false);
    });

    it('should read the all-day flag and the title of an external event', () => {
      const occurrence = getPlaceholderOccurrence(
        createPlaceholder('day-grid', 'external-drag'),
        null,
        TIMEZONE,
      );

      expect(occurrence.allDay).to.equal(true);
      expect(occurrence.title).to.equal('Dropped');
      expect(boundsOf(occurrence)[0]).to.equal('2025-07-03T04:00:00.000Z');
    });

    it('should keep the id of the dragged event when the store no longer has it', () => {
      const occurrence = getPlaceholderOccurrence(
        createPlaceholder('day-grid', 'internal-resize'),
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
        createPlaceholder('time-grid', 'internal-drag'),
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
      const occurrence = getPlaceholderOccurrence(
        createPlaceholder('timeline', 'creation'),
        null,
        TIMEZONE,
      );

      expect(occurrence.allDay).to.equal(undefined);
      expect(boundsOf(occurrence)).to.deep.equal([
        '2025-07-03T13:00:00.000Z',
        '2025-07-03T14:30:00.000Z',
      ]);
    });

    it('should span whole days for an all-day event and carry the target resource', () => {
      const occurrence = getPlaceholderOccurrence(
        createPlaceholder('timeline', 'internal-drag'),
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

    it('should fall back to the resource of the dragged event outside of any resource', () => {
      const occurrence = getPlaceholderOccurrence(
        createPlaceholder('timeline', 'internal-drag', { resourceId: null }),
        createOriginalEvent(false),
        TIMEZONE,
      );

      expect(occurrence.resource).to.equal('room-a');
    });
  });
});
