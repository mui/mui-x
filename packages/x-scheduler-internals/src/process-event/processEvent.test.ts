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
import type { SchedulerEvent } from '../models';
import { BaseTemporal } from '../internals/utils/base-temporal';

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
  });

  describe('displayTimezone', () => {
    it('should read start and end in the display timezone', () => {
      const event = EventBuilder.new().span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z').build();

      // Kiritimati is at UTC+14.
      const processed = processEvent(event, 'Pacific/Kiritimati');
      const { start, end } = processed;
      expect(start.plainDateTime.toString()).to.equal('2025-01-02T00:00:00');
      expect(end.plainDateTime.toString()).to.equal('2025-01-02T02:00:00');
      expect(start.timestamp).to.equal(Date.parse('2025-01-01T10:00:00Z'));
    });

    it('should read an end after 9999 in a timezone east of UTC', () => {
      // December 31st, 9999, a common "no end date", is already January 1st, 10000 in Tokyo.
      const event = EventBuilder.new()
        .withDataTimezone('Asia/Tokyo')
        .span('2025-01-01T10:00:00Z', '9999-12-31T23:30:00Z')
        .build();

      const processed = processEvent(event, 'Asia/Tokyo');

      expect(toPlainDate(processed.end.timestamp, processed.timezone).toString()).to.equal(
        '+010000-01-01',
      );
      expect(processed.end.plainDateTime.toPlainDate().toString()).to.equal('+010000-01-01');
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

    it.each([
      [true, { freq: 'DAILY' as const, until: '2025-01-11' }, '2025-01-11'],
      [true, 'FREQ=DAILY;UNTIL=20250111', '2025-01-11'],
      [false, 'FREQ=DAILY;UNTIL=20250111T150000Z', '2025-01-11T10:00:00'],
    ])('should read the UNTIL of a series with allDay=%s from %j', (allDay, rrule, expected) => {
      const builder = EventBuilder.new().withDataTimezone('America/New_York');
      const event = allDay
        ? builder.span('2025-01-01', '2025-01-02', { allDay: true }).build()
        : builder.build();
      const processed = processEvent(
        { ...event, rrule },
        'Asia/Tokyo',
        schedulerRecurringEventsPlugin,
      );
      // A plain date covers its whole day; a plain date-time is the exact cutoff of a timed series.
      expect(processed.rrule!.until).to.be.instanceOf(
        expected.includes('T') ? BaseTemporal.PlainDateTime : BaseTemporal.PlainDate,
      );
      expect(processed.rrule!.until!.toString()).to.equal(expected);
    });

    it.each<NonNullable<SchedulerEvent['rrule']>>([
      { freq: 'DAILY', until: '2025-01-11T03:00:00Z' },
      'FREQ=DAILY;UNTIL=20250111T030000Z',
    ])('should throw when the until of an all-day series is a date-time: %j', (rrule) => {
      const event = EventBuilder.new()
        .withDataTimezone('America/New_York')
        .span('2025-01-01', '2025-01-02', { allDay: true })
        .build();

      expect(() =>
        processEvent({ ...event, rrule }, 'Asia/Tokyo', schedulerRecurringEventsPlugin),
      ).to.throw(/of the recurrence rule of an all-day event is not a date/);
    });

    it.each<NonNullable<SchedulerEvent['rrule']>>([
      { freq: 'DAILY', until: '2025-01-11' },
      'FREQ=DAILY;UNTIL=20250111',
    ])('should throw when the until of a timed series is a date: %j', (rrule) => {
      const event = EventBuilder.new().withDataTimezone('America/New_York').build();

      expect(() =>
        processEvent({ ...event, rrule }, 'Asia/Tokyo', schedulerRecurringEventsPlugin),
      ).to.throw(/of the recurrence rule of a timed event is not a date-time/);
    });
  });

  describe('all-day events', () => {
    it.each(['UTC', 'America/New_York', 'Asia/Tokyo', 'Pacific/Kiritimati'])(
      'should place a plain-date all-day event on the same day displayed in %s',
      (displayTimezone) => {
        const processed = processEvent(utcJuly4AllDayBuilder().build(), displayTimezone);

        expect(processed.start.plainDateTime.toString()).to.equal('2025-07-04T00:00:00');
        expect(processed.end.plainDateTime.toString()).to.equal('2025-07-05T00:00:00');
        expect(processed.start.timestamp).to.equal(
          toEpochMs(BaseTemporal.PlainDate.from('2025-07-04'), displayTimezone),
        );
      },
    );

    it('should ignore the timezone of an all-day event', () => {
      const event = EventBuilder.new()
        .withDataTimezone('Asia/Tokyo')
        .span('2025-07-04', '2025-07-05', { allDay: true })
        .build();

      const processed = processEvent(event, 'America/New_York');

      expect(processed.start.plainDateTime.toString()).to.equal('2025-07-04T00:00:00');
      expect(processed.end.plainDateTime.toString()).to.equal('2025-07-05T00:00:00');
      expect(processed.timezone).to.equal('Asia/Tokyo');
    });

    it('should read the exception dates of an all-day series as its days', () => {
      const event = EventBuilder.new()
        .span('2025-07-04', '2025-07-05', { allDay: true })
        .exDates(['2025-07-11'])
        .rrule({ freq: 'DAILY' })
        .build();

      const processed = processEvent(event, 'Asia/Tokyo', schedulerRecurringEventsPlugin);

      expect(processed.exDates).to.have.length(1);
      expect(processed.exDates![0].toString()).to.equal('2025-07-11T00:00:00');
    });

    it('should give no day to an all-day event on a day the display timezone skips', () => {
      // Pacific/Apia skipped December 30th, 2011: the event has no day to cover there.
      const event = EventBuilder.new().span('2011-12-30', '2011-12-31', { allDay: true }).build();

      const processed = processEvent(event, 'Pacific/Apia');

      expect(processed.start.timestamp).to.equal(processed.end.timestamp);
    });

    it.each([
      [
        'the old inclusive format',
        { start: '2025-07-04T00:00:00', end: '2025-07-04T23:59:59' },
        /is not an existing date in the YYYY-MM-DD format/,
      ],
      [
        'a one-day span written as start === end',
        { start: '2025-07-04', end: '2025-07-04' },
        /is not after its start/,
      ],
      [
        'an instant exception date',
        {
          start: '2025-07-04',
          end: '2025-07-05',
          exDates: ['2025-07-11T00:00:00Z'],
          rrule: { freq: 'DAILY' as const },
        },
        /exception date/,
      ],
    ])('should throw for %s', (_, overrides, message) => {
      expect(() =>
        processEvent(
          { ...EventBuilder.new().allDay().build(), ...overrides },
          'UTC',
          schedulerRecurringEventsPlugin,
        ),
      ).to.throw(message);
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

    it.each(['2025-01-01T10:00:00Z', '2025-01-01T10:00:00'])(
      'should throw when the timezone is the removed "system" alias, for the date %s',
      (start) => {
        const event = EventBuilder.new()
          .id('event-1')
          .withDataTimezone('system')
          .span(start, '2025-01-01T12:00:00Z')
          .build();

        expect(() => processEvent(event, 'UTC')).to.throw(
          'MUI X Scheduler: The timezone "system" of the event "event-1" is not a supported timezone.',
        );
      },
    );
  });

  describe('string date resolution', () => {
    it('should resolve wall-time strings in the event timezone', () => {
      // "2025-01-01T09:00:00" in America/New_York → 09:00 local → 14:00 UTC (EST = UTC-5)
      const event = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .build();

      const processed = processEvent(event, 'America/New_York');

      expect(processed.start.timestamp).to.equal(new Date('2025-01-01T14:00:00Z').getTime());
      expect(toMsInDay(processed.start.timestamp, processed.timezone)).to.equal(9 * 3_600_000);
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
      expect(processedNY.start.timestamp).to.not.equal(processedTokyo.start.timestamp);
      expect(processedNY.start.timestamp).to.equal(new Date('2025-01-01T14:00:00Z').getTime());
      expect(processedTokyo.start.timestamp).to.equal(new Date('2025-01-01T00:00:00Z').getTime());
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

    it('should read the instants of the event in its timezone for instant strings', () => {
      const event = EventBuilder.new()
        .withDataTimezone('America/New_York')
        .span('2025-01-01T14:00:00Z', '2025-01-01T15:00:00Z')
        .exDates(['2025-01-05T14:00:00Z'])
        .recurrent('DAILY')
        .build();

      const processed = processEvent(event, 'Europe/Paris', schedulerRecurringEventsPlugin);

      // Same instants; day and hour reads answer in the event's timezone.
      expect(processed.start.timestamp).to.equal(new Date('2025-01-01T14:00:00Z').getTime());
      // 14:00 UTC = 09:00 in New York (UTC-5)
      expect(toMsInDay(processed.start.timestamp, processed.timezone)).to.equal(9 * 3_600_000);
      expect(toMsInDay(processed.end.timestamp, processed.timezone)).to.equal(10 * 3_600_000);
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
      expect(getMinutesInDay(processedBefore.start.plainDateTime)).to.equal(9 * 60);
      expect(getMinutesInDay(processedAfter.start.plainDateTime)).to.equal(9 * 60);

      // But different UTC timestamps
      expect(processedBefore.start.timestamp).to.equal(new Date('2025-01-01T14:00:00Z').getTime());
      expect(processedAfter.start.timestamp).to.equal(new Date('2025-03-10T13:00:00Z').getTime());
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
