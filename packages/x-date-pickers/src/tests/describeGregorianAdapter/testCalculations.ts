import { expect } from 'chai';
import { DescribeGregorianAdapterTestSuite } from './describeGregorianAdapter.types';
import { TEST_DATE_ISO_STRING, TEST_DATE_LOCALE_STRING } from './describeGregorianAdapter.utils';

export const testCalculations: DescribeGregorianAdapterTestSuite = ({ adapter }) => {
  const testDateIso = adapter.date(TEST_DATE_ISO_STRING)!;
  const testDateLocale = adapter.date(TEST_DATE_LOCALE_STRING)!;

  describe('Method: date', () => {
    it('should parse strings', () => {
      expect(adapter.isEqual(testDateIso, adapter.date(TEST_DATE_ISO_STRING))).to.equal(true);
      expect(adapter.isEqual(testDateLocale, adapter.date(TEST_DATE_LOCALE_STRING))).to.equal(true);
    });

    it('should parse native Date object', () => {
      expect(adapter.isEqual(testDateIso, adapter.date(new Date(TEST_DATE_ISO_STRING)))).to.equal(
        true,
      );
      expect(
        adapter.isEqual(testDateLocale, adapter.date(new Date(TEST_DATE_LOCALE_STRING))),
      ).to.equal(true);
    });

    it('should parse already-parsed object', () => {
      expect(
        adapter.isEqual(testDateIso, adapter.date(adapter.date(TEST_DATE_ISO_STRING))),
      ).to.equal(true);
      expect(
        adapter.isEqual(testDateLocale, adapter.date(adapter.date(TEST_DATE_LOCALE_STRING))),
      ).to.equal(true);
    });

    it('should parse null', () => {
      expect(adapter.date(null)).to.equal(null);
    });

    it('should parse undefined', () => {
      expect(adapter.date(undefined)).toEqualDateTime(new Date());
    });
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
    } else if (adapter.lib === 'luxon') {
      // luxon does not shorthand +00:00 to Z, which is also valid ISO string
      expect(outputtedISO).to.equal(TEST_DATE_ISO_STRING.replace('Z', '+00:00'));
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

  it('Method: isEqual', () => {
    expect(adapter.isEqual(adapter.date(null), null)).to.equal(true);
    expect(adapter.isEqual(testDateIso, adapter.date(TEST_DATE_ISO_STRING))).to.equal(true);
    expect(adapter.isEqual(null, testDateIso)).to.equal(false);
    expect(adapter.isEqual(testDateLocale, adapter.date(TEST_DATE_LOCALE_STRING))).to.equal(true);
    expect(adapter.isEqual(null, testDateLocale)).to.equal(false);
  });

  it('Method: isSameYear', () => {
    expect(adapter.isSameYear(testDateIso, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(
      true,
    );
    expect(adapter.isSameYear(testDateIso, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
      false,
    );
    expect(adapter.isSameYear(testDateLocale, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(
      true,
    );
    expect(adapter.isSameYear(testDateLocale, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
      false,
    );
  });

  it('Method: isSameMonth', () => {
    expect(adapter.isSameMonth(testDateIso, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(
      true,
    );
    expect(adapter.isSameMonth(testDateIso, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
      false,
    );
    expect(adapter.isSameMonth(testDateLocale, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(
      true,
    );
    expect(adapter.isSameMonth(testDateLocale, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
      false,
    );
  });

  it('Method: isSameDay', () => {
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

  it('Method: isSameHour', () => {
    expect(adapter.isSameHour(testDateIso, adapter.date('2018-10-30T11:00:00.000Z')!)).to.equal(
      true,
    );
    expect(adapter.isSameHour(testDateIso, adapter.date('2018-10-30T12:00:00.000Z')!)).to.equal(
      false,
    );
  });

  it('Method: isAfter', () => {
    expect(adapter.isAfter(adapter.date()!, testDateIso)).to.equal(true);
    expect(adapter.isAfter(testDateIso, adapter.date()!)).to.equal(false);

    expect(adapter.isAfter(adapter.date()!, testDateLocale)).to.equal(true);
    expect(adapter.isAfter(testDateLocale, adapter.date()!)).to.equal(false);
  });

  it('Method: isAfterYear', () => {
    const nextYearIso = adapter.addYears(testDateIso, 1);
    expect(adapter.isAfterYear(nextYearIso, testDateIso)).to.equal(true);
    expect(adapter.isAfterYear(testDateIso, nextYearIso)).to.equal(false);

    const nextYearLocale = adapter.addYears(testDateLocale, 1);
    expect(adapter.isAfterYear(nextYearLocale, testDateLocale)).to.equal(true);
    expect(adapter.isAfterYear(testDateLocale, nextYearLocale)).to.equal(false);
  });

  it('Method: isAfterDay', () => {
    const nextDayIso = adapter.addDays(testDateIso, 1);
    expect(adapter.isAfterDay(nextDayIso, testDateIso)).to.equal(true);
    expect(adapter.isAfterDay(testDateIso, nextDayIso)).to.equal(false);

    const nextDayLocale = adapter.addDays(testDateLocale, 1);
    expect(adapter.isAfterDay(nextDayLocale, testDateLocale)).to.equal(true);
    expect(adapter.isAfterDay(testDateLocale, nextDayLocale)).to.equal(false);
  });

  it('Method: isBefore', () => {
    expect(adapter.isBefore(testDateIso, adapter.date()!)).to.equal(true);
    expect(adapter.isBefore(adapter.date()!, testDateIso)).to.equal(false);

    expect(adapter.isBefore(testDateLocale, adapter.date()!)).to.equal(true);
    expect(adapter.isBefore(adapter.date()!, testDateLocale)).to.equal(false);
  });

  it('Method: isBeforeYear', () => {
    const nextYearIso = adapter.addYears(testDateIso, -1);
    expect(adapter.isBeforeYear(nextYearIso, testDateIso)).to.equal(true);
    expect(adapter.isBeforeYear(testDateIso, nextYearIso)).to.equal(false);

    const nextYearLocale = adapter.addYears(testDateLocale, -1);
    expect(adapter.isBeforeYear(nextYearLocale, testDateLocale)).to.equal(true);
    expect(adapter.isBeforeYear(testDateLocale, nextYearLocale)).to.equal(false);
  });

  it('Method: isBeforeDay', () => {
    const nextDayIso = adapter.addDays(testDateIso, -1);
    expect(adapter.isBeforeDay(nextDayIso, testDateIso)).to.equal(true);
    expect(adapter.isBeforeDay(testDateIso, nextDayIso)).to.equal(false);

    const nextDayLocale = adapter.addDays(testDateLocale, -1);
    expect(adapter.isBeforeDay(nextDayLocale, testDateLocale)).to.equal(true);
    expect(adapter.isBeforeDay(testDateLocale, nextDayLocale)).to.equal(false);
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

  it('Method: endOfMonth', () => {
    const expected = '2018-10-31T23:59:59.999Z';
    expect(adapter.endOfMonth(testDateIso)).toEqualDateTime(expected);
    expect(adapter.endOfMonth(testDateLocale)).toEqualDateTime(expected);
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

  it('Method: addMonths', () => {
    expect(adapter.addMonths(testDateIso, 2)).toEqualDateTime('2018-12-30T11:44:00.000Z');
    expect(adapter.addMonths(testDateIso, -2)).toEqualDateTime('2018-08-30T11:44:00.000Z');
    expect(adapter.addMonths(testDateIso, 3)).toEqualDateTime('2019-01-30T11:44:00.000Z');
  });

  it('Method: addWeeks', () => {
    expect(adapter.addWeeks(testDateIso, 2)).toEqualDateTime('2018-11-13T11:44:00.000Z');
    expect(adapter.addWeeks(testDateIso, -2)).toEqualDateTime('2018-10-16T11:44:00.000Z');
  });

  it('Method: addDays', () => {
    expect(adapter.addDays(testDateIso, 2)).toEqualDateTime('2018-11-01T11:44:00.000Z');
    expect(adapter.addDays(testDateIso, -2)).toEqualDateTime('2018-10-28T11:44:00.000Z');
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

  it('Method: getWeekArray', () => {
    const weekArray = adapter.getWeekArray(testDateIso);

    expect(weekArray).to.have.length(5);
    weekArray.forEach((week) => {
      expect(week).to.have.length(7);
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
