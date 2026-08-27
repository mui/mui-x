import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { AdapterFormats, PickerValidDate } from '@mui/x-date-pickers/models';
import {
  expectFieldValue,
  createPickerRenderer,
  describeGregorianAdapter,
  TEST_DATE_ISO_STRING,
  buildFieldInteractions,
} from 'test/utils/pickers';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';
// We import the plugins here just to have the typing
import 'dayjs/plugin/utc';
import 'dayjs/plugin/timezone';
import { describe, it, expect, vi } from 'vitest';

describe('<AdapterDayjs />', () => {
  const commonParams = {
    formatDateTime: 'YYYY-MM-DD HH:mm:ss',
    setDefaultTimezone: dayjs.tz.setDefault,
    getLocaleFromDate: (value: PickerValidDate) => (value as Dayjs).locale(),
    frenchLocale: 'fr',
  };

  describeGregorianAdapter(AdapterDayjs, commonParams);

  // Makes sure that all the tests that do not use timezones works fine when dayjs do not support UTC / timezone.
  describeGregorianAdapter(AdapterDayjs, {
    ...commonParams,
    prepareAdapter: (adapter) => {
      // @ts-ignore
      adapter.hasUTCPlugin = () => false;
      // @ts-ignore
      adapter.hasTimezonePlugin = () => false;
      // Makes sure that we don't run timezone related tests, that would not work.
      adapter.isTimezoneCompatible = false;
    },
  });

  describe('Adapter timezone', () => {
    it('setTimezone: should throw warning if no plugin is available', () => {
      const modifiedAdapter = new AdapterDayjs();
      // @ts-ignore
      modifiedAdapter.hasTimezonePlugin = () => false;

      const date = modifiedAdapter.date(TEST_DATE_ISO_STRING) as Dayjs;
      expect(() => modifiedAdapter.setTimezone(date, 'Europe/London')).to.throw();
    });

    it('should keep system-timezone dates compatible with plain `dayjs()` dates when `dayjs.tz.guess()` is non-UTC', () => {
      // Regression: before the fix, `createSystemDate` called
      // `dayjs.tz(value, dayjs.tz.guess())` when the guessed zone was not UTC,
      // which set `$x.$timezone` on the result. That made `getTimezone()` return
      // the guessed zone name (e.g. `America/New_York`) instead of `'system'`, so
      // comparisons against plain `dayjs()` dates (for which `getTimezone()`
      // returns `'system'`) went through an unnecessary `setTimezone` conversion
      // that could shift the day across midnight. CI runs in UTC, so the non-UTC
      // branch is only reachable by stubbing `dayjs.tz.guess()`. The Sinon
      // default sandbox is restored by the global `afterEach` in
      // `test/setupVitest.ts`, so no manual cleanup is needed.
      vi.spyOn(dayjs.tz, 'guess').mockReturnValue('America/New_York');

      const adapter = new AdapterDayjs();
      const resolvedDate = adapter.date(TEST_DATE_ISO_STRING, 'system') as Dayjs;

      expect(adapter.getTimezone(resolvedDate)).to.equal('system');
      expect(adapter.isSameDay(resolvedDate, dayjs(TEST_DATE_ISO_STRING))).to.equal(true);
    });

    // `Asia/Kolkata` is used because the affected zones depend on the system timezone, and the tests
    // run with `TZ=UTC`. See https://github.com/mui/mui-x/issues/23163
    describe('Dates predating the timezone standardization', () => {
      const adapter = new AdapterDayjs();
      // The wall clock of this date in `Asia/Kolkata` is `2026-08-06 01:41`.
      const getDate = () => adapter.date('2026-08-05T20:11:00Z', 'Asia/Kolkata') as Dayjs;

      it('setYear: should only change the year', () => {
        expect(
          adapter.formatByString(adapter.setYear(getDate(), 202), 'YYYY-MM-DD HH:mm'),
        ).to.equal('0202-08-06 01:41');
      });

      it('setMonth: should only change the month', () => {
        expect(
          adapter.formatByString(
            adapter.setMonth(adapter.setYear(getDate(), 202), 2),
            'YYYY-MM-DD HH:mm',
          ),
        ).to.equal('0202-03-06 01:41');
      });

      it('addYears: should keep the day of the month', () => {
        expect(
          adapter.formatByString(
            adapter.addYears(adapter.setYear(getDate(), 202), 1),
            'YYYY-MM-DD HH:mm',
          ),
        ).to.equal('0203-08-06 01:41');
      });

      it('addMonths: should keep the day of the month', () => {
        expect(
          adapter.formatByString(
            adapter.addMonths(adapter.setYear(getDate(), 202), 1),
            'YYYY-MM-DD HH:mm',
          ),
        ).to.equal('0202-09-06 01:41');
      });

      it('setMonth: should still clamp the day of the month on a shorter month', () => {
        const endOfJanuary = adapter.setDate(
          adapter.setMonth(adapter.setYear(getDate(), 202), 0),
          31,
        );

        expect(adapter.formatByString(adapter.setMonth(endOfJanuary, 1), 'YYYY-MM-DD')).to.equal(
          '0202-02-28',
        );
      });

      it('setYear: should support years that do not round-trip through the ISO format', () => {
        const result = adapter.setYear(getDate(), 10000);

        expect(adapter.isValid(result)).to.equal(true);
        expect(adapter.formatByString(result, 'MM-DD HH:mm')).to.equal('08-06 01:41');
      });

      it('setYear: should keep an invalid date invalid', () => {
        expect(adapter.isValid(adapter.setYear(adapter.getInvalidDate() as Dayjs, 2020))).to.equal(
          false,
        );
      });
    });
  });

  describe('Adapter localization', () => {
    describe('English', () => {
      const adapter = new AdapterDayjs({ locale: 'en' });
      const date = adapter.date(TEST_DATE_ISO_STRING) as Dayjs;

      it('getWeekArray: should start on Sunday', () => {
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('Su');
      });

      it('is12HourCycleInCurrentLocale: should have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });
    });

    describe('Russian', () => {
      const adapter = new AdapterDayjs({ locale: 'ru' });

      it('getWeekArray: should start on Monday', () => {
        const date = adapter.date(TEST_DATE_ISO_STRING) as Dayjs;
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('пн');
      });

      it('is12HourCycleInCurrentLocale: should not have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru');
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterDayjs({ locale: 'en' });
      const adapterRu = new AdapterDayjs({ locale: 'ru' });

      const expectDate = (
        format: keyof AdapterFormats,
        expectedWithEn: string,
        expectedWithRu: string,
      ) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z') as Dayjs;

        expect(adapter.format(date, format)).to.equal(expectedWithEn);
        expect(adapterRu.format(date, format)).to.equal(expectedWithRu);
      };

      expectDate('fullDate', 'Feb 1, 2020', '1 февр. 2020 г.');
      expectDate('keyboardDate', '02/01/2020', '01.02.2020');
      expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 вечера');
      expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
    });

    it('should warn when trying to use a non-loaded locale', () => {
      const adapter = new AdapterDayjs({ locale: 'pl' });
      expect(() => adapter.is12HourCycleInCurrentLocale()).toWarnDev(
        'Your locale has not been found.',
      );
    });
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';
    const localizedTexts = {
      undefined: {
        placeholder: 'MM/DD/YYYY hh:mm aa',
        value: '05/15/2018 09:35 AM',
      },
      fr: {
        placeholder: 'DD/MM/YYYY hh:mm',
        value: '15/05/2018 09:35',
      },
      de: {
        placeholder: 'DD.MM.YYYY hh:mm',
        value: '15.05.2018 09:35',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeName = localeKey === 'undefined' ? 'default' : `"${localeKey}"`;
      const localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };

      describe(`test with the ${localeName} locale`, () => {
        const { render, adapter } = createPickerRenderer({
          adapterName: 'dayjs',
          locale: localeObject,
        });

        const { renderWithProps } = buildFieldInteractions({
          render,
          Component: DateTimeField,
        });

        it('should have correct placeholder', () => {
          const view = renderWithProps({});

          expectFieldValue(view.getSectionsContainer(), localizedTexts[localeKey].placeholder);
        });

        it('should have well formatted value', () => {
          const view = renderWithProps({
            value: adapter.date(testDate),
          });

          expectFieldValue(view.getSectionsContainer(), localizedTexts[localeKey].value);
        });
      });
    });
  });
});
