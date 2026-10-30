import { adapter } from 'test/utils/scheduler/adapters';
import { processEvent } from '@mui/x-scheduler-internals/process-event';
import { EventBuilder } from 'test/utils/scheduler/event-builder';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import { toWallClockIsoString } from '@mui/x-scheduler-internals/internals';
import { describe, it, expect } from 'vitest';

describe('processEvent', () => {
  it('should keep event timezone in modelInBuiltInFormat', () => {
    const event = EventBuilder.new(adapter)
      .withDataTimezone('America/New_York')
      .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
      .build();

    const processed = processEvent(event, 'Pacific/Kiritimati', adapter);

    expect(processed.modelInBuiltInFormat.timezone).to.equal('America/New_York');
  });

  it('should fallback to "default" timezone when event.timezone is not provided', () => {
    const event = EventBuilder.new().build();

    const processed = processEvent(event, 'Europe/Paris', adapter);

    expect(processed.dataTimezone.timezone).to.equal('default');
    expect(processed.displayTimezone.timezone).to.equal('Europe/Paris');
  });

  describe('displayTimezone', () => {
    it('should read start and end in the display timezone', () => {
      const event = EventBuilder.new(adapter)
        .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
        .build();

      // Kiritimati is at UTC+14.
      const processed = processEvent(event, 'Pacific/Kiritimati', adapter);
      const { start, end } = processed.displayTimezone;
      expect(start.key).to.equal('2025-01-02');
      expect(start.minutesInDay).to.equal(0);
      expect(end.minutesInDay).to.equal(120);
      expect(adapter.getTime(start.value)).to.equal(Date.parse('2025-01-01T10:00:00Z'));
      // A plain `Date`, not a subclass carrying a timezone.
      expect(start.value.constructor).to.equal(Date);
    });

    it('should read an end after 9999 in a timezone east of UTC', () => {
      // December 31st, 9999, a common "no end date", is already January 1st, 10000 in Tokyo.
      const event = EventBuilder.new(adapter)
        .withDataTimezone('Asia/Tokyo')
        .span('2025-01-01T10:00:00Z', '9999-12-31T23:30:00Z')
        .build();

      const processed = processEvent(event, 'Asia/Tokyo', adapter);

      expect(processed.dataTimezone.end.key).to.equal('+010000-01-01');
      expect(processed.displayTimezone.end.key).to.equal('+010000-01-01');
    });

    it('should keep the instants of the exDates', () => {
      const event = EventBuilder.new(adapter).exDates(['2025-01-05T00:00:00Z']).build();
      const processed = processEvent(event, 'America/New_York', adapter);

      expect(processed.displayTimezone.exDates).to.have.length(1);
      expect(adapter.getTime(processed.displayTimezone.exDates![0])).to.equal(
        Date.parse('2025-01-05T00:00:00Z'),
      );
    });

    it('should read rrule.until as an instant when rrule is an object', () => {
      // The rule is expressed in the timezone the series expands in, not the display one.
      const event = EventBuilder.new(adapter)
        .withDataTimezone('America/New_York')
        .rrule({
          freq: 'DAILY',
          until: '2025-01-10T23:59:00Z',
        })
        .build();

      const processed = processEvent(event, 'Asia/Tokyo', adapter, schedulerRecurringEventsPlugin);

      expect(adapter.getTime(processed.dataTimezone.rrule!.until!)).to.equal(
        Date.parse('2025-01-10T23:59:00Z'),
      );
    });

    it('should parse an rrule string and read its UNTIL as an instant', () => {
      const event = EventBuilder.new(adapter).withDataTimezone('America/New_York').build();

      const processed = processEvent(
        {
          ...event,
          rrule: 'FREQ=DAILY;UNTIL=20250110T230000Z',
        },
        'Pacific/Kiritimati',
        adapter,
        schedulerRecurringEventsPlugin,
      );

      expect(adapter.getTime(processed.dataTimezone.rrule!.until!)).to.equal(
        Date.parse('2025-01-10T23:00:00Z'),
      );
    });
  });
  describe('dataTimezone', () => {
    it('should keep original timezone in dataTimezone', () => {
      const event = EventBuilder.new(adapter)
        .withDataTimezone('America/New_York')
        .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
        .build();

      const processed = processEvent(event, 'Pacific/Kiritimati', adapter);

      expect(processed.dataTimezone.timezone).to.equal('America/New_York');
    });
  });

  describe('string date resolution', () => {
    it('should resolve wall-time strings in the event timezone', () => {
      // "2025-01-01T09:00:00" in America/New_York → 09:00 local → 14:00 UTC (EST = UTC-5)
      const event = EventBuilder.new(adapter)
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const processed = processEvent(event, 'America/New_York', adapter);

      expect(processed.dataTimezone.start.timestamp).to.equal(
        new Date('2025-01-01T14:00:00Z').getTime(),
      );
      expect(processed.dataTimezone.start.minutesInDay).to.equal(9 * 60);
    });

    it('should produce different UTC instants for same wall-time string in different timezones', () => {
      const eventNY = EventBuilder.new(adapter)
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const eventTokyo = EventBuilder.new(adapter)
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('Asia/Tokyo')
        .build();

      const processedNY = processEvent(eventNY, 'UTC', adapter);
      const processedTokyo = processEvent(eventTokyo, 'UTC', adapter);

      // 09:00 NY (UTC-5) = 14:00 UTC vs 09:00 Tokyo (UTC+9) = 00:00 UTC
      expect(processedNY.dataTimezone.start.timestamp).to.not.equal(
        processedTokyo.dataTimezone.start.timestamp,
      );
      expect(processedNY.dataTimezone.start.timestamp).to.equal(
        new Date('2025-01-01T14:00:00Z').getTime(),
      );
      expect(processedTokyo.dataTimezone.start.timestamp).to.equal(
        new Date('2025-01-01T00:00:00Z').getTime(),
      );
    });

    it('should resolve wall-time exDates to date objects in dataTimezone', () => {
      const event = EventBuilder.new(adapter)
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .exDates(['2025-01-05T09:00:00'])
        .recurrent('DAILY')
        .build();

      const processed = processEvent(
        event,
        'Europe/Paris',
        adapter,
        schedulerRecurringEventsPlugin,
      );

      expect(processed.dataTimezone.exDates).to.have.length(1);
      // 09:00 NY (UTC-5) = 14:00 UTC
      expect(processed.dataTimezone.exDates![0].getTime()).to.equal(
        new Date('2025-01-05T14:00:00Z').getTime(),
      );
    });

    it('should read the data-timezone bag in the event timezone for instant strings', () => {
      const event = EventBuilder.new(adapter)
        .withDataTimezone('America/New_York')
        .span('2025-01-01T14:00:00Z', '2025-01-01T15:00:00Z')
        .exDates(['2025-01-05T14:00:00Z'])
        .recurrent('DAILY')
        .build();

      const processed = processEvent(
        event,
        'Europe/Paris',
        adapter,
        schedulerRecurringEventsPlugin,
      );

      // Same instants; day and hour reads answer in the event's timezone.
      expect(processed.dataTimezone.start.timestamp).to.equal(
        new Date('2025-01-01T14:00:00Z').getTime(),
      );
      // 14:00 UTC = 09:00 in New York (UTC-5)
      expect(processed.dataTimezone.start.minutesInDay).to.equal(9 * 60);
      expect(processed.dataTimezone.end.minutesInDay).to.equal(10 * 60);
      expect(
        toWallClockIsoString(
          adapter.getTime(processed.dataTimezone.exDates![0]),
          processed.dataTimezone.timezone,
        ),
      ).to.equal('2025-01-05T09:00:00');
    });

    it('should keep local hour across DST spring-forward for wall-time events', () => {
      // 2025 US spring-forward: March 9 at 02:00 → 03:00
      // Before DST (Jan 1): 09:00 NY = UTC-5 → 14:00 UTC
      // After DST (Mar 10): 09:00 NY = UTC-4 → 13:00 UTC
      const eventBefore = EventBuilder.new(adapter)
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const eventAfter = EventBuilder.new(adapter)
        .span('2025-03-10T09:00:00', '2025-03-10T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const processedBefore = processEvent(eventBefore, 'America/New_York', adapter);
      const processedAfter = processEvent(eventAfter, 'America/New_York', adapter);

      // Both should show 09:00 local
      expect(processedBefore.displayTimezone.start.minutesInDay).to.equal(9 * 60);
      expect(processedAfter.displayTimezone.start.minutesInDay).to.equal(9 * 60);

      // But different UTC timestamps
      expect(processedBefore.dataTimezone.start.timestamp).to.equal(
        new Date('2025-01-01T14:00:00Z').getTime(),
      );
      expect(processedAfter.dataTimezone.start.timestamp).to.equal(
        new Date('2025-03-10T13:00:00Z').getTime(),
      );
    });

    it('should not throw for a wall-time string during DST gap', () => {
      // 2025 US spring-forward: March 9 at 02:00 → 03:00
      // 02:30 on March 9 in NY is in the gap
      const event: SchedulerEvent = {
        id: 'gap-test',
        title: 'DST gap event',
        start: '2025-03-09T02:30:00',
        end: '2025-03-09T03:30:00',
        timezone: 'America/New_York',
      };

      expect(() => processEvent(event, 'America/New_York', adapter)).to.not.throw();
    });

    it('should preserve original string values in modelInBuiltInFormat', () => {
      const event = EventBuilder.new(adapter)
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const processed = processEvent(event, 'Europe/Paris', adapter);

      expect(processed.modelInBuiltInFormat.start).to.equal('2025-01-01T09:00:00');
      expect(processed.modelInBuiltInFormat.end).to.equal('2025-01-01T10:00:00');
    });
  });

  describe('without recurring events plugin', () => {
    it('should warn and leave rrule undefined on both timezones when no plugin is provided', () => {
      const event = EventBuilder.new(adapter).rrule({ freq: 'DAILY' }).build();

      let processed!: ReturnType<typeof processEvent>;
      expect(() => {
        processed = processEvent(event, 'Europe/Paris', adapter);
      }).toWarnDev([
        'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
      ]);

      expect(processed.dataTimezone.rrule).to.equal(undefined);
    });
  });
});
