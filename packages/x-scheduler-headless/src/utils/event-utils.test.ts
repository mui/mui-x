import { adapter, createOccurrenceFromEvent } from 'test/utils/scheduler';
import { getDaysTheOccurrenceIsVisibleOn } from './event-utils';
import { processDate } from '../process-date';

describe('event-utils', () => {
  const createEventOccurrence = (id: string, start: string, end: string) =>
    createOccurrenceFromEvent({
      id,
      start: adapter.date(start, 'default'),
      end: adapter.date(end, 'default'),
      title: `Event ${id}`,
      allDay: true,
    });

  describe('getDaysTheOccurrenceIsVisibleOn', () => {
    const days = [
      processDate(adapter.date('2024-01-14', 'default'), adapter),
      processDate(adapter.date('2024-01-15', 'default'), adapter),
      processDate(adapter.date('2024-01-16', 'default'), adapter),
      processDate(adapter.date('2024-01-17', 'default'), adapter),
      processDate(adapter.date('2024-01-18', 'default'), adapter),
    ];

    const formattedDays = days.map((day) => adapter.format(day.value, 'localizedNumericDate'));

    it('should return all days when event spans multiple days', () => {
      const event = createEventOccurrence('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toEqual([formattedDays[1], formattedDays[2], formattedDays[3]]);
    });

    it('should return empty array when event is completely outside visible range', () => {
      const event = createEventOccurrence('1', '2024-01-10T10:00:00', '2024-01-12T14:00:00');

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when event is after visible range', () => {
      const event = createEventOccurrence('1', '2024-01-20T10:00:00', '2024-01-22T14:00:00');

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toHaveLength(0);
    });

    it('should handle event that partially overlaps with visible range at the beginning', () => {
      const event = createEventOccurrence('1', '2024-01-13T10:00:00', '2024-01-16T14:00:00');

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toEqual([formattedDays[0], formattedDays[1], formattedDays[2]]);
    });

    it('should handle event that partially overlaps with visible range at the end', () => {
      const event = createEventOccurrence('1', '2024-01-16T10:00:00', '2024-01-19T14:00:00');

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toEqual([formattedDays[2], formattedDays[3], formattedDays[4]]);
    });
  });
});
