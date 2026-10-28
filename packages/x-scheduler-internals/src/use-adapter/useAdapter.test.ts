import { adapter, adapterFr } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';

describe('date-utils', () => {
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
