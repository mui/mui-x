import { DateTime } from 'luxon';
import { CalendarEventOccurrencesWithRowIndex } from '@mui/x-scheduler/primitives/models';
import {
  getEventDays,
  getEventRowIndex,
  getEventWithLargestRowIndex,
  isDayWithinRange,
  processDate,
} from './event-utils';
import { getAdapter } from './adapter/getAdapter';

describe('event-utils', () => {
  const adapter = getAdapter();
  const createEventOccurrence = (
    id: string,
    start: string,
    end: string,
  ): CalendarEventOccurrencesWithRowIndex => ({
    id,
    key: id,
    start: adapter.date(start),
    end: adapter.date(end),
    title: `Event ${id}`,
    allDay: true,
  });

  describe('getEventWithLargestRowIndex', () => {
    it('should return the largest row index from events', () => {
      const events: CalendarEventOccurrencesWithRowIndex[] = [
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
      const events: CalendarEventOccurrencesWithRowIndex[] = [];

      const result = getEventWithLargestRowIndex(events);

      expect(result).toBe(0);
    });

    it('should return 0 when all events have undefined eventRowIndex', () => {
      const eventsWithUndefinedRowIndex: CalendarEventOccurrencesWithRowIndex[] = [
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
      const events: CalendarEventOccurrencesWithRowIndex[] = [
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
    it('should return 1 for first event on a day with no existing events', () => {
      const result = getEventRowIndex({
        adapter,
        rowIndexLookup: {},
        occurrence: createEventOccurrence('1', '2024-01-15', '2024-01-15'),
        day: processDate(adapter.date('2024-01-15'), adapter),
        firstDayInRow: processDate(adapter.date('2024-01-15'), adapter),
      });

      expect(result).toBe(1);
    });

    it('should return next available row index when other events exist', () => {
      const result = getEventRowIndex({
        adapter,
        rowIndexLookup: {
          '1/15/2024': {
            occurrencesRowIndex: { '1': 1, '2': 2 },
            usedRowIndexes: new Set([1, 2]),
          },
        },
        occurrence: createEventOccurrence('3', '2024-01-15', '2024-01-15'),
        day: processDate(adapter.date('2024-01-15'), adapter),
        firstDayInRow: processDate(adapter.date('2024-01-15'), adapter),
      });

      expect(result).toBe(3);
    });

    it('should find gap in row indexes and use the lowest available', () => {
      const result = getEventRowIndex({
        adapter,
        rowIndexLookup: {
          '1/15/2024': {
            occurrencesRowIndex: { '1': 1, '2': 3, '3': 4 },
            usedRowIndexes: new Set([1, 3, 4]),
          },
        },
        occurrence: createEventOccurrence('4', '2024-01-15', '2024-01-15'),
        day: processDate(adapter.date('2024-01-15'), adapter),
        firstDayInRow: processDate(adapter.date('2024-01-15'), adapter),
      });

      expect(result).toBe(2);
    });

    it('should return existing row index when event starts before visible range and exists in first day', () => {
      const result = getEventRowIndex({
        adapter,
        rowIndexLookup: {
          '1/15/2024': {
            occurrencesRowIndex: { '1': 2 },
            usedRowIndexes: new Set([2]),
          },
          '1/16/2024': {
            occurrencesRowIndex: {},
            usedRowIndexes: new Set(),
          },
        },
        // Event starting before visible range
        occurrence: createEventOccurrence('1', '2024-01-10', '2024-01-16'),
        day: processDate(adapter.date('2024-01-16'), adapter),
        firstDayInRow: processDate(adapter.date('2024-01-15'), adapter),
      });

      expect(result).toBe(2); // Should use existing row index from first day
    });

    it('should return 1 when event starts before visible range but not found in first day', () => {
      const result = getEventRowIndex({
        adapter,
        rowIndexLookup: {
          '1/15/2024': {
            occurrencesRowIndex: { '1': 1 },
            usedRowIndexes: new Set([1]),
          },
          '1/16/2024': {
            occurrencesRowIndex: {},
            usedRowIndexes: new Set(),
          },
        },
        // Event starting before visible range
        occurrence: createEventOccurrence('2', '2024-01-10', '2024-01-16'),
        day: processDate(adapter.date('2024-01-16'), adapter),
        firstDayInRow: processDate(adapter.date('2024-01-15'), adapter),
      });

      expect(result).toBe(1);
    });

    it('should handle event row placement correctly in all columns', () => {
      const occurrence = createEventOccurrence('3', '2024-01-15', '2024-01-16');
      const result = getEventRowIndex({
        adapter,
        rowIndexLookup: {
          '1/14/2024': {
            occurrencesRowIndex: { '1': 1, '2': 3 },
            usedRowIndexes: new Set([1, 2]),
          },
          '1/15/2024': {
            occurrencesRowIndex: { '1': 1 },
            usedRowIndexes: new Set([1]),
          },
          '1/16/2024': {
            occurrencesRowIndex: {},
            usedRowIndexes: new Set(),
          },
        },
        occurrence,
        day: processDate(adapter.date('2024-01-15'), adapter),
        firstDayInRow: processDate(adapter.date('2024-01-14'), adapter),
      });

      expect(result).toBe(2);

      const result2 = getEventRowIndex({
        adapter,
        rowIndexLookup: {
          '1/14/2024': {
            occurrencesRowIndex: { '1': 1, '2': 3 },
            usedRowIndexes: new Set([1, 2]),
          },
          // Add the row index returned by the 1st call to getEventRowIndex
          '1/15/2024': {
            occurrencesRowIndex: { '1': 1, '3': 2 },
            usedRowIndexes: new Set([1, 2]),
          },
          '1/16/2024': {
            occurrencesRowIndex: {},
            usedRowIndexes: new Set(),
          },
        },
        occurrence,
        day: processDate(adapter.date('2024-01-16'), adapter),
        firstDayInRow: processDate(adapter.date('2024-01-14'), adapter),
      });

      expect(result2).toBe(2);
    });
  });

  describe('getEventDays', () => {
    const days = [
      processDate(adapter.date('2024-01-14'), adapter),
      processDate(adapter.date('2024-01-15'), adapter),
      processDate(adapter.date('2024-01-16'), adapter),
      processDate(adapter.date('2024-01-17'), adapter),
      processDate(adapter.date('2024-01-18'), adapter),
    ];

    describe('eventPlacement === "every-day"', () => {
      it('should return all days when event spans multiple days', () => {
        const event = createEventOccurrence('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');

        const result = getEventDays(event, days, adapter, 'every-day');

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/15/2024',
          '1/16/2024',
          '1/17/2024',
        ]);
      });

      it('should return single day when event is single day', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');

        const result = getEventDays(event, days, adapter, 'every-day');

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/16/2024');
      });

      it('should return empty array when event is completely outside visible range', () => {
        const event = createEventOccurrence('1', '2024-01-10T10:00:00', '2024-01-12T14:00:00');

        const result = getEventDays(event, days, adapter, 'every-day');

        expect(result).toHaveLength(0);
      });

      it('should return empty array when event is after visible range', () => {
        const event = createEventOccurrence('1', '2024-01-20T10:00:00', '2024-01-22T14:00:00');

        const result = getEventDays(event, days, adapter, 'every-day');

        expect(result).toHaveLength(0);
      });

      it('should handle event that partially overlaps with visible range at the beginning', () => {
        const event = createEventOccurrence('1', '2024-01-13T10:00:00', '2024-01-16T14:00:00');

        const result = getEventDays(event, days, adapter, 'every-day');

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/14/2024',
          '1/15/2024',
          '1/16/2024',
        ]);
      });

      it('should handle event that partially overlaps with visible range at the end', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-19T14:00:00');

        const result = getEventDays(event, days, adapter, 'every-day');

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/16/2024',
          '1/17/2024',
          '1/18/2024',
        ]);
      });
    });

    describe('eventPlacement === "first-day"', () => {
      it('should return single day when event spans multiple days ', () => {
        const event = createEventOccurrence('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');

        const result = getEventDays(event, days, adapter, 'first-day');

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/15/2024');
      });

      it('should return first visible day when event starts before visible range and eventPlacement === "first-day"', () => {
        const event = createEventOccurrence('1', '2024-01-10T10:00:00', '2024-01-17T14:00:00');

        const result = getEventDays(event, days, adapter, 'first-day');

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/14/2024');
      });

      it('should return single day when event is single day and eventPlacement === "first-day"', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');

        const result = getEventDays(event, days, adapter, 'first-day');

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/16/2024');
      });
    });
  });
});
