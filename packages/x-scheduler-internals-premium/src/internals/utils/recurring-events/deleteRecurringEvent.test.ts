import {
  addDays,
  createDate,
  EventBuilder,
  setSystemTimezone,
  startOfDay,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import type { SchedulerProcessedEventRecurrenceRule } from '@mui/x-scheduler-internals/models';
import { describe, it, expect } from 'vitest';
import {
  deleteRecurringEvent,
  applyRecurringDeleteFollowing,
  applyRecurringDeleteOnlyThis,
} from './deleteRecurringEvent';

describe('recurring-events/deleteRecurringEvent', () => {
  const defaultEvent = EventBuilder.new()
    .singleDay('2025-01-01T09:00:00Z')
    .rrule({ freq: 'DAILY', interval: 1 })
    .toProcessed();

  describe('deleteRecurringEvent', () => {
    it("should delete the whole event for scope 'all'", () => {
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const result = deleteRecurringEvent(defaultEvent, occurrenceStart, 'all');
      expect(result).to.deep.equal({ deleted: [defaultEvent.id] });
    });

    it('should throw for an unsupported scope', () => {
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      expect(() => {
        deleteRecurringEvent(defaultEvent, occurrenceStart, 'bogus' as any);
      }).to.throw(/not supported for recurring events/);
    });
  });

  describe('applyRecurringDeleteOnlyThis', () => {
    it('should add an EXDATE for the occurrence and keep the series', () => {
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const result = applyRecurringDeleteOnlyThis(defaultEvent, occurrenceStart);

      expect(result.deleted).to.equal(undefined);
      expect(result.created).to.equal(undefined);
      expect(result.updated).to.deep.equal([
        { id: defaultEvent.id, exDates: [startOfDay(occurrenceStart)] },
      ]);
    });

    it('should preserve existing EXDATEs', () => {
      const eventWithExDate = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1 })
        .exDates(['2025-01-02T09:00:00Z'])
        .toProcessed();
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');

      const result = applyRecurringDeleteOnlyThis(eventWithExDate, occurrenceStart);

      expect(result.updated).to.deep.equal([
        {
          id: eventWithExDate.id,
          exDates: [...eventWithExDate.dataTimezone.exDates!, startOfDay(occurrenceStart)],
        },
      ]);
    });

    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)(
      'should exclude the day of the occurrence, whatever the timezone of the system',
      () => {
        // America/Santiago falls back from 00:00 to 23:00 on April 5th, 2026, and
        // Australia/Lord_Howe falls back from 02:00 to 01:30 the same day.
        setSystemTimezone('Australia/Lord_Howe');
        const event = EventBuilder.new()
          .withDataTimezone('America/Santiago')
          .singleDay('2026-04-01T09:00:00')
          .rrule({ freq: 'DAILY' })
          .toProcessed();
        const occurrenceStart = createDate('2026-04-05T09:00:00', 'America/Santiago');

        const result = applyRecurringDeleteOnlyThis(event, occurrenceStart);
        const exDates = result.updated![0].exDates!;

        expect(exDates[0].toISOString()).to.equal('2026-04-05T04:00:00.000Z'); // midnight, April 5th
      },
    );

    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)(
      'should exclude the day of the occurrence when the timezone of the system skips it',
      () => {
        // Pacific/Apia skipped December 30th, 2011.
        setSystemTimezone('Pacific/Apia');
        const event = EventBuilder.new()
          .withDataTimezone('America/New_York')
          .singleDay('2011-12-26T14:00:00Z') // 09:00 EST
          .rrule({ freq: 'DAILY' })
          .toProcessed();
        const occurrenceStart = createDate('2011-12-30T14:00:00Z');

        const result = applyRecurringDeleteOnlyThis(event, occurrenceStart);
        const exDates = result.updated![0].exDates!;

        expect(exDates[0].toISOString()).to.equal('2011-12-30T05:00:00.000Z'); // midnight, December 30th
      },
    );

    it('should delete the whole series when removing the only occurrence of a finite series', () => {
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 1 })
        .toProcessed();
      const occurrenceStart = createDate('2025-01-01T09:00:00Z');

      const result = applyRecurringDeleteOnlyThis(event, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [event.id] });
    });

    it('should delete the whole series when all other occurrences are already excluded', () => {
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 3 })
        .exDates(['2025-01-01T09:00:00Z', '2025-01-02T09:00:00Z'])
        .toProcessed();
      const occurrenceStart = createDate('2025-01-03T09:00:00Z');

      const result = applyRecurringDeleteOnlyThis(event, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [event.id] });
    });

    it('should keep a finite series when other occurrences remain', () => {
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 3 })
        .toProcessed();
      const occurrenceStart = createDate('2025-01-02T09:00:00Z');

      const result = applyRecurringDeleteOnlyThis(event, occurrenceStart);
      expect(result.deleted).to.equal(undefined);
      expect(result.updated).to.deep.equal([
        { id: event.id, exDates: [startOfDay(occurrenceStart)] },
      ]);
    });

    it('should drop the series in the event timezone when removing the only occurrence near a DST change', () => {
      const event = EventBuilder.new()
        .singleDay('2025-03-09T12:00:00Z')
        .withDataTimezone('America/New_York')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY', interval: 1, count: 1 })
        .toProcessed();
      const occurrenceStart = event.dataTimezone.start.value;

      const result = applyRecurringDeleteOnlyThis(event, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [event.id] });
    });
  });

  describe('applyRecurringDeleteFollowing', () => {
    it('should truncate the series to end the day before the occurrence', () => {
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const result = applyRecurringDeleteFollowing(defaultEvent, occurrenceStart);

      expect(result.deleted).to.equal(undefined);
      expect(result.created).to.equal(undefined);
      expect(result.updated).to.deep.equal([
        {
          id: defaultEvent.id,
          rrule: {
            ...defaultEvent.dataTimezone.rrule,
            until: addDays(startOfDay(occurrenceStart), -1),
          },
        },
      ]);
    });

    it('should drop the whole series when the occurrence is on the DTSTART day', () => {
      const occurrenceStart = createDate('2025-01-01T09:00:00Z');
      const result = applyRecurringDeleteFollowing(defaultEvent, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [defaultEvent.id] });
    });

    it('should drop the whole series when all earlier occurrences are excluded by EXDATEs', () => {
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1 })
        .exDates([
          '2025-01-01T09:00:00Z',
          '2025-01-02T09:00:00Z',
          '2025-01-03T09:00:00Z',
          '2025-01-04T09:00:00Z',
        ])
        .toProcessed();
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');

      const result = applyRecurringDeleteFollowing(event, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [event.id] });
    });

    it('should drop COUNT/UNTIL from the truncated rule', () => {
      const countedEvent = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 10 })
        .toProcessed();
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');

      const result = applyRecurringDeleteFollowing(countedEvent, occurrenceStart);
      const rule = result.updated![0].rrule as SchedulerProcessedEventRecurrenceRule;

      expect(rule.count).to.equal(undefined);
      expect(rule.freq).to.equal('DAILY');
      expect(rule.until).to.toEqualDateTime(addDays(startOfDay(occurrenceStart), -1));
    });

    it('should truncate based on the event timezone', () => {
      const original = EventBuilder.new()
        .singleDay('2025-01-03T04:30:00Z')
        .withDataTimezone('America/New_York')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      // 23:30 on January 3rd in New York, January 4th in UTC and Madrid.
      const occurrenceStart = createDate('2025-01-04T04:30:00Z');

      const result = applyRecurringDeleteFollowing(original, occurrenceStart);
      const until = (result.updated![0].rrule as SchedulerProcessedEventRecurrenceRule).until!;

      // The start of January 2nd in New York.
      expect(new Date(until.getTime()).toISOString()).to.equal('2025-01-02T05:00:00.000Z');
    });

    it('should truncate the series to the last day that exists before the occurrence', () => {
      // Pacific/Apia skipped December 30th, 2011.
      const event = EventBuilder.new()
        .withDataTimezone('Pacific/Apia')
        .singleDay('2011-12-28T09:00:00')
        .rrule({ freq: 'DAILY' })
        .toProcessed();
      const occurrenceStart = createDate('2011-12-31T09:00:00', 'Pacific/Apia');

      const result = applyRecurringDeleteFollowing(event, occurrenceStart);
      const until = (result.updated![0].rrule as SchedulerProcessedEventRecurrenceRule).until!;

      expect(until.toISOString()).to.equal('2011-12-29T10:00:00.000Z'); // midnight, December 29th
    });

    it.each([
      // Europe/Paris springs forward from 02:00 to 03:00 on March 29th, 2026.
      { length: 23, occurrence: '2026-03-30T09:00:00', until: '2026-03-28T23:00:00.000Z' },
      // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026.
      { length: 25, occurrence: '2026-10-26T09:00:00', until: '2026-10-24T22:00:00.000Z' },
    ])(
      'should truncate the series to the start of the day before the occurrence when that day lasts $length hours',
      ({ occurrence, until }) => {
        const event = EventBuilder.new()
          .withDataTimezone('Europe/Paris')
          .singleDay('2026-03-01T09:00:00')
          .rrule({ freq: 'DAILY' })
          .toProcessed();
        const occurrenceStart = createDate(occurrence, 'Europe/Paris');

        const result = applyRecurringDeleteFollowing(event, occurrenceStart);
        const rule = result.updated![0].rrule as SchedulerProcessedEventRecurrenceRule;

        expect(rule.until!.toISOString()).to.equal(until); // midnight
      },
    );

    it('should truncate the series to the midnight of the day before a DST transition at midnight', () => {
      // America/Havana springs forward from 00:00 to 01:00 on March 8th, 2026.
      const event = EventBuilder.new()
        .withDataTimezone('America/Havana')
        .singleDay('2026-03-01T09:00:00')
        .rrule({ freq: 'DAILY' })
        .toProcessed();
      const occurrenceStart = createDate('2026-03-08T09:00:00', 'America/Havana');

      const result = applyRecurringDeleteFollowing(event, occurrenceStart);
      const rule = result.updated![0].rrule as SchedulerProcessedEventRecurrenceRule;

      expect(rule.until!.toISOString()).to.equal('2026-03-07T05:00:00.000Z'); // midnight, March 7th
    });
  });
});
