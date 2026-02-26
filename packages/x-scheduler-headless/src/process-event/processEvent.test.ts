import { adapter } from 'test/utils/scheduler/adapters';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { EventBuilder } from 'test/utils/scheduler/event-builder';
import { SchedulerEvent } from '@mui/x-scheduler-headless/models';

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
    it('should convert start and end to the display timezone', () => {
      const event = EventBuilder.new(adapter)
        .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
        .build();

      const processed = processEvent(event, 'Pacific/Kiritimati', adapter);
      expect(adapter.getTimezone(processed.displayTimezone.start.value)).to.equal(
        'Pacific/Kiritimati',
      );
      expect(adapter.getTimezone(processed.displayTimezone.end.value)).to.equal(
        'Pacific/Kiritimati',
      );
    });

    it('should convert exDates to the display timezone', () => {
      const event = EventBuilder.new(adapter).exDates(['2025-01-05T00:00:00Z']).build();
      const processed = processEvent(event, 'America/New_York', adapter);

      expect(processed.displayTimezone.exDates).to.have.length(1);
      expect(adapter.getTimezone(processed.displayTimezone.exDates![0])).to.equal(
        'America/New_York',
      );
    });

    it('should convert rrule.until to the display timezone when rrule is an object', () => {
      const event = EventBuilder.new(adapter)
        .rrule({
          freq: 'DAILY',
          until: '2025-01-10T23:59:00Z',
        })
        .build();

      const processed = processEvent(event, 'Asia/Tokyo', adapter);

      expect(adapter.getTimezone(processed.displayTimezone.rrule!.until!)).to.equal('Asia/Tokyo');
    });

    it('should parse rrule string and apply timezone conversion to UNTIL', () => {
      const event = EventBuilder.new(adapter).build();

      const processed = processEvent(
        {
          ...event,
          rrule: 'FREQ=DAILY;UNTIL=20250110T230000Z',
        },
        'Pacific/Kiritimati',
        adapter,
      );

      expect(adapter.getTimezone(processed.displayTimezone.rrule!.until!)).to.equal(
        'Pacific/Kiritimati',
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
      expect(adapter.getHours(processed.dataTimezone.start.value)).to.equal(9);
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

      const processed = processEvent(event, 'Europe/Paris', adapter);

      expect(processed.dataTimezone.exDates).to.have.length(1);
      // 09:00 NY (UTC-5) = 14:00 UTC
      expect(processed.dataTimezone.exDates![0].getTime()).to.equal(
        new Date('2025-01-05T14:00:00Z').getTime(),
      );
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
      expect(adapter.getHours(processedBefore.displayTimezone.start.value)).to.equal(9);
      expect(adapter.getHours(processedAfter.displayTimezone.start.value)).to.equal(9);

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
});
