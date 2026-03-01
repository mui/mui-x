import { AdapterTZDateFns } from '@mui/x-date-pickers/AdapterTZDateFns';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { describeGregorianAdapter, TEST_DATE_ISO_STRING } from 'test/utils/pickers';
import { enUS, fr, ru } from 'date-fns/locale';

describe('<AdapterTZDateFns />', () => {
  describeGregorianAdapter(AdapterTZDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: AdapterTZDateFns.setDefaultTimezone,
    frenchLocale: fr,
  });

  describe('Adapter localization', () => {
    describe('Default locale', () => {
      const adapter = new AdapterTZDateFns();

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('en-US');
      });
    });

    describe('English', () => {
      const adapter = new AdapterTZDateFns({ locale: enUS });
      const date = adapter.date(TEST_DATE_ISO_STRING) as Date;

      it('getWeekArray: should start on Sunday', () => {
        const result = adapter.getWeekArray(date);
        expect(adapter.formatByString(result[0][0], 'EEEEEE')).to.equal('Su');
      });

      it('is12HourCycleInCurrentLocale: should have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });
    });

    describe('Russian', () => {
      const adapter = new AdapterTZDateFns({ locale: ru });

      it('getWeekArray: should start on Monday', () => {
        const date = adapter.date(TEST_DATE_ISO_STRING) as Date;
        const result = adapter.getWeekArray(date);
        expect(adapter.formatByString(result[0][0], 'EEEEEE')).to.equal('пн');
      });

      it('is12HourCycleInCurrentLocale: should not have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru');
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterTZDateFns({ locale: enUS });
      const adapterRu = new AdapterTZDateFns({ locale: ru });

      const expectDate = (
        format: keyof AdapterFormats,
        expectedWithEn: string,
        expectedWithRu: string,
      ) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z') as Date;

        expect(adapter.format(date, format)).to.equal(expectedWithEn);
        expect(adapterRu.format(date, format)).to.equal(expectedWithRu);
      };

      expectDate('fullDate', 'Feb 1, 2020', '1 фев. 2020 г.');
      expectDate('keyboardDate', '02/01/2020', '01.02.2020');
      expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 ПП');
      expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
    });
  });
});
