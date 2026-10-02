import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import preParsePostFormat from 'dayjs/plugin/preParsePostFormat';
import { screen } from '@mui/internal-test-utils';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
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
import 'dayjs/locale/ar';
// We import the plugins here just to have the typing
import 'dayjs/plugin/utc';
import 'dayjs/plugin/timezone';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, onTestFinished, beforeEach, describe, it, expect } from 'vitest';

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
    const setSystemTimezone = (timezone: string) => {
      const previousTimezone = process.env.TZ;
      process.env.TZ = timezone;
      onTestFinished(() => {
        if (previousTimezone === undefined) {
          delete process.env.TZ;
        } else {
          process.env.TZ = previousTimezone;
        }
      });
    };

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
      // branch is only reachable by stubbing `dayjs.tz.guess()`.
      const guess = vi.spyOn(dayjs.tz, 'guess').mockReturnValue('America/New_York');
      onTestFinished(() => guess.mockRestore());

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

      // See https://github.com/mui/mui-x/issues/23301
      it('getDaysInMonth: should return the number of days in the month', () => {
        // The wall clock of this date in `Asia/Kolkata` is `1883-08-15 12:30:00`.
        const value = adapter.setYear(
          adapter.date('2026-08-15T12:30:00', 'Asia/Kolkata') as Dayjs,
          1883,
        );

        expect(adapter.getDaysInMonth(value)).to.equal(31);
      });

      // `dayjs` >= 1.11.22 gets `endOf('month')` wrong before 1970 in every timezone.
      // See https://github.com/iamkun/dayjs/pull/3227
      it('getDaysInMonth: should return the number of days in the month before 1970', () => {
        const value = adapter.setYear(
          adapter.date('2026-08-15T12:30:00', 'America/New_York') as Dayjs,
          1960,
        );

        expect(adapter.getDaysInMonth(value)).to.equal(31);
      });

      it('getDaysInMonth: should support `UTC` values bound to a timezone with `dayjs.tz`', () => {
        expect(adapter.getDaysInMonth(dayjs.tz('1890-03-10 12:00', 'UTC'))).to.equal(31);
      });

      describe('Localized digits', () => {
        const { render, adapter: adapterAr } = createPickerRenderer({
          adapterName: 'dayjs',
          locale: { code: 'ar' },
        });
        const { renderWithProps } = buildFieldInteractions({ render, Component: DateField });
        const getValue = () => dayjs.tz('1960-08-15 12:30', 'America/New_York').locale('ar');

        beforeEach(() => {
          const originalLocale = dayjs.locale();
          dayjs.locale('en');
          onTestFinished(() => {
            dayjs.locale(originalLocale);
          });

          // Restore the prototype after each test because Day.js plugins are global.
          dayjs.extend((option, dayjsClass, dayjsFactory) => {
            const originalPrototype = Object.getOwnPropertyDescriptors(dayjsClass.prototype);
            onTestFinished(() => {
              Object.defineProperties(dayjsClass.prototype, originalPrototype);
            });
            preParsePostFormat(option, dayjsClass, dayjsFactory);
          });
        });

        it('getDaysInMonth: should support localized digits without changing the value locale', () => {
          const value = getValue();

          expect(adapterAr.getDaysInMonth(value)).to.equal(31);
          expect(value.locale()).to.equal('ar');
          expect(value.format('YYYY-MM-DD')).to.equal('١٩٦٠-٠٨-١٥');
        });

        it('should add elapsed time without parsing localized digits or changing the locale', () => {
          const value = getValue();
          const result = adapterAr.addHours(value, 1) as Dayjs;

          expect(result.valueOf() - value.valueOf()).to.equal(3_600_000);
          expect(result.locale()).to.equal('ar');
          expect(result.format('YYYY-MM-DD HH:mm')).to.equal('١٩٦٠-٠٨-١٥ ١٣:٣٠');
          expect(value.format('YYYY-MM-DD HH:mm')).to.equal('١٩٦٠-٠٨-١٥ ١٢:٣٠');
        });

        it('should increment the day of the month with localized digits', async () => {
          const view = renderWithProps({
            defaultValue: getValue(),
            format: 'MM/DD/YYYY',
            timezone: 'America/New_York',
          });

          expectFieldValue(view.getSectionsContainer(), '٠٨/١٥/١٩٦٠');
          await view.selectSection('day');

          await view.user.keyboard('{ArrowUp}');
          expectFieldValue(view.getSectionsContainer(), '٠٨/١٦/١٩٦٠');

          await view.user.keyboard('{ArrowUp}');
          expectFieldValue(view.getSectionsContainer(), '٠٨/١٧/١٩٦٠');
        });
      });
    });

    describe('Elapsed time in named timezones', () => {
      const adapter = new AdapterDayjs();
      const transitions = [
        {
          timezone: 'America/New_York',
          before: '2026-03-08T06:30:12.345Z',
          after: '2026-03-08T07:30:12.345Z',
          beforeWall: '2026-03-08 01:30:12.345 -05:00',
          afterWall: '2026-03-08 03:30:12.345 -04:00',
        },
        {
          timezone: 'America/New_York',
          before: '2026-11-01T05:30:12.345Z',
          after: '2026-11-01T06:30:12.345Z',
          beforeWall: '2026-11-01 01:30:12.345 -04:00',
          afterWall: '2026-11-01 01:30:12.345 -05:00',
        },
        {
          timezone: 'Europe/London',
          before: '2026-03-29T00:30:12.345Z',
          after: '2026-03-29T01:30:12.345Z',
          beforeWall: '2026-03-29 00:30:12.345 +00:00',
          afterWall: '2026-03-29 02:30:12.345 +01:00',
        },
        {
          timezone: 'Europe/London',
          before: '2026-10-25T00:30:12.345Z',
          after: '2026-10-25T01:30:12.345Z',
          beforeWall: '2026-10-25 01:30:12.345 +01:00',
          afterWall: '2026-10-25 01:30:12.345 +00:00',
        },
        {
          timezone: 'Australia/Lord_Howe',
          before: '2026-04-04T14:45:12.345Z',
          after: '2026-04-04T15:45:12.345Z',
          beforeWall: '2026-04-05 01:45:12.345 +11:00',
          afterWall: '2026-04-05 02:15:12.345 +10:30',
        },
        {
          timezone: 'Australia/Lord_Howe',
          before: '2026-10-03T15:00:12.345Z',
          after: '2026-10-03T16:00:12.345Z',
          beforeWall: '2026-10-04 01:30:12.345 +10:30',
          afterWall: '2026-10-04 03:00:12.345 +11:00',
        },
      ];
      const format = 'YYYY-MM-DD HH:mm:ss.SSS Z';

      it.skipIf(!isJSDOM)(
        'should keep elapsed time exact when the target wall time falls in a system DST gap',
        () => {
          setSystemTimezone('Europe/London');
          const source = dayjs.utc('2026-03-29T04:30:12.345Z').tz('America/New_York');
          const result = adapter.addMinutes(source, 30);

          expect(result.toISOString()).to.equal('2026-03-29T05:00:12.345Z');
          expect(result.utcOffset()).to.equal(-240);
          expect(adapter.getTimezone(result)).to.equal('America/New_York');
          // Day.js stores nonzero-offset wall fields in a local Date. The expected 01:00 wall time
          // does not exist in the system timezone, so correct wall fields remain a library limitation.
        },
      );

      describe.each([
        'UTC',
        'America/New_York',
        'America/Los_Angeles',
        'Europe/London',
        'Australia/Lord_Howe',
      ])('system timezone: %s', (systemTimezone) => {
        // Browsers cannot change their timezone through process.env.TZ.
        describe.skipIf(!isJSDOM && systemTimezone !== 'UTC')('DST transitions', () => {
          beforeEach(() => {
            if (isJSDOM) {
              setSystemTimezone(systemTimezone);
            }
          });

          describe.each([
            { method: 'addHours', amount: 1 },
            { method: 'addMinutes', amount: 60 },
            { method: 'addSeconds', amount: 3600 },
          ] as const)('$method', ({ method, amount }) => {
            it.each(transitions)('$timezone: $before → $after', (transition) => {
              const { timezone, before, after, beforeWall, afterWall } = transition;
              for (const direction of [1, -1]) {
                const source = dayjs
                  .utc(direction === 1 ? before : after)
                  .tz(timezone)
                  .locale('fr');
                const originalTimestamp = source.valueOf();
                const originalWall = source.format(format);
                const result = adapter[method](source, amount * direction);
                const expected = direction === 1 ? after : before;
                const expectedWall = direction === 1 ? afterWall : beforeWall;

                expect(adapter[method](result, 0).valueOf()).to.equal(result.valueOf());
                expect(result.valueOf() - originalTimestamp).to.equal(direction * 3_600_000);
                expect(result.toISOString()).to.equal(expected);
                expect(result.format(format)).to.equal(expectedWall);
                expect(result.clone().format(format)).to.equal(expectedWall);
                expect(result.clone().valueOf()).to.equal(result.valueOf());
                expect(adapter.getTimezone(result)).to.equal(timezone);
                expect(result.locale()).to.equal('fr');
                expect(source.valueOf()).to.equal(originalTimestamp);
                expect(source.format(format)).to.equal(originalWall);
                expect(source.locale()).to.equal('fr');
              }
            });
          });
        });
      });
    });

    // CI runs with `TZ=UTC`, so these tests switch to a system timezone that observes DST.
    describe.skipIf(!isJSDOM)('DST changes of the system timezone', () => {
      it.each([
        {
          transition: 'spring forward',
          date: '2026-03-08',
          startOfDay: '2026-03-08T08:00:00.000Z',
        },
        { transition: 'fall back', date: '2026-11-01', startOfDay: '2026-11-01T07:00:00.000Z' },
      ])('should keep plain values plain after $transition', ({ date, startOfDay }) => {
        setSystemTimezone('America/Los_Angeles');
        const adapter = new AdapterDayjs();
        const value = adapter.setHours(adapter.date(`${date}T12:00`, 'system') as Dayjs, 4);

        expect(adapter.getTimezone(value)).to.equal('system');
        // A copied offset would make later `dayjs` calls on the returned value wrong by 1 hour.
        expect(value.startOf('day').toISOString()).to.equal(startOfDay);
      });

      describe('DigitalClock', () => {
        const { render } = createPickerRenderer({ adapterName: 'dayjs' });

        it('should emit distinct instants for both occurrences of the repeated hour with named-zone values', async () => {
          setSystemTimezone('America/New_York');
          const onChange = vi.fn();
          const { user } = render(
            <DigitalClock
              value={dayjs.tz('2026-11-01T12:00', 'America/New_York')}
              timeStep={30}
              ampm
              onChange={onChange}
            />,
          );

          expect(screen.getAllByRole('option')).to.have.length(50);
          const repeatedOptions = screen.getAllByRole('option', { name: '01:30 AM' });
          expect(repeatedOptions).to.have.length(2);
          await user.click(repeatedOptions[0]);
          await user.click(repeatedOptions[1]);
          expect(onChange.mock.calls.map(([value]) => value.toISOString())).to.deep.equal([
            '2026-11-01T05:30:00.000Z',
            '2026-11-01T06:30:00.000Z',
          ]);
        });

        it('should emit distinct instants for both occurrences of the repeated hour with plain values', async () => {
          setSystemTimezone('America/New_York');
          const onChange = vi.fn();
          const { user } = render(
            <DigitalClock
              defaultValue={dayjs('2026-11-01T12:00')}
              timezone="system"
              timeStep={30}
              ampm
              onChange={onChange}
            />,
          );

          expect(screen.getAllByRole('option')).to.have.length(50);
          const repeatedOptions = screen.getAllByRole('option', { name: '01:30 AM' });
          expect(repeatedOptions).to.have.length(2);

          await user.click(repeatedOptions[0]);
          expect(onChange.mock.lastCall?.[0].toISOString()).to.equal('2026-11-01T05:30:00.000Z');

          await user.click(repeatedOptions[1]);
          expect(onChange.mock.lastCall?.[0].toISOString()).to.equal('2026-11-01T06:30:00.000Z');
        });
      });

      it('should update the offset of values without a named timezone', () => {
        setSystemTimezone('America/Los_Angeles');
        const adapter = new AdapterDayjs();
        // Same shape as `adapter.date(undefined, 'default')` on a system timezone with DST.
        const now = dayjs('2026-03-08T12:58').utcOffset(-420, true);
        const value = adapter.setHours(now, 1);

        expect(adapter.getHours(value)).to.equal(1);
        expect(value.toISOString()).to.equal('2026-03-08T09:58:00.000Z');
      });
    });

    it('should keep small years when setting the year of a plain value', () => {
      const adapter = new AdapterDayjs();
      const value = adapter.setYear(adapter.date('2026-01-15T12:00', 'system') as Dayjs, 1);
      const expected = new Date(2026, 0, 15, 12);
      expected.setFullYear(1);

      expect(value.valueOf()).to.equal(expected.getTime());
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
