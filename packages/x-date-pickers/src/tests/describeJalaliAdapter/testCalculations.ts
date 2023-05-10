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

  it('Method: getYear', () => {
    expect(adapter.getYear(testDateIso)).to.equal(1397);
  });

  it('Method: getMonth', () => {
    expect(adapter.getMonth(testDateIso)).to.equal(7);
  });

  it('Method: getDate', () => {
    expect(adapter.getDate(testDateIso)).to.equal(8);
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

  it('Method: getNextMonth', () => {
    expect(adapter.getNextMonth(testDateIso)).toEqualDateTime('2018-11-29T11:44:00.000Z');
  });

  it('Method: getPreviousMonth', () => {
    expect(adapter.getPreviousMonth(testDateIso)).toEqualDateTime(
      new Date('2018-09-30T11:44:00.000Z'),
    );
  });

  it('Method: getMonthArray', () => {
    const monthArray = adapter.getMonthArray(testDateIso);
    let expectedDate = adapter.date('2018-03-21T00:00:00.000Z')!;

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
    // TODO: AdapterDateFnsJalali `getWeekDays` method seems broken
    // Same behavior with the date-io adapter.
    expect(adapter.getWeekdays()).to.deep.equal(
      adapter.lib === 'date-fns-jalali'
        ? ['ش', '1ش', '2ش', '3ش', '4ش', '5ش', 'ج']
        : ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
    );
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
    expect(adapter.getWeekNumber!(testDateIso)).to.equal(33);
  });

  it('Method: getYearRange', () => {
    const anotherDate = adapter.setYear(testDateIso, 1400);
    const yearRange = adapter.getYearRange(testDateIso, anotherDate);
    expect(yearRange).to.have.length(4);
  });
};
