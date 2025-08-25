import { DateTime } from 'luxon';
import { CalendarEventOccurrenceWithPosition } from '@mui/x-scheduler/primitives/models';
import {
  getEventDays,
  getEventRowIndex,
  getEventWithLargestRowIndex,
  isDayWithinRange,
} from './event-utils';
import { getAdapter } from './adapter/getAdapter';

describe('event-utils', () => {
  const adapter = getAdapter();
  const createEvent = (
    id: string,
    start: string,
    end: string,
  ): CalendarEventOccurrenceWithPosition => ({
    id,
    key: id,
    start: adapter.date(start),
    end: adapter.date(end),
    title: `Event ${id}`,
    allDay: true,
  });

  describe('getEventWithLargestRowIndex', () => {
    it('should return the largest row index from events', () => {
      const events: CalendarEventOccurrenceWithPosition[] = [
        {
          id: '1',
          key: '1',
          start: DateTime.fromISO('2025-05-01T09:00:00'),
          end: DateTime.fromISO('2025-05-01T10:00:00'),
          title: 'Meeting',
          allDay: true,
          eventRowIndex: 1,
        },
        {
          id: '2',
          key: '2',
          start: DateTime.fromISO('2025-05-15T14:00:00'),
          end: DateTime.fromISO('2025-05-15T15:00:00'),
          title: 'Doctor Appointment',
          allDay: true,
          eventRowIndex: 3,
        },
        {
          id: '3',
          key: '3',
          start: DateTime.fromISO('2025-05-20T16:00:00'),
          end: DateTime.fromISO('2025-05-20T17:00:00'),
          title: 'Conference Call',
          allDay: true,
          eventRowIndex: 2,
        },
      ];
      const result = getEventWithLargestRowIndex(events);

      expect(result).toBe(3);
    });

    it('should return 0 when events array is empty', () => {
      const events: CalendarEventOccurrenceWithPosition[] = [];

      const result = getEventWithLargestRowIndex(events);

      expect(result).toBe(0);
    });

    it('should return 0 when all events have undefined eventRowIndex', () => {
      const eventsWithUndefinedRowIndex: CalendarEventOccurrenceWithPosition[] = [
        {
          id: '1',
          key: '1',
          start: DateTime.fromISO('2025-05-01T09:00:00'),
          end: DateTime.fromISO('2025-05-01T10:00:00'),
          title: 'Meeting',
          allDay: true,
          eventRowIndex: undefined,
        },
        {
          id: '2',
          key: '2',
          start: DateTime.fromISO('2025-05-15T14:00:00'),
          end: DateTime.fromISO('2025-05-15T15:00:00'),
          title: 'Doctor Appointment',
          allDay: true,
          eventRowIndex: undefined,
        },
      ];

      const result = getEventWithLargestRowIndex(eventsWithUndefinedRowIndex);

      expect(result).toBe(0);
    });

    it('should handle mix of defined and undefined eventRowIndex values', () => {
      const events: CalendarEventOccurrenceWithPosition[] = [
        {
          id: '1',
          key: '1',
          start: DateTime.fromISO('2025-05-01T09:00:00'),
          end: DateTime.fromISO('2025-05-01T10:00:00'),
          title: 'Meeting',
          allDay: true,
          eventRowIndex: undefined,
        },
        {
          id: '2',
          key: '2',
          start: DateTime.fromISO('2025-05-15T14:00:00'),
          end: DateTime.fromISO('2025-05-15T15:00:00'),
          title: 'Doctor Appointment',
          allDay: true,
          eventRowIndex: 2,
        },
        {
          id: '3',
          key: '3',
          start: DateTime.fromISO('2025-05-20T16:00:00'),
          end: DateTime.fromISO('2025-05-20T17:00:00'),
          title: 'Conference Call',
          allDay: true,
          eventRowIndex: undefined,
        },
      ];

      const result = getEventWithLargestRowIndex(events);

      expect(result).toBe(2);
    });
  });

  describe('isDayWithinRange', () => {
    const eventFirstDay = adapter.date('2024-01-15');
    const eventLastDay = adapter.date('2024-01-17');
    it('should return true when day is same as event first day', () => {
      const day = adapter.date('2024-01-15');

      const result = isDayWithinRange(day, eventFirstDay, eventLastDay, adapter);

      expect(result).toBe(true);
    });

    it('should return true when day is same as event last day', () => {
      const day = adapter.date('2024-01-17');

      const result = isDayWithinRange(day, eventFirstDay, eventLastDay, adapter);

      expect(result).toBe(true);
    });

    it('should return true when day is between event first and last day', () => {
      const day = adapter.date('2024-01-16');

      const result = isDayWithinRange(day, eventFirstDay, eventLastDay, adapter);

      expect(result).toBe(true);
    });

    it('should return false when day is before event first day', () => {
      const day = adapter.date('2024-01-14');

      const result = isDayWithinRange(day, eventFirstDay, eventLastDay, adapter);

      expect(result).toBe(false);
    });

    it('should return false when day is after event last day', () => {
      const day = adapter.date('2024-01-18');

      const result = isDayWithinRange(day, eventFirstDay, eventLastDay, adapter);

      expect(result).toBe(false);
    });
  });

  describe('getEventRowIndex', () => {
    const createEventWithPosition = (
      id: string,
      start: string,
      end: string,
      eventRowIndex: number,
    ): CalendarEventOccurrenceWithPosition => ({
      ...createEvent(id, start, end),
      eventRowIndex,
    });

    it('should return 1 for first event on a day with no existing events', () => {
      const event = createEvent('1', '2024-01-15', '2024-01-15');
      const day = adapter.date('2024-01-15');
      const days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
      const daysMap = new Map([
        ['1/15/2024', { allDayEvents: [] }],
        ['1/16/2024', { allDayEvents: [] }],
      ]);

      const result = getEventRowIndex(event, day, days, daysMap, adapter);

      expect(result).toBe(1);
    });

    it('should return next available row index when other events exist', () => {
      const event = createEvent('3', '2024-01-15', '2024-01-15');
      const day = adapter.date('2024-01-15');
      const days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
      const daysMap = new Map([
        [
          '1/15/2024',
          {
            allDayEvents: [
              createEventWithPosition('1', '2024-01-15', '2024-01-15', 1),
              createEventWithPosition('2', '2024-01-15', '2024-01-15', 2),
            ],
          },
        ],
        ['1/16/2024', { allDayEvents: [] }],
      ]);

      const result = getEventRowIndex(event, day, days, daysMap, adapter);

      expect(result).toBe(3);
    });

    it('should find gap in row indexes and use the lowest available', () => {
      const event = createEvent('4', '2024-01-15', '2024-01-15');
      const day = adapter.date('2024-01-15');
      const days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
      const daysMap = new Map([
        [
          '1/15/2024',
          {
            allDayEvents: [
              createEventWithPosition('1', '2024-01-15', '2024-01-15', 1),
              createEventWithPosition('2', '2024-01-15', '2024-01-15', 3),
              createEventWithPosition('3', '2024-01-15', '2024-01-15', 4),
            ],
          },
        ],
      ]);

      const result = getEventRowIndex(event, day, days, daysMap, adapter);

      expect(result).toBe(2);
    });

    it('should return existing row index when event starts before visible range and exists in first day', () => {
      // Event starting before visible range
      const event = createEvent('1', '2024-01-10', '2024-01-16');
      const day = adapter.date('2024-01-16');
      const days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
      const daysMap = new Map([
        [
          '1/15/2024',
          {
            allDayEvents: [createEventWithPosition('1', '2024-01-10', '2024-01-16', 2)],
          },
        ],
        ['1/16/2024', { allDayEvents: [] }],
      ]);

      const result = getEventRowIndex(event, day, days, daysMap, adapter);

      expect(result).toBe(2); // Should use existing row index from first day
    });

    it('should return 1 when event starts before visible range but not found in first day', () => {
      const event = createEvent('2', '2024-01-10', '2024-01-16'); // Starts before visible range
      const day = adapter.date('2024-01-16');
      const days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
      const daysMap = new Map([
        [
          '1/15/2024',
          {
            allDayEvents: [createEventWithPosition('1', '2024-01-15', '2024-01-15', 1)],
          },
        ],
        ['1/16/2024', { allDayEvents: [] }],
      ]);

      const result = getEventRowIndex(event, day, days, daysMap, adapter);

      expect(result).toBe(1);
    });

    it('should handle event row placement correctly in all columns', () => {
      const event1 = createEventWithPosition('2', '2024-01-10', '2024-01-15', 1);
      const event2 = createEvent('3', '2024-01-15', '2024-01-16');
      const event3 = createEventWithPosition('3', '2024-01-10', '2024-01-14', 2);
      const day = adapter.date('2024-01-15');
      const days = [
        adapter.date('2024-01-14'),
        adapter.date('2024-01-15'),
        adapter.date('2024-01-16'),
      ];
      const daysMap = new Map([
        ['1/14/2024', { allDayEvents: [event1, event3] }],
        [
          '1/15/2024',
          {
            allDayEvents: [event1],
          },
        ],
        ['1/16/2024', { allDayEvents: [] }],
      ]);

      const result = getEventRowIndex(event2, day, days, daysMap, adapter);

      expect(result).toBe(2);

      const dayKey = adapter.format(day, 'keyboardDate');

      daysMap.get(dayKey)!.allDayEvents.push({
        ...event2,
        eventRowIndex: result,
      });

      const result2 = getEventRowIndex(event2, adapter.date('2024-01-16'), days, daysMap, adapter);
      expect(result2).toBe(2);
    });
  });

  describe('getEventDays', () => {
    const days = [
      adapter.date('2024-01-14'),
      adapter.date('2024-01-15'),
      adapter.date('2024-01-16'),
      adapter.date('2024-01-17'),
      adapter.date('2024-01-18'),
    ];

    describe('shouldOnlyRenderEventInOneCell is false', () => {
      it('should return all days when event spans multiple days', () => {
        const event = createEvent('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');

        const result = getEventDays(event, days, adapter, false);

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/15/2024',
          '1/16/2024',
          '1/17/2024',
        ]);
      });

      it('should return single day when event is single day', () => {
        const event = createEvent('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');

        const result = getEventDays(event, days, adapter, false);

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/16/2024');
      });

      it('should return empty array when event is completely outside visible range', () => {
        const event = createEvent('1', '2024-01-10T10:00:00', '2024-01-12T14:00:00');

        const result = getEventDays(event, days, adapter, false);

        expect(result).toHaveLength(0);
      });

      it('should return empty array when event is after visible range', () => {
        const event = createEvent('1', '2024-01-20T10:00:00', '2024-01-22T14:00:00');

        const result = getEventDays(event, days, adapter, false);

        expect(result).toHaveLength(0);
      });

      it('should handle event that partially overlaps with visible range at the beginning', () => {
        const event = createEvent('1', '2024-01-13T10:00:00', '2024-01-16T14:00:00');

        const result = getEventDays(event, days, adapter, false);

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/14/2024',
          '1/15/2024',
          '1/16/2024',
        ]);
      });

      it('should handle event that partially overlaps with visible range at the end', () => {
        const event = createEvent('1', '2024-01-16T10:00:00', '2024-01-19T14:00:00');

        const result = getEventDays(event, days, adapter, false);

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/16/2024',
          '1/17/2024',
          '1/18/2024',
        ]);
      });
    });

    describe('shouldOnlyRenderEventInOneCell is true', () => {
      it('should return single day when event spans multiple days ', () => {
        const event = createEvent('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');
        const shouldOnlyRenderEventInOneCell = true;

        const result = getEventDays(event, days, adapter, shouldOnlyRenderEventInOneCell);

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/15/2024');
      });

      it('should return first visible day when event starts before visible range and shouldOnlyRenderEventInOneCell is true', () => {
        const event = createEvent('1', '2024-01-10T10:00:00', '2024-01-17T14:00:00');

        const result = getEventDays(event, days, adapter, true);

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/14/2024');
      });

      it('should return single day when event is single day and shouldOnlyRenderEventInOneCell is true', () => {
        const event = createEvent('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');

        const result = getEventDays(event, days, adapter, true);

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/16/2024');
      });
    });
  });
});
