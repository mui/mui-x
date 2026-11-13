import { processEvent } from '@mui/x-scheduler-internals/process-event';
import { EventBuilder } from 'test/utils/scheduler/event-builder';
import { utcJuly4AllDayBuilder } from 'test/utils/scheduler/fixtures';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import {
  getMinutesInDay,
  toEpochMs,
  toMsInDay,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import { describe, it, expect } from 'vitest';

describe('processEvent', () => {
  it('should keep event timezone in modelInBuiltInFormat', () => {
    const event = EventBuilder.new()
      .withDataTimezone('America/New_York')
      .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
      .build();

    const processed = processEvent(event, 'Pacific/Kiritimati');

    expect(processed.modelInBuiltInFormat.timezone).to.equal('America/New_York');
  });

  it('should fallback to "default" timezone when event.timezone is not provided', () => {
    const event = EventBuilder.new().build();

    const processed = processEvent(event, 'Europe/Paris');

    expect(processed.timezone).to.equal('default');
    expect(processed.unstable_internalInfos.displayTimezone).to.equal('Europe/Paris');
  });

  describe('displayTimezone', () => {
    it('should read start and end in the display timezone', () => {
      const event = EventBuilder.new().span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z').build();

      // Kiritimati is at UTC+14.
      const processed = processEvent(event, 'Pacific/Kiritimati');
      const { start, end } = processed;
      expect(start.value.toString()).to.equal('2025-01-02T00:00:00');
      expect(end.value.toString()).to.equal('2025-01-02T02:00:00');
      expect(start.timestamp).to.equal(Date.parse('2025-01-01T10:00:00Z'));
    });

    it('should spread an all-day event over whole days of the display timezone', () => {
      // July 4th in UTC runs from 20:00 on July 3rd to 19:59 on July 4th in New York.
      const processed = processEvent(utcJuly4AllDayBuilder().build(), 'America/New_York');

      const { start, end } = processed;
      expect(start.value.toString()).to.equal('2025-07-03T00:00:00');
      expect(end.value.toString()).to.equal('2025-07-04T23:59:59.999');
      expect(
        toPlainDate(processed.unstable_internalInfos.dataStart, processed.timezone).toString(),
      ).to.equal('2025-07-04');
    });

    it('should read an end after 9999 in a timezone east of UTC', () => {
      // December 31st, 9999, a common "no end date", is already January 1st, 10000 in Tokyo.
      const event = EventBuilder.new()
        .withDataTimezone('Asia/Tokyo')
        .span('2025-01-01T10:00:00Z', '9999-12-31T23:30:00Z')
        .build();

      const processed = processEvent(event, 'Asia/Tokyo');

      expect(
        toPlainDate(processed.unstable_internalInfos.dataEnd, processed.timezone).toString(),
      ).to.equal('+010000-01-01');
      expect(processed.end.value.toPlainDate().toString()).to.equal('+010000-01-01');
    });

    it('should read the instants of the exDates in the timezone of the event', () => {
      const event = EventBuilder.new()
        .withDataTimezone('America/New_York')
        .exDates(['2025-01-05T00:00:00Z'])
        .build();
      const processed = processEvent(event, 'Europe/Paris');

      expect(processed.exDates).to.have.length(1);
      expect(processed.exDates![0].toString()).to.equal('2025-01-04T19:00:00');
    });

    it('should read rrule.until as its day in the timezone of the event when rrule is an object', () => {
      // The rule is expressed in the timezone the series expands in, not the display one: this
      // instant is January 10th in New York, but January 11th in UTC and in Tokyo.
      const event = EventBuilder.new()
        .withDataTimezone('America/New_York')
        .rrule({
          freq: 'DAILY',
          until: '2025-01-11T03:00:00Z',
        })
        .build();

      const processed = processEvent(event, 'Asia/Tokyo', schedulerRecurringEventsPlugin);

      expect(processed.rrule!.until!.toString()).to.equal('2025-01-10');
    });

    it('should parse an rrule string and read its UNTIL as its day in the timezone of the event', () => {
      const event = EventBuilder.new().withDataTimezone('America/New_York').build();

      const processed = processEvent(
        {
          ...event,
          rrule: 'FREQ=DAILY;UNTIL=20250111T030000Z',
        },
        'Pacific/Kiritimati',
        schedulerRecurringEventsPlugin,
      );

      expect(processed.rrule!.until!.toString()).to.equal('2025-01-10');
    });
  });
  describe('dataTimezone', () => {
    it('should keep original timezone in dataTimezone', () => {
      const event = EventBuilder.new()
        .withDataTimezone('America/New_York')
        .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
        .build();

      const processed = processEvent(event, 'Pacific/Kiritimati');

      expect(processed.timezone).to.equal('America/New_York');
    });
  });

  describe('string date resolution', () => {
    it('should resolve wall-time strings in the event timezone', () => {
      // "2025-01-01T09:00:00" in America/New_York → 09:00 local → 14:00 UTC (EST = UTC-5)
      const event = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const processed = processEvent(event, 'America/New_York');

      expect(processed.unstable_internalInfos.dataStart).to.equal(
        new Date('2025-01-01T14:00:00Z').getTime(),
      );
      expect(toMsInDay(processed.unstable_internalInfos.dataStart, processed.timezone)).to.equal(
        9 * 3_600_000,
      );
    });

    it('should produce different UTC instants for same wall-time string in different timezones', () => {
      const eventNY = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const eventTokyo = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('Asia/Tokyo')
        .build();

      const processedNY = processEvent(eventNY, 'UTC');
      const processedTokyo = processEvent(eventTokyo, 'UTC');

      // 09:00 NY (UTC-5) = 14:00 UTC vs 09:00 Tokyo (UTC+9) = 00:00 UTC
      expect(processedNY.unstable_internalInfos.dataStart).to.not.equal(
        processedTokyo.unstable_internalInfos.dataStart,
      );
      expect(processedNY.unstable_internalInfos.dataStart).to.equal(
        new Date('2025-01-01T14:00:00Z').getTime(),
      );
      expect(processedTokyo.unstable_internalInfos.dataStart).to.equal(
        new Date('2025-01-01T00:00:00Z').getTime(),
      );
    });

    it('should resolve wall-time exDates to date objects in dataTimezone', () => {
      const event = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .exDates(['2025-01-05T09:00:00'])
        .recurrent('DAILY')
        .build();

      const processed = processEvent(event, 'Europe/Paris', schedulerRecurringEventsPlugin);

      expect(processed.exDates).to.have.length(1);
      // 09:00 NY (UTC-5) = 14:00 UTC
      expect(toEpochMs(processed.exDates![0], processed.timezone)).to.equal(
        Date.parse('2025-01-05T14:00:00Z'),
      );
    });

    it('should read the data-timezone bag in the event timezone for instant strings', () => {
      const event = EventBuilder.new()
        .withDataTimezone('America/New_York')
        .span('2025-01-01T14:00:00Z', '2025-01-01T15:00:00Z')
        .exDates(['2025-01-05T14:00:00Z'])
        .recurrent('DAILY')
        .build();

      const processed = processEvent(event, 'Europe/Paris', schedulerRecurringEventsPlugin);

      // Same instants; day and hour reads answer in the event's timezone.
      expect(processed.unstable_internalInfos.dataStart).to.equal(
        new Date('2025-01-01T14:00:00Z').getTime(),
      );
      // 14:00 UTC = 09:00 in New York (UTC-5)
      expect(toMsInDay(processed.unstable_internalInfos.dataStart, processed.timezone)).to.equal(
        9 * 3_600_000,
      );
      expect(toMsInDay(processed.unstable_internalInfos.dataEnd, processed.timezone)).to.equal(
        10 * 3_600_000,
      );
      expect(processed.exDates![0].toString()).to.equal('2025-01-05T09:00:00');
    });

    it('should keep local hour across DST spring-forward for wall-time events', () => {
      // 2025 US spring-forward: March 9 at 02:00 → 03:00
      // Before DST (Jan 1): 09:00 NY = UTC-5 → 14:00 UTC
      // After DST (Mar 10): 09:00 NY = UTC-4 → 13:00 UTC
      const eventBefore = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const eventAfter = EventBuilder.new()
        .span('2025-03-10T09:00:00', '2025-03-10T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const processedBefore = processEvent(eventBefore, 'America/New_York');
      const processedAfter = processEvent(eventAfter, 'America/New_York');

      // Both should show 09:00 local
      expect(getMinutesInDay(processedBefore.start.value)).to.equal(9 * 60);
      expect(getMinutesInDay(processedAfter.start.value)).to.equal(9 * 60);

      // But different UTC timestamps
      expect(processedBefore.unstable_internalInfos.dataStart).to.equal(
        new Date('2025-01-01T14:00:00Z').getTime(),
      );
      expect(processedAfter.unstable_internalInfos.dataStart).to.equal(
        new Date('2025-03-10T13:00:00Z').getTime(),
      );
    });

    it('should preserve original string values in modelInBuiltInFormat', () => {
      const event = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const processed = processEvent(event, 'Europe/Paris');

      expect(processed.modelInBuiltInFormat.start).to.equal('2025-01-01T09:00:00');
      expect(processed.modelInBuiltInFormat.end).to.equal('2025-01-01T10:00:00');
    });
  });

  describe('without recurring events plugin', () => {
    it('should warn and leave rrule undefined on both timezones when no plugin is provided', () => {
      const event = EventBuilder.new().rrule({ freq: 'DAILY' }).build();

      let processed!: ReturnType<typeof processEvent>;
      expect(() => {
        processed = processEvent(event, 'Europe/Paris');
      }).toWarnDev([
        'MUI X Scheduler: Recurring events are not enabled. The `rrule` property will be ignored.',
      ]);

      expect(processed.rrule).to.equal(undefined);
    });
  });
});
