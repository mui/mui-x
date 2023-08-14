import { expect } from 'chai';
import { MuiPickersAdapter, PickersTimezone } from '@mui/x-date-pickers/models';
import { getDateOffset } from 'test/utils/pickers';
import { DescribeGregorianAdapterTestSuite } from './describeGregorianAdapter.types';
import { TEST_DATE_ISO_STRING, TEST_DATE_LOCALE_STRING } from './describeGregorianAdapter.utils';

/**
 * To check if the date has the right offset even after changing it's date parts,
 * we convert it to a different timezone that always has the same offset,
 * then we check that both dates have the same hour value.
 */
// We change to
const expectSameTimeInMonacoTZ = <TDate>(adapter: MuiPickersAdapter<TDate>, value: TDate) => {
  const valueInMonacoTz = adapter.setTimezone(value, 'Europe/Monaco');
  expect(adapter.getHours(value)).to.equal(adapter.getHours(valueInMonacoTz));
};

export const testCalculations: DescribeGregorianAdapterTestSuite = ({
  adapter,
  adapterTZ,
  adapterFr,
  setDefaultTimezone,
  getLocaleFromDate,
}) => {
  const testDateIso = adapter.date(TEST_DATE_ISO_STRING)!;
  const testDateLastNonDSTDay = adapterTZ.isTimezoneCompatible
    ? adapterTZ.dateWithTimezone('2022-03-27', 'Europe/Paris')!
    : adapterTZ.date('2022-03-27')!;
  const testDateLocale = adapter.date(TEST_DATE_LOCALE_STRING)!;

  describe('Method: date', () => {
    it('should parse strings', () => {
      expect(adapter.date(TEST_DATE_ISO_STRING)).toEqualDateTime(testDateIso);
      expect(adapter.date(TEST_DATE_LOCALE_STRING)).toEqualDateTime(testDateLocale);
    });

    it('should parse native Date object', () => {
      expect(adapter.date(new Date(TEST_DATE_ISO_STRING))).toEqualDateTime(testDateIso);
      expect(adapter.date(new Date(TEST_DATE_LOCALE_STRING))).toEqualDateTime(testDateLocale);
    });

    it('should parse already-parsed object', () => {
      expect(adapter.date(testDateIso)).toEqualDateTime(testDateIso);
      expect(adapter.date(testDateLocale)).toEqualDateTime(testDateLocale);
    });

    it('should parse null', () => {
      expect(adapter.date(null)).to.equal(null);
    });

    it('should parse undefined', () => {
      expect(
        Math.abs(adapter.toJsDate(adapter.date(undefined)!).getTime() - Date.now()),
      ).to.be.lessThan(5);
    });
  });

  describe('Method: dateWithTimezone', () => {
    it('should parse ISO strings', () => {
      if (adapter.isTimezoneCompatible) {
        const test = (timezone: PickersTimezone, expectedTimezones: string = timezone) => {
          [adapterTZ, adapterFr].forEach((instance) => {
            const dateWithZone = instance.dateWithTimezone(TEST_DATE_ISO_STRING, timezone)!;
            expect(instance.getTimezone(dateWithZone)).to.equal(expectedTimezones);

            // Should keep the time of the value in the UTC timezone
            expect(dateWithZone).toEqualDateTime(TEST_DATE_ISO_STRING);
          });
        };

        test('UTC');
        test('system');
        test('America/New_York');
        test('Europe/Paris');

        setDefaultTimezone('America/New_York');
        test('default', 'America/New_York');

        setDefaultTimezone('Europe/Paris');
        test('default', 'Europe/Paris');

        // Reset to the default timezone
        setDefaultTimezone(undefined);
      } else {
        expect(adapter.dateWithTimezone(TEST_DATE_ISO_STRING, 'system')).toEqualDateTime(
          TEST_DATE_ISO_STRING,
        );
        expect(adapter.dateWithTimezone(TEST_DATE_ISO_STRING, 'default')).toEqualDateTime(
          TEST_DATE_ISO_STRING,
        );
      }
    });

    it('should parse locale strings', () => {
      if (adapter.isTimezoneCompatible) {
        const test = (timezone: PickersTimezone) => {
          [adapterTZ, adapterFr].forEach((instance) => {
            const dateWithZone = instance.dateWithTimezone(TEST_DATE_LOCALE_STRING, timezone)!;
            expect(instance.getTimezone(dateWithZone)).to.equal(timezone);

            // Should keep the time of the date in the target timezone
            expect(instance.format(dateWithZone, 'fullTime24h')).to.equal('00:00');
          });
        };

        test('UTC');
        test('system');
        test('America/New_York');
        test('Europe/Paris');
      } else {
        expect(adapter.dateWithTimezone(TEST_DATE_LOCALE_STRING, 'system')).toEqualDateTime(
          TEST_DATE_LOCALE_STRING,
        );
      }
    });

    it('should parse null', () => {
      expect(adapter.dateWithTimezone(null, 'system')).to.equal(null);

      if (adapter.isTimezoneCompatible) {
        expect(adapter.dateWithTimezone(null, 'UTC')).to.equal(null);
        expect(adapter.dateWithTimezone(null, 'America/New_York')).to.equal(null);
      }
    });

    it('should parse undefined', () => {
      if (adapter.isTimezoneCompatible) {
        const testTodayZone = (timezone: PickersTimezone) => {
          const dateWithZone = adapterTZ.dateWithTimezone(undefined, timezone)!;
          expect(adapterTZ.getTimezone(dateWithZone)).to.equal(timezone);
          expect(adapterTZ.getDiff(dateWithZone, adapterTZ.date(new Date())!)).to.be.lessThan(5);
          expect(Math.abs(adapterTZ.toJsDate(dateWithZone).getTime() - Date.now())).to.be.lessThan(
            5,
          );
        };

        testTodayZone('system');
        testTodayZone('UTC');
        testTodayZone('America/New_York');
      } else {
        expect(
          Math.abs(
            adapterTZ.toJsDate(adapter.dateWithTimezone(undefined, 'system')!).getTime() -
              Date.now(),
          ),
        ).to.be.lessThan(5);
      }
    });
  });

  it('Method: getTimezone', () => {
    if (!adapter.isTimezoneCompatible) {
      return;
    }

    const testTimezone = (timezone: string, expectedTimezone = timezone) => {
      expect(adapter.getTimezone(adapter.dateWithTimezone(undefined, timezone))).to.equal(
        expectedTimezone,
      );
    };

    testTimezone('system');
    testTimezone('Europe/Paris');
    testTimezone('America/New_York');
    testTimezone('UTC');

    setDefaultTimezone('America/Chicago');
    testTimezone('default', 'America/Chicago');
    setDefaultTimezone(undefined);
  });

  it('Method: setTimezone', () => {
    if (adapter.isTimezoneCompatible) {
      const test = (timezone: PickersTimezone) => {
        setDefaultTimezone(timezone);
        const dateWithLocaleTimezone = adapter.dateWithTimezone(TEST_DATE_ISO_STRING, 'system')!;
        const dateWithDefaultTimezone = adapter.setTimezone(dateWithLocaleTimezone, 'default');

        expect(adapter.getTimezone(dateWithDefaultTimezone)).to.equal(timezone);
      };

      test('America/New_York');
      test('Europe/Paris');

      // Reset to the default timezone
      setDefaultTimezone(undefined);
    } else {
      const systemDate = adapter.dateWithTimezone(TEST_DATE_ISO_STRING, 'system')!;
      expect(adapter.setTimezone(systemDate, 'default')).toEqualDateTime(systemDate);
      expect(adapter.setTimezone(systemDate, 'system')).toEqualDateTime(systemDate);

      const defaultDate = adapter.dateWithTimezone(TEST_DATE_ISO_STRING, 'default')!;
      expect(adapter.setTimezone(systemDate, 'default')).toEqualDateTime(defaultDate);
      expect(adapter.setTimezone(systemDate, 'system')).toEqualDateTime(defaultDate);
    }
  });

  it('Method: toJsDate', () => {
    expect(adapter.toJsDate(testDateIso)).to.be.instanceOf(Date);
    expect(adapter.toJsDate(testDateLocale)).to.be.instanceOf(Date);
  });

  it('Method: parseISO', () => {
    expect(adapter.parseISO(TEST_DATE_ISO_STRING)).toEqualDateTime(testDateIso);
  });

  it('Method: toISO', () => {
    const outputtedISO = adapter.toISO(testDateIso);

    if (adapter.lib === 'date-fns') {
      // date-fns never suppress useless milliseconds in the end
      expect(outputtedISO).to.equal(TEST_DATE_ISO_STRING.replace('.000Z', 'Z'));
    } else {
      expect(outputtedISO).to.equal(TEST_DATE_ISO_STRING);
    }
  });

  it('Method: parse', () => {
    // Date time
    expect(adapter.parse('10/30/2018 11:44', adapter.formats.keyboardDateTime24h)).toEqualDateTime(
      '2018-10-30T11:44:00.000Z',
    );

    // Date
    expect(adapter.parse('10/30/2018', adapter.formats.keyboardDate)).toEqualDateTime(
      '2018-10-30T00:00:00.000Z',
    );

    // Empty string
    expect(adapter.parse('', adapter.formats.keyboardDate)).to.equal(null);

    // Invalid input
    expect(adapter.isValid(adapter.parse('99/99/9999', adapter.formats.keyboardDate))).to.equal(
      false,
    );
  });

  it('Method: isNull', () => {
    expect(adapter.isNull(null)).to.equal(true);
    expect(adapter.isNull(testDateIso)).to.equal(false);
    expect(adapter.isNull(testDateLocale)).to.equal(false);
  });

  it('Method: isValid', () => {
    const invalidDate = adapter.date('2018-42-30T11:60:00.000Z');

    expect(adapter.isValid(testDateIso)).to.equal(true);
    expect(adapter.isValid(testDateLocale)).to.equal(true);
    expect(adapter.isValid(invalidDate)).to.equal(false);
    expect(adapter.isValid(undefined)).to.equal(true);
    expect(adapter.isValid(null)).to.equal(false);
    expect(adapter.isValid('2018-42-30T11:60:00.000Z')).to.equal(false);
  });

  describe('Method: getDiff', () => {
    it('should compute the millisecond diff when there is no unit', () => {
      expect(adapter.getDiff(testDateIso, adapter.date('2018-10-29T11:44:00.000Z')!)).to.equal(
        86400000,
      );
      expect(adapter.getDiff(testDateIso, adapter.date('2018-10-31T11:44:00.000Z')!)).to.equal(
        -86400000,
      );
      expect(adapter.getDiff(testDateIso, adapter.date('2018-10-31T11:44:00.000Z')!)).to.equal(
        -86400000,
      );
    });

    it('should compute the diff in the provided unit (ISO)', () => {
      expect(
        adapter.getDiff(testDateIso, adapter.date('2017-09-29T11:44:00.000Z')!, 'years'),
      ).to.equal(1);
      expect(
        adapter.getDiff(testDateIso, adapter.date('2018-08-29T11:44:00.000Z')!, 'months'),
      ).to.equal(2);
      expect(
        adapter.getDiff(testDateIso, adapter.date('2018-05-29T11:44:00.000Z')!, 'quarters'),
      ).to.equal(1);
      expect(
        adapter.getDiff(testDateIso, adapter.date('2018-09-29T11:44:00.000Z')!, 'days'),
      ).to.equal(31);
      expect(
        adapter.getDiff(testDateIso, adapter.date('2018-09-29T11:44:00.000Z')!, 'weeks'),
      ).to.equal(4);
      expect(
        adapter.getDiff(testDateIso, adapter.date('2018-09-29T11:44:00.000Z')!, 'hours'),
      ).to.equal(744);

      expect(
        adapter.getDiff(testDateIso, adapter.date('2018-09-29T11:44:00.000Z')!, 'minutes'),
      ).to.equal(44640);

      expect(
        adapter.getDiff(testDateIso, adapter.date('2018-10-30T10:44:00.000Z')!, 'seconds'),
      ).to.equal(3600);

      expect(
        adapter.getDiff(testDateIso, adapter.date('2018-10-30T10:44:00.000Z')!, 'milliseconds'),
      ).to.equal(3600000);
    });

    it('should compute the diff in the provided unit (locale)', () => {
      expect(adapter.getDiff(testDateLocale, adapter.date('2017-09-29')!, 'years')).to.equal(1);
      expect(adapter.getDiff(testDateLocale, adapter.date('2018-08-29')!, 'months')).to.equal(2);
      expect(adapter.getDiff(testDateLocale, adapter.date('2018-05-29')!, 'quarters')).to.equal(1);
      expect(adapter.getDiff(testDateLocale, adapter.date('2018-09-29')!, 'days')).to.equal(31);
      expect(adapter.getDiff(testDateLocale, adapter.date('2018-09-29')!, 'weeks')).to.equal(4);
    });

    it('should compute the diff with string "comparing" param', () => {
      expect(adapter.getDiff(testDateLocale, '2017-09-29', 'years')).to.equal(1);
      expect(adapter.getDiff(testDateLocale, '2018-08-29', 'months')).to.equal(2);
      expect(adapter.getDiff(testDateLocale, '2018-05-29', 'quarters')).to.equal(1);
      expect(adapter.getDiff(testDateLocale, '2018-09-29', 'days')).to.equal(31);
      expect(adapter.getDiff(testDateLocale, '2018-09-29', 'weeks')).to.equal(4);
    });
  });

  describe('Method: isEqual', () => {
    it('should work in the same timezone', () => {
      expect(adapter.isEqual(adapter.date(null), null)).to.equal(true);
      expect(adapter.isEqual(testDateIso, adapter.date(TEST_DATE_ISO_STRING))).to.equal(true);
      expect(adapter.isEqual(null, testDateIso)).to.equal(false);
      expect(adapter.isEqual(testDateLocale, adapter.date(TEST_DATE_LOCALE_STRING))).to.equal(true);
      expect(adapter.isEqual(null, testDateLocale)).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      const dateInLondonTZ = adapterTZ.setTimezone(testDateIso, 'Europe/London');
      const dateInParisTZ = adapterTZ.setTimezone(testDateIso, 'Europe/Paris');

      expect(adapterTZ.isEqual(dateInLondonTZ, dateInParisTZ)).to.equal(true);
    });
  });

  describe('Method: isSameYear', () => {
    it('should work in the same timezone', () => {
      expect(adapter.isSameYear(testDateIso, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(
        true,
      );
      expect(adapter.isSameYear(testDateIso, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
        false,
      );
      expect(
        adapter.isSameYear(testDateLocale, adapter.date('2018-10-01T00:00:00.000Z')!),
      ).to.equal(true);
      expect(
        adapter.isSameYear(testDateLocale, adapter.date('2019-10-01T00:00:00.000Z')!),
      ).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      // Both dates below have the same timestamp, but they are not in the same year when represented in their respective timezone.
      // The adapter should still consider that they are in the same year.
      const dateInLondonTZ = adapterTZ.endOfYear(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');

      expect(adapterTZ.isSameYear(dateInLondonTZ, dateInParisTZ)).to.equal(true);
      expect(adapterTZ.isSameYear(dateInParisTZ, dateInLondonTZ)).to.equal(true);
    });
  });

  describe('Method: isSameMonth', () => {
    it('should work in the same timezone', () => {
      expect(adapter.isSameMonth(testDateIso, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(
        true,
      );
      expect(adapter.isSameMonth(testDateIso, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
        false,
      );
      expect(
        adapter.isSameMonth(testDateLocale, adapter.date('2018-10-01T00:00:00.000Z')!),
      ).to.equal(true);
      expect(
        adapter.isSameMonth(testDateLocale, adapter.date('2019-10-01T00:00:00.000Z')!),
      ).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      // Both dates below have the same timestamp, but they are not in the same month when represented in their respective timezone.
      // The adapter should still consider that they are in the same month.
      const dateInLondonTZ = adapterTZ.endOfMonth(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');

      expect(adapterTZ.isSameMonth(dateInLondonTZ, dateInParisTZ)).to.equal(true);
      expect(adapterTZ.isSameMonth(dateInParisTZ, dateInLondonTZ)).to.equal(true);
    });
  });

  describe('Method: isSameDay', () => {
    it('should work in the same timezone', () => {
      expect(adapter.isSameDay(testDateIso, adapter.date('2018-10-30T00:00:00.000Z')!)).to.equal(
        true,
      );
      expect(adapter.isSameDay(testDateIso, adapter.date('2019-10-30T00:00:00.000Z')!)).to.equal(
        false,
      );
      expect(adapter.isSameDay(testDateLocale, adapter.date('2018-10-30T00:00:00.000Z')!)).to.equal(
        true,
      );
      expect(adapter.isSameDay(testDateLocale, adapter.date('2019-10-30T00:00:00.000Z')!)).to.equal(
        false,
      );
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      // Both dates below have the same timestamp, but they are not in the same day when represented in their respective timezone.
      // The adapter should still consider that they are in the same day.
      const dateInLondonTZ = adapterTZ.endOfDay(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');

      expect(adapterTZ.isSameDay(dateInLondonTZ, dateInParisTZ)).to.equal(true);
      expect(adapterTZ.isSameDay(dateInParisTZ, dateInLondonTZ)).to.equal(true);
    });
  });

  describe('Method: isSameHour', () => {
    it('should work in the same timezone', () => {
      expect(adapter.isSameHour(testDateIso, adapter.date('2018-10-30T11:00:00.000Z')!)).to.equal(
        true,
      );
      expect(adapter.isSameHour(testDateIso, adapter.date('2018-10-30T12:00:00.000Z')!)).to.equal(
        false,
      );
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      // Both dates below have the same timestamp, but they are not in the same day when represented in their respective timezone.
      // The adapter should still consider that they are in the same day.
      const dateInLondonTZ = adapterTZ.setTimezone(testDateIso, 'Europe/London');
      const dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');

      expect(adapterTZ.isSameHour(dateInLondonTZ, dateInParisTZ)).to.equal(true);
      expect(adapterTZ.isSameHour(dateInParisTZ, dateInLondonTZ)).to.equal(true);
    });
  });

  describe('Method: isAfter', () => {
    it('should work with the same timezone', () => {
      expect(adapter.isAfter(adapter.date()!, testDateIso)).to.equal(true);
      expect(adapter.isAfter(testDateIso, adapter.date()!)).to.equal(false);

      expect(adapter.isAfter(adapter.date()!, testDateLocale)).to.equal(true);
      expect(adapter.isAfter(testDateLocale, adapter.date()!)).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      const dateInLondonTZ = adapterTZ.endOfDay(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.addMinutes(
        adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/Paris')),
        30,
      );

      expect(adapter.isAfter(dateInLondonTZ, dateInParisTZ)).to.equal(true);
      expect(adapter.isAfter(dateInParisTZ, dateInLondonTZ)).to.equal(false);
    });
  });

  describe('Method: isAfterYear', () => {
    it('should work in the same timezone', () => {
      const nextYearIso = adapter.addYears(testDateIso, 1);
      expect(adapter.isAfterYear(nextYearIso, testDateIso)).to.equal(true);
      expect(adapter.isAfterYear(testDateIso, nextYearIso)).to.equal(false);

      const nextYearLocale = adapter.addYears(testDateLocale, 1);
      expect(adapter.isAfterYear(nextYearLocale, testDateLocale)).to.equal(true);
      expect(adapter.isAfterYear(testDateLocale, nextYearLocale)).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      // Both dates below have the same timestamp, but they are not in the same year when represented in their respective timezone.
      // The adapter should still consider that they are in the same year.
      const dateInLondonTZ = adapterTZ.endOfYear(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');

      expect(adapterTZ.isAfterYear(dateInLondonTZ, dateInParisTZ)).to.equal(false);
      expect(adapterTZ.isAfterYear(dateInParisTZ, dateInLondonTZ)).to.equal(false);
    });
  });

  describe('Method: isAfterDay', () => {
    it('should work with the same timezone', () => {
      const nextDayIso = adapter.addDays(testDateIso, 1);
      expect(adapter.isAfterDay(nextDayIso, testDateIso)).to.equal(true);
      expect(adapter.isAfterDay(testDateIso, nextDayIso)).to.equal(false);

      const nextDayLocale = adapter.addDays(testDateLocale, 1);
      expect(adapter.isAfterDay(nextDayLocale, testDateLocale)).to.equal(true);
      expect(adapter.isAfterDay(testDateLocale, nextDayLocale)).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      // Both dates below have the same timestamp, but they are not in the same day when represented in their respective timezone.
      // The adapter should still consider that they are in the same day.
      const dateInLondonTZ = adapterTZ.endOfDay(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');

      expect(adapterTZ.isAfterDay(dateInLondonTZ, dateInParisTZ)).to.equal(false);
      expect(adapterTZ.isAfterDay(dateInParisTZ, dateInLondonTZ)).to.equal(false);

      // Both dates below have the same day when represented in their respective timezone,
      // But not when represented in the same timezone
      // The adapter should consider that they are not in the same day
      const dateInLondonTZ2 = adapterTZ.startOfDay(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ2 = adapterTZ.addHours(
        adapterTZ.setTimezone(dateInLondonTZ2, 'Europe/Paris'),
        -1,
      );

      expect(adapterTZ.isAfterDay(dateInLondonTZ2, dateInParisTZ2)).to.equal(true);
      expect(adapterTZ.isAfterDay(dateInParisTZ2, dateInLondonTZ2)).to.equal(false);
    });
  });

  describe('Method: isBefore', () => {
    it('should work with the same timezone', () => {
      expect(adapter.isBefore(testDateIso, adapter.date()!)).to.equal(true);
      expect(adapter.isBefore(adapter.date()!, testDateIso)).to.equal(false);

      expect(adapter.isBefore(testDateLocale, adapter.date()!)).to.equal(true);
      expect(adapter.isBefore(adapter.date()!, testDateLocale)).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      const dateInLondonTZ = adapterTZ.endOfDay(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.addMinutes(
        adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/Paris')),
        30,
      );

      expect(adapter.isBefore(dateInLondonTZ, dateInParisTZ)).to.equal(false);
      expect(adapter.isBefore(dateInParisTZ, dateInLondonTZ)).to.equal(true);
    });
  });

  describe('Method: isBeforeYear', () => {
    it('should work in the same timezone', () => {
      const nextYearIso = adapter.addYears(testDateIso, -1);
      expect(adapter.isBeforeYear(nextYearIso, testDateIso)).to.equal(true);
      expect(adapter.isBeforeYear(testDateIso, nextYearIso)).to.equal(false);

      const nextYearLocale = adapter.addYears(testDateLocale, -1);
      expect(adapter.isBeforeYear(nextYearLocale, testDateLocale)).to.equal(true);
      expect(adapter.isBeforeYear(testDateLocale, nextYearLocale)).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      // Both dates below have the same timestamp, but they are not in the same year when represented in their respective timezone.
      // The adapter should still consider that they are in the same year.
      const dateInLondonTZ = adapterTZ.endOfYear(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');

      expect(adapterTZ.isBeforeYear(dateInLondonTZ, dateInParisTZ)).to.equal(false);
      expect(adapterTZ.isBeforeYear(dateInParisTZ, dateInLondonTZ)).to.equal(false);
    });
  });

  describe('Method: isBeforeDay', () => {
    it('should work with the same timezone', () => {
      const previousDayIso = adapter.addDays(testDateIso, -1);
      expect(adapter.isBeforeDay(previousDayIso, testDateIso)).to.equal(true);
      expect(adapter.isBeforeDay(testDateIso, previousDayIso)).to.equal(false);

      const previousDayLocale = adapter.addDays(testDateLocale, -1);
      expect(adapter.isBeforeDay(previousDayLocale, testDateLocale)).to.equal(true);
      expect(adapter.isBeforeDay(testDateLocale, previousDayLocale)).to.equal(false);
    });

    it('should work with different timezones', function test() {
      if (!adapter.isTimezoneCompatible) {
        this.skip();
      }

      // Both dates below have the same timestamp, but they are not in the same day when represented in their respective timezone.
      // The adapter should still consider that they are in the same day.
      const dateInLondonTZ = adapterTZ.endOfDay(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');

      expect(adapterTZ.isBeforeDay(dateInLondonTZ, dateInParisTZ)).to.equal(false);
      expect(adapterTZ.isBeforeDay(dateInParisTZ, dateInLondonTZ)).to.equal(false);

      // Both dates below have the same day when represented in their respective timezone,
      // But not when represented in the same timezone
      // The adapter should consider that they are not in the same day
      const dateInLondonTZ2 = adapterTZ.endOfDay(
        adapterTZ.setTimezone(testDateIso, 'Europe/London'),
      );
      const dateInParisTZ2 = adapterTZ.addHours(
        adapterTZ.setTimezone(dateInLondonTZ2, 'Europe/Paris'),
        -1,
      );

      expect(adapterTZ.isBeforeDay(dateInLondonTZ2, dateInParisTZ2)).to.equal(false);
      expect(adapterTZ.isBeforeDay(dateInParisTZ2, dateInLondonTZ2)).to.equal(true);
    });
  });

  describe('Method: isWithinRange', () => {
    it('should work on simple examples', () => {
      expect(
        adapter.isWithinRange(adapter.date('2019-10-01T00:00:00.000Z')!, [
          adapter.date('2019-09-01T00:00:00.000Z')!,
          adapter.date('2019-11-01T00:00:00.000Z')!,
        ]),
      ).to.equal(true);

      expect(
        adapter.isWithinRange(adapter.date('2019-12-01T00:00:00.000Z')!, [
          adapter.date('2019-09-01T00:00:00.000Z')!,
          adapter.date('2019-11-01T00:00:00.000Z')!,
        ]),
      ).to.equal(false);

      expect(
        adapter.isWithinRange(adapter.date('2019-10-01')!, [
          adapter.date('2019-09-01')!,
          adapter.date('2019-11-01')!,
        ]),
      ).to.equal(true);

      expect(
        adapter.isWithinRange(adapter.date('2019-12-01')!, [
          adapter.date('2019-09-01')!,
          adapter.date('2019-11-01')!,
        ]),
      ).to.equal(false);
    });

    it('should use inclusivity of range', () => {
      expect(
        adapter.isWithinRange(adapter.date('2019-09-01T00:00:00.000Z')!, [
          adapter.date('2019-09-01T00:00:00.000Z')!,
          adapter.date('2019-12-01T00:00:00.000Z')!,
        ]),
      ).to.equal(true);

      expect(
        adapter.isWithinRange(adapter.date('2019-12-01T00:00:00.000Z')!, [
          adapter.date('2019-09-01T00:00:00.000Z')!,
          adapter.date('2019-12-01T00:00:00.000Z')!,
        ]),
      ).to.equal(true);

      expect(
        adapter.isWithinRange(adapter.date('2019-09-01')!, [
          adapter.date('2019-09-01')!,
          adapter.date('2019-12-01')!,
        ]),
      ).to.equal(true);

      expect(
        adapter.isWithinRange(adapter.date('2019-12-01')!, [
          adapter.date('2019-09-01')!,
          adapter.date('2019-12-01')!,
        ]),
      ).to.equal(true);
    });
  });

  it('Method: startOfYear', () => {
    const expected = '2018-01-01T00:00:00.000Z';
    expect(adapter.startOfYear(testDateIso)).toEqualDateTime(expected);
    expect(adapter.startOfYear(testDateLocale)).toEqualDateTime(expected);
  });

  it('Method: startOfMonth', () => {
    const expected = '2018-10-01T00:00:00.000Z';
    expect(adapter.startOfMonth(testDateIso)).toEqualDateTime(expected);
    expect(adapter.startOfMonth(testDateLocale)).toEqualDateTime(expected);
  });

  it('Method: startOfWeek', () => {
    const expected =
      adapter.lib === 'luxon' ? '2018-10-29T00:00:00.000Z' : '2018-10-28T00:00:00.000Z';
    expect(adapter.startOfWeek(testDateIso)).toEqualDateTime(expected);
    expect(adapter.startOfWeek(testDateLocale)).toEqualDateTime(expected);
  });

  it('Method: startOfDay', () => {
    const expected = '2018-10-30T00:00:00.000Z';
    expect(adapter.startOfDay(testDateIso)).toEqualDateTime(expected);
    expect(adapter.startOfDay(testDateLocale)).toEqualDateTime(expected);
  });

  it('Method: endOfYear', () => {
    const expected = '2018-12-31T23:59:59.999Z';
    expect(adapter.endOfYear(testDateIso)).toEqualDateTime(expected);
    expect(adapter.endOfYear(testDateLocale)).toEqualDateTime(expected);
  });

  describe('Method: endOfMonth', () => {
    it('should handle basic usecases', () => {
      const expected = '2018-10-31T23:59:59.999Z';
      expect(adapter.endOfMonth(testDateIso)).toEqualDateTime(expected);
      expect(adapter.endOfMonth(testDateLocale)).toEqualDateTime(expected);
    });

    it('should update the offset when entering DST', function test() {
      if (!adapterTZ.isTimezoneCompatible) {
        this.skip();
      }

      expectSameTimeInMonacoTZ(adapterTZ, testDateLastNonDSTDay);
      expectSameTimeInMonacoTZ(adapterTZ, adapterTZ.endOfMonth(testDateLastNonDSTDay));
    });
  });

  it('Method: endOfWeek', () => {
    const expected =
      adapter.lib === 'luxon' ? '2018-11-04T23:59:59.999Z' : '2018-11-03T23:59:59.999Z';
    expect(adapter.endOfWeek(testDateIso)).toEqualDateTime(expected);
    expect(adapter.endOfWeek(testDateLocale)).toEqualDateTime(expected);
  });

  it('Method: endOfDay', () => {
    const expected = '2018-10-30T23:59:59.999Z';
    expect(adapter.endOfDay(testDateIso)).toEqualDateTime(expected);
    expect(adapter.endOfDay(testDateLocale)).toEqualDateTime(expected);
  });

  it('Method: addYears', () => {
    expect(adapter.addYears(testDateIso, 2)).toEqualDateTime('2020-10-30T11:44:00.000Z');
    expect(adapter.addYears(testDateIso, -2)).toEqualDateTime('2016-10-30T11:44:00.000Z');
  });

  describe('Method: addMonths', () => {
    it('should handle basic usecases', () => {
      expect(adapter.addMonths(testDateIso, 2)).toEqualDateTime('2018-12-30T11:44:00.000Z');
      expect(adapter.addMonths(testDateIso, -2)).toEqualDateTime('2018-08-30T11:44:00.000Z');
      expect(adapter.addMonths(testDateIso, 3)).toEqualDateTime('2019-01-30T11:44:00.000Z');
    });

    it('should update the offset when entering DST', function test() {
      if (!adapterTZ.isTimezoneCompatible) {
        this.skip();
      }

      expectSameTimeInMonacoTZ(adapterTZ, testDateLastNonDSTDay);
      expectSameTimeInMonacoTZ(adapterTZ, adapterTZ.addMonths(testDateLastNonDSTDay, 1));
    });
  });

  describe('Method: addWeeks', () => {
    it('should handle basic usecases', () => {
      expect(adapter.addWeeks(testDateIso, 2)).toEqualDateTime('2018-11-13T11:44:00.000Z');
      expect(adapter.addWeeks(testDateIso, -2)).toEqualDateTime('2018-10-16T11:44:00.000Z');
    });

    it('should update the offset when entering DST', function test() {
      if (!adapterTZ.isTimezoneCompatible) {
        this.skip();
      }

      expectSameTimeInMonacoTZ(adapterTZ, testDateLastNonDSTDay);
      expectSameTimeInMonacoTZ(adapterTZ, adapterTZ.addWeeks(testDateLastNonDSTDay, 1));
    });
  });

  describe('Method: addWeeks', () => {
    it('should handle basic usecases', () => {
      expect(adapter.addDays(testDateIso, 2)).toEqualDateTime('2018-11-01T11:44:00.000Z');
      expect(adapter.addDays(testDateIso, -2)).toEqualDateTime('2018-10-28T11:44:00.000Z');
    });

    it('should update the offset when entering DST', function test() {
      if (!adapterTZ.isTimezoneCompatible) {
        this.skip();
      }

      expectSameTimeInMonacoTZ(adapterTZ, testDateLastNonDSTDay);
      expectSameTimeInMonacoTZ(adapterTZ, adapterTZ.addDays(testDateLastNonDSTDay, 1));
    });
  });

  it('Method: addHours', () => {
    expect(adapter.addHours(testDateIso, 2)).toEqualDateTime('2018-10-30T13:44:00.000Z');
    expect(adapter.addHours(testDateIso, -2)).toEqualDateTime('2018-10-30T09:44:00.000Z');
    expect(adapter.addHours(testDateIso, 15)).toEqualDateTime('2018-10-31T02:44:00.000Z');
  });

  it('Method: addMinutes', () => {
    expect(adapter.addMinutes(testDateIso, 2)).toEqualDateTime('2018-10-30T11:46:00.000Z');
    expect(adapter.addMinutes(testDateIso, -2)).toEqualDateTime('2018-10-30T11:42:00.000Z');
    expect(adapter.addMinutes(testDateIso, 20)).toEqualDateTime('2018-10-30T12:04:00.000Z');
  });

  it('Method: addSeconds', () => {
    expect(adapter.addSeconds(testDateIso, 2)).toEqualDateTime('2018-10-30T11:44:02.000Z');
    expect(adapter.addSeconds(testDateIso, -2)).toEqualDateTime('2018-10-30T11:43:58.000Z');
    expect(adapter.addSeconds(testDateIso, 70)).toEqualDateTime('2018-10-30T11:45:10.000Z');
  });

  it('Method: getYear', () => {
    expect(adapter.getYear(testDateIso)).to.equal(2018);
  });

  it('Method: getMonth', () => {
    expect(adapter.getMonth(testDateIso)).to.equal(9);
  });

  it('Method: getDate', () => {
    expect(adapter.getDate(testDateIso)).to.equal(30);
  });

  it('Method: getHours', () => {
    expect(adapter.getHours(testDateIso)).to.equal(11);
  });

  it('Method: getMinutes', () => {
    expect(adapter.getMinutes(testDateIso)).to.equal(44);
  });

  it('Method: getSeconds', () => {
    expect(adapter.getSeconds(testDateIso)).to.equal(0);
  });

  it('Method: getMilliseconds', () => {
    expect(adapter.getMilliseconds(testDateIso)).to.equal(0);
  });

  it('Method: setYear', () => {
    expect(adapter.setYear(testDateIso, 2011)).toEqualDateTime('2011-10-30T11:44:00.000Z');
  });

  it('Method: setMonth', () => {
    expect(adapter.setMonth(testDateIso, 4)).toEqualDateTime('2018-05-30T11:44:00.000Z');
  });

  it('Method: setDate', () => {
    expect(adapter.setDate(testDateIso, 15)).toEqualDateTime('2018-10-15T11:44:00.000Z');
  });

  it('Method: setHours', () => {
    expect(adapter.setHours(testDateIso, 0)).toEqualDateTime('2018-10-30T00:44:00.000Z');
  });

  it('Method: setMinutes', () => {
    expect(adapter.setMinutes(testDateIso, 12)).toEqualDateTime('2018-10-30T11:12:00.000Z');
  });

  it('Method: setSeconds', () => {
    expect(adapter.setSeconds(testDateIso, 11)).toEqualDateTime('2018-10-30T11:44:11.000Z');
  });

  it('Method: setMilliseconds', () => {
    expect(adapter.setMilliseconds(testDateIso, 11)).toEqualDateTime('2018-10-30T11:44:00.011Z');
  });

  it('Method: getDaysInMonth', () => {
    expect(adapter.getDaysInMonth(testDateIso)).to.equal(31);
    expect(adapter.getDaysInMonth(testDateLocale)).to.equal(31);
    expect(adapter.getDaysInMonth(adapter.addMonths(testDateIso, 1))).to.equal(30);
  });

  it('Method: getNextMonth', () => {
    expect(adapter.getNextMonth(testDateIso)).toEqualDateTime('2018-11-30T11:44:00.000Z');
  });

  it('Method: getPreviousMonth', () => {
    expect(adapter.getPreviousMonth(testDateIso)).toEqualDateTime('2018-09-30T11:44:00.000Z');
  });

  it('Method: getMonthArray', () => {
    const monthArray = adapter.getMonthArray(testDateIso);
    let expectedDate = adapter.date('2018-01-01T00:00:00.000Z')!;

    monthArray.forEach((month) => {
      expect(month).toEqualDateTime(expectedDate);
      expectedDate = adapter.addMonths(expectedDate, 1)!;
    });
  });

  it('Method: mergeDateAndTime', () => {
    const mergedDate = adapter.mergeDateAndTime(
      testDateIso,
      adapter.date('2018-01-01T14:15:16.000Z')!,
    );

    expect(adapter.toJsDate(mergedDate)).toEqualDateTime('2018-10-30T14:15:16.000Z');
  });

  it('Method: getWeekdays', () => {
    const weekDays = adapter.getWeekdays();
    let date = adapter.startOfWeek(testDateIso);

    weekDays.forEach((dayLabel) => {
      expect(adapter.format(date, 'weekday').startsWith(dayLabel)).to.equal(true);
      date = adapter.addDays(date, 1);
    });
  });

  describe('Method: getWeekArray', () => {
    it('should work without timezones', () => {
      const weekArray = adapter.getWeekArray(testDateIso);
      let expectedDate = adapter.startOfWeek(adapter.startOfMonth(testDateIso));

      expect(weekArray).to.have.length(5);
      weekArray.forEach((week) => {
        expect(week).to.have.length(7);
        week.forEach((day) => {
          expect(day).toEqualDateTime(expectedDate);
          expectedDate = adapter.addDays(expectedDate, 1);
        });
      });
    });

    it('should respect the DST', function test() {
      if (!adapterTZ.isTimezoneCompatible) {
        this.skip();
      }

      const referenceDate = adapterTZ.dateWithTimezone('2022-03-17', 'Europe/Paris')!;
      const weekArray = adapterTZ.getWeekArray(referenceDate);
      let expectedDate = adapter.startOfWeek(adapter.startOfMonth(referenceDate));

      expect(weekArray).to.have.length(5);
      weekArray.forEach((week) => {
        expect(week).to.have.length(7);
        week.forEach((day) => {
          expect(adapterTZ.startOfDay(day)).toEqualDateTime(adapterTZ.startOfDay(expectedDate));
          expectedDate = adapterTZ.addDays(expectedDate, 1);

          expect(getDateOffset(adapterTZ, day)).to.equal(
            adapterTZ.isAfter(day, testDateLastNonDSTDay) ? 120 : 60,
          );
        });
      });
    });

    it('should respect the locale of the adapter, not the locale of the date', function test() {
      const dateFr = adapterFr.dateWithTimezone('2022-03-17', 'default')!;
      const weekArray = adapter.getWeekArray(dateFr);

      if (getLocaleFromDate) {
        expect(getLocaleFromDate(weekArray[0][0])).to.match(/en/);
      }

      // Week should start on Monday (28th of March) for adapters supporting locale-based week start.
      expect(adapter.getDate(weekArray[0][0])).to.equal(adapter.lib === 'luxon' ? 28 : 27);
    });
  });

  it('Method: getWeekNumber', () => {
    expect(adapter.getWeekNumber!(testDateIso)).to.equal(44);
  });

  it('Method: getYearRange', () => {
    const yearRange = adapter.getYearRange(testDateIso, adapter.setYear(testDateIso, 2124));

    expect(yearRange).to.have.length(107);
    expect(adapter.getYear(yearRange[yearRange.length - 1])).to.equal(2124);

    const emptyYearRange = adapter.getYearRange(
      testDateIso,
      adapter.setYear(testDateIso, adapter.getYear(testDateIso) - 1),
    );

    expect(emptyYearRange).to.have.length(0);
  });
};
