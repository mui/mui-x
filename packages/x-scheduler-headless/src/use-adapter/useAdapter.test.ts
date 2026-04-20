import { adapter, adapterFr } from 'test/utils/scheduler';
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

  describe('dateLocale', () => {
    it('formats weekday in English by default', () => {
      const monday = adapter.date('2025-01-06T12:00:00Z', 'default');
      expect(adapter.format(monday, 'weekday')).to.equal('Monday');
    });

    it('formats dates in French when using a French locale adapter', () => {
      const date = adapterFr.date('2025-01-06T12:00:00Z', 'default');
      expect(adapterFr.format(date, 'weekday')).to.equal('lundi');
      expect(adapterFr.format(date, 'monthFullLetter')).to.equal('janvier');
    });
  });
});
