import { adapter } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { iterate } from './iterate';

describe('iterate()', () => {
  describe('full aligned ranges', () => {
    it('should return one cell per year with spanInTicks=1 when walking years over year ticks', () => {
      const start = adapter.date('2025-01-01T00:00:00Z', 'default');
      const end = adapter.date('2027-12-31T23:59:59.999Z', 'default');

      const cells = iterate(adapter, 'year', 'year', start, end);

      expect(cells.length).to.equal(3);
      cells.forEach((cell) => expect(cell.spanInTicks).to.equal(1));
    });

    it('should return 24 hour ticks per day cell in the dayAndHour shape', () => {
      const start = adapter.date('2025-07-03T00:00:00Z', 'default');
      const end = adapter.date('2025-07-06T23:59:59.999Z', 'default');

      const dayCells = iterate(adapter, 'day', 'hour', start, end);
      const hourCells = iterate(adapter, 'hour', 'hour', start, end);

      expect(dayCells.length).to.equal(4);
      dayCells.forEach((cell) => expect(cell.spanInTicks).to.equal(24));
      expect(hourCells.length).to.equal(4 * 24);
      hourCells.forEach((cell) => expect(cell.spanInTicks).to.equal(1));
    });

    it('should report total span equal to the total tick count of the visible range', () => {
      const start = adapter.date('2025-01-01T00:00:00Z', 'default');
      const end = adapter.date('2025-01-28T23:59:59.999Z', 'default');

      const cells = iterate(adapter, 'week', 'day', start, end);
      const total = cells.reduce((sum, cell) => sum + cell.spanInTicks, 0);

      expect(total).to.equal(28);
    });
  });

  describe('hour range trimming', () => {
    const start = adapter.date('2025-07-03T00:00:00Z', 'default');
    const end = adapter.date('2025-07-06T23:59:59.999Z', 'default');

    it('should emit only the visible hour cells per day for a trimmed hour range', () => {
      const hourCells = iterate(adapter, 'hour', 'hour', start, end, undefined, {
        dayStartMinute: 480,
        dayEndMinute: 1200,
      });

      expect(hourCells.length).to.equal(4 * 12);
      expect(adapter.getHours(hourCells[0].date)).to.equal(8);
      expect(adapter.getHours(hourCells[11].date)).to.equal(19);
      expect(adapter.getHours(hourCells[12].date)).to.equal(8);
      hourCells.forEach((cell) => expect(cell.spanInTicks).to.equal(1));
    });

    it('should index the emitted hour cells contiguously', () => {
      const hourCells = iterate(adapter, 'hour', 'hour', start, end, undefined, {
        dayStartMinute: 480,
        dayEndMinute: 1200,
      });

      hourCells.forEach((cell, i) => expect(cell.index).to.equal(i));
    });

    it('should span the day cells by the visible hours only', () => {
      const dayCells = iterate(adapter, 'day', 'hour', start, end, undefined, {
        dayStartMinute: 480,
        dayEndMinute: 1200,
      });

      expect(dayCells.length).to.equal(4);
      dayCells.forEach((cell) => expect(cell.spanInTicks).to.equal(12));
    });

    it('should behave like the untrimmed iteration when the hour range covers the full day', () => {
      const trimmed = iterate(adapter, 'hour', 'hour', start, end, undefined, {
        dayStartMinute: 0,
        dayEndMinute: 1440,
      });
      const untrimmed = iterate(adapter, 'hour', 'hour', start, end);

      expect(trimmed).to.deep.equal(untrimmed);
    });

    it('should ignore the hour range when the tick unit is not hour', () => {
      const cells = iterate(adapter, 'week', 'day', start, end, undefined, {
        dayStartMinute: 480,
        dayEndMinute: 1200,
      });
      const untrimmed = iterate(adapter, 'week', 'day', start, end);

      expect(cells).to.deep.equal(untrimmed);
    });
  });

  // The hour row is a wall-clock grid, like the Event Calendar's time axis: every day
  // shows the same hour columns whatever the real hours of that day are. Events crossing
  // a transition stretch or shrink over that fixed grid instead of moving it.
  describe('across DST transitions', () => {
    // Mar 8 2026 in America/New_York skips the 02:00 wall-clock hour.
    const springForward = adapter.date('2026-03-08T00:00:00', 'America/New_York');
    // Nov 2 2025 in America/New_York repeats the 01:00 wall-clock hour.
    const fallBack = adapter.date('2025-11-02T00:00:00', 'America/New_York');

    it('should emit 24 hour cells on a spring-forward day', () => {
      const cells = iterate(
        adapter,
        'hour',
        'hour',
        springForward,
        adapter.endOfDay(springForward),
      );

      expect(cells.length).to.equal(24);
      cells.forEach((cell) => expect(cell.spanInTicks).to.equal(1));
    });

    it('should emit 24 hour cells on a fall-back day', () => {
      const cells = iterate(adapter, 'hour', 'hour', fallBack, adapter.endOfDay(fallBack));

      expect(cells.length).to.equal(24);
      cells.forEach((cell) => expect(cell.spanInTicks).to.equal(1));
    });

    it('should keep a cell for the hour skipped by the spring-forward transition', () => {
      const cells = iterate(
        adapter,
        'hour',
        'hour',
        springForward,
        adapter.endOfDay(springForward),
      );

      expect(cells.map((cell) => cell.wallClockHour).slice(0, 5)).to.deep.equal([0, 1, 2, 3, 4]);
    });

    it('should emit a single cell for the hour repeated by the fall-back transition', () => {
      const cells = iterate(adapter, 'hour', 'hour', fallBack, adapter.endOfDay(fallBack));

      expect(cells.filter((cell) => cell.wallClockHour === 1).length).to.equal(1);
    });

    it('should span the day cell by the displayed hour count on a DST day', () => {
      const springDays = iterate(
        adapter,
        'day',
        'hour',
        springForward,
        adapter.endOfDay(springForward),
      );
      const fallBackDays = iterate(adapter, 'day', 'hour', fallBack, adapter.endOfDay(fallBack));

      expect(springDays.map((cell) => cell.spanInTicks)).to.deep.equal([24]);
      expect(fallBackDays.map((cell) => cell.spanInTicks)).to.deep.equal([24]);
    });

    describe('with a trimmed hour window', () => {
      const HOUR_WINDOW = { dayStartMinute: 0, dayEndMinute: 360 };
      // Starts exactly on the hour the spring-forward transition skips.
      const GAP_HOUR_WINDOW = { dayStartMinute: 120, dayEndMinute: 1200 };

      it('should emit one cell per displayed hour on a fall-back day', () => {
        const end = adapter.endOfDay(adapter.addDays(fallBack, 1));

        const hourCells = iterate(adapter, 'hour', 'hour', fallBack, end, undefined, HOUR_WINDOW);
        const dayCells = iterate(adapter, 'day', 'hour', fallBack, end, undefined, HOUR_WINDOW);

        expect(hourCells.length).to.equal(12);
        expect(dayCells.map((cell) => cell.spanInTicks)).to.deep.equal([6, 6]);
      });

      it('should emit one cell per displayed hour on a spring-forward day', () => {
        const end = adapter.endOfDay(adapter.addDays(springForward, 1));

        const hourCells = iterate(
          adapter,
          'hour',
          'hour',
          springForward,
          end,
          undefined,
          HOUR_WINDOW,
        );
        const dayCells = iterate(
          adapter,
          'day',
          'hour',
          springForward,
          end,
          undefined,
          HOUR_WINDOW,
        );

        expect(hourCells.length).to.equal(12);
        expect(dayCells.map((cell) => cell.spanInTicks)).to.deep.equal([6, 6]);
      });

      it('should emit the full hour row when the window starts on the skipped hour', () => {
        const end = adapter.endOfDay(springForward);

        const hourCells = iterate(
          adapter,
          'hour',
          'hour',
          springForward,
          end,
          undefined,
          GAP_HOUR_WINDOW,
        );
        const dayCells = iterate(
          adapter,
          'day',
          'hour',
          springForward,
          end,
          undefined,
          GAP_HOUR_WINDOW,
        );

        expect(hourCells.length).to.equal(18);
        expect(hourCells[0].wallClockHour).to.equal(2);
        expect(dayCells.map((cell) => cell.spanInTicks)).to.deep.equal([18]);
      });
    });
  });

  describe('boundary clamping', () => {
    it('should shorten the first cell when the visible range starts mid-unit', () => {
      // monthAndYear shape: visibleDate 2025-07-15 → startOfMonth gives 2025-07-01.
      // The first year cell is aligned to 2025-01-01 but clamped to 2025-07-01, so its
      // span must equal the number of days from Jul 1 through Dec 31 2025 = 184.
      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2028-06-30T23:59:59.999Z', 'default');

      const cells = iterate(adapter, 'year', 'day', start, end);

      expect(cells.length).to.equal(4);
      expect(adapter.getYear(cells[0].date)).to.equal(2025);
      expect(cells[0].spanInTicks).to.equal(
        adapter.differenceInDays(adapter.date('2026-01-01T00:00:00Z', 'default'), start),
      );
      // Middle year is a full year (365 or 366 days).
      expect([365, 366]).to.include(cells[1].spanInTicks);
      // Last partial year ends in June → 182 days (2028 is a leap year: 31+29+31+30+31+30).
      expect(cells[3].spanInTicks).to.equal(182);
    });

    it('should shorten the last cell when the visible range ends mid-unit', () => {
      // One full month + the first 10 days of the next month.
      const start = adapter.date('2025-01-01T00:00:00Z', 'default');
      const end = adapter.date('2025-02-10T23:59:59.999Z', 'default');

      const cells = iterate(adapter, 'month', 'day', start, end);

      expect(cells.length).to.equal(2);
      expect(cells[0].spanInTicks).to.equal(31); // January full
      expect(cells[1].spanInTicks).to.equal(10); // Feb 1–10
    });

    it('should expose the aligned `date` plus clamped `start` and `end`', () => {
      const start = adapter.date('2025-07-15T00:00:00Z', 'default');
      const end = adapter.date('2025-08-15T23:59:59.999Z', 'default');

      const cells = iterate(adapter, 'month', 'day', start, end);

      // First cell aligns to July 1st but its clamped start is July 15th.
      expect(adapter.getDate(cells[0].date)).to.equal(1);
      expect(cells[0].start).toEqualDateTime(start);
    });

    it('should emit one partial cell per month when the range crosses a year boundary', () => {
      const start = adapter.date('2025-12-28T00:00:00Z', 'default');
      const end = adapter.date('2026-01-05T23:59:59.999Z', 'default');

      const cells = iterate(adapter, 'month', 'day', start, end);

      expect(cells.length).to.equal(2);
      expect(adapter.getYear(cells[0].date)).to.equal(2025);
      expect(adapter.getMonth(cells[0].date)).to.equal(11); // December (0-indexed)
      expect(cells[0].spanInTicks).to.equal(4); // Dec 28-31
      expect(adapter.getYear(cells[1].date)).to.equal(2026);
      expect(adapter.getMonth(cells[1].date)).to.equal(0); // January
      expect(cells[1].spanInTicks).to.equal(5); // Jan 1-5
    });

    it('should produce exactly one cell when rangeStart equals rangeEnd', () => {
      const date = adapter.date('2025-07-03T00:00:00Z', 'default');

      const cells = iterate(adapter, 'day', 'day', date, date);

      expect(cells.length).to.equal(1);
      expect(cells[0].spanInTicks).to.equal(1);
    });
  });

  describe('DST resilience', () => {
    it('should emit 24 hour ticks for every day even when real hours differ due to DST', () => {
      // Europe spring-forward week (Mar 24-30 2025) contains a 23-hour day.
      // The generic grid still renders 24 cells per day because `endOfDay` + 1 hour
      // spans the full calendar day regardless of DST.
      const start = adapter.date('2025-03-24T00:00:00Z', 'default');
      const end = adapter.date('2025-03-30T23:59:59.999Z', 'default');

      const hourCells = iterate(adapter, 'hour', 'hour', start, end);

      expect(hourCells.length).to.equal(7 * 24);
    });

    it('should produce integer day spans for monthly cells across a DST transition', () => {
      // March 2025 in America/New_York contains the spring-forward transition
      // (Mar 9, 02:00 → 03:00), so the 31-day range only spans 742 real hours
      // (one hour lost). `differenceInDays` must still return 31 because
      // date-fns counts calendar days, not hours/24.
      const start = adapter.date('2025-03-01T00:00:00', 'America/New_York');
      const end = adapter.date('2025-03-31T23:59:59.999', 'America/New_York');

      // Sanity check: prove the adapter is actually applying the timezone (a
      // tz-naive adapter would return 743 here). If this fails the rest of the
      // assertions are meaningless.
      expect(adapter.differenceInHours(end, start)).to.equal(742);

      const cells = iterate(adapter, 'month', 'day', start, end);

      expect(cells.length).to.equal(1);
      expect(cells[0].spanInTicks).to.equal(31);
      expect(Number.isInteger(cells[0].spanInTicks)).to.equal(true);
    });
  });

  describe('errors', () => {
    it('should throw for an unsupported unit', () => {
      const start = adapter.date('2025-01-01T00:00:00Z', 'default');
      const end = adapter.date('2025-01-02T00:00:00Z', 'default');

      expect(() => iterate(adapter, 'fortnight' as any, 'day', start, end)).to.throw(
        /Unsupported header unit/,
      );
    });

    it('should throw when rangeEnd is before rangeStart', () => {
      const start = adapter.date('2025-07-31T00:00:00Z', 'default');
      const end = adapter.date('2025-07-01T00:00:00Z', 'default');

      expect(() => iterate(adapter, 'day', 'day', start, end)).to.throw(
        /rangeEnd is before rangeStart/,
      );
    });

    it('should throw when the cell count would exceed the 10k safety cap', () => {
      // Hour ticks across 2 years = 17,520 cells, well over the 10k cap.
      const start = adapter.date('2024-01-01T00:00:00Z', 'default');
      const end = adapter.date('2025-12-31T23:59:59.999Z', 'default');

      expect(() => iterate(adapter, 'hour', 'hour', start, end)).to.throw(
        /produced more than 10,000 cells/,
      );
    });
  });

  describe('weekStartsOn', () => {
    it('should start the first week cell on Monday when weekStartsOn is 1', () => {
      // Range: 2025-01-08 (Wednesday) to 2025-01-22 (Wednesday).
      // With weekStartsOn=1 the first week cell must start on Mon 2025-01-06.
      const start = adapter.date('2025-01-08T00:00:00Z', 'default');
      const end = adapter.date('2025-01-22T23:59:59.999Z', 'default');

      const cells = iterate(adapter, 'week', 'day', start, end, 1);

      // The aligned `date` on the first cell should be Jan 6 (Monday).
      expect(adapter.getDate(cells[0].date)).to.equal(6);
      expect(adapter.getMonth(cells[0].date)).to.equal(0); // January
    });

    it('should start the first week cell on Sunday when weekStartsOn is 0', () => {
      // Range: same Wed-to-Wed. With weekStartsOn=0 first cell aligns to Sun 2025-01-05.
      const start = adapter.date('2025-01-08T00:00:00Z', 'default');
      const end = adapter.date('2025-01-22T23:59:59.999Z', 'default');

      const cells = iterate(adapter, 'week', 'day', start, end, 0);

      // The aligned `date` on the first cell should be Jan 5 (Sunday).
      expect(adapter.getDate(cells[0].date)).to.equal(5);
      expect(adapter.getMonth(cells[0].date)).to.equal(0); // January
    });

    it('should produce the same result as default when weekStartsOn is undefined', () => {
      const start = adapter.date('2025-01-08T00:00:00Z', 'default');
      const end = adapter.date('2025-01-22T23:59:59.999Z', 'default');

      const withUndefined = iterate(adapter, 'week', 'day', start, end, undefined);
      const withoutArg = iterate(adapter, 'week', 'day', start, end);

      expect(withUndefined.length).to.equal(withoutArg.length);
      withUndefined.forEach((cell, i) => {
        expect(adapter.isSameDay(cell.date, withoutArg[i].date)).to.equal(true);
      });
    });
  });
});
