import { expect } from 'chai';
import { DescribeJalaliAdapterTestSuite } from './describeJalaliAdapter.types';
import { TEST_DATE_ISO_STRING } from '../describeGregorianAdapter';

export const testCalculations: DescribeJalaliAdapterTestSuite = ({ adapter }) => {
  const testDateIso = adapter.date(TEST_DATE_ISO_STRING)!;

  it('Method: date', () => {
    expect(adapter.date(null)).to.equal(null);
  });

  it('Method: parse', () => {
    expect(adapter.parse('', adapter.formats.keyboardDate)).to.equal(null);
    expect(adapter.parse('01/01/1395', adapter.formats.keyboardDate)).not.to.equal(null);
  });

  it('Method: isEqual', () => {
    const anotherDate = adapter.date(TEST_DATE_ISO_STRING);

    expect(adapter.isEqual(testDateIso, anotherDate)).to.equal(true);
    expect(adapter.isEqual(null, null)).to.equal(true);
    expect(adapter.isEqual(testDateIso, null)).to.equal(false);
  });

  it('Method: isValid', () => {
    expect(adapter.isValid(testDateIso)).to.equal(true);
    expect(adapter.isValid(null)).to.equal(false);
    if (adapter.lib !== 'moment-jalaali') {
      expect(adapter.isValid(adapter.date('invalid'))).to.equal(false);
    } else {
      expect(() => adapter.isValid(adapter.date('invalid'))).toWarnDev(
        'Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not rel',
      );
    }
  });

  it('Method: isSameYear', () => {
    expect(adapter.isSameYear(testDateIso, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(
      true,
    );
    expect(adapter.isSameYear(testDateIso, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
      false,
    );
  });

  it('Method: isSameMonth', () => {
    expect(adapter.isSameMonth(testDateIso, adapter.date('2018-11-04T00:00:00.000Z')!)).to.equal(
      true,
    );
    expect(adapter.isSameMonth(testDateIso, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
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
  });

  it('Method: isAfterYear', () => {
    const afterYear = adapter.addYears(testDateIso, 2);
    expect(adapter.isAfterYear(afterYear, testDateIso)).to.equal(true);
  });

  it('Method: isAfterDay', () => {
    const nextDayIso = adapter.addDays(testDateIso, 1);
    expect(adapter.isAfterDay(nextDayIso, testDateIso)).to.equal(true);
    expect(adapter.isAfterDay(testDateIso, nextDayIso)).to.equal(false);
  });

  it('Method: isBefore', () => {
    expect(adapter.isBefore(testDateIso, adapter.date()!)).to.equal(true);
    expect(adapter.isBefore(adapter.date()!, testDateIso)).to.equal(false);
  });

  it('Method: isBeforeYear', () => {
    const afterYear = adapter.addYears(testDateIso, 2);
    expect(adapter.isBeforeYear(testDateIso, afterYear)).to.equal(true);
  });

  it('Method: isBeforeDay', () => {
    const nextDayIso = adapter.addDays(testDateIso, -1);
    expect(adapter.isBeforeDay(nextDayIso, testDateIso)).to.equal(true);
    expect(adapter.isBeforeDay(testDateIso, nextDayIso)).to.equal(false);
  });

  it('Method: isWithinRange', () => {
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

  it('Method: startOfYear', () => {
    expect(adapter.startOfYear(testDateIso)).toEqualDateTime('2018-03-21T00:00:00.000Z');
  });

  it('Method: startOfMonth', () => {
    expect(adapter.startOfMonth(testDateIso)).toEqualDateTime('2018-10-23T00:00:00.000Z');
  });

  it('Method: startOfWeek', () => {
    expect(adapter.startOfWeek(testDateIso)).toEqualDateTime('2018-10-27T00:00:00.000Z');
  });

  it('Method: startOfDay', () => {
    expect(adapter.startOfDay(testDateIso)).toEqualDateTime('2018-10-30T00:00:00.000Z');
  });

  it('Method: endOfYear', () => {
    expect(adapter.endOfYear(testDateIso)).toEqualDateTime('2019-03-20T23:59:59.999Z');
  });

  it('Method: endOfMonth', () => {
    expect(adapter.endOfMonth(testDateIso)).toEqualDateTime('2018-11-21T23:59:59.999Z');
  });

  it('Method: endOfWeek', () => {
    expect(adapter.endOfWeek(testDateIso)).toEqualDateTime('2018-11-02T23:59:59.999Z');
  });

  it('Method: endOfDay', () => {
    expect(adapter.endOfDay(testDateIso)).toEqualDateTime('2018-10-30T23:59:59.999Z');
  });

  it('Method: addYears', () => {
    expect(adapter.addYears(testDateIso, 2)).toEqualDateTime('2020-10-29T11:44:00.000Z');
    expect(adapter.addYears(testDateIso, -2)).toEqualDateTime('2016-10-29T11:44:00.000Z');
  });

  it('Method: addMonths', () => {
    expect(adapter.addMonths(testDateIso, 2)).toEqualDateTime('2018-12-29T11:44:00.000Z');
    expect(adapter.addMonths(testDateIso, -2)).toEqualDateTime('2018-08-30T11:44:00.000Z');
    expect(adapter.addMonths(testDateIso, 3)).toEqualDateTime('2019-01-28T11:44:00.000Z');
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
    expect(adapter.getYear(testDateIso)).to.equal(1397);
  });

  it('Method: getMonth', () => {
    expect(adapter.getMonth(testDateIso)).to.equal(7);
  });

  it('Method: getDate', () => {
    expect(adapter.getDate(testDateIso)).to.equal(8);
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
    expect(adapter.setYear(testDateIso, 1398)).toEqualDateTime('2019-10-30T11:44:00.000Z');
  });

  it('Method: setMonth', () => {
    expect(adapter.setMonth(testDateIso, 4)).toEqualDateTime('2018-07-30T11:44:00.000Z');
  });

  it('Method: setDate', () => {
    expect(adapter.setDate(testDateIso, 9)).toEqualDateTime('2018-10-31T11:44:00.000Z');
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
    expect(adapter.getDaysInMonth(testDateIso)).to.equal(30);
  });

  it('Method: getWeekArray', () => {
    const weekArray = adapter.getWeekArray(testDateIso);
    const expectedDate = new Date('2018-10-20T00:00:00.000Z');

    weekArray.forEach((week) => {
      week.forEach((day) => {
        expect(day).toEqualDateTime(expectedDate);
        expectedDate.setDate(expectedDate.getDate() + 1);
      });
    });
  });

  it('Method: getWeekNumber', () => {
    expect(adapter.getWeekNumber(testDateIso)).to.equal(33);
  });

  it('Method: getYearRange', () => {
    const anotherDate = adapter.setYear(testDateIso, 1400);
    const yearRange = adapter.getYearRange([testDateIso, anotherDate]);
    expect(yearRange).to.have.length(4);
  });
};
