import {
  adapter,
  adapterArSA,
  adapterFaIR,
  adapterFr,
  adapterHe,
  adapterUnknownLocale,
} from 'test/utils/scheduler';

describe('date-utils', () => {
  describe('isWeekend', () => {
    describe('en-US locale (Saturday & Sunday are weekends)', () => {
      it('returns false for weekday (e.g. Wednesday)', () => {
        const wed = adapter.date('2025-01-08T12:00:00Z', 'default');
        expect(adapter.isWeekend(wed)).to.equal(false);
      });

      it('returns true for Saturday', () => {
        const sat = adapter.date('2025-01-11T12:00:00Z', 'default');
        expect(adapter.isWeekend(sat)).to.equal(true);
      });

      it('returns true for Sunday', () => {
        const sun = adapter.date('2025-01-12T12:00:00Z', 'default');
        expect(adapter.isWeekend(sun)).to.equal(true);
      });

      it('returns false for Friday', () => {
        const fri = adapter.date('2025-01-10T12:00:00Z', 'default');
        expect(adapter.isWeekend(fri)).to.equal(false);
      });
    });

    describe('ar-SA locale (Friday & Saturday are weekends)', () => {
      it('returns true for Friday', () => {
        const fri = adapterArSA.date('2025-01-10T12:00:00Z', 'default');
        expect(adapterArSA.isWeekend(fri)).to.equal(true);
      });

      it('returns true for Saturday', () => {
        const sat = adapterArSA.date('2025-01-11T12:00:00Z', 'default');
        expect(adapterArSA.isWeekend(sat)).to.equal(true);
      });

      it('returns false for Sunday', () => {
        const sun = adapterArSA.date('2025-01-12T12:00:00Z', 'default');
        expect(adapterArSA.isWeekend(sun)).to.equal(false);
      });

      it('returns false for weekday (e.g. Wednesday)', () => {
        const wed = adapterArSA.date('2025-01-08T12:00:00Z', 'default');
        expect(adapterArSA.isWeekend(wed)).to.equal(false);
      });
    });

    describe('fa-IR locale (Friday only is weekend)', () => {
      it('returns true for Friday', () => {
        const fri = adapterFaIR.date('2025-01-10T12:00:00Z', 'default');
        expect(adapterFaIR.isWeekend(fri)).to.equal(true);
      });

      it('returns false for Saturday', () => {
        const sat = adapterFaIR.date('2025-01-11T12:00:00Z', 'default');
        expect(adapterFaIR.isWeekend(sat)).to.equal(false);
      });

      it('returns false for Sunday', () => {
        const sun = adapterFaIR.date('2025-01-12T12:00:00Z', 'default');
        expect(adapterFaIR.isWeekend(sun)).to.equal(false);
      });
    });

    describe('he locale / Israel (Friday & Saturday are weekends)', () => {
      it('returns true for Friday', () => {
        const fri = adapterHe.date('2025-01-10T12:00:00Z', 'default');
        expect(adapterHe.isWeekend(fri)).to.equal(true);
      });

      it('returns true for Saturday', () => {
        const sat = adapterHe.date('2025-01-11T12:00:00Z', 'default');
        expect(adapterHe.isWeekend(sat)).to.equal(true);
      });

      it('returns false for Sunday', () => {
        const sun = adapterHe.date('2025-01-12T12:00:00Z', 'default');
        expect(adapterHe.isWeekend(sun)).to.equal(false);
      });
    });

    describe('unknown locale / missing weekInfo (fallback: Saturday & Sunday)', () => {
      it('returns true for Saturday', () => {
        const sat = adapterUnknownLocale.date('2025-01-11T12:00:00Z', 'default');
        expect(adapterUnknownLocale.isWeekend(sat)).to.equal(true);
      });

      it('returns true for Sunday', () => {
        const sun = adapterUnknownLocale.date('2025-01-12T12:00:00Z', 'default');
        expect(adapterUnknownLocale.isWeekend(sun)).to.equal(true);
      });

      it('returns false for weekday (e.g. Wednesday)', () => {
        const wed = adapterUnknownLocale.date('2025-01-08T12:00:00Z', 'default');
        expect(adapterUnknownLocale.isWeekend(wed)).to.equal(false);
      });
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
