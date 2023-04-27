import { expect } from 'chai';
import { DescribeJalaliAdapterTestSuite } from './describeJalaliAdapter.types';
import { TEST_DATE_ISO } from '../describeGregorianAdapter';

export const testCalculations: DescribeJalaliAdapterTestSuite = ({ adapter, testDate }) => {
  it('Method: date', () => {
    expect(adapter.date(null)).to.equal(null);
  });

  it('Method: parse', () => {
    expect(adapter.parse('', adapter.formats.keyboardDate)).to.equal(null);
    expect(adapter.parse('01/01/1395', adapter.formats.keyboardDate)).not.to.equal(null);
  });

  it('Method: isEqual', () => {
    const anotherDate = adapter.date(TEST_DATE_ISO);

    expect(adapter.isEqual(testDate, anotherDate)).to.equal(true);
    expect(adapter.isEqual(null, null)).to.equal(true);
  });

  it('Method: isAfterYear', () => {
    const afterYear = adapter.addYears(testDate, 2);
    expect(adapter.isAfterYear(afterYear, testDate)).to.equal(true);
  });

  it('Method: isBeforeYear', () => {
    const afterYear = adapter.addYears(testDate, 2);
    expect(adapter.isBeforeYear(testDate, afterYear)).to.equal(true);
  });

  it('Method: startOfYear', () => {
    expect(adapter.startOfYear(testDate)).toEqualDateTime(new Date('2018-03-21T00:00:00.000Z'));
  });

  it('Method: startOfMonth', () => {
    expect(adapter.startOfMonth(testDate)).toEqualDateTime(new Date('2018-10-23T00:00:00.000Z'));
  });

  it('Method: endOfYear', () => {
    expect(adapter.endOfYear(testDate)).toEqualDateTime(new Date('2019-03-20T23:59:59.999Z'));
  });

  it('Method: endOfMonth', () => {
    expect(adapter.endOfMonth(testDate)).toEqualDateTime(new Date('2018-11-21T23:59:59.999Z'));
  });

  it('Method: getYear', () => {
    expect(adapter.getYear(testDate)).to.equal(1397);
  });

  it('Method: getMonth', () => {
    expect(adapter.getMonth(testDate)).to.equal(7);
  });

  it('Method: getDate', () => {
    expect(adapter.getDate(testDate)).to.equal(8);
  });

  it('Method: setYear', () => {
    expect(adapter.setYear(testDate, 1398)).toEqualDateTime(new Date('2019-10-30T11:44:00.000Z'));
  });

  it('Method: setDate', () => {
    expect(adapter.setDate(testDate, 9)).toEqualDateTime(new Date('2018-10-31T11:44:00.000Z'));
  });

  it('Method: getNextMonth', () => {
    expect(adapter.getNextMonth(testDate)).toEqualDateTime(new Date('2018-11-29T11:44:00.000Z'));
  });

  it('Method: getPreviousMonth', () => {
    expect(adapter.getPreviousMonth(testDate)).toEqualDateTime(
      new Date('2018-09-30T11:44:00.000Z'),
    );
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
    const weekArray = adapter.getWeekArray(testDate);
    const expectedDate = new Date('2018-10-20T00:00:00.000Z');

    weekArray.forEach((week) => {
      week.forEach((day) => {
        expect(day).toEqualDateTime(expectedDate);
        expectedDate.setDate(expectedDate.getDate() + 1);
      });
    });
  });

  it('Method: getWeekNumber', () => {
    expect(adapter.getWeekNumber!(testDate)).to.equal(33);
  });

  it('Method: getYearRange', () => {
    const anotherDate = adapter.setYear(testDate, 1400);
    const yearRange = adapter.getYearRange(testDate, anotherDate);
    expect(yearRange).to.have.length(4);
  });
};
