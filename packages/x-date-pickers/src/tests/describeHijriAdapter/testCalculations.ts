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

  it('Method: isAfterYear', () => {
    const afterYear = adapter.addYears(testDateIso, 2);
    expect(adapter.isAfterYear(afterYear, testDateIso)).to.equal(true);
  });

  it('Method: isBeforeYear', () => {
    const afterYear = adapter.addYears(testDateIso, 2);
    expect(adapter.isBeforeYear(testDateIso, afterYear)).to.equal(true);
  });

  it('Method: startOfYear', () => {
    expect(adapter.startOfYear(testDateIso)).toEqualDateTime('2018-09-11T00:00:00.000Z');
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

  it('Method: setDate', () => {
    expect(adapter.setDate(testDateIso, 22)).toEqualDateTime('2018-10-31T11:44:00.000Z');
  });

  it('Method: getNextMonth', () => {
    expect(adapter.getNextMonth(testDateIso)).toEqualDateTime('2018-11-29T11:44:00.000Z');
  });

  it('Method: getPreviousMonth', () => {
    expect(adapter.getPreviousMonth(testDateIso)).toEqualDateTime(
      new Date('2018-10-01T11:44:00.000Z'),
    );
  });

  it('Method: getMonthArray', () => {
    const monthArray = adapter.getMonthArray(testDateIso);
    let expectedDate = adapter.date('2018-09-11T00:00:00.000Z')!;

    monthArray.forEach((month) => {
      expect(month).toEqualDateTime(expectedDate);
      expectedDate = adapter.addMonths(expectedDate, 1)!;
    });
  });

  it('Method: getWeekdays', () => {
    expect(adapter.getWeekdays()).to.deep.equal(['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']);
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
    expect(adapter.getWeekNumber!(testDateIso)).to.equal(8);
  });

  describe('Method: getYearRange', () => {
    it('Minimum limit', () => {
      const anotherYear = adapter.setYear(testDateIso, 1355);

      expect(() => adapter.getYearRange(anotherYear, testDateIso)).to.throw(
        'min date must be on or after 1356-01-01 H (1937-03-14)',
      );
    });

    it('Maximum limit', () => {
      const anotherYear = adapter.setYear(testDateIso, 1500);

      expect(() => adapter.getYearRange(testDateIso, anotherYear)).to.throw(
        'max date must be on or before 1499-12-29 H (2076-11-26)',
      );
    });
  });

  it('Method: getYearRange', () => {
    const anotherDate = adapter.setYear(testDateIso, 1445);
    const yearRange = adapter.getYearRange(testDateIso, anotherDate);
    expect(yearRange).to.have.length(6);
  });
};
