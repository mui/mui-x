import { adapter } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe, it, expect } from 'vitest';
import { getMonthlyReference, getWeeklyDays } from './presets';

describe('recurring-events/presets', () => {
  describe('getWeeklyDays', () => {
    it('returns 7 contiguous days starting from the start of the week', () => {
      const visibleDate = adapter.date('2025-07-09T10:00:00Z', 'default'); // Wednesday
      const days = getWeeklyDays(adapter, visibleDate);

      expect(days).to.have.length(7);
      const codes = days.map((d) => d.code);
      expect(codes).to.deep.equal(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']);
      expect(days.map((d) => d.date.toString())).to.deep.equal([
        '2025-07-06',
        '2025-07-07',
        '2025-07-08',
        '2025-07-09',
        '2025-07-10',
        '2025-07-11',
        '2025-07-12',
      ]);
    });

    it('returns days starting on Monday when weekStartsOn=1', () => {
      const visibleDate = adapter.date('2025-07-09T10:00:00Z', 'default'); // Wednesday
      const days = getWeeklyDays(adapter, visibleDate, 1);

      expect(days).to.have.length(7);
      // Week starting Monday: MO TU WE TH FR SA SU
      expect(days[0].code).to.equal('MO');
      expect(days[6].code).to.equal('SU');
    });

    it('returns days starting on Sunday when weekStartsOn=0', () => {
      const visibleDate = adapter.date('2025-07-09T10:00:00Z', 'default'); // Wednesday
      const days = getWeeklyDays(adapter, visibleDate, 0);

      expect(days).to.have.length(7);
      expect(days[0].code).to.equal('SU');
      expect(days[6].code).to.equal('SA');
    });

    it('lists the days of the last week of 9999, past the last supported day', () => {
      const visibleDate = adapter.date('9999-12-30T12:00:00Z', 'default');
      const days = getWeeklyDays(adapter, visibleDate, 1);

      expect(days.map((d) => d.date.dayNumber - days[0].date.dayNumber)).to.deep.equal([
        0, 1, 2, 3, 4, 5, 6,
      ]);
      expect(days[0].date.toString()).to.equal('9999-12-27');
    });

    it('lists every day of the week when the timezone skips one', () => {
      // December 30th, 2011 (Friday) doesn't exist in Pacific/Apia.
      const visibleDate = adapter.date('2011-12-28T12:00:00', 'Pacific/Apia');
      const days = getWeeklyDays(adapter, visibleDate, 1);

      expect(days.map((d) => d.code)).to.deep.equal(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']);
      expect(days.map((d) => d.date.toString())).to.deep.equal([
        '2011-12-26',
        '2011-12-27',
        '2011-12-28',
        '2011-12-29',
        '2011-12-30',
        '2011-12-31',
        '2012-01-01',
      ]);
    });
  });

  describe('getMonthlyReference', () => {
    it('returns dayOfMonth, weekday code, ordinal and the underlying date', () => {
      const occurrenceStart = processDate(adapter.date('2025-07-15T10:00:00Z', 'default'), adapter); // 3rd Tuesday of July 2025
      const ref = getMonthlyReference(adapter, occurrenceStart);

      expect(ref.dayOfMonth).to.equal(15);
      expect(ref.code).to.equal('TU');
      expect(ref.ord).to.equal(3);
      expect(adapter.getTime(ref.date)).to.equal(adapter.getTime(occurrenceStart.value));
    });
  });
});
