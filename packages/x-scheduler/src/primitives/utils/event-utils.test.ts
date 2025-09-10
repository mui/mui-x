import { CalendarEventOccurrence } from '@mui/x-scheduler/primitives/models';
import {
  getDaysTheOccurrenceIsVisibleOn,
  getEventOccurrencePositionInDayList,
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
  ): CalendarEventOccurrence => ({
    id,
    key: id,
    start: adapter.date(start),
    end: adapter.date(end),
    title: `Event ${id}`,
    allDay: true,
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

  describe('getEventOccurrencePositionInDayList', () => {
    it('should return 1 for first event on a day with no existing events', () => {
      const { index } = getEventOccurrencePositionInDayList({
        adapter,
        indexLookup: {},
        occurrence: createEventOccurrence('1', '2024-01-15', '2024-01-15'),
        day: processDate(adapter.date('2024-01-15'), adapter),
        previousDay: null,
        daysBeforeCollectionEnd: 2,
      });

      expect(index).toBe(1);
    });

    it('should return next available index when other events exist', () => {
      const { index } = getEventOccurrencePositionInDayList({
        adapter,
        indexLookup: {
          '1/15/2024': {
            occurrencesIndex: { '1': 1, '2': 2 },
            usedIndexes: new Set([1, 2]),
          },
        },
        occurrence: createEventOccurrence('3', '2024-01-15', '2024-01-15'),
        day: processDate(adapter.date('2024-01-15'), adapter),
        previousDay: null,
        daysBeforeCollectionEnd: 2,
      });

      expect(index).toBe(3);
    });

    it('should find gap in indexes and use the lowest available', () => {
      const { index } = getEventOccurrencePositionInDayList({
        adapter,
        indexLookup: {
          '1/15/2024': {
            occurrencesIndex: { '1': 1, '2': 3, '3': 4 },
            usedIndexes: new Set([1, 3, 4]),
          },
        },
        occurrence: createEventOccurrence('4', '2024-01-15', '2024-01-15'),
        day: processDate(adapter.date('2024-01-15'), adapter),
        previousDay: null,
        daysBeforeCollectionEnd: 2,
      });

      expect(index).toBe(2);
    });

    it('should return existing index when event starts before visible range and exists in first day', () => {
      const { index } = getEventOccurrencePositionInDayList({
        adapter,
        indexLookup: {
          '1/15/2024': {
            occurrencesIndex: { '1': 2 },
            usedIndexes: new Set([2]),
          },
          '1/16/2024': {
            occurrencesIndex: {},
            usedIndexes: new Set(),
          },
        },
        // Event starting before visible range
        occurrence: createEventOccurrence('1', '2024-01-10', '2024-01-16'),
        day: processDate(adapter.date('2024-01-16'), adapter),
        previousDay: processDate(adapter.date('2024-01-15'), adapter),
        daysBeforeCollectionEnd: 2,
      });

      expect(index).toBe(2); // Should use existing index from first day
    });

    it('should return 1 when event starts before visible range but not found in first day', () => {
      const { index } = getEventOccurrencePositionInDayList({
        adapter,
        indexLookup: {
          '1/15/2024': {
            occurrencesIndex: { '1': 1 },
            usedIndexes: new Set([1]),
          },
          '1/16/2024': {
            occurrencesIndex: {},
            usedIndexes: new Set(),
          },
        },
        // Event starting before visible range
        occurrence: createEventOccurrence('2', '2024-01-10', '2024-01-16'),
        day: processDate(adapter.date('2024-01-16'), adapter),
        previousDay: processDate(adapter.date('2024-01-15'), adapter),
        daysBeforeCollectionEnd: 2,
      });

      expect(index).toBe(1);
    });

    it('should handle event position correctly in all days', () => {
      const occurrence = createEventOccurrence('3', '2024-01-15', '2024-01-16');
      const { index } = getEventOccurrencePositionInDayList({
        adapter,
        indexLookup: {
          '1/14/2024': {
            occurrencesIndex: { '1': 1, '2': 3 },
            usedIndexes: new Set([1, 2]),
          },
          '1/15/2024': {
            occurrencesIndex: { '1': 1 },
            usedIndexes: new Set([1]),
          },
          '1/16/2024': {
            occurrencesIndex: {},
            usedIndexes: new Set(),
          },
        },
        occurrence,
        day: processDate(adapter.date('2024-01-15'), adapter),
        previousDay: processDate(adapter.date('2024-01-14'), adapter),
        daysBeforeCollectionEnd: 2,
      });

      expect(index).toBe(2);

      const { index: index2 } = getEventOccurrencePositionInDayList({
        adapter,
        indexLookup: {
          '1/14/2024': {
            occurrencesIndex: { '1': 1, '2': 3 },
            usedIndexes: new Set([1, 2]),
          },
          // Add the index returned by the 1st call to the method
          '1/15/2024': {
            occurrencesIndex: { '1': 1, '3': 2 },
            usedIndexes: new Set([1, 2]),
          },
          '1/16/2024': {
            occurrencesIndex: {},
            usedIndexes: new Set(),
          },
        },
        occurrence,
        day: processDate(adapter.date('2024-01-16'), adapter),
        previousDay: processDate(adapter.date('2024-01-15'), adapter),
        daysBeforeCollectionEnd: 2,
      });

      expect(index2).toBe(2);
    });
  });

  describe('getDaysTheOccurrenceIsVisibleOn', () => {
    const days = [
      processDate(adapter.date('2024-01-14'), adapter),
      processDate(adapter.date('2024-01-15'), adapter),
      processDate(adapter.date('2024-01-16'), adapter),
      processDate(adapter.date('2024-01-17'), adapter),
      processDate(adapter.date('2024-01-18'), adapter),
    ];

    describe('renderEventIn === "every-day"', () => {
      it('should return all days when event spans multiple days', () => {
        const event = createEventOccurrence('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'every-day');

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/15/2024',
          '1/16/2024',
          '1/17/2024',
        ]);
      });

      it('should return single day when event is single day', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'every-day');

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/16/2024');
      });

      it('should return empty array when event is completely outside visible range', () => {
        const event = createEventOccurrence('1', '2024-01-10T10:00:00', '2024-01-12T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'every-day');

        expect(result).toHaveLength(0);
      });

      it('should return empty array when event is after visible range', () => {
        const event = createEventOccurrence('1', '2024-01-20T10:00:00', '2024-01-22T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'every-day');

        expect(result).toHaveLength(0);
      });

      it('should handle event that partially overlaps with visible range at the beginning', () => {
        const event = createEventOccurrence('1', '2024-01-13T10:00:00', '2024-01-16T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'every-day');

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/14/2024',
          '1/15/2024',
          '1/16/2024',
        ]);
      });

      it('should handle event that partially overlaps with visible range at the end', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-19T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'every-day');

        expect(result).toHaveLength(3);
        expect(result.map((day) => adapter.format(day, 'keyboardDate'))).toEqual([
          '1/16/2024',
          '1/17/2024',
          '1/18/2024',
        ]);
      });
    });

    describe('renderEventIn === "first-day"', () => {
      it('should return single day when event spans multiple days ', () => {
        const event = createEventOccurrence('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'first-day');

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/15/2024');
      });

      it('should return first visible day when event starts before visible range and renderEventIn === "first-day"', () => {
        const event = createEventOccurrence('1', '2024-01-10T10:00:00', '2024-01-17T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'first-day');

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/14/2024');
      });

      it('should return single day when event is single day and renderEventIn === "first-day"', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'first-day');

        expect(result).toHaveLength(1);
        expect(adapter.format(result[0], 'keyboardDate')).toBe('1/16/2024');
      });
    });
  });
});
