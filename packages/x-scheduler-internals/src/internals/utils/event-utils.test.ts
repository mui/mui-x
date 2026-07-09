import { adapter, EventBuilder } from 'test/utils/scheduler';
import {
  getDaysTheOccurrenceIsVisibleOn,
  getEventResourceIds,
  getPrimaryResourceId,
} from './event-utils';
import { processDate } from '../../process-date';

describe('event-utils', () => {
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
      const event = EventBuilder.new()
        .span('2024-01-15T10:00:00Z', '2024-01-17T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toEqual([formattedDays[1], formattedDays[2], formattedDays[3]]);
    });

    it('should return empty array when event is completely outside visible range', () => {
      const event = EventBuilder.new()
        .span('2024-01-10T10:00:00Z', '2024-01-12T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when event is after visible range', () => {
      const event = EventBuilder.new()
        .span('2024-01-20T10:00:00Z', '2024-01-22T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toHaveLength(0);
    });

    it('should handle event that partially overlaps with visible range at the beginning', () => {
      const event = EventBuilder.new()
        .span('2024-01-13T10:00:00Z', '2024-01-16T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toEqual([formattedDays[0], formattedDays[1], formattedDays[2]]);
    });

    it('should handle event that partially overlaps with visible range at the end', () => {
      const event = EventBuilder.new()
        .span('2024-01-16T10:00:00Z', '2024-01-19T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, adapter);
      expect(result).toEqual([formattedDays[2], formattedDays[3], formattedDays[4]]);
    });
  });

  describe('getEventResourceIds', () => {
    it('should return an empty array when the resource is null', () => {
      expect(getEventResourceIds(null)).toEqual([]);
    });

    it('should return an empty array when the resource is undefined', () => {
      expect(getEventResourceIds(undefined)).toEqual([]);
    });

    it('should wrap a single resource ID in an array', () => {
      expect(getEventResourceIds('resource-1')).toEqual(['resource-1']);
    });

    it('should return the array as-is when the resource is already an array', () => {
      expect(getEventResourceIds(['resource-1', 'resource-2'])).toEqual([
        'resource-1',
        'resource-2',
      ]);
    });

    it('should return an empty array when the resource is an empty array', () => {
      expect(getEventResourceIds([])).toEqual([]);
    });
  });

  describe('getPrimaryResourceId', () => {
    it('should return null when the resource is null', () => {
      expect(getPrimaryResourceId(null)).toBeNull();
    });

    it('should return null when the resource is undefined', () => {
      expect(getPrimaryResourceId(undefined)).toBeNull();
    });

    it('should return the resource ID when it is a single value', () => {
      expect(getPrimaryResourceId('resource-1')).toBe('resource-1');
    });

    it('should return the first resource ID when the resource is an array', () => {
      expect(getPrimaryResourceId(['resource-1', 'resource-2'])).toBe('resource-1');
    });

    it('should return null when the resource is an empty array', () => {
      expect(getPrimaryResourceId([])).toBeNull();
    });
  });
});
