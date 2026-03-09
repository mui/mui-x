import { adapter, adapterFr } from 'test/utils/scheduler';
import { isWeekend, createTestAdapterFr } from './useAdapter';

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

    it('formats weekday in French when using a French locale adapter', () => {
      const monday = adapterFr.date('2025-01-06T12:00:00Z', 'default');
      expect(adapterFr.format(monday, 'weekday')).to.equal('lundi');
    });

    it('formats month in French when using a French locale adapter', () => {
      const january = adapterFr.date('2025-01-06T12:00:00Z', 'default');
      expect(adapterFr.format(january, 'monthFullLetter')).to.equal('janvier');
    });

    it('creates separate adapter instances for different locales', () => {
      const frAdapter = createTestAdapterFr();
      const monday = adapter.date('2025-01-06T12:00:00Z', 'default');
      const mondayFr = frAdapter.date('2025-01-06T12:00:00Z', 'default');
      expect(adapter.format(monday, 'weekday')).to.equal('Monday');
      expect(frAdapter.format(mondayFr, 'weekday')).to.equal('lundi');
    });
  });
});
