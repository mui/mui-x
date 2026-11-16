import {
  createDate,
  endOfDay,
  EventBuilder,
  ResourceBuilder,
  startOfDay,
  utcJuly4AllDayBuilder,
} from 'test/utils/scheduler';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import { describe, it, expect } from 'vitest';
import {
  generateOccurrenceFromEvent,
  getOccurrenceInternalInfos,
  getDaysTheOccurrenceIsVisibleOn,
  getEventResourceIds,
  getOccurrenceLastDayNumber,
  getOccurrenceModelEnd,
  getOccurrencesFromEvents,
  getPrimaryResourceId,
  getRecurringOccurrenceKey,
  getResourceSelectionMode,
} from './event-utils';
import { getDayListFromPlainDates } from '../../get-day-list';
import { BaseTemporal } from './base-temporal';
import { getDayNumber } from './plain-date-utils/plainDate';
import { createEventRangeIndex } from './event-range-index';

describe('event-utils', () => {
  describe('getDaysTheOccurrenceIsVisibleOn', () => {
    const days = getDayListFromPlainDates({
      firstPlainDate: BaseTemporal.PlainDate.from('2024-01-14'),
      lastPlainDate: BaseTemporal.PlainDate.from('2024-01-18'),
      timezone: 'default',
    });
    const dayNumbers = days.map((day) => getDayNumber(day.plainDate));

    const dayKeys = ['2024-01-14', '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18'];

    it('should return all days when event spans multiple days', () => {
      const event = EventBuilder.new()
        .span('2024-01-15T10:00:00Z', '2024-01-17T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, dayNumbers);
      expect(result).toEqual([dayKeys[1], dayKeys[2], dayKeys[3]]);
    });

    it('should return empty array when event is completely outside visible range', () => {
      const event = EventBuilder.new()
        .span('2024-01-10T10:00:00Z', '2024-01-12T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, dayNumbers);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when event is after visible range', () => {
      const event = EventBuilder.new()
        .span('2024-01-20T10:00:00Z', '2024-01-22T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, dayNumbers);
      expect(result).toHaveLength(0);
    });

    it('should handle event that partially overlaps with visible range at the beginning', () => {
      const event = EventBuilder.new()
        .span('2024-01-13T10:00:00Z', '2024-01-16T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, dayNumbers);
      expect(result).toEqual([dayKeys[0], dayKeys[1], dayKeys[2]]);
    });

    it('should handle event that partially overlaps with visible range at the end', () => {
      const event = EventBuilder.new()
        .span('2024-01-16T10:00:00Z', '2024-01-19T14:00:00Z')
        .allDay(true)
        .toOccurrence();

      const result = getDaysTheOccurrenceIsVisibleOn(event, days, dayNumbers);
      expect(result).toEqual([dayKeys[2], dayKeys[3], dayKeys[4]]);
    });
  });

  describe('exclusive end of all-day occurrences', () => {
    it.each([
      // Europe/Paris springs forward on March 29th, 2026: a 23-hour day.
      {
        timezone: 'Europe/Paris',
        day: '2026-03-28',
        end: '2026-03-30T00:00:00',
        days: ['2026-03-28', '2026-03-29'],
      },
      // America/Santiago repeats 23:00-23:59 on April 4th, 2026: a 25-hour day.
      {
        timezone: 'America/Santiago',
        day: '2026-04-04',
        end: '2026-04-05T00:00:00',
        days: ['2026-04-03', '2026-04-04'],
      },
      // Pacific/Apia skipped December 30th, 2011.
      {
        timezone: 'Pacific/Apia',
        day: '2011-12-29',
        end: '2011-12-31T00:00:00',
        days: ['2011-12-28', '2011-12-29'],
      },
    ])(
      'should end a UTC all-day occurrence displayed in $timezone after its last displayed day',
      ({ timezone, day, end, days: expectedDays }) => {
        const event = EventBuilder.new()
          .withDataTimezone('UTC')
          .withDisplayTimezone(timezone)
          .span(`${day}T00:00:00`, `${day}T23:59:59`, { allDay: true })
          .rrule({ freq: 'DAILY', count: 1 })
          .toProcessed();
        const firstPlainDate = BaseTemporal.PlainDate.from(day).add({ days: -3 });
        const days = getDayListFromPlainDates({
          firstPlainDate,
          lastPlainDate: firstPlainDate.add({ days: 6 }),
          timezone,
        });
        const dayNumbers = days.map((item) => getDayNumber(item.plainDate));

        for (const recurringEventsPlugin of [null, schedulerRecurringEventsPlugin]) {
          const [occurrence] = getOccurrencesFromEvents({
            start: days[0].timestamp,
            end: days[days.length - 1].timestamp,
            eventRangeIndex: createEventRangeIndex([event], recurringEventsPlugin != null),
            visibleResources: {},
            displayTimezone: timezone,
            recurringEventsPlugin,
          });

          expect(occurrence.end.plainDateTime.toString()).to.equal(end);
          expect(getOccurrenceModelEnd(occurrence)).to.equal(occurrence.end.timestamp - 1);
          expect(getOccurrenceLastDayNumber(occurrence)).to.equal(
            getDayNumber(BaseTemporal.PlainDate.from(expectedDays[1])),
          );
          expect(getDaysTheOccurrenceIsVisibleOn(occurrence, days, dayNumbers)).to.deep.equal(
            expectedDays,
          );
        }
      },
    );

    it('should keep the end of a timed occurrence', () => {
      const occurrence = EventBuilder.new()
        .withDataTimezone('UTC')
        .span('2026-03-28T22:00:00', '2026-03-29T00:00:00')
        .toOccurrence();

      expect(getOccurrenceModelEnd(occurrence)).to.equal(occurrence.end.timestamp);
      // A timed occurrence ending at midnight covers the start of the next day.
      expect(getOccurrenceLastDayNumber(occurrence)).to.equal(
        getDayNumber(BaseTemporal.PlainDate.from('2026-03-29')),
      );
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
    const start = createDate('2024-01-14');
    const end = createDate('2024-01-18');
    const resourceA = ResourceBuilder.new().build();
    const resourceB = ResourceBuilder.new().build();

    it.each(['single', 'recurring', 'recurring-disabled'] as const)(
      'should keep exception dates on the event rather than its occurrences (%s)',
      (mode) => {
        const event = EventBuilder.new()
          .singleDay('2024-01-15T10:00:00Z')
          .rrule(mode === 'single' ? undefined : { freq: 'DAILY' })
          .exDates(['2024-01-16T10:00:00Z'])
          .toProcessed();

        const result = getOccurrencesFromEvents({
          start: createDate('2024-01-15T00:00:00Z').getTime(),
          end: createDate('2024-01-17T23:59:59Z').getTime(),
          eventRangeIndex: createEventRangeIndex([event], mode === 'recurring'),
          visibleResources: {},
          displayTimezone: 'default',
          recurringEventsPlugin: mode === 'recurring' ? schedulerRecurringEventsPlugin : null,
        });

        expect(result.map((occurrence) => occurrence.start.plainDateTime.day)).to.deep.equal(
          mode === 'recurring' ? [15, 17] : [15],
        );
        for (const occurrence of result) {
          expect((occurrence as { exDates?: unknown }).exDates).to.equal(undefined);
          expect(occurrence.modelInBuiltInFormat.exDates).to.deep.equal(['2024-01-16T10:00:00Z']);
        }
        expect(event.exDates).toHaveLength(1);
      },
    );

    it('should include an event assigned to multiple resources when at least one is visible', () => {
      const event = EventBuilder.new()
        .resources([resourceA, resourceB])
        .singleDay('2024-01-15T10:00:00Z')
        .toProcessed();

      const result = getOccurrencesFromEvents({
        start: start.getTime(),
        end: end.getTime(),
        eventRangeIndex: createEventRangeIndex([event], false),
        visibleResources: { [resourceA.id]: true, [resourceB.id]: false },
        displayTimezone: 'default',
        recurringEventsPlugin: null,
      });

      expect(result.map((o) => o.id)).toEqual([event.id]);
    });

    it('should preserve visibility filtering when using the range index', () => {
      const visibleEvent = EventBuilder.new()
        .id('visible')
        .resource(resourceA)
        .singleDay('2024-01-15T10:00:00Z')
        .toProcessed();
      const hiddenEvent = EventBuilder.new()
        .id('hidden')
        .resource(resourceB)
        .singleDay('2024-01-15T10:00:00Z')
        .toProcessed();
      const events = [visibleEvent, hiddenEvent];

      const result = getOccurrencesFromEvents({
        start: start.getTime(),
        end: end.getTime(),
        eventRangeIndex: createEventRangeIndex(events, false),
        visibleResources: { [resourceA.id]: true, [resourceB.id]: false },
        displayTimezone: 'default',
        recurringEventsPlugin: null,
      });

      expect(result.map((occurrence) => occurrence.id)).to.deep.equal(['visible']);
    });

    it('should preserve event order when indexed recurring events are expanded', () => {
      const events = [
        EventBuilder.new().id('first').singleDay('2024-01-15T08:00:00Z').toProcessed(),
        EventBuilder.new()
          .id('recurring')
          .singleDay('2024-01-01T09:00:00Z')
          .rrule({ freq: 'DAILY' })
          .toProcessed(),
        EventBuilder.new().id('last').singleDay('2024-01-15T10:00:00Z').toProcessed(),
      ];
      const rangeStart = createDate('2024-01-15T00:00:00Z');

      const result = getOccurrencesFromEvents({
        start: startOfDay(rangeStart).getTime(),
        end: endOfDay(rangeStart).getTime(),
        eventRangeIndex: createEventRangeIndex(events, true),
        visibleResources: {},
        displayTimezone: 'default',
        recurringEventsPlugin: schedulerRecurringEventsPlugin,
      });

      expect(result.map((occurrence) => occurrence.id)).to.deep.equal([
        'first',
        'recurring',
        'last',
      ]);
    });

    it('should exclude an event when all of its assigned resources are hidden', () => {
      const event = EventBuilder.new()
        .resources([resourceA, resourceB])
        .singleDay('2024-01-15T10:00:00Z')
        .toProcessed();

      const result = getOccurrencesFromEvents({
        start: start.getTime(),
        end: end.getTime(),
        eventRangeIndex: createEventRangeIndex([event], false),
        visibleResources: { [resourceA.id]: false, [resourceB.id]: false },
        displayTimezone: 'default',
        recurringEventsPlugin: null,
      });

      expect(result).toHaveLength(0);
    });

    it('should include an event with no resource regardless of the visibleResources map', () => {
      const event = EventBuilder.new().singleDay('2024-01-15T10:00:00Z').toProcessed();

      const result = getOccurrencesFromEvents({
        start: start.getTime(),
        end: end.getTime(),
        eventRangeIndex: createEventRangeIndex([event], false),
        visibleResources: { [resourceA.id]: false, [resourceB.id]: false },
        displayTimezone: 'default',
        recurringEventsPlugin: null,
      });

      expect(result.map((o) => o.id)).toEqual([event.id]);
    });
  });

  describe('getOccurrenceInternalInfos', () => {
    it('should return the dataTimezone of an event occurrence', () => {
      const occurrence = utcJuly4AllDayBuilder()
        .withDisplayTimezone('America/New_York')
        .toOccurrence();

      expect(getOccurrenceInternalInfos(occurrence)).to.equal(occurrence.unstable_internalInfos);
    });

    it('should return undefined for a placeholder occurrence', () => {
      const occurrence = EventBuilder.new().toOccurrence();
      const placeholder = {
        ...occurrence,
        unstable_internalInfos: {
          displayTimezone: occurrence.unstable_internalInfos.displayTimezone,
        },
      };

      expect(getOccurrenceInternalInfos(placeholder)).to.equal(undefined);
    });
  });

  describe('generateOccurrenceFromEvent', () => {
    it('should carry the data instants next to the display segment bounds', () => {
      const processed = utcJuly4AllDayBuilder()
        .withDisplayTimezone('America/New_York')
        .exDates(['2025-07-05T00:00:00Z'])
        .toProcessed();

      const occurrence = generateOccurrenceFromEvent({
        event: processed,
        eventId: processed.id,
        occurrenceKey: 'key',
        start: processed.start,
        end: processed.end,
        internalInfos: processed.unstable_internalInfos,
      });

      // Display bounds normalize to New York July 3rd; the data identity stays July 4th.
      expect(occurrence.start).to.equal(processed.start);
      expect(occurrence.unstable_internalInfos.dataStart).to.equal(
        createDate('2025-07-04T00:00:00', 'UTC').getTime(),
      );
      expect((occurrence as { exDates?: unknown }).exDates).to.equal(undefined);
    });

    it('should default the data instants to the display bounds when not provided', () => {
      const processed = EventBuilder.new().singleDay('2025-07-04T09:00:00Z', 30).toProcessed();

      const occurrence = generateOccurrenceFromEvent({
        event: processed,
        eventId: processed.id,
        occurrenceKey: 'key',
        start: processed.start,
        end: processed.end,
      });

      expect(occurrence.unstable_internalInfos.dataStart).to.equal(processed.start.timestamp);
    });
  });

  describe('getRecurringOccurrenceKey', () => {
    it('should key the occurrence on its day in the timezone', () => {
      // July 3rd at 17:00 UTC is July 4th in Tokyo.
      const timestamp = Date.parse('2025-07-03T17:00:00Z');
      expect(getRecurringOccurrenceKey('event', timestamp, 'Asia/Tokyo')).to.equal(
        'event::2025-07-04',
      );
      expect(getRecurringOccurrenceKey('event', timestamp, 'UTC')).to.equal('event::2025-07-03');
    });
  });
});
