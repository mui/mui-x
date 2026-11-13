import { BaseTemporal, toPlainDate } from '@mui/x-scheduler-internals/internals';
import { processEvent } from '@mui/x-scheduler-internals/process-event';
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
          unstable_internalInfos: {
            ...defaultEvent.unstable_internalInfos,
            dataStart: originalSeriesStart.getTime(),
          },
        },
        split.getTime(),
        changes,
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

        const res = decideSplitRRule(event, Date.parse('2025-01-04T09:00:00Z'), {
          title: 'New Event Title',
        });
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
          const res = call(original, { start: movedStart });
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
          const res = call(original, { start: movedStart });
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
          expect(call(original, { start: movedStart })).to.deep.equal({
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
            call(original, { start: thirdWed }, startMonth, startOfDay(thirdWed)),
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
          expect(call(original, { start: lastFri }, monthStart, startOfDay(lastFri))).to.deep.equal(
            { freq: 'MONTHLY', interval: 1, byDay: ['-1FR'] },
          );
        });
      });
    });
  });

  describe('applyRecurringUpdateFollowing', () => {
    it('should keep a new RRULE string as is for the new series', () => {
      const occurrenceStart = createDate('2025-01-07T09:00:00Z');
      const updatedEvents = applyRecurringUpdateFollowing(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        {
          id: defaultEvent.id,
          rrule: 'FREQ=WEEKLY;BYDAY=TU',
        },
      );

      expect(updatedEvents.created![0].rrule).to.equal('FREQ=WEEKLY;BYDAY=TU');
    });

    it('should truncate the original series at the day before the edited occurrence and appends the new series', () => {
      // Original: daily from Jan 01
      // Edit an occurrence on Jan 05
      const occurrenceStart = createDate('2025-01-05T09:00:00Z');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        // New timing for the split series
        start: createDate('2025-01-05T11:00:00Z'),
        end: createDate('2025-01-05T12:00:00Z'),
        title: 'Edited Event',
        // rrule omitted → inherit from original
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
      );

      // Original remains but with truncated rule, new series appended, other event unchanged
      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.updated).to.have.length(1);
      const { id, rrule } = updatedEvents.updated![0];
      const { until, ...truncatedRule } = rrule as SchedulerProcessedEventRecurrenceRule;
      expect(id).to.equal(defaultEvent.id);
      expect(truncatedRule).to.deep.equal(defaultEvent.rrule);
      expect(until!.toString()).to.equal('2025-01-04T23:59:59.999');
      expect(updatedEvents.created).to.deep.equal([
        {
          ...withoutId(defaultEvent.modelInBuiltInFormat),
          title: 'Edited Event',
          start: changes.start!.toISOString(),
          end: changes.end!.toISOString(),
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
        start: createDate('2025-01-10T12:00:00Z'),
        end: createDate('2025-01-10T13:00:00Z'),
        title: 'Edited First',
        // rrule omitted → inherit
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
      );

      // Original removed, new series added, other keeps
      expect(updatedEvents.deleted).to.deep.equal([original.id]);
      expect(updatedEvents.updated).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          ...withoutId(original.modelInBuiltInFormat),
          title: 'Edited First',
          start: changes.start!.toISOString(),
          end: changes.end!.toISOString(),
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
        start: createDate('2025-01-03T10:00:00Z'),
        end: createDate('2025-01-03T11:00:00Z'),
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
        start: createDate('2025-01-04T12:00:00Z'),
        end: createDate('2025-01-04T13:00:00Z'),
        rrule: undefined,
      };

      const updated = applyRecurringUpdateFollowing(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
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
        start: createDate('2025-01-05T11:00:00', 'America/New_York'),
        end: createDate('2025-01-05T12:00:00', 'America/New_York'),
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        wallTimeEvent,
        createOccurrence(wallTimeEvent, occurrenceStart),
        changes,
      );

      const createdEvent = updatedEvents.created![0];
      expect(createdEvent.start).not.to.include('Z');
      expect(createdEvent.end).not.to.include('Z');
    });

    it.each([{ freq: 'DAILY' as const, until: '2025-01-10' }, 'FREQ=DAILY;UNTIL=20250110'])(
      'should preserve a date-only UNTIL when splitting an all-day series (%j)',
      (rrule) => {
        const event = EventBuilder.new().singleDay('2025-01-01T09:00:00').allDay(true).build();
        const original = processEvent(
          { ...event, rrule },
          'default',
          schedulerRecurringEventsPlugin,
        );
        const result = applyRecurringUpdateFollowing(
          original,
          createOccurrence(original, createDate('2025-01-05T09:00:00')),
          { id: event.id, title: 'Updated' },
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
          start: new Date('2025-01-05T10:00:00Z'),
          end: new Date('2025-01-05T11:00:00Z'),
          exDates: [new Date('2025-01-08T10:00:00Z')],
        },
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

      const occurrenceStart = new Date(original.unstable_internalInfos.dataStart);

      // Changes come as instants
      // 00:40 JST → 2025-01-09T15:40:00Z
      // 01:30 JST → 2025-01-09T16:30:00Z
      const changes = {
        id: original.id,
        start: createDate('2025-01-09T15:40:00Z'),
        end: createDate('2025-01-09T16:30:00Z'),
      };

      const updated = applyRecurringUpdateAll(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
      );

      // DTSTART should still correspond to Jan 10 in the event data timezone (Tokyo)
      const newStart = updated.updated![0].start!;
      expect(toPlainDate(newStart.getTime(), 'Asia/Tokyo').day).to.equal(10);
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
            start: createDate('2026-10-27T01:30:00Z'), // 02:30 CET
            end: createDate('2026-10-27T01:45:00Z'),
          },
        );

        expect(updated.updated![0].start!.toISOString()).to.equal(
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
        createOccurrence(original, new Date(original.unstable_internalInfos.dataStart)),
        {
          id: original.id,
          start: createDate('2026-10-25T01:05:00Z'), // the second 02:05
          end: createDate('2026-10-25T01:20:00Z'), // the second 02:20
        },
      );

      expect(updated.updated![0].start!.toISOString()).to.equal('2026-10-25T01:05:00.000Z');
      expect(updated.updated![0].end!.toISOString()).to.equal('2026-10-25T01:20:00.000Z');
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
          start: createDate('2026-10-27T00:50:00Z'), // 01:50 CET
        },
      );
      expect(resizeStart.updated![0].start!.toISOString()).to.equal(
        '2026-10-24T23:50:00.000Z', // 01:50 CEST
      );
      expect(resizeStart.updated![0]).not.to.have.property('end');

      const resizeEnd = applyRecurringUpdateAll(
        original,
        createOccurrence(original, createDate('2026-10-27T01:30:00Z')),
        {
          id: original.id,
          end: createDate('2026-10-27T02:45:00Z'), // 03:45 CET
        },
      );
      expect(resizeEnd.updated![0]).not.to.have.property('start');
      expect(resizeEnd.updated![0].end!.toISOString()).to.equal(
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
          end: createDate('2026-10-27T01:40:00Z'), // 02:40 CET
        },
      );
      // The first 02:40 of October 25th, CEST, is before the start.
      expect(resizeEnd.updated![0]).not.to.have.property('start');
      expect(resizeEnd.updated![0].end!.toISOString()).to.equal(
        '2026-10-25T01:40:00.000Z', // the second 02:40, CET
      );

      const resizeStart = applyRecurringUpdateAll(
        original,
        createOccurrence(original, createDate('2026-10-27T01:10:00Z')),
        {
          id: original.id,
          start: createDate('2026-10-27T01:20:00Z'), // 02:20 CET
        },
      );
      expect(resizeStart.updated![0].start!.toISOString()).to.equal(
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
          start: createDate('2026-03-31T00:30:00Z'), // 02:30 CEST
          end: createDate('2026-03-31T02:00:00Z'), // 04:00 CEST
        },
      );

      expect(updated.updated![0].start!.toISOString()).to.equal(
        '2026-03-29T01:30:00.000Z', // 03:30 CEST
      );
      expect(updated.updated![0].end!.toISOString()).to.equal(
        '2026-03-29T02:00:00.000Z', // 04:00 CEST
      );
    });

    it('should keep the days of an all-day series when moving a later occurrence to a day a DST transition lengthens', () => {
      // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026: that day lasts 25 hours.
      const original = EventBuilder.new()
        .span('2026-09-30T22:00:00Z', '2026-10-01T21:59:59.999Z', { allDay: true }) // October 1st
        .withDataTimezone('Europe/Paris')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      // Drag the occurrence of October 24th to October 25th.
      const updated = applyRecurringUpdateAll(
        original,
        createOccurrence(original, createDate('2026-10-23T22:00:00Z')),
        {
          id: original.id,
          start: createDate('2026-10-24T22:00:00Z'),
          end: createDate('2026-10-25T22:59:59.999Z'),
        },
      );

      expect(updated.updated![0].start!.toISOString()).to.equal('2026-09-30T22:00:00.000Z');
      expect(updated.updated![0].end!.toISOString()).to.equal('2026-10-01T21:59:59.999Z');
    });

    it('should remove recurrence when changes.rrule is explicitly undefined, even when the day changes', () => {
      const occurrenceStart = new Date(defaultEvent.unstable_internalInfos.dataStart);
      // Moving the series to another day realigns its rule, unless the changes set one.
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        title: 'One-off',
        start: createDate('2025-01-02T09:00:00Z'),
        end: createDate('2025-01-02T10:00:00Z'),
        rrule: undefined,
      };

      const updatedEvents = applyRecurringUpdateAll(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
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
        start: newStart,
        end: newEnd,
      };

      const updatedEvents = applyRecurringUpdateAll(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);

      // Date stays anchored to root (Jan 01), times come from changes
      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          start: createDate('2025-01-01T11:15:00Z'),
          end: createDate('2025-01-01T12:15:00Z'),
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
        start: createDate('2025-01-11T11:00:00Z'), // Saturday
        end: createDate('2025-01-11T12:00:00Z'),
      };

      const updatedEvents = applyRecurringUpdateAll(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          start: createDate('2025-01-01T11:00:00Z'),
          end: createDate('2025-01-01T12:00:00Z'),
          rrule: { byDay: ['SA'], freq: 'WEEKLY' },
        },
      ]);
    });

    it('should update the start date of the original event when editing the first occurrence (DTSTART)', () => {
      // DTSTART = 2025-01-01
      const occurrenceStart = new Date(defaultEvent.unstable_internalInfos.dataStart);

      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        start: createDate('2025-01-12T11:00:00Z'),
        end: createDate('2025-01-12T12:00:00Z'),
      };

      const updatedEvents = applyRecurringUpdateAll(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
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
        start: createDate('2025-01-11T11:00:00Z'), // Saturday
        end: createDate('2025-01-11T12:00:00Z'),
        rrule: explicitRRule,
      };

      const updatedEvents = applyRecurringUpdateAll(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
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
        start: createDate('2025-01-05T11:00:00Z'),
        end: createDate('2025-01-05T12:00:00Z'),
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        ...changesWithoutId,
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          ...changesWithoutId,
          start: changesWithoutId.start.toISOString(),
          end: changesWithoutId.end.toISOString(),
          extractedFromId: defaultEvent.id,
          description: defaultEvent.description,
        },
      ]);
      expect(updatedEvents.updated).to.deep.equal([
        { id: defaultEvent.id, exDates: [startOfDay(occurrenceStart)] },
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
      );

      const createdEvent = updatedEvents.created![0];
      expect(createdEvent.start).to.equal(occurrenceStart.toISOString());
      expect(createdEvent.end).to.equal(addMinutes(occurrenceStart, 60).toISOString());
      expect(updatedEvents.updated).to.deep.equal([
        { id: defaultEvent.id, exDates: [startOfDay(occurrenceStart)] },
      ]);
    });

    it('should use changes.start to generate the detachedId', () => {
      const occurrenceStart = createDate('2025-01-07T09:00:00Z');
      const changesWithoutId = {
        title: 'Only-this changed date',
        start: createDate('2025-01-08T11:00:00Z'),
        end: createDate('2025-01-08T12:00:00Z'),
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        ...changesWithoutId,
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        defaultEvent,
        createOccurrence(defaultEvent, occurrenceStart),
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          extractedFromId: defaultEvent.id,
          description: defaultEvent.description,
          ...changesWithoutId,
          start: changesWithoutId.start.toISOString(),
          end: changesWithoutId.end.toISOString(),
        },
      ]);
      expect(updatedEvents.updated).to.deep.equal([
        { id: defaultEvent.id, exDates: [startOfDay(occurrenceStart)] },
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
        start: createDate('2025-01-05T11:00:00', 'America/New_York'),
        end: createDate('2025-01-05T12:00:00', 'America/New_York'),
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        wallTimeEvent,
        createOccurrence(wallTimeEvent, occurrenceStart),
        changes,
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
      const occurrenceStart = new Date(original.unstable_internalInfos.dataStart);

      const updated = applyRecurringUpdateOnlyThis(
        original,
        createOccurrence(original, occurrenceStart),
        {
          id: original.id,
          title: 'Edit only this',
        },
      );

      // EXDATE should be the start of the day of the occurrence in America/New_York, the data
      // timezone.
      expect(updated.updated![0].exDates![0].getTime()).to.equal(
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
        start: createDate('2025-01-01T11:00:00Z'),
        end: createDate('2025-01-01T12:00:00Z'),
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        original,
        createOccurrence(original, occurrenceStart),
        changes,
      );

      expect(updatedEvents.updated).to.equal(undefined);
      expect(updatedEvents.deleted).to.deep.equal([original.id]);
      expect(updatedEvents.created).to.have.length(1);
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
        const occurrenceStart = new Date(occurrence.unstable_internalInfos.dataStart);

        for (const { created } of [
          applyRecurringUpdateOnlyThis(event, createOccurrence(event, occurrenceStart), changes),
          applyRecurringUpdateFollowing(event, createOccurrence(event, occurrenceStart), changes),
        ]) {
          expect([created![0].start, created![0].end]).to.deep.equal(['2025-10-26T02:30:00', end]);
        }
      },
    );
  });
});
