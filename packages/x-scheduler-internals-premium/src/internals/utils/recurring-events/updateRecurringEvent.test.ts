import {
  BaseTemporal,
  toEventDateStrings,
  toEpochMs,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import { processEvent } from '@mui/x-scheduler-internals/process-event';
import { createProcessedDate } from '@mui/x-scheduler-internals/process-date';
import {
  addMinutes,
  createDate,
  createOccurrence,
  EventBuilder,
  setSystemTimezone,
  startOfDay,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import type {
  SchedulerEventUpdatedProperties,
  RecurringEventByDayValue,
  SchedulerEventRecurrenceRule,
  SchedulerProcessedEventRecurrenceRule,
} from '@mui/x-scheduler-internals/models';
import { describe, it, expect } from 'vitest';
import { schedulerRecurringEventsPlugin } from '../../plugins/schedulerRecurringEventsPlugin';
import {
  adjustRRuleForAllMove,
  applyRecurringUpdateAll,
  applyRecurringUpdateFollowing,
  applyRecurringUpdateOnlyThis,
  decideSplitRRule,
} from './updateRecurringEvent';
import { getRecurringEventOccurrencesForVisibleDays } from './getRecurringEventOccurrencesForVisibleDays';

// The store gives the events it creates their own id.
function withoutId<T extends { id: unknown }>(model: T): Omit<T, 'id'> {
  const { id: unusedId, ...rest } = model;
  return rest;
}

describe('recurring-events/updateRecurringEvent', () => {
  const defaultEvent = EventBuilder.new()
    .singleDay('2025-01-01T09:00:00Z')
    .rrule({ freq: 'DAILY', interval: 1 })
    .toProcessed();

  describe('decideSplitRRule', () => {
    const seriesStart = createDate('2025-01-01T09:00:00Z'); // DTSTART
    const splitStart = createDate('2025-01-06T15:00:00Z'); // "this and following" starts here

    const call = (
      originalRule: SchedulerProcessedEventRecurrenceRule,
      changes: Partial<SchedulerEventUpdatedProperties> = {},
      originalSeriesStart = seriesStart,
      split = splitStart,
    ) =>
      decideSplitRRule(
        {
          ...defaultEvent,
          rrule: originalRule,
          start: createProcessedDate(originalSeriesStart.getTime(), 'default'),
        },
        split.getTime(),
        changes,
        'default',
      ) as SchedulerProcessedEventRecurrenceRule | undefined;

    describe('should inherit base pattern when RRULE not explicitly changed', () => {
      it('should inherit base pattern when RRULE not touched and there are no boundaries', () => {
        const original: SchedulerProcessedEventRecurrenceRule = { freq: 'DAILY', interval: 2 };
        const res = call(original, { title: 'New Event Title' });
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 2 });
      });

      it('should inherit base pattern and recomputes COUNT to remaining occurrences when RRULE not touched', () => {
        // Original: daily with count 42 from Jan 01
        // Split on Jan 06 => Jan 01..05 consumed => remaining 37 => new COUNT=37
        const original: SchedulerProcessedEventRecurrenceRule = {
          freq: 'DAILY',
          interval: 1,
          count: 42,
        };

        const res = call(original, { title: 'New Event Title' });
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 1, count: 37 });
      });

      it('should count the excluded occurrences toward the COUNT of the new series', () => {
        // Daily with count 5 from Jan 01, Jan 02 excluded
        // Split on Jan 04 => Jan 01..03 consumed => remaining 2 => new COUNT=2
        const event = EventBuilder.new()
          .singleDay('2025-01-01T09:00:00Z')
          .rrule({ freq: 'DAILY', count: 5 })
          .exDates(['2025-01-02Z'])
          .toProcessed();

        const res = decideSplitRRule(
          event,
          Date.parse('2025-01-04T09:00:00Z'),
          { title: 'New Event Title' },
          'default',
        );
        expect(res).to.deep.equal({ freq: 'DAILY', count: 2 });
      });

      it('should keep the original UNTIL when inheriting (untouched RRULE)', () => {
        const originalUntil = BaseTemporal.PlainDate.from('2025-01-20');
        const original: SchedulerProcessedEventRecurrenceRule = {
          freq: 'DAILY',
          interval: 1,
          until: originalUntil,
        };

        const res = call(original, { title: 'New Event Title' })!;
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 1, until: originalUntil });
      });

      describe('weekly realignment (BYDAY swap)', () => {
        it('should keep pattern selectors when inheriting (e.g., WEEKLY BYDAY)', () => {
          const original: SchedulerProcessedEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['MO', 'WE'],
          };
          const res = call(original, { title: 'New Event Title' });
          expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE'] });
        });

        it('should realign WEEKLY BYDAY when moving the day of the occurrence', () => {
          // Expect MO,WE → TU,WE (preserve pattern, swap only the edited weekday).
          const original: SchedulerProcessedEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['MO', 'WE'],
          };
          const movedStart = createDate('2025-01-07T15:00:00Z');
          const res = call(original, { start: movedStart.getTime() });
          expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['TU', 'WE'] });
        });

        it('should avoid duplicates when new weekday already exists (MO→TU with TU present)', () => {
          // Expect MO,TU and moving MO → TU to result in just TU (no duplicate).
          const original: SchedulerProcessedEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['MO', 'TU'],
          };
          const movedStart = createDate('2025-01-07T10:00:00Z');
          const res = call(original, { start: movedStart.getTime() });
          expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['TU'] });
        });
      });

      describe('monthly realignment (BYMONTHDAY swap / ordinal BYDAY)', () => {
        it('should realign to new day of month (10th → 12th) (BYMONTHDAY)', () => {
          const original: SchedulerProcessedEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [10],
          };
          const movedStart = createDate('2025-03-12T10:00:00Z');
          expect(call(original, { start: movedStart.getTime() })).to.deep.equal({
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [12],
          });
        });

        it('should recompute ordinal+weekday (2TU → 3WE) (ordinal BYDAY)', () => {
          const startMonth = createDate('2025-07-01T00:00:00Z');
          const original: SchedulerProcessedEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['2TU'],
          };
          const thirdWed = createDate('2025-07-16T10:00:00Z'); // 3rd Wednesday
          expect(
            call(original, { start: thirdWed.getTime() }, startMonth, startOfDay(thirdWed)),
          ).to.deep.equal({ freq: 'MONTHLY', interval: 1, byDay: ['3WE'] });
        });

        it('should use -1 for last weekday of month (→ -1FR) (ordinal BYDAY)', () => {
          const monthStart = createDate('2025-10-01T00:00:00Z');
          const original: SchedulerProcessedEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['2TU'],
          };
          const lastFri = createDate('2025-10-31T09:00:00Z'); // last Friday
          expect(
            call(original, { start: lastFri.getTime() }, monthStart, startOfDay(lastFri)),
          ).to.deep.equal({ freq: 'MONTHLY', interval: 1, byDay: ['-1FR'] });
        });
      });
    });
  });

  describe('applyRecurringUpdateFollowing', () => {
    it('should truncate the original series at the day before the edited occurrence and appends the new series', () => {
      // Original: daily from Jan 01
      // Edit an occurrence on Jan 05
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        // New timing for the split series
        start: createDate('2025-01-05T11:00:00Z').getTime(),
        end: createDate('2025-01-05T12:00:00Z').getTime(),
        title: 'Edited Event',
        // rrule omitted → inherit from original
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      // Original remains but with truncated rule, new series appended, other event unchanged
      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.updated).to.have.length(1);
      const { id, rrule } = updatedEvents.updated![0];
      const { until, ...truncatedRule } = rrule as SchedulerProcessedEventRecurrenceRule;
      expect(id).to.equal(defaultEvent.id);
      expect(truncatedRule).to.deep.equal(defaultEvent.rrule);
      expect(until).toEqualPlainDate('2025-01-04');
      expect(updatedEvents.created).to.deep.equal([
        {
          ...withoutId(defaultEvent.modelInBuiltInFormat),
          title: 'Edited Event',
          start: new Date(changes.start!).toISOString(),
          end: new Date(changes.end!).toISOString(),
          extractedFromId: defaultEvent.id,
          rrule: {
            ...defaultEvent.rrule,
          },
        },
      ]);
    });

    it('should drop the original series when occurrence is on the DTSTART day (no remaining occurrences)', () => {
      // Original: daily from Jan 10
      const original = EventBuilder.new()
        .singleDay('2025-01-10T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      // occurrenceStart same calendar day as DTSTART → shouldDropOldSeries = true
      const occurrenceStart = createDate('2025-01-10T09:00:00Z');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: createDate('2025-01-10T12:00:00Z').getTime(),
        end: createDate('2025-01-10T13:00:00Z').getTime(),
        title: 'Edited First',
        // rrule omitted → inherit
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
        'default',
      );

      // Original removed, new series added, other keeps
      expect(updatedEvents.deleted).to.deep.equal([original.id]);
      expect(updatedEvents.updated).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          ...withoutId(original.modelInBuiltInFormat),
          title: 'Edited First',
          start: new Date(changes.start!).toISOString(),
          end: new Date(changes.end!).toISOString(),
          extractedFromId: original.id,
          rrule: {
            ...original.rrule,
          },
        },
      ]);
    });

    it('should use provided changes.rrule for the new series', () => {
      // Original: daily from Jan 01
      const occurrenceStart = createDate('2025-01-03T09:00:00Z');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        start: createDate('2025-01-03T10:00:00Z').getTime(),
        end: createDate('2025-01-03T11:00:00Z').getTime(),
        rrule: {
          freq: 'WEEKLY',
          interval: 2,
          count: 5,
        },
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      expect(updatedEvents.created).to.have.length(1);
      expect(updatedEvents.created![0].rrule).to.deep.equal({
        freq: 'WEEKLY',
        interval: 2,
        count: 5,
      });
    });

    it('should remove recurrence for the new series when changes.rrule is explicitly undefined', () => {
      // Original: daily from Jan 01
      const occurrenceStart = createDate('2025-01-04T09:00:00Z');

      const changes = {
        id: defaultEvent.id,
        start: createDate('2025-01-04T12:00:00Z').getTime(),
        end: createDate('2025-01-04T13:00:00Z').getTime(),
        rrule: undefined,
      };

      const updated = applyRecurringUpdateFollowing(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      expect(updated.created).to.have.length(1);
      expect(updated.created![0].rrule).to.equal(undefined);
    });

    it('should preserve wall-time format (no Z suffix) in start/end of created event', () => {
      const wallTimeEvent = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      const occurrenceStart = createDate('2025-01-05T09:00:00', 'America/New_York');
      const changes: SchedulerEventUpdatedProperties = {
        id: wallTimeEvent.id,
        start: createDate('2025-01-05T11:00:00', 'America/New_York').getTime(),
        end: createDate('2025-01-05T12:00:00', 'America/New_York').getTime(),
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        wallTimeEvent,
        createOccurrence(wallTimeEvent, occurrenceStart),
        changes,
        'default',
      );

      const createdEvent = updatedEvents.created![0];
      expect(createdEvent.start).not.to.include('Z');
      expect(createdEvent.end).not.to.include('Z');
    });

    it.each([{ freq: 'DAILY' as const, until: '2025-01-10' }, 'FREQ=DAILY;UNTIL=20250110'])(
      'should preserve a date-only UNTIL when splitting an all-day series (%j)',
      (rrule) => {
        const event = EventBuilder.new().span('2025-01-01', '2025-01-02', { allDay: true }).build();
        const original = processEvent(
          { ...event, rrule },
          'default',
          schedulerRecurringEventsPlugin,
        );
        const result = applyRecurringUpdateFollowing(
          original,
          createOccurrence(original, createDate('2025-01-05T00:00:00')),
          { id: event.id, title: 'Updated' },
          'default',
        );
        expect((result.created![0].rrule as SchedulerEventRecurrenceRule).until).to.equal(
          '2025-01-10',
        );
      },
    );

    it('should write the dates of a series with offsets as instants', () => {
      const offsetEvent = EventBuilder.new()
        .span('2025-01-01T09:00:00+01:00', '2025-01-01T10:00:00+01:00')
        .withDataTimezone('Europe/Paris')
        .rrule({ freq: 'DAILY', interval: 1, until: '2025-01-10T09:00:00+01:00' })
        .exDates(['2025-01-07T09:00:00+01:00'])
        .toProcessed();

      const updatedEvents = applyRecurringUpdateFollowing(
        offsetEvent,
        createOccurrence(offsetEvent, new Date('2025-01-05T08:00:00Z')),
        {
          id: offsetEvent.id,
          start: new Date('2025-01-05T10:00:00Z').getTime(),
          end: new Date('2025-01-05T11:00:00Z').getTime(),
          exDates: [new Date('2025-01-08T10:00:00Z').getTime()],
        },
        'default',
      );

      const createdEvent = updatedEvents.created![0];
      expect(createdEvent.start).to.equal('2025-01-05T10:00:00.000Z');
      expect(createdEvent.end).to.equal('2025-01-05T11:00:00.000Z');
      expect(createdEvent.exDates).to.deep.equal(['2025-01-08T10:00:00.000Z']);
      // The exact cutoff in Paris is preserved as a UTC instant.
      expect((createdEvent.rrule as SchedulerEventRecurrenceRule).until).to.equal(
        '2025-01-10T08:00:00.000Z',
      );
    });

    it('should start the new series at the occurrence date, not DTSTART, when changes.start is not provided', () => {
      // Daily series from Jan 01.
      // Edit "this and following" on Jan 05 with only a title change (no start change).
      // Expected: new series starts at Jan 05 (the occurrence), NOT at Jan 01 (DTSTART).
      // Bug: if the new series starts at DTSTART, it overlaps with the truncated original (Jan 01–04).
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        title: 'Title-only change',
        // no start/end changes
      };

      const result = applyRecurringUpdateFollowing(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      // New series must start on Jan 05, not Jan 01
      const newEventStart = result.created![0].start as string;
      expect(createDate(newEventStart).getDate()).to.equal(5);
    });

    it('should not count a day the timezone skips toward the COUNT of the new series', () => {
      // Pacific/Apia skipped December 30th, 2011: the series runs on December 28th, 29th and 31st,
      // and on January 1st and 2nd.
      const event = EventBuilder.new()
        .withDataTimezone('Pacific/Apia')
        .singleDay('2011-12-28T09:00:00')
        .rrule({ freq: 'DAILY', count: 5 })
        .toProcessed();
      const occurrenceStart = createDate('2012-01-01T09:00:00', 'Pacific/Apia');

      const result = applyRecurringUpdateFollowing(
        event,
        createOccurrence(event, occurrenceStart),
        {
          id: event.id,
          title: 'New title',
        },
        'default',
      );

      expect(result.created![0].rrule).to.deep.equal({ freq: 'DAILY', count: 2 });
      expect(result.updated![0].rrule).to.have.property('until');
    });
  });

  describe('adjustRRuleForAllMove', () => {
    it('should realign BYDAY from Sunday to Saturday when destination day changes on a WEEKLY rule', () => {
      const rrule = { freq: 'WEEKLY' as const, byDay: ['SU' as const] };
      const occurrenceStart = createDate('2025-01-05T09:00:00Z'); // Sunday
      const newStart = createDate('2025-01-11T11:00:00Z'); // Saturday

      const next = adjustRRuleForAllMove(
        rrule,
        occurrenceStart.getTime(),
        newStart.getTime(),
        'default',
      );

      expect(next).to.deep.equal({ freq: 'WEEKLY', byDay: ['SA'] });
    });

    it('should swap only the edited weekday and preserve the rest for WEEKLY with multiple BYDAY values', () => {
      const rrule = {
        freq: 'WEEKLY' as const,
        byDay: ['MO', 'WE', 'SU'] as RecurringEventByDayValue[],
      };
      const occurrenceStart = createDate('2025-01-05T09:00:00Z'); // SU
      const newStart = createDate('2025-01-11T11:00:00Z'); // SA

      const next = adjustRRuleForAllMove(
        rrule,
        occurrenceStart.getTime(),
        newStart.getTime(),
        'default',
      );

      expect(next).to.deep.equal({ freq: 'WEEKLY', byDay: ['MO', 'WE', 'SA'] });
    });

    it('should align the day-of-month to the destination date for MONTHLY (BYMONTHDAY)', () => {
      const rrule = { freq: 'MONTHLY' as const, byMonthDay: [5] };
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const newStart = createDate('2025-01-12T11:00:00Z');

      const next = adjustRRuleForAllMove(
        rrule,
        occurrenceStart.getTime(),
        newStart.getTime(),
        'default',
      );

      expect(next).to.deep.equal({ freq: 'MONTHLY', byMonthDay: [12] });
    });

    it('should recompute ordinal + weekday based on destination date for MONTHLY (ordinal BYDAY)', () => {
      // 2TU (second Tuesday) -> destination is 2025-01-18 (Saturday) which is 3rd Saturday in Jan 2025
      const rrule = { freq: 'MONTHLY' as const, byDay: ['2TU' as const] };
      const occurrenceStart = createDate('2025-01-14T09:00:00Z'); // second Tuesday
      const newStart = createDate('2025-01-18T11:00:00Z'); // third Saturday

      const next = adjustRRuleForAllMove(
        rrule,
        occurrenceStart.getTime(),
        newStart.getTime(),
        'default',
      );

      expect(next).to.deep.equal({ freq: 'MONTHLY', byDay: ['3SA'] });
    });

    it('should read the weekdays in the timezone for WEEKLY', () => {
      const rrule = { freq: 'WEEKLY' as const, byDay: ['SU' as const] };
      // Monday and Saturday at 03:00 UTC are Sunday and Friday at 22:00 in New York.
      const occurrenceStart = createDate('2025-01-06T03:00:00Z');
      const newStart = createDate('2025-01-11T03:00:00Z');

      const next = adjustRRuleForAllMove(
        rrule,
        occurrenceStart.getTime(),
        newStart.getTime(),
        'America/New_York',
      );

      expect(next).to.deep.equal({ freq: 'WEEKLY', byDay: ['FR'] });
    });

    it('should read the day of the month in the timezone for MONTHLY (BYMONTHDAY)', () => {
      const rrule = { freq: 'MONTHLY' as const, byMonthDay: [5] };
      const occurrenceStart = createDate('2025-01-06T03:00:00Z');
      // January 12th at 03:00 UTC is January 11th at 22:00 in New York.
      const newStart = createDate('2025-01-12T03:00:00Z');

      const next = adjustRRuleForAllMove(
        rrule,
        occurrenceStart.getTime(),
        newStart.getTime(),
        'America/New_York',
      );

      expect(next).to.deep.equal({ freq: 'MONTHLY', byMonthDay: [11] });
    });

    it('should return the same rule (no weekday pattern to adjust)', () => {
      const rrule = { freq: 'DAILY' as const, interval: 1 };
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const newStart = createDate('2025-01-12T11:00:00Z');

      const next = adjustRRuleForAllMove(
        rrule,
        occurrenceStart.getTime(),
        newStart.getTime(),
        'default',
      );

      expect(next).to.deep.equal(rrule);
    });
  });

  describe('applyRecurringUpdateAll', () => {
    it('should replace exactly one event without creating duplicates', () => {
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const changes = {
        id: defaultEvent.id,
        title: 'Rec 1 Updated',
      };

      const updatedEvents = applyRecurringUpdateAll(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );
      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([changes]);
    });

    it('should preserve the original DTSTART day when editing an occurrence that appears shifted due to timezone conversion', () => {
      // Original timezone = Tokyo (UTC+9)
      // 2025-01-10 00:30 JST → 2025-01-09 15:30 UTC
      const original = EventBuilder.new()
        .singleDay('2025-01-09T15:30:00Z')
        .withDataTimezone('Asia/Tokyo')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const occurrenceStart = new Date(original.start.timestamp);

      // Changes come as instants
      // 00:40 JST → 2025-01-09T15:40:00Z
      // 01:30 JST → 2025-01-09T16:30:00Z
      const changes = {
        id: original.id,
        start: createDate('2025-01-09T15:40:00Z').getTime(),
        end: createDate('2025-01-09T16:30:00Z').getTime(),
      };

      const updated = applyRecurringUpdateAll(
        original,
        createOccurrence(original, occurrenceStart, 'Europe/Madrid'),
        changes,
        'Europe/Madrid',
      );

      // DTSTART should still correspond to Jan 10 in the event data timezone (Tokyo)
      const newStart = updated.updated![0].start!;
      expect(toPlainDate(newStart, 'Asia/Tokyo').day).to.equal(10);
    });

    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)(
      'should move the series to the first instant of a repeated time, whatever the timezone of the system',
      () => {
        // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026: 02:30 comes twice.
        setSystemTimezone('America/New_York');
        const original = EventBuilder.new()
          .span('2026-10-25T08:00:00Z', '2026-10-25T09:00:00Z') // 09:00 CET
          .withDataTimezone('Europe/Paris')
          .rrule({ freq: 'DAILY' })
          .toProcessed();

        // Move a later occurrence to 02:30: the series keeps its first day at 02:30.
        const updated = applyRecurringUpdateAll(
          original,
          createOccurrence(original, createDate('2026-10-27T08:00:00Z')),
          {
            id: original.id,
            start: createDate('2026-10-27T01:30:00Z').getTime(), // 02:30 CET
            end: createDate('2026-10-27T01:45:00Z').getTime(),
          },
          'default',
        );

        expect(new Date(updated.updated![0].start!).toISOString()).to.equal(
          '2026-10-25T00:30:00.000Z', // the first 02:30, CEST
        );
      },
    );

    it('should keep the instants of a repeated time when editing the first occurrence', () => {
      // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026: 02:00 to 03:00 comes twice.
      const original = EventBuilder.new()
        .span('2026-10-25T00:30:00Z', '2026-10-25T01:15:00Z') // the first 02:30, the second 02:15
        .withDataTimezone('Europe/Paris')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const updated = applyRecurringUpdateAll(
        original,
        createOccurrence(original, new Date(original.start.timestamp)),
        {
          id: original.id,
          start: createDate('2026-10-25T01:05:00Z').getTime(), // the second 02:05
          end: createDate('2026-10-25T01:20:00Z').getTime(), // the second 02:20
        },
        'default',
      );

      expect(new Date(updated.updated![0].start!).toISOString()).to.equal(
        '2026-10-25T01:05:00.000Z',
      );
      expect(new Date(updated.updated![0].end!).toISOString()).to.equal('2026-10-25T01:20:00.000Z');
    });

    it('should only write the bound that a resize of a later occurrence moves', () => {
      // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026: 02:00 to 03:00 comes twice.
      const original = EventBuilder.new()
        .span('2026-10-25T00:30:00Z', '2026-10-25T01:15:00Z') // the first 02:30 to the second 02:15
        .withDataTimezone('Europe/Paris')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const resizeStart = applyRecurringUpdateAll(
        original,
        createOccurrence(original, createDate('2026-10-27T01:30:00Z')),
        {
          id: original.id,
          start: createDate('2026-10-27T00:50:00Z').getTime(), // 01:50 CET
        },
        'default',
      );
      expect(new Date(resizeStart.updated![0].start!).toISOString()).to.equal(
        '2026-10-24T23:50:00.000Z', // 01:50 CEST
      );
      expect(resizeStart.updated![0]).not.to.have.property('end');

      const resizeEnd = applyRecurringUpdateAll(
        original,
        createOccurrence(original, createDate('2026-10-27T01:30:00Z')),
        {
          id: original.id,
          end: createDate('2026-10-27T02:45:00Z').getTime(), // 03:45 CET
        },
        'default',
      );
      expect(resizeEnd.updated![0]).not.to.have.property('start');
      expect(new Date(resizeEnd.updated![0].end!).toISOString()).to.equal(
        '2026-10-25T02:45:00.000Z', // 03:45 CET
      );
    });

    it('should resolve the end of a series starting in a repeated time to its first instant after the start when resizing a later occurrence', () => {
      // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026: 02:00 to 03:00 comes twice.
      const original = EventBuilder.new()
        .span('2026-10-25T01:10:00Z', '2026-10-25T01:30:00Z') // the second 02:10 to 02:30
        .withDataTimezone('Europe/Paris')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const resizeEnd = applyRecurringUpdateAll(
        original,
        createOccurrence(original, createDate('2026-10-27T01:10:00Z')),
        {
          id: original.id,
          end: createDate('2026-10-27T01:40:00Z').getTime(), // 02:40 CET
        },
        'default',
      );
      // The first 02:40 of October 25th, CEST, is before the start.
      expect(resizeEnd.updated![0]).not.to.have.property('start');
      expect(new Date(resizeEnd.updated![0].end!).toISOString()).to.equal(
        '2026-10-25T01:40:00.000Z', // the second 02:40, CET
      );

      const resizeStart = applyRecurringUpdateAll(
        original,
        createOccurrence(original, createDate('2026-10-27T01:10:00Z')),
        {
          id: original.id,
          start: createDate('2026-10-27T01:20:00Z').getTime(), // 02:20 CET
        },
        'default',
      );
      expect(new Date(resizeStart.updated![0].start!).toISOString()).to.equal(
        '2026-10-25T00:20:00.000Z', // the first 02:20, CEST
      );
      expect(resizeStart.updated![0]).not.to.have.property('end');
    });

    it('should move the series forward by the length of the gap when moving a later occurrence to a time a DST transition skips', () => {
      // Europe/Paris springs forward from 02:00 to 03:00 on March 29th, 2026.
      const original = EventBuilder.new()
        .span('2026-03-29T07:00:00Z', '2026-03-29T08:00:00Z') // 09:00 CEST
        .withDataTimezone('Europe/Paris')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const updated = applyRecurringUpdateAll(
        original,
        createOccurrence(original, createDate('2026-03-31T07:00:00Z')),
        {
          id: original.id,
          start: createDate('2026-03-31T00:30:00Z').getTime(), // 02:30 CEST
          end: createDate('2026-03-31T02:00:00Z').getTime(), // 04:00 CEST
        },
        'default',
      );

      expect(new Date(updated.updated![0].start!).toISOString()).to.equal(
        '2026-03-29T01:30:00.000Z', // 03:30 CEST
      );
      expect(new Date(updated.updated![0].end!).toISOString()).to.equal(
        '2026-03-29T02:00:00.000Z', // 04:00 CEST
      );
    });

    it('should keep the days of an all-day series when moving a later occurrence to a day a DST transition lengthens', () => {
      // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026: that day lasts 25 hours.
      const original = EventBuilder.new()
        .span('2026-10-01', '2026-10-02', { allDay: true })
        .withDataTimezone('Europe/Paris')
        .withDisplayTimezone('Europe/Paris')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      // Drag the occurrence of October 24th to October 25th.
      const updated = applyRecurringUpdateAll(
        original,
        createOccurrence(
          original,
          createDate('2026-10-24T00:00:00', 'Europe/Paris'),
          'Europe/Paris',
        ),
        {
          id: original.id,
          start: createDate('2026-10-24T22:00:00Z').getTime(),
          end: createDate('2026-10-25T23:00:00Z').getTime(),
        },
        'Europe/Paris',
      );

      expect(updated.updated![0]).not.to.have.property('start');
      expect(updated.updated![0]).not.to.have.property('end');
      expect(updated.updated![0].rrule).to.deep.equal(original.rrule);
    });

    it('should remove recurrence when changes.rrule is explicitly undefined, even when the day changes', () => {
      const occurrenceStart = new Date(defaultEvent.start.timestamp);
      // Moving the series to another day realigns its rule, unless the changes set one.
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        title: 'One-off',
        start: createDate('2025-01-02T09:00:00Z').getTime(),
        end: createDate('2025-01-02T10:00:00Z').getTime(),
        rrule: undefined,
      };

      const updatedEvents = applyRecurringUpdateAll(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.have.length(1);
      expect(updatedEvents.updated![0]).to.have.property('rrule', undefined);
    });

    it('should keep the original date and just update hours/minutes when changing the time of a non-first occurrence', () => {
      // Edited the Jan 05 occurrence and changed only the time
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const newStart = createDate('2025-01-05T11:15:00Z');
      const newEnd = createDate('2025-01-05T12:15:00Z');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        start: newStart.getTime(),
        end: newEnd.getTime(),
      };

      const updatedEvents = applyRecurringUpdateAll(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);

      // Date stays anchored to root (Jan 01), times come from changes
      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          start: createDate('2025-01-01T11:15:00Z').getTime(),
          end: createDate('2025-01-01T12:15:00Z').getTime(),
        },
      ]);
    });

    it('should update the rrule when editing a non-first occurrence with a different day', () => {
      const original = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ byDay: ['SU'], freq: 'WEEKLY' })
        .toProcessed();
      const occurrenceStart = createDate('2025-01-05T09:00:00Z'); // Jan 5, a Sunday
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: createDate('2025-01-11T11:00:00Z').getTime(), // Saturday
        end: createDate('2025-01-11T12:00:00Z').getTime(),
      };

      const updatedEvents = applyRecurringUpdateAll(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
        'default',
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          start: createDate('2025-01-01T11:00:00Z').getTime(),
          end: createDate('2025-01-01T12:00:00Z').getTime(),
          rrule: { byDay: ['SA'], freq: 'WEEKLY' },
        },
      ]);
    });

    it('should update the start date of the original event when editing the first occurrence (DTSTART)', () => {
      // DTSTART = 2025-01-01
      const occurrenceStart = new Date(defaultEvent.start.timestamp);

      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        start: createDate('2025-01-12T11:00:00Z').getTime(),
        end: createDate('2025-01-12T12:00:00Z').getTime(),
      };

      const updatedEvents = applyRecurringUpdateAll(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          rrule: defaultEvent.rrule,
        },
      ]);
    });

    it('should preserve the user-provided changes.rrule and NOT auto-adjust it when the date also changes', () => {
      // Series: weekly on Sunday (DTSTART Jan 1, a Wednesday - but with byDay:['SU'])
      const original = EventBuilder.new()
        .singleDay('2025-01-05T09:00:00Z') // Sunday
        .rrule({ freq: 'WEEKLY', byDay: ['SU'] })
        .toProcessed();

      const occurrenceStart = createDate('2025-01-05T09:00:00Z'); // Sunday

      // User explicitly provides a brand-new rrule AND moves to a different day (Saturday).
      // The user's explicit rrule must be respected; adjustRRuleForAllMove must NOT override it.
      const explicitRRule: SchedulerProcessedEventRecurrenceRule = {
        freq: 'WEEKLY',
        byDay: ['SA'],
        interval: 2,
        count: 10,
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: createDate('2025-01-11T11:00:00Z').getTime(), // Saturday
        end: createDate('2025-01-11T12:00:00Z').getTime(),
        rrule: explicitRRule,
      };

      const updatedEvents = applyRecurringUpdateAll(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
        'default',
      );

      // The rrule in the result must be exactly the user-provided one (interval:2, count:10 preserved)
      expect((updatedEvents.updated![0] as SchedulerEventUpdatedProperties).rrule).to.deep.equal(
        explicitRRule,
      );
    });
  });

  describe('applyRecurringUpdateOnlyThis', () => {
    it('should create a detached event with exDate on the original and keep the rest intact', () => {
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const changesWithoutId = {
        title: 'Only-this edited',
        start: createDate('2025-01-05T11:00:00Z').getTime(),
        end: createDate('2025-01-05T12:00:00Z').getTime(),
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        ...changesWithoutId,
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          ...changesWithoutId,
          start: new Date(changesWithoutId.start).toISOString(),
          end: new Date(changesWithoutId.end).toISOString(),
          extractedFromId: defaultEvent.id,
          description: defaultEvent.description,
        },
      ]);
      expect(updatedEvents.updated).to.deep.equal([
        { id: defaultEvent.id, exDates: [startOfDay(occurrenceStart).getTime()] },
      ]);
    });

    it('should keep the occurrence date when changes omit start/end instead of using DTSTART', () => {
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');

      const updatedEvents = applyRecurringUpdateOnlyThis(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        {
          id: defaultEvent.id,
          title: 'Edit only this',
        },
        'default',
      );

      const createdEvent = updatedEvents.created![0];
      expect(createdEvent.start).to.equal(occurrenceStart.toISOString());
      expect(createdEvent.end).to.equal(addMinutes(occurrenceStart, 60).toISOString());
      expect(updatedEvents.updated).to.deep.equal([
        { id: defaultEvent.id, exDates: [startOfDay(occurrenceStart).getTime()] },
      ]);
    });

    it('should use changes.start to generate the detachedId', () => {
      const occurrenceStart = createDate('2025-01-07T09:00:00Z');
      const changesWithoutId = {
        title: 'Only-this changed date',
        start: createDate('2025-01-08T11:00:00Z').getTime(),
        end: createDate('2025-01-08T12:00:00Z').getTime(),
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        ...changesWithoutId,
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
        'default',
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          extractedFromId: defaultEvent.id,
          description: defaultEvent.description,
          ...changesWithoutId,
          start: new Date(changesWithoutId.start).toISOString(),
          end: new Date(changesWithoutId.end).toISOString(),
        },
      ]);
      expect(updatedEvents.updated).to.deep.equal([
        { id: defaultEvent.id, exDates: [startOfDay(occurrenceStart).getTime()] },
      ]);
    });

    it('should preserve wall-time format (no Z suffix) in start/end of created event', () => {
      const wallTimeEvent = EventBuilder.new()
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      const occurrenceStart = createDate('2025-01-05T09:00:00', 'America/New_York');
      const changes: SchedulerEventUpdatedProperties = {
        id: wallTimeEvent.id,
        title: 'Only-this wall-time',
        start: createDate('2025-01-05T11:00:00', 'America/New_York').getTime(),
        end: createDate('2025-01-05T12:00:00', 'America/New_York').getTime(),
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        wallTimeEvent,
        createOccurrence(wallTimeEvent, occurrenceStart),
        changes,
        'default',
      );

      const createdEvent = updatedEvents.created![0];
      expect(createdEvent.start).not.to.include('Z');
      expect(createdEvent.end).not.to.include('Z');
    });

    it('should add EXDATE based on the original event timezone, not the display timezone shifted day', () => {
      // Original event in New York
      const original = EventBuilder.new()
        .singleDay('2025-03-01T23:00:00Z')
        .withDataTimezone('America/New_York')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      // OccurrenceStart in display timezone (Madrid) will look like next day,
      // but update must use data timezone
      const occurrenceStart = new Date(original.start.timestamp);

      const updated = applyRecurringUpdateOnlyThis(
        original,
        createOccurrence(original, occurrenceStart, 'Europe/Madrid'),
        {
          id: original.id,
          title: 'Edit only this',
        },
        'Europe/Madrid',
      );

      // EXDATE should be the start of the day of the occurrence in America/New_York, the data
      // timezone.
      expect(updated.updated![0].exDates![0]).to.equal(
        startOfDay(occurrenceStart, 'America/New_York').getTime(),
      );
    });

    it('should delete the original series when only-this empties a finite series', () => {
      const original = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 1 })
        .toProcessed();
      const occurrenceStart = createDate('2025-01-01T09:00:00Z');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        title: 'Detached',
        start: createDate('2025-01-01T11:00:00Z').getTime(),
        end: createDate('2025-01-01T12:00:00Z').getTime(),
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
        'default',
      );

      expect(updatedEvents.updated).to.equal(undefined);
      expect(updatedEvents.deleted).to.deep.equal([original.id]);
      expect(updatedEvents.created).to.have.length(1);
    });
  });

  describe('all-day series', () => {
    // A daily all-day series on July 4th, displayed in Tokyo.
    const buildDailySeries = () =>
      EventBuilder.new()
        .id('trip')
        .span('2025-07-04', '2025-07-05', { allDay: true })
        .rrule({ freq: 'DAILY' })
        .withDisplayTimezone('Asia/Tokyo')
        .toProcessed();
    const tokyo = (date: string) => createDate(`${date}T00:00:00`, 'Asia/Tokyo');

    it('should split an all-day series on the displayed occurrence and write dates', () => {
      const event = buildDailySeries();

      const result = applyRecurringUpdateFollowing(
        event,
        createOccurrence(event, tokyo('2025-07-10'), 'Asia/Tokyo'),
        { id: 'trip', start: tokyo('2025-07-12').getTime(), end: tokyo('2025-07-13').getTime() },
        'Asia/Tokyo',
      );

      expect(result.created![0].start).to.equal('2025-07-12');
      expect(result.created![0].end).to.equal('2025-07-13');
      expect(
        (result.updated![0].rrule as SchedulerProcessedEventRecurrenceRule).until,
      ).toEqualPlainDate('2025-07-09');
    });

    it('should detach one all-day occurrence as a date and exclude its day', () => {
      const event = buildDailySeries();

      const result = applyRecurringUpdateOnlyThis(
        event,
        createOccurrence(event, tokyo('2025-07-10'), 'Asia/Tokyo'),
        { id: 'trip', title: 'Detached' },
        'Asia/Tokyo',
      );

      expect(result.created![0].start).to.equal('2025-07-10');
      expect(result.created![0].end).to.equal('2025-07-11');
      // The first instant of the excluded day in the display timezone, which the store writes
      // as that day.
      expect(result.updated![0].exDates![0]).to.equal(tokyo('2025-07-10').getTime());
    });

    it('should keep the day of an all-day occurrence read before the display timezone changed', () => {
      const event = buildDailySeries();
      const occurrence = createOccurrence(event, tokyo('2025-07-10'), 'Asia/Tokyo');

      // The display timezone moved to New York while the occurrence was being edited.
      const result = applyRecurringUpdateOnlyThis(
        event,
        occurrence,
        { id: 'trip', title: 'Detached' },
        'America/New_York',
      );

      expect(result.created![0].start).to.equal('2025-07-10');
      expect(result.created![0].end).to.equal('2025-07-11');
      expect(result.updated![0].exDates![0]).to.equal(
        createDate('2025-07-10T00:00:00', 'America/New_York').getTime(),
      );
    });

    it("should move an all-day series as a whole on a scope 'all' day change of its first occurrence", () => {
      const event = buildDailySeries();

      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(event, tokyo('2025-07-04'), 'Asia/Tokyo'),
        { id: 'trip', start: tokyo('2025-07-06').getTime(), end: tokyo('2025-07-07').getTime() },
        'Asia/Tokyo',
      );

      expect(result.updated![0].start!).to.equal(tokyo('2025-07-06').getTime());
      expect(result.updated![0].end!).to.equal(tokyo('2025-07-07').getTime());
    });

    it("should resize an all-day series starting on a day without midnight by whole days on a scope 'all' change", () => {
      // America/Havana springs forward at midnight on March 9th, 2025: that day starts at 01:00.
      const havana = (date: string) =>
        toEpochMs(BaseTemporal.PlainDate.from(date), 'America/Havana');
      const event = EventBuilder.new()
        .id('trip')
        .span('2025-03-09', '2025-03-10', { allDay: true })
        .rrule({ freq: 'DAILY' })
        .withDisplayTimezone('America/Havana')
        .toProcessed();

      // The occurrence of March 12th extended to two days.
      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(event, new Date(havana('2025-03-12')), 'America/Havana'),
        { id: 'trip', end: havana('2025-03-14') },
        'America/Havana',
      );

      // The series keeps its first day and ends at the start of March 11th.
      expect(result.updated![0]).not.to.have.property('start');
      expect(result.updated![0].end!).to.equal(havana('2025-03-11'));
    });

    it("should keep the dates of an all-day series on a scope 'all' change of a later occurrence", () => {
      const event = EventBuilder.new()
        .id('weekly')
        .span('2025-07-04', '2025-07-05', { allDay: true })
        .rrule({ freq: 'WEEKLY', byDay: ['FR'] })
        .withDisplayTimezone('Asia/Tokyo')
        .toProcessed();

      // The second occurrence, Friday July 11th, moved to Saturday July 12th.
      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(event, tokyo('2025-07-11'), 'Asia/Tokyo'),
        { id: 'weekly', start: tokyo('2025-07-12').getTime(), end: tokyo('2025-07-13').getTime() },
        'Asia/Tokyo',
      );

      expect(result.updated![0]).not.to.have.property('start');
      expect(result.updated![0]).not.to.have.property('end');
      expect(result.updated![0].rrule).to.deep.equal({ freq: 'WEEKLY', byDay: ['SA'] });
    });

    it("should resize an all-day series on a scope 'all' change of a later occurrence", () => {
      const event = buildDailySeries();

      // The occurrence of July 10th extended to two days.
      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(event, tokyo('2025-07-10'), 'Asia/Tokyo'),
        { id: 'trip', end: tokyo('2025-07-12').getTime() },
        'Asia/Tokyo',
      );

      // The series keeps its first day and takes the new day count.
      expect(result.updated![0]).not.to.have.property('start');
      expect(result.updated![0].end!).to.equal(tokyo('2025-07-06').getTime());
    });

    it("should make a timed series all-day on its own first day on a scope 'all' change of a later occurrence", () => {
      const event = EventBuilder.new()
        .id('standup')
        .singleDay('2025-07-07T09:00:00Z')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(event, createDate('2025-07-08T09:00:00Z')),
        {
          id: 'standup',
          allDay: true,
          start: createDate('2025-07-08T00:00:00Z').getTime(),
          end: createDate('2025-07-09T00:00:00Z').getTime(),
        },
        'default',
      );

      // The series keeps its first day, July 7th, as a whole day.
      expect(result.updated![0].allDay).to.equal(true);
      expect(new Date(result.updated![0].start!).toISOString()).to.equal(
        '2025-07-07T00:00:00.000Z',
      );
      expect(new Date(result.updated![0].end!).toISOString()).to.equal('2025-07-08T00:00:00.000Z');
    });

    it("should make an all-day series timed with the times of a later occurrence on a scope 'all' change", () => {
      const event = buildDailySeries();

      // The occurrence of July 10th dropped on the time grid, from 10:00 to 11:30.
      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(event, tokyo('2025-07-10'), 'Asia/Tokyo'),
        {
          id: 'trip',
          allDay: false,
          start: createDate('2025-07-10T10:00:00', 'Asia/Tokyo').getTime(),
          end: createDate('2025-07-10T11:30:00', 'Asia/Tokyo').getTime(),
        },
        'Asia/Tokyo',
      );

      // The series keeps its first day, July 4th, with the times of the occurrence.
      expect(result.updated![0].allDay).to.equal(false);
      expect(result.updated![0].start!).to.equal(
        createDate('2025-07-04T10:00:00', 'Asia/Tokyo').getTime(),
      );
      expect(result.updated![0].end!).to.equal(
        createDate('2025-07-04T11:30:00', 'Asia/Tokyo').getTime(),
      );
    });

    it("should make a timed series all-day on its days on a scope 'all' change without bounds", () => {
      const event = EventBuilder.new()
        .id('standup')
        .singleDay('2025-07-07T09:00:00Z')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(event, createDate('2025-07-08T09:00:00Z')),
        { id: 'standup', allDay: true },
        'default',
      );

      // The series keeps its first day, July 7th, as a whole day.
      expect(result.updated![0].allDay).to.equal(true);
      expect(new Date(result.updated![0].start!).toISOString()).to.equal(
        '2025-07-07T00:00:00.000Z',
      );
      expect(new Date(result.updated![0].end!).toISOString()).to.equal('2025-07-08T00:00:00.000Z');
    });

    it("should move the exceptions of a timed series made all-day on a given day to their displayed days on a 'this and following' change", () => {
      // A daily series at 23:00 in New York, displayed in Tokyo on the next day.
      const event = EventBuilder.new()
        .id('standup')
        .withDataTimezone('America/New_York')
        .singleDay('2025-07-04T23:00:00')
        .rrule({ freq: 'DAILY' })
        .exDates(['2025-07-06T23:00:00'])
        .withDisplayTimezone('Asia/Tokyo')
        .toProcessed();

      // The occurrence displayed on July 6th in Tokyo dropped on the all-day row.
      const result = applyRecurringUpdateFollowing(
        event,
        createOccurrence(
          event,
          createDate('2025-07-05T23:00:00', 'America/New_York'),
          'Asia/Tokyo',
        ),
        {
          id: 'standup',
          allDay: true,
          start: tokyo('2025-07-06').getTime(),
          end: tokyo('2025-07-07').getTime(),
        },
        'Asia/Tokyo',
      );

      expect(result.created![0].start).to.equal('2025-07-06');
      expect(result.created![0].end).to.equal('2025-07-07');
      // The excluded July 6th at 23:00 in New York is displayed on July 7th in Tokyo.
      expect(result.created![0].exDates).to.deep.equal(['2025-07-07']);
    });

    it("should move the weekday of a timed series made all-day on the day it is dropped on on a 'this and following' change", () => {
      // Fridays at 20:00 in New York are Saturdays in Tokyo: the drop on a Saturday moves it there.
      const event = EventBuilder.new()
        .id('standup')
        .withDataTimezone('America/New_York')
        .singleDay('2025-07-04T20:00:00')
        .rrule({ freq: 'WEEKLY', byDay: ['FR'] })
        .withDisplayTimezone('Asia/Tokyo')
        .toProcessed();

      // Saturday July 12th in Tokyo dropped on the all-day row.
      const result = applyRecurringUpdateFollowing(
        event,
        createOccurrence(
          event,
          createDate('2025-07-11T20:00:00', 'America/New_York'),
          'Asia/Tokyo',
        ),
        {
          id: 'standup',
          allDay: true,
          start: tokyo('2025-07-12').getTime(),
          end: tokyo('2025-07-13').getTime(),
        },
        'Asia/Tokyo',
      );

      expect(result.created![0].start).to.equal('2025-07-12');
      expect(
        (result.created![0].rrule as SchedulerProcessedEventRecurrenceRule).byDay,
      ).to.deep.equal(['SA']);
    });

    it("should move only the dropped weekday of a timed series made all-day on a scope 'all' change", () => {
      // Mondays and Fridays at 23:00 in New York are Tuesdays and Saturdays in Tokyo.
      const event = EventBuilder.new()
        .id('sync')
        .withDataTimezone('America/New_York')
        .singleDay('2025-07-04T23:00:00')
        .rrule({ freq: 'WEEKLY', byDay: ['MO', 'FR'] })
        .exDates(['2025-07-07T23:00:00', '2025-07-18T23:00:00'])
        .withDisplayTimezone('Asia/Tokyo')
        .toProcessed();

      // Saturday July 12th in Tokyo (Friday July 11th at 23:00 in New York) dropped on the
      // all-day row.
      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(
          event,
          createDate('2025-07-11T23:00:00', 'America/New_York'),
          'Asia/Tokyo',
        ),
        {
          id: 'sync',
          allDay: true,
          start: tokyo('2025-07-12').getTime(),
          end: tokyo('2025-07-13').getTime(),
        },
        'Asia/Tokyo',
      );

      // The series keeps its Mondays: only the Fridays, including the first day, move to the
      // Saturdays they are displayed on.
      expect(result.updated![0].start!).to.equal(tokyo('2025-07-05').getTime());
      expect(result.updated![0].end!).to.equal(tokyo('2025-07-06').getTime());
      expect(result.updated![0].rrule).to.deep.equal({ freq: 'WEEKLY', byDay: ['MO', 'SA'] });
      // The excluded Monday keeps its day, the excluded Friday moves to its Saturday.
      expect(result.updated![0].exDates!).to.deep.equal([
        tokyo('2025-07-07').getTime(),
        tokyo('2025-07-19').getTime(),
      ]);
    });

    it("should resize an all-day series from its start on a scope 'all' change of a later occurrence", () => {
      const event = EventBuilder.new()
        .id('weekly')
        .span('2025-07-07', '2025-07-08', { allDay: true })
        .rrule({ freq: 'WEEKLY', byDay: ['MO'] })
        .withDisplayTimezone('Asia/Tokyo')
        .toProcessed();

      // The start of Monday July 14th dragged to Sunday July 13th.
      const result = applyRecurringUpdateAll(
        event,
        createOccurrence(event, tokyo('2025-07-14'), 'Asia/Tokyo'),
        { id: 'weekly', start: tokyo('2025-07-13').getTime() },
        'Asia/Tokyo',
      );

      // The series keeps its first day, with the new day count and on the new weekday.
      expect(result.updated![0]).not.to.have.property('start');
      expect(result.updated![0].end!).to.equal(tokyo('2025-07-09').getTime());
      expect(result.updated![0].rrule).to.deep.equal({ freq: 'WEEKLY', byDay: ['SU'] });
    });

    describe('made timed in a timezone other than the display one', () => {
      // A Monday and Friday all-day series of an event in New York, displayed in Tokyo.
      const buildMondayFridaySeries = () =>
        EventBuilder.new()
          .id('gym')
          .withDataTimezone('America/New_York')
          .span('2025-07-07', '2025-07-08', { allDay: true })
          .rrule({ freq: 'WEEKLY', byDay: ['MO', 'FR'] })
          .withDisplayTimezone('Asia/Tokyo')
          .toProcessed();

      // A Friday all-day series of an event in New York without July 18th, displayed in Tokyo.
      const buildFridaySeriesWithException = () =>
        EventBuilder.new()
          .id('gym')
          .withDataTimezone('America/New_York')
          .span('2025-07-04', '2025-07-05', { allDay: true })
          .rrule({ freq: 'WEEKLY', byDay: ['FR'] })
          .exDates(['2025-07-18'])
          .withDisplayTimezone('Asia/Tokyo')
          .toProcessed();

      it("should move the series to the display timezone and keep its rule on a scope 'all' change", () => {
        const event = buildMondayFridaySeries();

        // Friday July 11th dropped at 09:00 in Tokyo, which is Thursday in New York.
        const result = applyRecurringUpdateAll(
          event,
          createOccurrence(event, tokyo('2025-07-11'), 'Asia/Tokyo'),
          {
            id: 'gym',
            allDay: false,
            start: createDate('2025-07-11T09:00:00', 'Asia/Tokyo').getTime(),
            end: createDate('2025-07-11T10:00:00', 'Asia/Tokyo').getTime(),
          },
          'Asia/Tokyo',
        );

        const written = toEventDateStrings(
          result.updated![0],
          event.modelInBuiltInFormat,
          'Asia/Tokyo',
        );
        expect(written.timezone).to.equal('Asia/Tokyo');
        expect(written.start).to.equal('2025-07-07T09:00:00');
        expect(written.end).to.equal('2025-07-07T10:00:00');
        expect(result.updated![0]).not.to.have.property('rrule');
      });

      it("should move the series to the display timezone and keep its rule and exceptions on a 'this and following' change", () => {
        const event = buildFridaySeriesWithException();

        // Friday July 11th dropped at 09:00 in Tokyo, which is Thursday in New York.
        const result = applyRecurringUpdateFollowing(
          event,
          createOccurrence(event, tokyo('2025-07-11'), 'Asia/Tokyo'),
          {
            id: 'gym',
            allDay: false,
            start: createDate('2025-07-11T09:00:00', 'Asia/Tokyo').getTime(),
            end: createDate('2025-07-11T10:00:00', 'Asia/Tokyo').getTime(),
          },
          'Asia/Tokyo',
        );

        expect(result.created![0].timezone).to.equal('Asia/Tokyo');
        expect(result.created![0].start).to.equal('2025-07-11T09:00:00');
        expect(
          (result.created![0].rrule as SchedulerProcessedEventRecurrenceRule).byDay,
        ).to.deep.equal(['FR']);
        expect(result.created![0].exDates).to.deep.equal(['2025-07-18T09:00:00']);
      });

      it("should keep the exceptions of the series on their days across a DST change on a scope 'all' change", () => {
        // A Monday all-day series of an event in UTC without December 1st, displayed in New York.
        const event = EventBuilder.new()
          .id('gym')
          .withDataTimezone('UTC')
          .span('2025-07-07', '2025-07-08', { allDay: true })
          .rrule({ freq: 'WEEKLY', byDay: ['MO'] })
          .exDates(['2025-12-01'])
          .withDisplayTimezone('America/New_York')
          .toProcessed();

        // Monday July 14th dropped at 19:30 in New York, which is Monday 23:30 in UTC (EDT).
        const result = applyRecurringUpdateAll(
          event,
          createOccurrence(
            event,
            createDate('2025-07-14T00:00:00', 'America/New_York'),
            'America/New_York',
          ),
          {
            id: 'gym',
            allDay: false,
            start: createDate('2025-07-14T19:30:00', 'America/New_York').getTime(),
            end: createDate('2025-07-14T20:30:00', 'America/New_York').getTime(),
          },
          'America/New_York',
        );

        const written = toEventDateStrings(
          result.updated![0],
          event.modelInBuiltInFormat,
          'America/New_York',
        );
        expect(written.timezone).to.equal('America/New_York');
        expect(written.start).to.equal('2025-07-07T19:30:00');
        expect(written.exDates).to.deep.equal(['2025-12-01T19:30:00']);
        expect(result.updated![0]).not.to.have.property('rrule');
      });

      it("should write the bounds of a first occurrence made timed without bounds on a scope 'all' change", () => {
        const event = buildFridaySeriesWithException();

        // The first occurrence, Friday July 4th in Tokyo, made timed without bounds.
        const result = applyRecurringUpdateAll(
          event,
          createOccurrence(event, tokyo('2025-07-04'), 'Asia/Tokyo'),
          { id: 'gym', allDay: false },
          'Asia/Tokyo',
        );

        const written = toEventDateStrings(
          result.updated![0],
          event.modelInBuiltInFormat,
          'Asia/Tokyo',
        );
        expect(written.timezone).to.equal('Asia/Tokyo');
        expect(written.start).to.equal('2025-07-04T00:00:00');
        expect(written.end).to.equal('2025-07-05T00:00:00');
        expect(result.updated![0]).not.to.have.property('rrule');
      });

      it("should keep a MONTHLY rule on a scope 'all' change of an occurrence on the last weekday of its month", () => {
        // The fourth Friday of each month, which is also the last Friday of February 2025.
        const event = EventBuilder.new()
          .id('review')
          .span('2025-01-24', '2025-01-25', { allDay: true })
          .rrule({ freq: 'MONTHLY', byDay: ['4FR'] })
          .withDisplayTimezone('UTC')
          .toProcessed();

        const result = applyRecurringUpdateAll(
          event,
          createOccurrence(event, createDate('2025-02-28T00:00:00Z'), 'UTC'),
          {
            id: 'review',
            allDay: false,
            start: createDate('2025-02-28T09:00:00Z').getTime(),
            end: createDate('2025-02-28T10:00:00Z').getTime(),
          },
          'UTC',
        );

        expect(result.updated![0]).not.to.have.property('rrule');
      });
    });

    describe('made all-day in a timezone other than the display one', () => {
      it("should keep the exceptions of the series on their days on a scope 'all' change", () => {
        // A daily series at 23:00 in Tokyo, displayed at 10:00 the same day in New York, without
        // July 10th.
        const event = EventBuilder.new()
          .id('sync')
          .withDataTimezone('Asia/Tokyo')
          .span('2025-07-04T23:00:00', '2025-07-04T23:30:00')
          .rrule({ freq: 'DAILY' })
          .exDates(['2025-07-10T00:00:00'])
          .withDisplayTimezone('America/New_York')
          .toProcessed();
        const newYork = (date: string) => createDate(`${date}T00:00:00`, 'America/New_York');

        const result = applyRecurringUpdateAll(
          event,
          createOccurrence(
            event,
            createDate('2025-07-12T23:00:00', 'Asia/Tokyo'),
            'America/New_York',
          ),
          {
            id: 'sync',
            allDay: true,
            start: newYork('2025-07-12').getTime(),
            end: newYork('2025-07-13').getTime(),
          },
          'America/New_York',
        );

        const written = toEventDateStrings(
          result.updated![0],
          event.modelInBuiltInFormat,
          'America/New_York',
        );
        expect(written.start).to.equal('2025-07-04');
        expect(written.exDates).to.deep.equal(['2025-07-10']);
      });

      it("should keep the until of the series on its day on a scope 'all' change", () => {
        // A daily series at 23:00 in New York until July 8th, displayed on the next day in Tokyo.
        const event = EventBuilder.new()
          .id('sync')
          .withDataTimezone('America/New_York')
          .span('2025-07-04T23:00:00', '2025-07-04T23:30:00')
          .rrule({ freq: 'DAILY', until: '2025-07-08T23:00:00' })
          .withDisplayTimezone('Asia/Tokyo')
          .toProcessed();

        // Sunday July 6th in New York, displayed on Monday July 7th in Tokyo.
        const result = applyRecurringUpdateAll(
          event,
          createOccurrence(
            event,
            createDate('2025-07-06T23:00:00', 'America/New_York'),
            'Asia/Tokyo',
          ),
          { id: 'sync', allDay: true },
          'Asia/Tokyo',
        );

        // The series keeps its days in New York, from July 4th to July 8th.
        expect(result.updated![0].start!).to.equal(tokyo('2025-07-04').getTime());
        expect(result.updated![0]).not.to.have.property('rrule');
      });

      it("should keep the first day and the rule of a series made all-day across a DST change on a scope 'all' change", () => {
        // Wednesdays at 18:30 in New York: Thursdays at 00:30 in Paris in winter, and Wednesdays
        // at 23:30 between the DST changes of the United States and of Europe. The series stays on
        // Wednesdays.
        const event = EventBuilder.new()
          .id('sync')
          .withDataTimezone('America/New_York')
          .span('2025-01-01T18:30:00', '2025-01-01T18:45:00')
          .rrule({ freq: 'WEEKLY', byDay: ['WE'] })
          .withDisplayTimezone('Europe/Paris')
          .toProcessed();
        const paris = (date: string) => createDate(`${date}T00:00:00`, 'Europe/Paris');

        // Wednesday March 12th, displayed on Wednesday in Paris.
        const result = applyRecurringUpdateAll(
          event,
          createOccurrence(
            event,
            createDate('2025-03-12T18:30:00', 'America/New_York'),
            'Europe/Paris',
          ),
          {
            id: 'sync',
            allDay: true,
            start: paris('2025-03-12').getTime(),
            end: paris('2025-03-13').getTime(),
          },
          'Europe/Paris',
        );

        expect(result.updated![0].start!).to.equal(paris('2025-01-01').getTime());
        expect(result.updated![0]).not.to.have.property('rrule');
      });
    });

    describe('representation changes of other rules and scopes', () => {
      // A series at 23:00 in New York, displayed on the next day in Tokyo.
      const buildLateSeries = (rrule: SchedulerEventRecurrenceRule) =>
        EventBuilder.new()
          .id('sync')
          .withDataTimezone('America/New_York')
          .span('2025-07-04T23:00:00', '2025-07-04T23:30:00')
          .rrule(rrule)
          .withDisplayTimezone('Asia/Tokyo')
          .toProcessed();
      const newYorkOccurrence = (event: ReturnType<typeof buildLateSeries>, date: string) =>
        createOccurrence(event, createDate(`${date}T23:00:00`, 'America/New_York'), 'Asia/Tokyo');

      it("should keep the day of the month of a series made all-day on a scope 'all' change", () => {
        const event = buildLateSeries({ freq: 'MONTHLY', byMonthDay: [4] });

        const result = applyRecurringUpdateAll(
          event,
          newYorkOccurrence(event, '2025-08-04'),
          { id: 'sync', allDay: true },
          'Asia/Tokyo',
        );

        expect(result.updated![0].start!).to.equal(tokyo('2025-07-04').getTime());
        expect(result.updated![0]).not.to.have.property('rrule');
      });

      it("should keep the ordinal weekday of a series made all-day on a scope 'all' change", () => {
        // The first Friday at 23:00 in New York is the first Saturday in Tokyo.
        const event = buildLateSeries({ freq: 'MONTHLY', byDay: ['1FR'] });

        const result = applyRecurringUpdateAll(
          event,
          newYorkOccurrence(event, '2025-08-01'),
          { id: 'sync', allDay: true },
          'Asia/Tokyo',
        );

        expect(result.updated![0]).not.to.have.property('rrule');
      });

      it("should keep the remaining count of a series made all-day on a 'this and following' change", () => {
        const event = buildLateSeries({ freq: 'DAILY', count: 5 });

        // July 6th in New York, displayed on July 7th in Tokyo.
        const result = applyRecurringUpdateFollowing(
          event,
          newYorkOccurrence(event, '2025-07-06'),
          { id: 'sync', allDay: true },
          'Asia/Tokyo',
        );

        expect(result.created![0].start).to.equal('2025-07-06');
        expect((result.created![0].rrule as SchedulerEventRecurrenceRule).count).to.equal(3);
      });

      it('should detach a timed occurrence made all-day without bounds on its day', () => {
        const event = buildLateSeries({ freq: 'DAILY' });

        const result = applyRecurringUpdateOnlyThis(
          event,
          newYorkOccurrence(event, '2025-07-06'),
          { id: 'sync', allDay: true },
          'Asia/Tokyo',
        );

        expect(result.created![0].start).to.equal('2025-07-06');
        expect(result.created![0].end).to.equal('2025-07-07');
      });

      it('should detach an all-day occurrence made timed in the display timezone', () => {
        const event = EventBuilder.new()
          .id('gym')
          .withDataTimezone('America/New_York')
          .span('2025-07-04', '2025-07-05', { allDay: true })
          .rrule({ freq: 'WEEKLY', byDay: ['FR'] })
          .withDisplayTimezone('Asia/Tokyo')
          .toProcessed();

        const result = applyRecurringUpdateOnlyThis(
          event,
          createOccurrence(event, tokyo('2025-07-11'), 'Asia/Tokyo'),
          {
            id: 'gym',
            allDay: false,
            start: createDate('2025-07-11T09:00:00', 'Asia/Tokyo').getTime(),
            end: createDate('2025-07-11T10:00:00', 'Asia/Tokyo').getTime(),
          },
          'Asia/Tokyo',
        );

        expect(result.created![0].timezone).to.equal('Asia/Tokyo');
        expect(result.created![0].start).to.equal('2025-07-11T09:00:00');
        expect(result.created![0].end).to.equal('2025-07-11T10:00:00');
        expect(result.updated![0].exDates![0]).to.equal(tokyo('2025-07-11').getTime());
      });
    });
  });

  // The DST transitions must resolve the same way whatever the timezone of the system.
  describe.each(['UTC', 'America/New_York'])('system timezone: %s', (systemTimezone) => {
    // Europe/Paris falls back from 03:00 CEST to 02:00 CET on October 26th, 2025.
    it.skipIf(!isJSDOM && systemTimezone !== 'UTC').each([
      ['an hour', '2025-10-26T03:30:00'],
      ['30 minutes', '2025-10-26T03:00:00'],
    ])(
      'should keep the times of an occurrence in a repeated hour lasting %s when only its title changes',
      (_duration, end) => {
        if (isJSDOM) {
          setSystemTimezone(systemTimezone);
        }
        const event = EventBuilder.new()
          .withDataTimezone('Europe/Paris')
          .withDisplayTimezone('Europe/Paris')
          .span('2025-10-26T02:30:00', end)
          .rrule({ freq: 'DAILY', count: 3 })
          .toProcessed();
        const [occurrence] = getRecurringEventOccurrencesForVisibleDays(
          event,
          Date.parse('2025-10-26T00:00:00Z'),
          Date.parse('2025-10-26T12:00:00Z'),
          'Europe/Paris',
        );
        const changes: SchedulerEventUpdatedProperties = { id: event.id, title: 'New title' };
        const occurrenceStart = new Date(occurrence.start.timestamp);

        for (const { created } of [
          applyRecurringUpdateOnlyThis(
            event,
            createOccurrence(event, occurrenceStart, 'Europe/Paris'),
            changes,
            'Europe/Paris',
          ),
          applyRecurringUpdateFollowing(
            event,
            createOccurrence(event, occurrenceStart, 'Europe/Paris'),
            changes,
            'Europe/Paris',
          ),
        ]) {
          expect([created![0].start, created![0].end]).to.deep.equal(['2025-10-26T02:30:00', end]);
        }
      },
    );
  });
});
