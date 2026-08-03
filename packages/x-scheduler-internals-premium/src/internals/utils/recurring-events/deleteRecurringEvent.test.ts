import { adapter, EventBuilder } from 'test/utils/scheduler';
import type { SchedulerProcessedEventRecurrenceRule } from '@mui/x-scheduler-internals/models';
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
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const result = deleteRecurringEvent(adapter, defaultEvent, occurrenceStart, 'all');
      expect(result).to.deep.equal({ deleted: [defaultEvent.id] });
    });

    it('should throw for an unsupported scope', () => {
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      expect(() => {
        deleteRecurringEvent(adapter, defaultEvent, occurrenceStart, 'bogus' as any);
      }).to.throw(/not supported for recurring events/);
    });
  });

  describe('applyRecurringDeleteOnlyThis', () => {
    it('should add an EXDATE for the occurrence and keep the series', () => {
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const result = applyRecurringDeleteOnlyThis(adapter, defaultEvent, occurrenceStart);

      expect(result.deleted).to.equal(undefined);
      expect(result.created).to.equal(undefined);
      expect(result.updated).to.deep.equal([
        { id: defaultEvent.id, exDates: [adapter.startOfDay(occurrenceStart)] },
      ]);
    });

    it('should preserve existing EXDATEs', () => {
      const eventWithExDate = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1 })
        .exDates(['2025-01-02T09:00:00Z'])
        .toProcessed();
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');

      const result = applyRecurringDeleteOnlyThis(adapter, eventWithExDate, occurrenceStart);

      expect(result.updated).to.deep.equal([
        {
          id: eventWithExDate.id,
          exDates: [...eventWithExDate.dataTimezone.exDates!, adapter.startOfDay(occurrenceStart)],
        },
      ]);
    });

    it('should delete the whole series when removing the only occurrence of a finite series', () => {
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 1 })
        .toProcessed();
      const occurrenceStart = adapter.date('2025-01-01T09:00:00Z', 'default');

      const result = applyRecurringDeleteOnlyThis(adapter, event, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [event.id] });
    });

    it('should delete the whole series when all other occurrences are already excluded', () => {
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 3 })
        .exDates(['2025-01-01T09:00:00Z', '2025-01-02T09:00:00Z'])
        .toProcessed();
      const occurrenceStart = adapter.date('2025-01-03T09:00:00Z', 'default');

      const result = applyRecurringDeleteOnlyThis(adapter, event, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [event.id] });
    });

    it('should keep a finite series when other occurrences remain', () => {
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 3 })
        .toProcessed();
      const occurrenceStart = adapter.date('2025-01-02T09:00:00Z', 'default');

      const result = applyRecurringDeleteOnlyThis(adapter, event, occurrenceStart);
      expect(result.deleted).to.equal(undefined);
      expect(result.updated).to.deep.equal([
        { id: event.id, exDates: [adapter.startOfDay(occurrenceStart)] },
      ]);
    });

    it('should drop the series in the event timezone when removing the only occurrence near a DST change', () => {
      const event = EventBuilder.new(adapter)
        .singleDay('2025-03-09T12:00:00Z')
        .withDataTimezone('America/New_York')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY', interval: 1, count: 1 })
        .toProcessed();
      const occurrenceStart = event.dataTimezone.start.value;

      const result = applyRecurringDeleteOnlyThis(adapter, event, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [event.id] });
    });
  });

  describe('applyRecurringDeleteFollowing', () => {
    it('should truncate the series to end the day before the occurrence', () => {
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const result = applyRecurringDeleteFollowing(adapter, defaultEvent, occurrenceStart);

      expect(result.deleted).to.equal(undefined);
      expect(result.created).to.equal(undefined);
      expect(result.updated).to.deep.equal([
        {
          id: defaultEvent.id,
          rrule: {
            ...defaultEvent.dataTimezone.rrule,
            until: adapter.addDays(adapter.startOfDay(occurrenceStart), -1),
          },
        },
      ]);
    });

    it('should drop the whole series when the occurrence is on the DTSTART day', () => {
      const occurrenceStart = adapter.date('2025-01-01T09:00:00Z', 'default');
      const result = applyRecurringDeleteFollowing(adapter, defaultEvent, occurrenceStart);
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
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');

      const result = applyRecurringDeleteFollowing(adapter, event, occurrenceStart);
      expect(result).to.deep.equal({ deleted: [event.id] });
    });

    it('should drop COUNT/UNTIL from the truncated rule', () => {
      const countedEvent = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 10 })
        .toProcessed();
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');

      const result = applyRecurringDeleteFollowing(adapter, countedEvent, occurrenceStart);
      const rule = result.updated![0].rrule as SchedulerProcessedEventRecurrenceRule;

      expect(rule.count).to.equal(undefined);
      expect(rule.freq).to.equal('DAILY');
      expect(rule.until).to.toEqualDateTime(
        adapter.addDays(adapter.startOfDay(occurrenceStart), -1),
      );
    });

    it('should truncate based on the event timezone', () => {
      const original = EventBuilder.new(adapter)
        .singleDay('2025-01-03T04:30:00Z')
        .withDataTimezone('America/New_York')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const occurrenceStart = adapter.date('2025-01-04T04:30:00Z', 'default');
      const occurrenceStartDataTz = adapter.setTimezone(occurrenceStart, 'America/New_York');

      const result = applyRecurringDeleteFollowing(adapter, original, occurrenceStartDataTz);
      const until = (result.updated![0].rrule as SchedulerProcessedEventRecurrenceRule).until!;

      expect(adapter.getDate(until)).to.equal(2);
    });
  });
});
