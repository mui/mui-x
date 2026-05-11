import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import { getDaysTheOccurrenceIsVisibleOn, getOccurrencesFromEvents } from './event-utils';
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

  describe('getOccurrencesFromEvents', () => {
    const start = adapter.startOfDay(adapter.date('2024-01-10T00:00:00Z', 'default'));
    const end = adapter.endOfDay(adapter.date('2024-01-12T00:00:00Z', 'default'));

    it('should exclude events whose resource is not visible', () => {
      const visibleResource = ResourceBuilder.new().id('visible').build();
      const hiddenResource = ResourceBuilder.new().id('hidden').build();
      const visibleEvent = EventBuilder.new()
        .id('visible-event')
        .resource(visibleResource)
        .singleDay('2024-01-11T10:00:00Z')
        .toProcessed();
      const hiddenEvent = EventBuilder.new()
        .id('hidden-event')
        .resource(hiddenResource)
        .singleDay('2024-01-11T10:00:00Z')
        .toProcessed();

      const result = getOccurrencesFromEvents({
        adapter,
        start,
        end,
        events: [visibleEvent, hiddenEvent],
        visibleResources: { visible: true, hidden: false },
        displayTimezone: 'default',
        plan: 'premium',
      });

      expect(result).to.have.length(1);
      expect(result[0].id).to.equal('visible-event');
    });

    it('should convert recurring event occurrences to the display timezone before grouping', () => {
      // Event at Jan 11, 04:00 UTC (= Jan 10, 23:00 New York time, UTC-5).
      // Display timezone Europe/Paris (UTC+1 in January) → 05:00 local Paris on Jan 11.
      // No occurrence must surface on Jan 10 in Paris time even though the data timezone
      // would put the first one on Jan 10.
      const event = EventBuilder.new()
        .id('recurring')
        .span('2024-01-11T04:00:00Z', '2024-01-11T05:00:00Z')
        .withDataTimezone('America/New_York')
        .withDisplayTimezone('Europe/Paris')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const result = getOccurrencesFromEvents({
        adapter,
        start,
        end,
        events: [event],
        visibleResources: {},
        displayTimezone: 'Europe/Paris',
        plan: 'premium',
      });

      expect(result.length).to.be.greaterThan(0);
      const jan11Start = adapter.date('2024-01-11T00:00:00Z', 'default');
      for (const occurrence of result) {
        expect(
          adapter.isAfter(occurrence.displayTimezone.start.value, jan11Start) ||
            adapter.isEqual(occurrence.displayTimezone.start.value, jan11Start),
        ).to.equal(true);
      }
    });

    it('should skip non-recurring events outside the visible range', () => {
      const event = EventBuilder.new()
        .id('outside')
        .singleDay('2024-01-20T10:00:00Z')
        .toProcessed();

      const result = getOccurrencesFromEvents({
        adapter,
        start,
        end,
        events: [event],
        visibleResources: {},
        displayTimezone: 'default',
        plan: 'premium',
      });

      expect(result).to.have.length(0);
    });
  });
});
