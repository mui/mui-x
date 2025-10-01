import { CalendarEventOccurrence } from '@mui/x-scheduler/primitives/models';
import { getDaysTheOccurrenceIsVisibleOn, processDate } from './event-utils';
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
        expect(result).toEqual(['1/15/2024', '1/16/2024', '1/17/2024']);
      });

      it('should return single day when event is single day', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'every-day');
        expect(result).toEqual(['1/16/2024']);
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
        expect(result).toEqual(['1/14/2024', '1/15/2024', '1/16/2024']);
      });

      it('should handle event that partially overlaps with visible range at the end', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-19T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'every-day');
        expect(result).toEqual(['1/16/2024', '1/17/2024', '1/18/2024']);
      });
    });

    describe('renderEventIn === "first-day"', () => {
      it('should return single day when event spans multiple days ', () => {
        const event = createEventOccurrence('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'first-day');
        expect(result).toEqual(['1/15/2024']);
      });

      it('should return first visible day when event starts before visible range and renderEventIn === "first-day"', () => {
        const event = createEventOccurrence('1', '2024-01-10T10:00:00', '2024-01-17T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'first-day');
        expect(result).toEqual(['1/14/2024']);
      });

      it('should return single day when event is single day and renderEventIn === "first-day"', () => {
        const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');

        const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter, 'first-day');
        expect(result).toEqual(['1/16/2024']);
      });
    });
  });
});
