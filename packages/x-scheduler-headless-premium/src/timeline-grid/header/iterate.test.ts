import { adapter } from 'test/utils/scheduler';
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
  });

  describe('errors', () => {
    it('should throw for an unsupported unit', () => {
      const start = adapter.date('2025-01-01T00:00:00Z', 'default');
      const end = adapter.date('2025-01-02T00:00:00Z', 'default');

      expect(() => iterate(adapter, 'fortnight' as any, 'day', start, end)).to.throw(
        /Unsupported header unit/,
      );
    });
  });
});
