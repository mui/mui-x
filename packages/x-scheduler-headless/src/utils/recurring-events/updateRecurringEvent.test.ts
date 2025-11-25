import { adapter, createProcessedEvent } from 'test/utils/scheduler';
import {
  SchedulerEventUpdatedProperties,
  SchedulerEvent,
  RecurringEventByDayValue,
  RecurringEventRecurrenceRule,
  SchedulerValidDate,
} from '@mui/x-scheduler-headless/models';
import { mergeDateAndTime } from '../date-utils';
import {
  adjustRRuleForAllMove,
  applyRecurringUpdateAll,
  applyRecurringUpdateFollowing,
  applyRecurringUpdateOnlyThis,
  decideSplitRRule,
} from './updateRecurringEvent';
import { estimateOccurrencesUpTo } from './internal-utils';

describe('recurring-events/internal-utils', () => {
  const createRecurringEvent = (overrides: Partial<SchedulerEvent> = {}) =>
    createProcessedEvent({
      id: 'recurring',
      title: 'Recurring Event',
      start: adapter.date('2025-01-01T09:00:00Z', 'default'),
      end: adapter.date('2025-01-01T10:00:00Z', 'default'),
      rrule: { freq: 'DAILY', interval: 1 },
      ...overrides,
    });

  describe('decideSplitRRule', () => {
    const seriesStart = adapter.date('2025-01-01T09:00:00Z', 'default'); // DTSTART
    const splitStart = adapter.date('2025-01-06T15:00:00Z', 'default'); // "this and following" starts here

    const call = (
      originalRule: RecurringEventRecurrenceRule,
      changes: Partial<SchedulerEvent> = {},
      originalSeriesStart: SchedulerValidDate = seriesStart,
      split: SchedulerValidDate = splitStart,
    ) => decideSplitRRule(adapter, originalRule, originalSeriesStart, split, changes);

    it('should return changes.rrule as is when user explicitly changed recurrence', () => {
      const original: RecurringEventRecurrenceRule = { freq: 'DAILY', interval: 1 };
      const newRule: RecurringEventRecurrenceRule = { freq: 'WEEKLY', interval: 2, count: 5 };

      const res = call(original, { rrule: newRule });
      expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 2, count: 5 });
    });

    it('should return undefined when user explicitly removed recurrence', () => {
      const original: RecurringEventRecurrenceRule = { freq: 'DAILY', interval: 1 };
      const res = call(original, { rrule: undefined });
      expect(res).to.equal(undefined);
    });

    describe('should inherit base pattern when RRULE not explicitly changed', () => {
      it('should inherit base pattern when RRULE not touched and there are no boundaries', () => {
        const original: RecurringEventRecurrenceRule = { freq: 'DAILY', interval: 2 };
        const res = call(original, { title: 'New Event Title' });
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 2 });
      });

      it('should inherit base pattern and recomputes COUNT to remaining occurrences when RRULE not touched', () => {
        // Original: daily with count 42 from Jan 01
        // Split on Jan 06 => Jan 01..05 consumed => remaining 37 => new COUNT=37
        const original: RecurringEventRecurrenceRule = { freq: 'DAILY', interval: 1, count: 42 };

        const dayBeforeSplit = adapter.addDays(adapter.startOfDay(splitStart), -1);
        const consumed = estimateOccurrencesUpTo(adapter, original, seriesStart, dayBeforeSplit);
        const remaining = (original.count as number) - consumed;

        const res = call(original, { title: 'New Event Title' });
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 1, count: remaining });
      });

      it('should keep the original UNTIL when inheriting (untouched RRULE)', () => {
        const originalUntil = adapter.date('2025-01-20T23:59:59Z', 'default');
        const original: RecurringEventRecurrenceRule = {
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
          const original: RecurringEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['MO', 'WE'],
          };
          const res = call(original, { title: 'New Event Title' });
          expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE'] });
        });

        it('should realign WEEKLY BYDAY when moving the day of the occurrence', () => {
          // Expect MO,WE → TU,WE (preserve pattern, swap only the edited weekday).
          const original: RecurringEventRecurrenceRule = {
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
          const original: RecurringEventRecurrenceRule = {
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
          const original: RecurringEventRecurrenceRule = {
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
          const original: RecurringEventRecurrenceRule = {
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
          const original: RecurringEventRecurrenceRule = {
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
      const original = createRecurringEvent();

      const occurrenceStart = adapter.date('2025-01-07T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: adapter.date('2025-01-07T10:00:00Z', 'default'),
        end: adapter.date('2025-01-07T11:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        adapter,
        original,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.created).to.have.length(1);
      expect(updatedEvents.created![0].extractedFromId).to.equal(original.id);
    });

    it('should truncate the original series at the day before the edited occurrence and appends the new series', () => {
      // Original: daily from Jan 01
      const original = createRecurringEvent();

      // Edit an occurrence on Jan 05
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        // New timing for the split series
        start: adapter.date('2025-01-05T11:00:00Z', 'default'),
        end: adapter.date('2025-01-05T12:00:00Z', 'default'),
        title: 'Edited Event',
        // rrule omitted → inherit from original
      };

      const updatedEvents = applyRecurringUpdateFollowing(
        adapter,
        original,
        occurrenceStart,
        changes,
      );

      // Original remains but with truncated rule, new series appended, other event unchanged
      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([
        {
          id: original.id,
          rrule: {
            ...original.rrule,
            until: adapter.addDays(adapter.startOfDay(occurrenceStart), -1),
          },
        },
      ]);
      expect(updatedEvents.created).to.deep.equal([
        {
          ...original.modelInBuiltInFormat,
          ...changes,
          id: `${original.id}::${adapter.format(changes.start!, 'localizedNumericDate')}`,
          extractedFromId: original.id,
          rrule: {
            ...original.rrule,
          },
        },
      ]);
    });

    it('should drop the original series when occurrence is on the DTSTART day (no remaining occurrences)', () => {
      // Original: daily from Jan 10
      const original = createRecurringEvent({
        start: adapter.date('2025-01-10T09:00:00Z', 'default'),
        end: adapter.date('2025-01-10T10:00:00Z', 'default'),
      });

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
          ...changes,
          id: `${original.id}::${adapter.format(changes.start!, 'localizedNumericDate')}`,
          extractedFromId: original.id,
          rrule: {
            ...original.rrule,
          },
        },
      ]);
    });

    it('should use provided changes.rrule for the new series', () => {
      // Original: daily from Jan 01
      const original = createRecurringEvent();
      const occurrenceStart = adapter.date('2025-01-03T09:00:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
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
        original,
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
      const original = createRecurringEvent();
      const occurrenceStart = adapter.date('2025-01-04T09:00:00Z', 'default');

      const changes = {
        ...original,
        start: adapter.date('2025-01-04T12:00:00Z', 'default'),
        end: adapter.date('2025-01-04T13:00:00Z', 'default'),
        rrule: undefined,
      };

      const updated = applyRecurringUpdateFollowing(adapter, original, occurrenceStart, changes);

      expect(updated.created).to.have.length(1);
      expect(updated.created![0].rrule).to.equal(undefined);
    });

    it('should inherit the original rule when changes.rrule is omitted', () => {
      // Original: daily from Jan 01
      const original = createRecurringEvent({ rrule: { freq: 'DAILY', interval: 2 } });

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
        (updatedEvents.updated![0].rrule as RecurringEventRecurrenceRule)!.until,
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

      expect(next).to.deep.equal({ freq: 'WEEKLY', byDay: ['WE', 'SA', 'MO'] });
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
      const original = createRecurringEvent({ id: 'rec-1' });
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const changes = {
        id: original.id,
        title: 'Rec 1 Updated',
      };

      const updatedEvents = applyRecurringUpdateAll(adapter, original, occurrenceStart, changes);

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([changes]);
    });

    it('should use the rrule provided in changes when present', () => {
      const original = createRecurringEvent();

      const occurrenceStart = original.start;
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        title: 'Now Weekly',
        rrule: { freq: 'WEEKLY', interval: 2, byDay: ['MO'] },
        start: adapter.date('2025-01-01T10:00:00Z', 'default'),
        end: adapter.date('2025-01-01T11:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateAll(
        adapter,
        original,
        occurrenceStart.value,
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([changes]);
    });

    it('should remove recurrence when changes.rrule is explicitly undefined', () => {
      const original = createRecurringEvent();

      const occurrenceStart = original.start;
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        title: 'One-off',
        rrule: undefined,
      };

      const updatedEvents = applyRecurringUpdateAll(
        adapter,
        original,
        occurrenceStart.value,
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);
      expect(updatedEvents.updated).to.deep.equal([changes]);
    });

    it('should keep the original date and just update hours/minutes when changing the time of a non-first occurrence', () => {
      const original = createRecurringEvent();

      // Edited the Jan 05 occurrence and changed only the time
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const newStart = adapter.date('2025-01-05T11:15:00Z', 'default');
      const newEnd = adapter.date('2025-01-05T12:15:00Z', 'default');
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: newStart,
        end: newEnd,
      };

      const updatedEvents = applyRecurringUpdateAll(adapter, original, occurrenceStart, changes);

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.equal(undefined);

      // Date stays anchored to root (Jan 01), times come from changes
      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          start: mergeDateAndTime(adapter, original.start.value, newStart),
          end: mergeDateAndTime(adapter, original.end.value, newEnd),
        },
      ]);
    });

    it('should update the rrule when editing a non-first occurrence with a different day', () => {
      const original = createRecurringEvent({ rrule: { byDay: ['SU'], freq: 'WEEKLY' } });
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
          start: mergeDateAndTime(adapter, original.start.value, changes.start!),
          end: mergeDateAndTime(adapter, original.end.value, changes.end!),
          rrule: { byDay: ['SA'], freq: 'WEEKLY' },
        },
      ]);
    });

    it('should update the start date of the original event when editing the first occurrence (DTSTART)', () => {
      const original = createRecurringEvent(); // DTSTART = 2025-01-01
      const occurrenceStart = original.start;

      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        start: adapter.date('2025-01-12T11:00:00Z', 'default'),
        end: adapter.date('2025-01-12T12:00:00Z', 'default'),
      };

      const updatedEvents = applyRecurringUpdateAll(
        adapter,
        original,
        occurrenceStart.value,
        changes,
      );

      expect(updatedEvents.updated).to.deep.equal([
        {
          ...changes,
          rrule: original.rrule,
        },
      ]);
    });
  });

  describe('applyRecurringUpdateOnlyThis', () => {
    it('should create a detached event with exDate on the original and keep the rest intact', () => {
      const original = createRecurringEvent();

      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z', 'default');
      const changesWithoutId = {
        title: 'Only-this edited',
        start: adapter.date('2025-01-05T11:00:00Z', 'default'),
        end: adapter.date('2025-01-05T12:00:00Z', 'default'),
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        ...changesWithoutId,
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        adapter,
        original,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          ...changesWithoutId,
          extractedFromId: original.id,
        },
      ]);
      expect(updatedEvents.updated).to.deep.equal([
        { id: original.id, exDates: [adapter.startOfDay(occurrenceStart)] },
      ]);
    });

    it('should accumulate previous exDates', () => {
      const prevEx = adapter.startOfDay(adapter.date('2025-01-03T09:00:00Z', 'default'));
      const original = createRecurringEvent({ exDates: [prevEx] });

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
          exDates: [...(original.exDates ?? []), adapter.startOfDay(occurrenceStart)],
        },
      ]);
    });

    it('should use changes.start to generate the detachedId', () => {
      const original = createRecurringEvent();

      const occurrenceStart = adapter.date('2025-01-07T09:00:00Z', 'default');
      const changesWithoutId = {
        title: 'Only-this changed date',
        start: adapter.date('2025-01-08T11:00:00Z', 'default'),
        end: adapter.date('2025-01-08T12:00:00Z', 'default'),
      };
      const changes: SchedulerEventUpdatedProperties = {
        id: original.id,
        ...changesWithoutId,
      };

      const updatedEvents = applyRecurringUpdateOnlyThis(
        adapter,
        original,
        occurrenceStart,
        changes,
      );

      expect(updatedEvents.deleted).to.equal(undefined);
      expect(updatedEvents.created).to.deep.equal([
        {
          extractedFromId: original.id,
          ...changesWithoutId,
        },
      ]);
      expect(updatedEvents.updated).to.deep.equal([
        { id: original.id, exDates: [adapter.startOfDay(occurrenceStart)] },
      ]);
    });
  });
});
