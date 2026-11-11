import { adapter, EventBuilder } from 'test/utils/scheduler';
import { renderHook } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { useEventOccurrencesWithDayGridPosition } from './useEventOccurrencesWithDayGridPosition';
import type { SchedulerProcessedEvent } from '../models';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { createEventRangeIndex } from '../internals/utils/event-range-index';
import { getDayListFromPlainDates } from '../get-day-list';
import { BaseTemporal } from '../internals/utils/base-temporal';

describe('useDayListEventOccurrencesWithPosition', () => {
  const days = getDayListFromPlainDates({
    firstPlainDate: BaseTemporal.PlainDate.from('2024-01-15'),
    lastPlainDate: BaseTemporal.PlainDate.from('2024-01-17'),
    timezone: 'default',
  });

  function testHook(
    events: SchedulerProcessedEvent[],
    maxEvents?: number,
    { dayList = days, displayTimezone = 'default' } = {},
  ) {
    const { result } = renderHook(() => {
      const occurrencesMap = innerGetEventOccurrencesGroupedByDay({
        adapter,
        days: dayList,
        eventRangeIndex: createEventRangeIndex(events, false),
        visibleResources: {},
        displayTimezone,
        recurringEventsPlugin: null,
      });
      return useEventOccurrencesWithDayGridPosition({ days: dayList, occurrencesMap, maxEvents });
    });

    return result.current;
  }

  it('should set index to 1 for the first event on a day', () => {
    const result = testHook([EventBuilder.new().singleDay('2024-01-15Z').toProcessed()]);

    expect(result.maxIndex).to.equal(1);
    expect(result.days[0].withPosition).to.have.length(1);
    expect(result.days[0].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 1 });
  });

  it('should place the occurrences in all the concurrent indexes when in the same day', () => {
    const result = testHook([
      EventBuilder.new().id('A').singleDay('2024-01-15Z').toProcessed(),
      EventBuilder.new().id('B').singleDay('2024-01-15Z').toProcessed(),
      EventBuilder.new().id('C').singleDay('2024-01-15Z').toProcessed(),
    ]);

    expect(result.maxIndex).to.equal(3);
    expect(result.days[0].withPosition[0].id).to.equal('A');
    expect(result.days[0].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 1 });
    expect(result.days[0].withPosition[1].id).to.equal('B');
    expect(result.days[0].withPosition[1].position).to.deep.equal({ index: 2, daySpan: 1 });
    expect(result.days[0].withPosition[2].id).to.equal('C');
    expect(result.days[0].withPosition[2].position).to.deep.equal({ index: 3, daySpan: 1 });
  });

  it('should keep the same index for multi-day events and set daySpan=1 and isInvisible: true for all days but the first one', () => {
    const result = testHook([
      EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-16Z').toProcessed(),
      EventBuilder.new().id('B').startAt('2024-01-16Z').endAt('2024-01-17Z').toProcessed(),
    ]);

    expect(result.maxIndex).to.equal(2);
    expect(result.days[1].withPosition[1].id).to.equal('B');
    expect(result.days[1].withPosition[1].position).to.deep.equal({ index: 2, daySpan: 2 });
    expect(result.days[2].withPosition[0].id).to.equal('B');
    // Event B was visible on day 2, so it stays in row 2 — no compaction to row 1
    expect(result.days[2].withPosition[0].position).to.deep.equal({
      index: 2,
      daySpan: 1,
      isInvisible: true,
    });
  });

  it('should resurface a hidden event into a visible row when one opens up', () => {
    // A (row 1) spans days 1–3, B (row 2) spans days 1–2 only.
    // C first appears on day 2 as a new event and gets hidden (row 3 > maxEvents=2).
    // On day 3 B is absent → row 2 is free → C resurfaces at a visible index.
    const result = testHook(
      [
        // endAt('2024-01-17Z') → endOfDay(Jan 17) → event IS visible on Jan 17 (day 3)
        EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-17Z').toProcessed(),
        // endAt('2024-01-16Z') → endOfDay(Jan 16) → event ends before Jan 17, so absent on day 3
        EventBuilder.new().id('B').startAt('2024-01-15Z').endAt('2024-01-16Z').toProcessed(),
        // C starts on day 2, endAt('2024-01-17Z') → also visible on day 3
        EventBuilder.new().id('C').startAt('2024-01-16Z').endAt('2024-01-17Z').toProcessed(),
      ],
      2,
    );

    // C first appears on day 2 hidden (index > maxEvents=2)
    expect(result.days[1].withPosition.find((o) => o.id === 'C')!.position.index).to.be.greaterThan(
      2,
    );

    // C resurfaces on day 3 into a visible row
    const cDay3 = result.days[2].withPosition.find((o) => o.id === 'C')!;
    expect(cDay3.position.index).to.be.lessThanOrEqual(2);
  });

  it('should not collide with visible events when a large-span hidden event could resurface', () => {
    // C starts on day 2 with a larger total span (6 days) than A and B (3 days each).
    // Because C has the largest span, it is sorted first among active events on day 3.
    // Without the pre-reservation fix, C would steal row 1 from A. With the fix it
    // correctly finds that rows 1 and 2 are already reserved and stays hidden (row 3).
    const result = testHook(
      [
        EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-18Z').toProcessed(),
        EventBuilder.new().id('B').startAt('2024-01-15Z').endAt('2024-01-18Z').toProcessed(),
        EventBuilder.new().id('C').startAt('2024-01-16Z').endAt('2024-01-22Z').toProcessed(),
      ],
      2,
    );

    for (const day of result.days.slice(1)) {
      const a = day.withPosition.find((o) => o.id === 'A')!;
      const b = day.withPosition.find((o) => o.id === 'B')!;
      const c = day.withPosition.find((o) => o.id === 'C')!;

      // A must remain at row 1 and B at row 2 — the pre-reservation prevents C from
      // bumping A off its row.
      expect(a.position.index).to.equal(1);
      expect(b.position.index).to.equal(2);
      // C must stay beyond the visible threshold, never colliding with A or B.
      expect(c.position.index).to.be.greaterThan(2);
    }
  });

  it('should split a bumped multi-day event and resurface it after the overflow day', () => {
    // A and B fill rows 1-2 across all days. C appears on day 2 only, so that day
    // overflows and the "+N more" button takes row 2 — B is bumped into the overflow
    // there, then must resurface as a visible bar on day 3 instead of vanishing.
    const result = testHook(
      [
        EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-17Z').toProcessed(),
        EventBuilder.new().id('B').startAt('2024-01-15Z').endAt('2024-01-17Z').toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-16Z').toProcessed(),
      ],
      2,
    );

    const bDay1 = result.days[0].withPosition.find((o) => o.id === 'B')!;
    const bDay2 = result.days[1].withPosition.find((o) => o.id === 'B')!;
    const bDay3 = result.days[2].withPosition.find((o) => o.id === 'B')!;

    // Day 1: B shows as a visible bar on row 2, truncated so it does not run over the
    // "+N more" button that appears on day 2.
    expect(bDay1.position.index).to.equal(2);
    expect(bDay1.position.isInvisible).to.not.equal(true);
    expect(bDay1.position.daySpan).to.equal(1);

    // Day 2 overflows: B is bumped into the "+N more" overflow, not rendered as a bar.
    expect(bDay2.position.isInvisible).to.equal(true);

    // Day 3: B resurfaces as a visible bar again instead of staying hidden.
    expect(bDay3.position.index).to.equal(2);
    expect(bDay3.position.isInvisible).to.not.equal(true);
  });

  it('should find gaps in the indexes and use the lower available', () => {
    const result = testHook([
      EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-16Z').toProcessed(),
      EventBuilder.new().id('B').startAt('2024-01-16Z').endAt('2024-01-17Z').toProcessed(),
      EventBuilder.new().id('C').singleDay('2024-01-17Z').toProcessed(),
    ]);

    // Event A is not present on day 3, so event C should use index 1 on that day instead of using index 3 below Event B
    expect(result.maxIndex).to.equal(2);
    expect(result.days[2].withPosition[0].id).to.equal('C');
    expect(result.days[2].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 1 });
    expect(result.days[2].withPosition[1].id).to.equal('B');
    expect(result.days[2].withPosition[1].position).to.deep.equal({
      index: 2,
      daySpan: 1,
      isInvisible: true,
    });
  });

  it('should span the next day when the first day starts after midnight', () => {
    // America/Havana springs forward from 00:00 to 01:00 on March 8th, 2026.
    const timezone = 'America/Havana';
    const dayList = getDayListFromPlainDates({
      firstPlainDate: BaseTemporal.PlainDate.from('2026-03-08'),
      lastPlainDate: BaseTemporal.PlainDate.from('2026-03-09'),
      timezone,
    });
    const result = testHook(
      [
        EventBuilder.new()
          .withDisplayTimezone(timezone)
          .startAt('2026-03-08T14:00:00Z')
          .endAt('2026-03-09T04:30:00Z')
          .toProcessed(),
      ],
      undefined,
      { dayList, displayTimezone: timezone },
    );

    expect(result.days[0].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 2 });
    expect(result.days[1].withPosition[0].position).to.deep.equal({
      index: 1,
      daySpan: 1,
      isInvisible: true,
    });
  });

  it('should span every date an event covers after a DST transition at midnight', () => {
    // America/Havana springs forward from 00:00 to 01:00 on March 8th, 2026.
    const havanaDays = getDayListFromPlainDates({
      firstPlainDate: BaseTemporal.PlainDate.from('2026-03-08'),
      lastPlainDate: BaseTemporal.PlainDate.from('2026-03-10'),
      timezone: 'America/Havana',
    });
    const result = testHook(
      [
        EventBuilder.new()
          .id('A')
          .span('2026-03-09T16:00:00Z', '2026-03-10T04:30:00Z') // March 9th 12:00 to March 10th 00:30
          .withDisplayTimezone('America/Havana')
          .toProcessed(),
      ],
      undefined,
      { dayList: havanaDays, displayTimezone: 'America/Havana' },
    );

    expect(result.days[1].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 2 });
  });
});
