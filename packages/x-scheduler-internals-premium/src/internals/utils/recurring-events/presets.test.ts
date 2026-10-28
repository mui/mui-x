import { adapter } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { PlainDate } from '@mui/x-scheduler-internals/internals';
import { getMonthlyReference, getWeeklyDays } from './presets';

describe('recurring-events/presets', () => {
  describe('getWeeklyDays', () => {
    it('returns 7 contiguous days starting from the start of the week', () => {
      const visiblePlainDate = PlainDate.from('2025-07-09'); // Wednesday
      const days = getWeeklyDays(adapter, visiblePlainDate);

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
      const visiblePlainDate = PlainDate.from('2025-07-09'); // Wednesday
      const days = getWeeklyDays(adapter, visiblePlainDate, 1);

      expect(days).to.have.length(7);
      // Week starting Monday: MO TU WE TH FR SA SU
      expect(days[0].code).to.equal('MO');
      expect(days[6].code).to.equal('SU');
    });

    it('returns days starting on Sunday when weekStartsOn=0', () => {
      const visiblePlainDate = PlainDate.from('2025-07-09'); // Wednesday
      const days = getWeeklyDays(adapter, visiblePlainDate, 0);

      expect(days).to.have.length(7);
      expect(days[0].code).to.equal('SU');
      expect(days[6].code).to.equal('SA');
    });

    it('returns days starting on Friday when weekStartsOn=5', () => {
      const days = getWeeklyDays(adapter, PlainDate.from('2011-12-31'), 5); // Saturday

      expect(days.map((d) => d.code)).to.deep.equal(['FR', 'SA', 'SU', 'MO', 'TU', 'WE', 'TH']);
      expect(days[0].date).toEqualPlainDate('2011-12-30');
    });
  });

  describe('getMonthlyReference', () => {
    it('returns the day of the month, the weekday code and the ordinal', () => {
      const ref = getMonthlyReference(PlainDate.from('2025-07-15')); // 3rd Tuesday of July 2025

      expect(ref.dayOfMonth).to.equal(15);
      expect(ref.code).to.equal('TU');
      expect(ref.ord).to.equal(3);
    });
  });
});
