import { adapter } from 'test/utils/scheduler';
import { isWeekend } from './useAdapter';

describe('date-utils', () => {
  describe('isWeekend', () => {
    it('returns false for weekday (e.g. Wednesday)', () => {
      const wed = adapter.date('2025-01-08T12:00:00Z', 'default');
      expect(isWeekend(adapter, wed)).to.equal(false);
    });

    it('returns true for Saturday or Sunday', () => {
      const sat = adapter.date('2025-01-11T12:00:00Z', 'default');
      expect(isWeekend(adapter, sat)).to.equal(true);

      const sun = adapter.date('2025-01-12T12:00:00Z', 'default');
      expect(isWeekend(adapter, sun)).to.equal(true);
    });
  });
});
