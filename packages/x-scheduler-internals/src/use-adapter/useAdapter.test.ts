import { format } from 'date-fns/format';
import { cs } from 'date-fns/locale/cs';
import { pl } from 'date-fns/locale/pl';
import { adapter, adapterCs, adapterFr, adapterPl } from 'test/utils/scheduler';
import { isWeekend } from './useAdapter';

describe('useAdapter', () => {
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
      expect(adapterFr.format(date, 'monthFullLetterStandalone')).to.equal('janvier');
    });

    it.each([
      { name: 'Polish', locale: pl, adapterInstance: adapterPl },
      { name: 'Czech', locale: cs, adapterInstance: adapterCs },
    ])(
      'maps month format tokens to date-fns MMMM and LLLL for $name',
      ({ locale, adapterInstance }) => {
        const date = adapterInstance.date('2026-06-01T12:00:00Z', 'default');
        const jsDate = adapterInstance.toJsDate(date);

        expect(adapterInstance.format(date, 'monthFullLetter')).to.equal(
          format(jsDate, 'MMMM', { locale }),
        );
        expect(adapterInstance.format(date, 'monthFullLetterStandalone')).to.equal(
          format(jsDate, 'LLLL', { locale }),
        );
        expect(adapterInstance.format(date, 'monthFullLetterStandalone')).not.to.equal(
          adapterInstance.format(date, 'monthFullLetter'),
        );
      },
    );

    it('uses MMMM for day-with-month patterns and LLLL for month-with-year patterns', () => {
      const june = adapterPl.date('2026-06-01T12:00:00Z', 'default');
      const june13 = adapterPl.date('2026-06-13T12:00:00Z', 'default');
      const f = adapterPl.formats;

      expect(
        adapterPl.formatByString(june, `${f.monthFullLetterStandalone} ${f.yearPadded}`),
      ).to.equal(adapterPl.formatByString(june, `LLLL ${f.yearPadded}`));
      expect(adapterPl.formatByString(june13, `${f.dayOfMonth} ${f.monthFullLetter}`)).to.equal(
        adapterPl.formatByString(june13, `${f.dayOfMonth} MMMM`),
      );
    });
  });
});
