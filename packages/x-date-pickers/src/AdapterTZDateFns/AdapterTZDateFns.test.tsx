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

  describe('Timezone-specific behavior', () => {
    afterEach(() => {
      // Reset static state to prevent leaks between tests (Issue #7)
      AdapterTZDateFns.setDefaultTimezone(undefined);
    });

    describe('date() with date-only strings', () => {
      it('should preserve date components in a named timezone', () => {
        const adapter = new AdapterTZDateFns();
        const date = adapter.date('2024-06-15', 'America/New_York') as Date;

        expect(adapter.getYear(date)).to.equal(2024);
        expect(adapter.getMonth(date)).to.equal(5); // 0-indexed June
        expect(adapter.getDate(date)).to.equal(15);
        expect(adapter.getHours(date)).to.equal(0);
        expect(adapter.getTimezone(date)).to.equal('America/New_York');
      });

      it('should preserve date components in UTC', () => {
        const adapter = new AdapterTZDateFns();
        const date = adapter.date('2024-06-15', 'UTC') as Date;

        expect(adapter.getYear(date)).to.equal(2024);
        expect(adapter.getMonth(date)).to.equal(5);
        expect(adapter.getDate(date)).to.equal(15);
        expect(adapter.getHours(date)).to.equal(0);
      });
    });

    describe('toJsDate', () => {
      it('should preserve the instant when converting TZDate to plain Date', () => {
        const adapter = new AdapterTZDateFns();
        const tzDate = adapter.date(TEST_DATE_ISO_STRING, 'America/New_York') as Date;
        const jsDate = adapter.toJsDate(tzDate);

        expect(jsDate).to.be.an.instanceOf(Date);
        expect(jsDate.getTime()).to.equal(tzDate.getTime());
      });

      it('should return a plain Date, not a TZDate', () => {
        const adapter = new AdapterTZDateFns();
        const tzDate = adapter.date(TEST_DATE_ISO_STRING, 'Europe/Paris') as Date;
        const jsDate = adapter.toJsDate(tzDate);

        expect(adapter.getTimezone(jsDate)).to.equal('system');
      });
    });

    describe('setTimezone', () => {
      it('should return the same object when timezone is unchanged', () => {
        const adapter = new AdapterTZDateFns();
        const date = adapter.date(TEST_DATE_ISO_STRING, 'America/New_York') as Date;
        const result = adapter.setTimezone(date, 'America/New_York');

        expect(result).to.equal(date); // Same reference, not just same value
      });
    });

    describe('getTimezone', () => {
      it('should return "default" for null', () => {
        const adapter = new AdapterTZDateFns();
        expect(adapter.getTimezone(null)).to.equal('default');
      });

      it('should return the timezone for a TZDate', () => {
        const adapter = new AdapterTZDateFns();
        const date = adapter.date(TEST_DATE_ISO_STRING, 'Europe/Paris') as Date;
        expect(adapter.getTimezone(date)).to.equal('Europe/Paris');
      });

      it('should return "system" for a plain Date', () => {
        const adapter = new AdapterTZDateFns();
        expect(adapter.getTimezone(new Date())).to.equal('system');
      });
    });

    describe('setDefaultTimezone', () => {
      it('should be used when resolving "default" timezone', () => {
        const adapter = new AdapterTZDateFns();
        AdapterTZDateFns.setDefaultTimezone('America/Chicago');

        const date = adapter.date(TEST_DATE_ISO_STRING, 'default') as Date;
        expect(adapter.getTimezone(date)).to.equal('America/Chicago');
      });

      it('should fall back to "system" when no default is set', () => {
        const adapter = new AdapterTZDateFns();
        // defaultTimezone is undefined after afterEach reset
        const date = adapter.date(TEST_DATE_ISO_STRING, 'default') as Date;
        expect(adapter.getTimezone(date)).to.equal('system');
      });
    });
  });
});
