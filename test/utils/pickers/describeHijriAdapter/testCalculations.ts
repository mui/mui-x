import { expect } from 'chai';
import { DescribeHijriAdapterTestSuite } from './describeHijriAdapter.types';
import { TEST_DATE_ISO_STRING } from '../describeGregorianAdapter';

export const testCalculations: DescribeHijriAdapterTestSuite = ({ adapter }) => {
  const testDateIso = adapter.date(TEST_DATE_ISO_STRING)!;

  it('Method: date', () => {
    expect(adapter.date(null)).to.equal(null);
  });

  it('Method: parse', () => {
    expect(adapter.parse('', 'iYYYY/iM/iD')).to.equal(null);
    expect(adapter.parse('01/01/1395', 'iYYYY/iM/iD')).not.to.equal(null);
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
    expect(adapter.startOfYear(testDateIso)).toEqualDateTime('2018-09-11T00:00:00.000Z');
  });

  it('Method: startOfWeek', () => {
    expect(adapter.startOfWeek(testDateIso)).toEqualDateTime('2018-10-28T00:00:00.000Z');
  });

  it('Method: startOfDay', () => {
    expect(adapter.startOfDay(testDateIso)).toEqualDateTime('2018-10-30T00:00:00.000Z');
  });

  it('Method: startOfMonth', () => {
    expect(adapter.startOfMonth(testDateIso)).toEqualDateTime('2018-10-10T00:00:00.000Z');
  });

  it('Method: endOfYear', () => {
    expect(adapter.endOfYear(testDateIso)).toEqualDateTime('2019-08-30T23:59:59.999Z');
  });

  it('Method: endOfMonth', () => {
    expect(adapter.endOfMonth(testDateIso)).toEqualDateTime('2018-11-08T23:59:59.999Z');
  });

  it('Method: endOfWeek', () => {
    expect(adapter.endOfWeek(testDateIso)).toEqualDateTime('2018-11-03T23:59:59.999Z');
  });

  it('Method: endOfDay', () => {
    expect(adapter.endOfDay(testDateIso)).toEqualDateTime('2018-10-30T23:59:59.999Z');
  });

  it('Method: addYears', () => {
    expect(adapter.addYears(testDateIso, 2)).toEqualDateTime('2020-10-08T11:44:00.000Z');
    expect(adapter.addYears(testDateIso, -2)).toEqualDateTime('2016-11-21T11:44:00.000Z');
  });

  it('Method: addMonths', () => {
    expect(adapter.addMonths(testDateIso, 2)).toEqualDateTime('2018-12-28T11:44:00.000Z');
    expect(adapter.addMonths(testDateIso, -2)).toEqualDateTime('2018-09-01T11:44:00.000Z');
    expect(adapter.addMonths(testDateIso, 3)).toEqualDateTime('2019-01-27T11:44:00.000Z');
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
    expect(adapter.getYear(testDateIso)).to.equal(1440);
  });

  it('Method: getMonth', () => {
    expect(adapter.getMonth(testDateIso)).to.equal(1);
  });

  it('Method: getDate', () => {
    expect(adapter.getDate(testDateIso)).to.equal(21);
  });

  it('Method: setYear', () => {
    expect(adapter.setYear(testDateIso, 1441)).toEqualDateTime('2019-10-20T11:44:00.000Z');
  });

  it('Method: setMonth', () => {
    expect(adapter.setMonth(testDateIso, 4)).toEqualDateTime('2019-01-27T11:44:00.000Z');
  });

  it('Method: setDate', () => {
    expect(adapter.setDate(testDateIso, 22)).toEqualDateTime('2018-10-31T11:44:00.000Z');
  });

  it('Method: getWeekArray', () => {
    const weekArray = adapter.getWeekArray(testDateIso);
    const expectedDate = new Date('2018-10-07T00:00:00.000Z');

    weekArray.forEach((week) => {
      week.forEach((day) => {
        expect(day).toEqualDateTime(expectedDate);
        expectedDate.setDate(expectedDate.getDate() + 1);
      });
    });
  });

  it('Method: getWeekNumber', () => {
    expect(adapter.getWeekNumber(testDateIso)).to.equal(8);
  });

  describe('Method: getYearRange', () => {
    it('Minimum limit', () => {
      const anotherYear = adapter.setYear(testDateIso, 1355);

      expect(() => adapter.getYearRange([anotherYear, testDateIso])).to.throw(
        'min date must be on or after 1356-01-01 H (1937-03-14)',
      );
    });

    it('Maximum limit', () => {
      const anotherYear = adapter.setYear(testDateIso, 1500);

      expect(() => adapter.getYearRange([testDateIso, anotherYear])).to.throw(
        'max date must be on or before 1499-12-29 H (2076-11-26)',
      );
    });
  });

  it('Method: getYearRange', () => {
    const anotherDate = adapter.setYear(testDateIso, 1445);
    const yearRange = adapter.getYearRange([testDateIso, anotherDate]);
    expect(yearRange).to.have.length(6);
  });
};
