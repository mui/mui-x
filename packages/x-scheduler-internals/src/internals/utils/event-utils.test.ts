import {
  adapter,
  EventBuilder,
  ResourceBuilder,
  utcJuly4AllDayBuilder,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import {
  generateOccurrenceFromEvent,
  getOccurrenceDataTimezone,
  getDaysTheOccurrenceIsVisibleOn,
  getEventResourceIds,
  getOccurrencesFromEvents,
  getPrimaryResourceId,
  getResourceSelectionMode,
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

  describe('getResourceSelectionMode', () => {
    it('should return "multiple" while creating, regardless of the resource shape, when canHaveMultipleResources is true', () => {
      expect(getResourceSelectionMode('resource-1', true, true)).toBe('multiple');
      expect(getResourceSelectionMode(['resource-1'], true, true)).toBe('multiple');
      expect(getResourceSelectionMode(null, true, true)).toBe('multiple');
      expect(getResourceSelectionMode(undefined, true, true)).toBe('multiple');
    });

    it('should return "single" while creating, regardless of the resource shape, when canHaveMultipleResources is false', () => {
      expect(getResourceSelectionMode('resource-1', false, true)).toBe('single');
      expect(getResourceSelectionMode(['resource-1'], false, true)).toBe('single');
      expect(getResourceSelectionMode(null, false, true)).toBe('single');
      expect(getResourceSelectionMode(undefined, false, true)).toBe('single');
    });

    it('should return "single" while editing when the resource is a string', () => {
      expect(getResourceSelectionMode('resource-1', true, false)).toBe('single');
    });

    it('should return "multiple" while editing when the resource is an array, including an empty one', () => {
      expect(getResourceSelectionMode(['resource-1', 'resource-2'], false, false)).toBe('multiple');
      expect(getResourceSelectionMode([], false, false)).toBe('multiple');
    });

    it('should fall back to canHaveMultipleResources while editing when the resource is null or undefined', () => {
      expect(getResourceSelectionMode(null, true, false)).toBe('multiple');
      expect(getResourceSelectionMode(null, false, false)).toBe('single');
      expect(getResourceSelectionMode(undefined, true, false)).toBe('multiple');
      expect(getResourceSelectionMode(undefined, false, false)).toBe('single');
    });
  });

  describe('getOccurrencesFromEvents', () => {
    const start = adapter.date('2024-01-14', 'default');
    const end = adapter.date('2024-01-18', 'default');
    const resourceA = ResourceBuilder.new().build();
    const resourceB = ResourceBuilder.new().build();

    it('should include an event assigned to multiple resources when at least one is visible', () => {
      const event = EventBuilder.new(adapter)
        .resources([resourceA, resourceB])
        .singleDay('2024-01-15T10:00:00Z')
        .toProcessed();

      const result = getOccurrencesFromEvents({
        adapter,
        start,
        end,
        events: [event],
        visibleResources: { [resourceA.id]: true, [resourceB.id]: false },
        displayTimezone: 'default',
        recurringEventsPlugin: null,
      });

      expect(result.map((o) => o.id)).toEqual([event.id]);
    });

    it('should exclude an event when all of its assigned resources are hidden', () => {
      const event = EventBuilder.new(adapter)
        .resources([resourceA, resourceB])
        .singleDay('2024-01-15T10:00:00Z')
        .toProcessed();

      const result = getOccurrencesFromEvents({
        adapter,
        start,
        end,
        events: [event],
        visibleResources: { [resourceA.id]: false, [resourceB.id]: false },
        displayTimezone: 'default',
        recurringEventsPlugin: null,
      });

      expect(result).toHaveLength(0);
    });

    it('should include an event with no resource regardless of the visibleResources map', () => {
      const event = EventBuilder.new(adapter).singleDay('2024-01-15T10:00:00Z').toProcessed();

      const result = getOccurrencesFromEvents({
        adapter,
        start,
        end,
        events: [event],
        visibleResources: { [resourceA.id]: false, [resourceB.id]: false },
        displayTimezone: 'default',
        recurringEventsPlugin: null,
      });

      expect(result.map((o) => o.id)).toEqual([event.id]);
    });
  });

  describe('getOccurrenceDataTimezone', () => {
    it('should return the data-timezone bounds of an event occurrence', () => {
      const occurrence = utcJuly4AllDayBuilder()
        .withDisplayTimezone('America/New_York')
        .toOccurrence();

      expect(getOccurrenceDataTimezone(occurrence)).to.equal(occurrence.dataTimezone);
    });

    it('should return undefined for a placeholder occurrence', () => {
      const { dataTimezone, ...placeholder } = EventBuilder.new().toOccurrence();

      expect(getOccurrenceDataTimezone(placeholder as any)).to.equal(undefined);
    });
  });

  describe('generateOccurrenceFromEvent', () => {
    it('should carry the data-timezone bounds separately from the display segment bounds', () => {
      const processed = utcJuly4AllDayBuilder()
        .withDisplayTimezone('America/New_York')
        .toProcessed();

      const occurrence = generateOccurrenceFromEvent({
        event: processed,
        eventId: processed.id,
        occurrenceKey: 'key',
        start: processed.displayTimezone.start,
        end: processed.displayTimezone.end,
        dataTimezone: processed.dataTimezone,
      });

      // Display bounds normalize to New York July 3rd; the data identity stays July 4th.
      expect(occurrence.displayTimezone.start).to.equal(processed.displayTimezone.start);
      expect(occurrence.dataTimezone.start.timestamp).to.equal(
        adapter.getTime(adapter.date('2025-07-04T00:00:00', 'UTC')),
      );
    });

    it('should default the data bounds to the display bounds when not provided', () => {
      const processed = EventBuilder.new().singleDay('2025-07-04T09:00:00Z', 30).toProcessed();

      const occurrence = generateOccurrenceFromEvent({
        event: processed,
        eventId: processed.id,
        occurrenceKey: 'key',
        start: processed.displayTimezone.start,
        end: processed.displayTimezone.end,
      });

      expect(occurrence.dataTimezone.start).to.equal(processed.displayTimezone.start);
    });
  });
});
