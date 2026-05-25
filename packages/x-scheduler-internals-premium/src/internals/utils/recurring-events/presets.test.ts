import { adapter } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { getMonthlyReference, getWeeklyDays } from './presets';

describe('recurring-events/presets', () => {
  describe('getWeeklyDays', () => {
    it('returns 7 contiguous days starting from the start of the week', () => {
      const visibleDate = adapter.date('2025-07-09T10:00:00Z', 'default'); // Wednesday
      const days = getWeeklyDays(adapter, visibleDate);

      expect(days).to.have.length(7);
      const codes = days.map((d) => d.code);
      expect(codes).to.deep.equal(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']);

      const expectedStart = adapter.startOfWeek(visibleDate);
      for (let i = 0; i < 7; i += 1) {
        expect(adapter.getTime(days[i].date)).to.equal(
          adapter.getTime(adapter.addDays(expectedStart, i)),
        );
      }
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
