import { adapter, adapterFr, EventBuilder } from 'test/utils/scheduler';
import {
  SchedulerEventUpdatedProperties,
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';
import { mergeDateAndTime } from '../date-utils';
import {
  adjustRRuleForAllMove,
  applyRecurringUpdateAll,
  applyRecurringUpdateFollowing,
  applyRecurringUpdateOnlyThis,
  decideSplitRRule,
} from './updateRecurringEvent';
import { getRemainingOccurrences } from './internal-utils';

describe('recurring-events/updateRecurringEvent', () => {
  const defaultEvent = EventBuilder.new()
    .singleDay('2025-01-01T09:00:00Z')
    .rrule({ freq: 'DAILY', interval: 1 })
    .toProcessed();

  describe('decideSplitRRule', () => {
    const seriesStart = adapter.date('2025-01-01T09:00:00Z', 'default'); // DTSTART
    const splitStart = adapter.date('2025-01-06T15:00:00Z', 'default'); // "this and following" starts here

    const call = (
      originalRule: SchedulerProcessedEventRecurrenceRule,
      changes: Partial<SchedulerEventUpdatedProperties> = {},
      originalSeriesStart: TemporalSupportedObject = seriesStart,
      split: TemporalSupportedObject = splitStart,
    ) => decideSplitRRule(adapter, originalRule, originalSeriesStart, split, changes);

    it('should return changes.rrule as is when user explicitly changed recurrence', () => {
      const original: SchedulerProcessedEventRecurrenceRule = { freq: 'DAILY', interval: 1 };
      const newRule: SchedulerProcessedEventRecurrenceRule = {
        freq: 'WEEKLY',
        interval: 2,
        count: 5,
      };

      const res = call(original, { rrule: newRule });
      expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 2, count: 5 });
    });

    it('should return undefined when user explicitly removed recurrence', () => {
      const original: SchedulerProcessedEventRecurrenceRule = { freq: 'DAILY', interval: 1 };
      const res = call(original, { rrule: undefined });
      expect(res).to.equal(undefined);
    });

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

        const dayBeforeSplit = adapter.addDays(adapter.startOfDay(splitStart), -1);
        const remaining = getRemainingOccurrences(
          adapter,
          original,
          seriesStart,
          dayBeforeSplit,
          original.count as number,
        );

        const res = call(original, { title: 'New Event Title' });
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 1, count: remaining });
      });

      it('should keep the original UNTIL when inheriting (untouched RRULE)', () => {
        const originalUntil = adapter.date('2025-01-20T23:59:59Z', 'default');
        const original: SchedulerProcessedEventRecurrenceRule = {
          freq: 'DAILY',
          interval: 1,
          until: originalUntil,
        };

        const res = call(original, { title: 'New Event Title' })!;
        expect(adapter.isSameDay(res.until!, originalUntil)).to.equal(true);
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
          const movedStart = adapter.date('2025-01-07T15:00:00Z', 'default');
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
          const movedStart = adapter.date('2025-01-07T10:00:00Z', 'default');
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
          const movedStart = adapter.date('2025-03-12T10:00:00Z', 'default');
          expect(call(original, { start: movedStart })).to.deep.equal({
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [12],
          });
        });

        it('should recompute ordinal+weekday (2TU → 3WE) (ordinal BYDAY)', () => {
          const startMonth = adapter.date('2025-07-01T00:00:00Z', 'default');
          const original: SchedulerProcessedEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['2TU'],
          };
          const thirdWed = adapter.date('2025-07-16T10:00:00Z', 'default'); // 3rd Wednesday
          expect(
            call(original, { start: thirdWed }, startMonth, adapter.startOfDay(thirdWed)),
          ).to.deep.equal({ freq: 'MONTHLY', interval: 1, byDay: ['3WE'] });
        });

        it('should use -1 for last weekday of month (→ -1FR) (ordinal BYDAY)', () => {
          const monthStart = adapter.date('2025-10-01T00:00:00Z', 'default');
          const original: SchedulerProcessedEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['2TU'],
          };
          const lastFri = adapter.date('2025-10-31T09:00:00Z', 'default'); // last Friday
          expect(
            call(original, { start: lastFri }, monthStart, adapter.startOfDay(lastFri)),
          ).to.deep.equal({ freq: 'MONTHLY', interval: 1, byDay: ['-1FR'] });
        });
      });
    });
  });

  describe('applyRecurringUpdateFollowing', () => {
    it('should set extractedFromId for the new series', () => {
      // Original: daily from Jan 01
      const occurrenceStart = adapter.date('2025-01-07T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        start: adapter.date('2025-01-07T10:00:00Z', 'default'),
        end: adapter.date('2025-01-07T11:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        adapter,
        defaultEvent,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.created).to.have.length(1);
      expect(updatedEvents.created![0].extractedFromId).to.equal(defaultEvent.id);
    });

    it('should truncate the original series at the day before the edited occurrence and appends the new series', () => {
      // Original: daily from Jan 01
      // Edit an occurrence on Jan 05
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        // New timing for the split series
        start: adapter.date('2025-01-05T11:00:00Z', 'default'),
        end: adapter.date('2025-01-05T12:00:00Z', 'default'),
        title: 'Edited Event',
        // rrule omitted → inherit from original
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        adapter,
        defaultEvent,
        occurrenceStart,
        changes,
      );

      // Original remains but with truncated rule, new series appended, other event unchanged
      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([
        {
          id: defaultEvent.id,
          rrule: {
            ...defaultEvent.dataTimezone.rrule,
            until: adapter.addDays(adapter.startOfDay(occurrenceStart), -1),
          },
        },
      ]);
      expect(updatedEvents.created).to.deep.equal([
        {
          ...defaultEvent.modelInBuiltInFormat,
          title: 'Edited Event',
          start: changes.start!.toISOString(),
          end: changes.end!.toISOString(),
          id: `${defaultEvent.id}::${adapter.format(changes.start!, 'localizedNumericDate')}`,
          extractedFromId: defaultEvent.id,
          rrule: {
            ...defaultEvent.dataTimezone.rrule,
          },
        },
      ]);
    });

    it('should truncate based on the event timezone even when the UI sees the occurrence as the next day', () => {
      // DTSTART NY = 2025-01-02 23:30
      // UTC equivalent = 2025-01-03T04:30:00Z
      const original = EventBuilder.new(adapter)
        .singleDay('2025-01-03T04:30:00Z') // 23:30 Jan 2 NY
        .withDataTimezone('America/New_York')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      /**
       * SECOND OCCURRENCE:
       * NY = 2025-01-03 23:30
       * UTC = 2025-01-04T04:30:00Z
       */

      // updateRecurringEvent internally receives the occurrence converted into NY.
      const occurrenceStart = adapter.date('2025-01-04T04:30:00Z', 'default');
      const occurrenceStartDataTz = adapter.setTimezone(occurrenceStart, 'America/New_York'); // → 23:30 Jan 3 NY

      // User modifies only the hour, keeping the same NY calendar day:
      const changes = {
        id: original.id,
        start: adapter.date('2025-01-03T21:30:00', 'America/New_York'), // 9:30 PM Jan 3 NY
        end: adapter.date('2025-01-03T22:30:00', 'America/New_York'), // 10:30 PM Jan 3 NY
      };

      const updated = applyRecurringUpdateFollowing(
        adapter,
        original,
        occurrenceStartDataTz,
        changes,
      );

      const until = (updated.updated![0].rrule as SchedulerProcessedEventRecurrenceRule).until!;

      // The UI thinks it's Jan 4 (display timezone), but truncation MUST use Jan 3 NY → until Jan 2.
      expect(adapter.getDate(until)).to.equal(2);
    });

    it('should drop the original series when occurrence is on the DTSTART day (no remaining occurrences)', () => {
      // Original: daily from Jan 10
      const original = EventBuilder.new()
        .singleDay('2025-01-10T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      // occurrenceStart same calendar day as DTSTART → shouldDropOldSeries = true
      const occurrenceStart = adapter.date('2025-01-10T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: adapter.date('2025-01-10T12:00:00Z', 'default'),
        end: adapter.date('2025-01-10T13:00:00Z', 'default'),
        title: 'Edited First',
        // rrule omitted → inherit
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        adapter,
        original,
        occurrenceStart,
        changes,
      );

      // Original removed, new series added, other keeps
      expect(updatedEvents.deleted).to.deep.equal([original.id]);
      expect(updatedEvents.updated).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          ...original.modelInBuiltInFormat,
          title: 'Edited First',
          start: changes.start!.toISOString(),
          end: changes.end!.toISOString(),
          id: `${original.id}::${adapter.format(changes.start!, 'localizedNumericDate')}`,
          extractedFromId: original.id,
          rrule: {
            ...original.dataTimezone.rrule,
          },
        },
      ]);
    });

    it('should use provided changes.rrule for the new series', () => {
      // Original: daily from Jan 01
      const occurrenceStart = adapter.date('2025-01-03T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        start: adapter.date('2025-01-03T10:00:00Z', 'default'),
        end: adapter.date('2025-01-03T11:00:00Z', 'default'),
        rrule: {
          freq: 'WEEKLY',
          interval: 2,
          count: 5,
        },
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        adapter,
        defaultEvent,
        occurrenceStart,
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
      const occurrenceStart = adapter.date('2025-01-04T09:00:00Z', 'default');

      const changes = {
        id: defaultEvent.id,
        start: adapter.date('2025-01-04T12:00:00Z', 'default'),
        end: adapter.date('2025-01-04T13:00:00Z', 'default'),
        rrule: undefined,
      };

      const updated = applyRecurringUpdateFollowing(
        adapter,
        defaultEvent,
        occurrenceStart,
        changes,
      );

      expect(updated.created).to.have.length(1);
      expect(updated.created![0].rrule).to.equal(undefined);
    });

    it('should preserve wall-time format (no Z suffix) in start/end of created event', () => {
      const wallTimeEvent = EventBuilder.new(adapter)
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      const occurrenceStart = adapter.date('2025-01-05T09:00:00', 'America/New_York');
      const changes: SchedulerEventUpdatedProperties = {
        id: wallTimeEvent.id,
        start: adapter.date('2025-01-05T11:00:00', 'America/New_York'),
        end: adapter.date('2025-01-05T12:00:00', 'America/New_York'),
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        adapter,
        wallTimeEvent,
        occurrenceStart,
        changes,
      );

      const createdEvent = updatedEvents.created![0];
      expect(createdEvent.start).not.to.include('Z');
      expect(createdEvent.end).not.to.include('Z');
    });

    it('should start the new series at the occurrence date, not DTSTART, when changes.start is not provided', () => {
      // Daily series from Jan 01.
      // Edit "this and following" on Jan 05 with only a title change (no start change).
      // Expected: new series starts at Jan 05 (the occurrence), NOT at Jan 01 (DTSTART).
      // Bug: if the new series starts at DTSTART, it overlaps with the truncated original (Jan 01–04).
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        title: 'Title-only change',
        // no start/end changes
      };

      const result = applyRecurringUpdateFollowing(adapter, defaultEvent, occurrenceStart, changes);

      // New series must start on Jan 05, not Jan 01
      const newEventStart = result.created![0].start as string;
      expect(adapter.getDate(adapter.date(newEventStart, 'default'))).to.equal(5);
    });

    it('should inherit the original rule when changes.rrule is omitted', () => {
      // Original: daily from Jan 01
      const original = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 2 })
        .toProcessed();

      const occurrenceStart = adapter.date('2025-01-06T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: adapter.date('2025-01-06T15:00:00Z', 'default'),
        end: adapter.date('2025-01-06T16:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        adapter,
        original,
        occurrenceStart,
        changes,
      );

      // New series has inherited rule
      expect(updatedEvents.created).to.have.length(1);
      expect(updatedEvents.created![0].rrule).to.deep.equal({ freq: 'DAILY', interval: 2 });

      // Original series is truncated with UNTIL = day(occurrenceStart) - 1
      const expectedUntil = adapter.addDays(adapter.startOfDay(occurrenceStart), -1);
      expect(updatedEvents.updated).to.have.length(1);
      expect(
        (updatedEvents.updated![0].rrule as SchedulerProcessedEventRecurrenceRule)!.until,
      ).toEqualDateTime(expectedUntil);
    });
  });

  describe('adjustRRuleForAllMove', () => {
    it('should realign BYDAY from Sunday to Saturday when destination day changes on a WEEKLY rule', () => {
      const rrule = { freq: 'WEEKLY' as const, byDay: ['SU' as const] };
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default'); // Sunday
      const newStart = adapter.date('2025-01-11T11:00:00Z', 'default'); // Saturday

      const next = adjustRRuleForAllMove(adapter, rrule, occurrenceStart, newStart);

      expect(next).to.deep.equal({ freq: 'WEEKLY', byDay: ['SA'] });
    });

    it('should swap only the edited weekday and preserve the rest for WEEKLY with multiple BYDAY values', () => {
      const rrule = {
        freq: 'WEEKLY' as const,
        byDay: ['MO', 'WE', 'SU'] as RecurringEventByDayValue[],
      };
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default'); // SU
      const newStart = adapter.date('2025-01-11T11:00:00Z', 'default'); // SA

      const next = adjustRRuleForAllMove(adapter, rrule, occurrenceStart, newStart);

      expect(next).to.deep.equal({ freq: 'WEEKLY', byDay: ['MO', 'WE', 'SA'] });
    });

    it('should return BYDAY in canonical RFC 5545 order (MO first) regardless of adapter locale', () => {
      // In a Sunday-first locale (US, mondayWeekDayNumber=2) the loop starts at TU,
      // so MO ends up last in the output. The result must be locale-independent.
      const rrule = {
        freq: 'WEEKLY' as const,
        byDay: ['MO', 'WE', 'SU'] as RecurringEventByDayValue[],
      };
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default'); // SU
      const newStart = adapter.date('2025-01-11T11:00:00Z', 'default'); // SA

      // US adapter (Sunday-first locale)
      const nextUs = adjustRRuleForAllMove(adapter, rrule, occurrenceStart, newStart);
      // FR adapter (Monday-first locale)
      const nextFr = adjustRRuleForAllMove(adapterFr, rrule, occurrenceStart, newStart);

      // Both should produce canonical order: MO before WE before SA
      expect(nextUs.byDay).to.deep.equal(['MO', 'WE', 'SA']);
      expect(nextFr.byDay).to.deep.equal(['MO', 'WE', 'SA']);
    });

    it('should align the day-of-month to the destination date for MONTHLY (BYMONTHDAY)', () => {
      const rrule = { freq: 'MONTHLY' as const, byMonthDay: [5] };
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const newStart = adapter.date('2025-01-12T11:00:00Z', 'default');

      const next = adjustRRuleForAllMove(adapter, rrule, occurrenceStart, newStart);

      expect(next).to.deep.equal({ freq: 'MONTHLY', byMonthDay: [12] });
    });

    it('should recompute ordinal + weekday based on destination date for MONTHLY (ordinal BYDAY)', () => {
      // 2TU (second Tuesday) -> destination is 2025-01-18 (Saturday) which is 3rd Saturday in Jan 2025
      const rrule = { freq: 'MONTHLY' as const, byDay: ['2TU' as const] };
      const occurrenceStart = adapter.date('2025-01-14T09:00:00Z', 'default'); // second Tuesday
      const newStart = adapter.date('2025-01-18T11:00:00Z', 'default'); // third Saturday

      const next = adjustRRuleForAllMove(adapter, rrule, occurrenceStart, newStart);

      expect(next).to.deep.equal({ freq: 'MONTHLY', byDay: ['3SA'] });
    });

    it('should return the same rule (no weekday pattern to adjust)', () => {
      const rrule = { freq: 'DAILY' as const, interval: 1 };
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const newStart = adapter.date('2025-01-12T11:00:00Z', 'default');

      const next = adjustRRuleForAllMove(adapter, rrule, occurrenceStart, newStart);

      expect(next).to.deep.equal(rrule);
    });
  });

  describe('applyRecurringUpdateAll', () => {
    it('should replace exactly one event without creating duplicates', () => {
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const changes = {
        id: defaultEvent.id,
        title: 'Rec 1 Updated',
      };

      const updatedEvents = applyRecurringUpdateAll(
        adapter,
        defaultEvent,
        occurrenceStart,
        changes,
      );
      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([changes]);
    });

    it('should preserve the original DTSTART day when editing an occurrence that appears shifted due to timezone conversion', () => {
      // Original timezone = Tokyo (UTC+9)
      // 2025-01-10 00:30 JST → 2025-01-09 15:30 UTC
      const original = EventBuilder.new(adapter)
        .singleDay('2025-01-09T15:30:00Z')
        .withDataTimezone('Asia/Tokyo')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const occurrenceStart = original.dataTimezone.start.value;

      // Changes come as instants
      // 00:40 JST → 2025-01-09T15:40:00Z
      // 01:30 JST → 2025-01-09T16:30:00Z
      const changes = {
        id: original.id,
        start: adapter.date('2025-01-09T15:40:00Z', 'default'),
        end: adapter.date('2025-01-09T16:30:00Z', 'default'),
      };

      const updated = applyRecurringUpdateAll(adapter, original, occurrenceStart, changes);

      // DTSTART should still correspond to Jan 10 in the event data timezone (Tokyo)
      const newStart = updated.updated![0].start!;
      expect(adapter.getDate(adapter.setTimezone(newStart, 'Asia/Tokyo'))).to.equal(10);
    });

    it('should use the rrule provided in changes when present', () => {
      const occurrenceStart = defaultEvent.dataTimezone.start.value;
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        title: 'Now Weekly',
        rrule: { freq: 'WEEKLY', interval: 2, byDay: ['MO'] },
        start: adapter.date('2025-01-01T10:00:00Z', 'default'),
        end: adapter.date('2025-01-01T11:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateAll(
        adapter,
        defaultEvent,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([changes]);
    });

    it('should remove recurrence when changes.rrule is explicitly undefined', () => {
      const occurrenceStart = defaultEvent.dataTimezone.start.value;
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        title: 'One-off',
        rrule: undefined,
      };

      const updatedEvents = applyRecurringUpdateAll(
        adapter,
        defaultEvent,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([changes]);
    });

    it('should keep the original date and just update hours/minutes when changing the time of a non-first occurrence', () => {
      // Edited the Jan 05 occurrence and changed only the time
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const newStart = adapter.date('2025-01-05T11:15:00Z', 'default');
      const newEnd = adapter.date('2025-01-05T12:15:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        start: newStart,
        end: newEnd,
      };

      const updatedEvents = applyRecurringUpdateAll(
        adapter,
        defaultEvent,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);

      // Date stays anchored to root (Jan 01), times come from changes
      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          start: mergeDateAndTime(adapter, defaultEvent.dataTimezone.start.value, newStart),
          end: mergeDateAndTime(adapter, defaultEvent.dataTimezone.end.value, newEnd),
        },
      ]);
    });

    it('should update the rrule when editing a non-first occurrence with a different day', () => {
      const original = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ byDay: ['SU'], freq: 'WEEKLY' })
        .toProcessed();
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default'); // Jan 5, a Sunday
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: adapter.date('2025-01-11T11:00:00Z', 'default'), // Saturday
        end: adapter.date('2025-01-11T12:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateAll(adapter, original, occurrenceStart, changes);

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          start: mergeDateAndTime(adapter, original.dataTimezone.start.value, changes.start!),
          end: mergeDateAndTime(adapter, original.dataTimezone.end.value, changes.end!),
          rrule: { byDay: ['SA'], freq: 'WEEKLY' },
        },
      ]);
    });

    it('should update the start date of the original event when editing the first occurrence (DTSTART)', () => {
      // DTSTART = 2025-01-01
      const occurrenceStart = defaultEvent.dataTimezone.start.value;

      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        start: adapter.date('2025-01-12T11:00:00Z', 'default'),
        end: adapter.date('2025-01-12T12:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateAll(
        adapter,
        defaultEvent,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          rrule: defaultEvent.dataTimezone.rrule,
        },
      ]);
    });

    it('should preserve the user-provided changes.rrule and NOT auto-adjust it when the date also changes', () => {
      // Series: weekly on Sunday (DTSTART Jan 1, a Wednesday - but with byDay:['SU'])
      const original = EventBuilder.new()
        .singleDay('2025-01-05T09:00:00Z') // Sunday
        .rrule({ freq: 'WEEKLY', byDay: ['SU'] })
        .toProcessed();

      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default'); // Sunday

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
        start: adapter.date('2025-01-11T11:00:00Z', 'default'), // Saturday
        end: adapter.date('2025-01-11T12:00:00Z', 'default'),
        rrule: explicitRRule,
      };

      const updatedEvents = applyRecurringUpdateAll(adapter, original, occurrenceStart, changes);

      // The rrule in the result must be exactly the user-provided one (interval:2, count:10 preserved)
      expect((updatedEvents.updated![0] as SchedulerEventUpdatedProperties).rrule).to.deep.equal(
        explicitRRule,
      );
    });
  });

  describe('applyRecurringUpdateOnlyThis', () => {
    it('should create a detached event with exDate on the original and keep the rest intact', () => {
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const changesWithoutId = {
        title: 'Only-this edited',
        start: adapter.date('2025-01-05T11:00:00Z', 'default'),
        end: adapter.date('2025-01-05T12:00:00Z', 'default'),
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        ...changesWithoutId,
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        adapter,
        defaultEvent,
        occurrenceStart,
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
        { id: defaultEvent.id, exDates: [adapter.startOfDay(occurrenceStart)] },
      ]);
    });

    it('should accumulate previous exDates', () => {
      const original = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1 })
        .exDates(['2025-01-03Z'])
        .toProcessed();

      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        title: 'Another only-this',
        start: adapter.date('2025-01-05T11:00:00Z', 'default'),
        end: adapter.date('2025-01-05T12:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        adapter,
        original,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.updated).to.deep.equal([
        {
          id: original.id,
          exDates: [...(original.dataTimezone.exDates ?? []), adapter.startOfDay(occurrenceStart)],
        },
      ]);
    });

    it('should use changes.start to generate the detachedId', () => {
      const occurrenceStart = adapter.date('2025-01-07T09:00:00Z', 'default');
      const changesWithoutId = {
        title: 'Only-this changed date',
        start: adapter.date('2025-01-08T11:00:00Z', 'default'),
        end: adapter.date('2025-01-08T12:00:00Z', 'default'),
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: defaultEvent.id,
        ...changesWithoutId,
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        adapter,
        defaultEvent,
        occurrenceStart,
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
        { id: defaultEvent.id, exDates: [adapter.startOfDay(occurrenceStart)] },
      ]);
    });

    it('should preserve wall-time format (no Z suffix) in start/end of created event', () => {
      const wallTimeEvent = EventBuilder.new(adapter)
        .span('2025-01-01T09:00:00', '2025-01-01T10:00:00')
        .withDataTimezone('America/New_York')
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      const occurrenceStart = adapter.date('2025-01-05T09:00:00', 'America/New_York');
      const changes: SchedulerEventUpdatedProperties = {
        id: wallTimeEvent.id,
        title: 'Only-this wall-time',
        start: adapter.date('2025-01-05T11:00:00', 'America/New_York'),
        end: adapter.date('2025-01-05T12:00:00', 'America/New_York'),
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        adapter,
        wallTimeEvent,
        occurrenceStart,
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
      const occurrenceStart = original.dataTimezone.start.value;

      const updated = applyRecurringUpdateOnlyThis(adapter, original, occurrenceStart, {
        id: original.id,
        title: 'Edit only this',
      });

      // EXDATE should match America/New_York startOfDay, not the display timezone shifted date
      expect(
        adapter.isSameDay(updated.updated![0].exDates![0], adapter.startOfDay(occurrenceStart)),
      ).to.equal(true);
    });
  });
});
