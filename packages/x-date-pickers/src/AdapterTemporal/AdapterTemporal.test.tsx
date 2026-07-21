import { onTestFinished } from 'vitest';
// The Temporal API is not yet available in every runtime, so the tests install the polyfill globally.
import 'temporal-polyfill/global';
import { AdapterTemporal, setDefaultTimezone } from '@mui/x-date-pickers/AdapterTemporal';
import type { AdapterTemporalDate } from '@mui/x-date-pickers/AdapterTemporal';
import type { AdapterFormats } from '@mui/x-date-pickers/models';
import { describeGregorianAdapter, TEST_DATE_ISO_STRING } from 'test/utils/pickers';

describe('<AdapterTemporal />', () => {
  describeGregorianAdapter(AdapterTemporal, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone,
    frenchLocale: 'fr-FR',
  });

  describe('Temporal availability', () => {
    it('should throw when the global Temporal is not available', () => {
      const globalWithTemporal = globalThis as { Temporal?: unknown };
      const original = globalWithTemporal.Temporal;
      delete globalWithTemporal.Temporal;
      onTestFinished(() => {
        globalWithTemporal.Temporal = original;
      });

      expect(() => new AdapterTemporal()).to.throw(/`Temporal` API is not available/);
    });
  });

  describe('Adapter localization', () => {
    describe('English', () => {
      const adapter = new AdapterTemporal({ locale: 'en-US' });

      it('is12HourCycleInCurrentLocale: should have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });
    });

    describe('Russian', () => {
      const adapter = new AdapterTemporal({ locale: 'ru-RU' });

      it('getWeekArray: should start on Monday', () => {
        const date = adapter.date(TEST_DATE_ISO_STRING) as AdapterTemporalDate;
        const result = adapter.getWeekArray(date);
        expect(adapter.formatByString(result[0][0], 'EEE')).to.match(/пн/i);
      });

      it('is12HourCycleInCurrentLocale: should not have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru-RU');
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterTemporal({ locale: 'en-US' });

      const expectDate = (format: keyof AdapterFormats, expectedWithEn: string) => {
        const date = adapter.date('2020-01-01T23:44:00.000Z', 'UTC') as AdapterTemporalDate;
        expect(adapter.format(date, format)).to.equal(expectedWithEn);
      };

      expectDate('fullDate', 'Jan 1, 2020');
      expectDate('keyboardDate', '01/01/2020');
      expectDate('shortDate', 'Jan 1');
      expectDate('normalDate', '1 January');
      expectDate('normalDateWithWeekday', 'Wed, Jan 1');
      expectDate('fullTime12h', '11:44 PM');
      expectDate('fullTime24h', '23:44');
      expectDate('keyboardDateTime12h', '01/01/2020 11:44 PM');
      expectDate('keyboardDateTime24h', '01/01/2020 23:44');
    });
  });
});
