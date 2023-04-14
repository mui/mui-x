import { expect } from 'chai';
import { DescribeGregorianAdapterTestSuite } from './describeGregorianAdapter.types';

export const testCalculations: DescribeGregorianAdapterTestSuite = ({
  adapter,
  testDate,
  testDateISO,
  formatDateTime,
}) => {
  it('Method: date', () => {
    // ISO string
    expect(adapter.isEqual(testDate, adapter.date(testDateISO))).to.equal(true);

    // Native Date
    expect(adapter.isEqual(testDate, adapter.date(new Date(testDateISO)))).to.equal(true);

    // Parse already date-specific object
    expect(adapter.isEqual(testDate, adapter.date(adapter.date(testDateISO)))).to.equal(true);

    // Parse null inputs
    expect(adapter.date(null)).to.equal(null);

    // Undefined
    expect(!!adapter.date(undefined)).to.equal(true);
  });

  it('Method: isValid', () => {
    const invalidDate = adapter.date('2018-42-30T11:60:00.000Z');

    expect(adapter.isValid(testDate)).to.equal(true);
    expect(adapter.isValid(invalidDate)).to.equal(false);
    expect(adapter.isValid(undefined)).to.equal(true);
    expect(adapter.isValid(null)).to.equal(false);
    expect(adapter.isValid('2018-42-30T11:60:00.000Z')).to.equal(false);
  });

  it('Method: addYears', () => {
    expect(adapter.format(adapter.addYears(testDate, 2), 'year')).to.equal('2020');
    expect(adapter.format(adapter.addYears(testDate, -2), 'year')).to.equal('2016');
  });

  it('Method: addMonths', () => {
    expect(adapter.format(adapter.addMonths(testDate, 2), 'monthAndYear')).to.equal(
      'December 2018',
    );
    expect(adapter.format(adapter.addMonths(testDate, -2), 'monthAndYear')).to.equal('August 2018');
  });

  it('Method: addWeeks', () => {
    expect(adapter.getDiff(adapter.addWeeks(testDate, 1), testDate, 'weeks')).to.equal(1);
    expect(adapter.getDiff(adapter.addWeeks(testDate, -1), testDate, 'weeks')).to.equal(-1);
  });

  it('Method: addDays', () => {
    expect(adapter.format(adapter.addDays(testDate, 1), 'dayOfMonth')).to.equal('31');
    expect(adapter.format(adapter.addDays(testDate, -1), 'dayOfMonth')).to.equal('29');
  });

  it('Method: addHours', () => {
    expect(adapter.format(adapter.addHours(testDate, 65), 'hours24h')).to.equal('04');
    expect(adapter.format(adapter.addHours(testDate, -5), 'hours24h')).to.equal('06');
  });

  it('Method: addMinutes', () => {
    expect(adapter.format(adapter.addMinutes(testDate, 65), 'minutes')).to.equal('49');
    expect(adapter.format(adapter.addMinutes(testDate, -5), 'minutes')).to.equal('39');
  });

  it('Method: addSeconds', () => {
    expect(adapter.format(adapter.addSeconds(testDate, 65), 'seconds')).to.equal('05');
    expect(adapter.format(adapter.addSeconds(testDate, -5), 'seconds')).to.equal('55');
  });

  it('Method: startOfYear', () => {
    expect(adapter.formatByString(adapter.startOfYear(testDate), formatDateTime)).to.equal(
      '2018-01-01 00:00:00',
    );
  });

  it('Method: startOfMonth', () => {
    expect(adapter.formatByString(adapter.startOfMonth(testDate), formatDateTime)).to.equal(
      '2018-10-01 00:00:00',
    );
  });

  it('Method: startOfWeek', () => {
    expect(adapter.formatByString(adapter.startOfWeek(testDate), formatDateTime)).to.equal(
      adapter.lib === 'luxon' ? '2018-10-29 00:00:00' : '2018-10-28 00:00:00',
    );

    // Non ISO
    expect(
      adapter.formatByString(
        adapter.startOfWeek(adapter.date('2018-10-28T00:00:00.000Z')!),
        formatDateTime,
      ),
    ).to.equal(adapter.lib === 'luxon' ? '2018-10-22 00:00:00' : '2018-10-28 00:00:00');
  });

  it('Method: startOfDay', () => {
    expect(adapter.formatByString(adapter.startOfDay(testDate), formatDateTime)).to.equal(
      '2018-10-30 00:00:00',
    );
  });

  it('Method: endOfYear', () => {
    expect(adapter.formatByString(adapter.endOfYear(testDate), formatDateTime)).to.equal(
      '2018-12-31 23:59:59',
    );
  });

  it('Method: endOfMonth', () => {
    expect(adapter.formatByString(adapter.endOfMonth(testDate), formatDateTime)).to.equal(
      '2018-10-31 23:59:59',
    );
  });

  it('Method: endOfWeek', () => {
    expect(adapter.formatByString(adapter.endOfWeek(testDate), formatDateTime)).to.equal(
      adapter.lib === 'luxon' ? '2018-11-04 23:59:59' : '2018-11-03 23:59:59',
    );

    // Non ISO
    expect(
      adapter.formatByString(
        adapter.endOfWeek(adapter.date('2018-10-28T00:00:00.000Z')!),
        formatDateTime,
      ),
    ).to.equal(adapter.lib === 'luxon' ? '2018-10-28 23:59:59' : '2018-11-03 23:59:59');
  });

  it('Method: endOfDay', () => {
    expect(adapter.formatByString(adapter.endOfDay(testDate), formatDateTime)).to.equal(
      '2018-10-30 23:59:59',
    );
  });

  it('Method:getPreviousMonth', () => {
    expect(adapter.formatByString(adapter.getPreviousMonth(testDate), formatDateTime)).to.equal(
      '2018-09-30 11:44:00',
    );
  });

  it('Method:getMonthArray', () => {
    expect(
      adapter.getMonthArray(testDate).map((date) => adapter.formatByString(date, formatDateTime)),
    ).to.deep.equal([
      '2018-01-01 00:00:00',
      '2018-02-01 00:00:00',
      '2018-03-01 00:00:00',
      '2018-04-01 00:00:00',
      '2018-05-01 00:00:00',
      '2018-06-01 00:00:00',
      '2018-07-01 00:00:00',
      '2018-08-01 00:00:00',
      '2018-09-01 00:00:00',
      '2018-10-01 00:00:00',
      '2018-11-01 00:00:00',
      '2018-12-01 00:00:00',
    ]);
  });

  it('Method:getNextMonth', () => {
    expect(adapter.formatByString(adapter.getNextMonth(testDate), formatDateTime)).to.equal(
      '2018-11-30 11:44:00',
    );
  });

  it('Method:getHours', () => {
    expect(adapter.getHours(testDate)).to.equal(new Date(testDateISO).getHours());
  });

  it('Method:getMinutes', () => {
    expect(adapter.getMinutes(testDate)).to.equal(44);
  });

  it('Method:getSeconds', () => {
    expect(adapter.getSeconds(testDate)).to.equal(0);
  });

  it('Method:getDate', () => {
    expect(adapter.getDate(testDate)).to.equal(30);
  });

  it('Method:getYear', () => {
    expect(adapter.getYear(testDate)).to.equal(2018);
  });

  it('Method:getMonth', () => {
    expect(adapter.getMonth(testDate)).to.equal(9);
  });

  it('Method:getDaysInMonth', () => {
    expect(adapter.getDaysInMonth(testDate)).to.equal(31);
  });

  it('Method:setMonth', () => {
    const updatedTime = adapter.formatByString(adapter.setMonth(testDate, 4), formatDateTime);
    expect(updatedTime).to.equal('2018-05-30 11:44:00');
  });

  it('Method:setHours', () => {
    const updatedTime = adapter.formatByString(adapter.setHours(testDate, 0), formatDateTime);
    expect(updatedTime).to.equal('2018-10-30 00:44:00');
  });

  it('Method:setMinutes', () => {
    const updatedTime = adapter.formatByString(adapter.setMinutes(testDate, 12), formatDateTime);
    expect(updatedTime).to.equal('2018-10-30 11:12:00');
  });

  it('Method:setMinutes', () => {
    const updatedTime = adapter.formatByString(adapter.setMinutes(testDate, 12), formatDateTime);
    expect(updatedTime).to.equal('2018-10-30 11:12:00');
  });

  it('Method:setYear', () => {
    const updatedTime = adapter.formatByString(adapter.setYear(testDate, 2011), formatDateTime);
    expect(updatedTime).to.equal('2011-10-30 11:44:00');
  });

  it('Method:setDate', () => {
    const updatedTime = adapter.formatByString(adapter.setDate(testDate, 15), formatDateTime);
    expect(updatedTime).to.equal('2018-10-15 11:44:00');
  });

  it('Method:setSeconds', () => {
    const updatedValue = adapter.formatByString(adapter.setSeconds(testDate, 11), formatDateTime);

    expect(updatedValue).to.equal('2018-10-30 11:44:11');
  });

  it('Method:isAfter', () => {
    expect(adapter.isAfter(adapter.date()!, testDate)).to.equal(true);
    expect(adapter.isAfter(testDate, adapter.date()!)).to.equal(false);
  });

  it('Method:isBefore', () => {
    expect(adapter.isBefore(testDate, adapter.date()!)).to.equal(true);
    expect(adapter.isBefore(adapter.date()!, testDate)).to.equal(false);
  });

  it('Method:isAfterDay', () => {
    const nextDay = adapter.addDays(testDate, 1);

    expect(adapter.isAfterDay(nextDay, testDate)).to.equal(true);
    expect(adapter.isAfterDay(testDate, nextDay)).to.equal(false);
  });

  it('Method:isBeforeDay', () => {
    const previousDay = adapter.addDays(testDate, -1);

    expect(adapter.isBeforeDay(testDate, previousDay)).to.equal(false);
    expect(adapter.isBeforeDay(previousDay, testDate)).to.equal(true);
  });

  it('Method:isAfterYear', () => {
    const nextYear = adapter.setYear(testDate, 2019);

    expect(adapter.isAfterYear(nextYear, testDate)).to.equal(true);
    expect(adapter.isAfterYear(testDate, nextYear)).to.equal(false);
  });

  it('Method:isBeforeYear', () => {
    const previousYear = adapter.setYear(testDate, 2017);

    expect(adapter.isBeforeYear(testDate, previousYear)).to.equal(false);
    expect(adapter.isBeforeYear(previousYear, testDate)).to.equal(true);
  });

  it('Method:getWeekArray', () => {
    const weekArray = adapter.getWeekArray(testDate);

    expect(weekArray).to.have.length(5);
    weekArray.forEach((week) => {
      expect(week).to.have.length(7);
    });
  });

  it('Method:getYearRange', () => {
    const yearRange = adapter.getYearRange(testDate, adapter.setYear(testDate, 2124));

    expect(yearRange).to.have.length(107);
    expect(adapter.getYear(yearRange[yearRange.length - 1])).to.equal(2124);

    const emptyYearRange = adapter.getYearRange(
      testDate,
      adapter.setYear(testDate, adapter.getYear(testDate) - 1),
    );

    expect(emptyYearRange).to.have.length(0);
  });

  it('Method: getDiff', () => {
    expect(adapter.getDiff(testDate, adapter.date('2018-10-29T11:44:00.000Z')!)).to.equal(86400000);
    expect(adapter.getDiff(testDate, adapter.date('2018-10-31T11:44:00.000Z')!)).to.equal(
      -86400000,
    );
    expect(adapter.getDiff(testDate, '2018-10-31T11:44:00.000Z')).to.equal(-86400000);

    // With units
    expect(adapter.getDiff(testDate, adapter.date('2017-09-29T11:44:00.000Z')!, 'years')).to.equal(
      1,
    );
    expect(adapter.getDiff(testDate, adapter.date('2018-08-29T11:44:00.000Z')!, 'months')).to.equal(
      2,
    );
    expect(
      adapter.getDiff(testDate, adapter.date('2018-05-29T11:44:00.000Z')!, 'quarters'),
    ).to.equal(1);
    expect(adapter.getDiff(testDate, adapter.date('2018-09-29T11:44:00.000Z')!, 'days')).to.equal(
      31,
    );
    expect(adapter.getDiff(testDate, adapter.date('2018-09-29T11:44:00.000Z')!, 'weeks')).to.equal(
      4,
    );
    expect(adapter.getDiff(testDate, adapter.date('2018-09-29T11:44:00.000Z')!, 'hours')).to.equal(
      744,
    );

    expect(
      adapter.getDiff(testDate, adapter.date('2018-09-29T11:44:00.000Z')!, 'minutes'),
    ).to.equal(44640);

    expect(
      adapter.getDiff(testDate, adapter.date('2018-10-30T10:44:00.000Z')!, 'seconds'),
    ).to.equal(3600);

    expect(
      adapter.getDiff(testDate, adapter.date('2018-10-30T10:44:00.000Z')!, 'milliseconds'),
    ).to.equal(3600000);
  });

  it('Method: mergeDateAndTime', () => {
    const mergedDate = adapter.mergeDateAndTime(
      testDate,
      adapter.date('2018-01-01T14:15:16.000Z')!,
    );

    expect(adapter.toJsDate(mergedDate).toISOString()).to.equal('2018-10-30T14:15:16.000Z');
  });

  it('Method: isEqual', () => {
    expect(adapter.isEqual(adapter.date(null), null)).to.equal(true);
    expect(adapter.isEqual(testDate, adapter.date(testDateISO))).to.equal(true);
    expect(adapter.isEqual(null, adapter.date(testDateISO))).to.equal(false);
  });

  it('Method: parseISO', () => {
    const parsedDate = adapter.parseISO(testDateISO);
    const outputtedISO = adapter.toISO(parsedDate);

    if (adapter.lib === 'date-fns') {
      // date-fns never suppress useless milliseconds in the end
      expect(outputtedISO).to.equal(testDateISO.replace('.000Z', 'Z'));
    } else if (adapter.lib === 'luxon') {
      // luxon does not shorthand +00:00 to Z, which is also valid ISO string
      expect(outputtedISO).to.equal(testDateISO.replace('Z', '+00:00'));
    } else {
      expect(outputtedISO).to.equal(testDateISO);
    }
  });

  it('Method: parse', () => {
    const parsedDate = adapter.parse('2018-10-30 11:44:00', formatDateTime);
    expect(adapter.isEqual(parsedDate, testDate)).to.equal(true);
    expect(adapter.parse('', formatDateTime)).to.equal(null);

    // Invalid input
    const invalidateParsedDate = adapter.parse('99-99-9999', formatDateTime);
    expect(adapter.isValid(invalidateParsedDate)).to.equal(false);
  });

  it('Method: isNull', () => {
    expect(adapter.isNull(null)).to.equal(true);
    expect(adapter.isNull(testDate)).to.equal(false);
  });

  it('Method: isSameDay', () => {
    expect(adapter.isSameDay(testDate, adapter.date('2018-10-30T00:00:00.000Z')!)).to.equal(true);
    expect(adapter.isSameDay(testDate, adapter.date('2019-10-30T00:00:00.000Z')!)).to.equal(false);
  });

  it('Method: isSameMonth', () => {
    expect(adapter.isSameMonth(testDate, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(true);
    expect(adapter.isSameMonth(testDate, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(
      false,
    );
  });

  it('Method: isSameYear', () => {
    expect(adapter.isSameYear(testDate, adapter.date('2018-10-01T00:00:00.000Z')!)).to.equal(true);
    expect(adapter.isSameYear(testDate, adapter.date('2019-10-01T00:00:00.000Z')!)).to.equal(false);
  });

  it('Method: isSameHour', () => {
    expect(adapter.isSameHour(testDate, adapter.date(testDateISO)!)).to.equal(true);
    expect(adapter.isSameHour(testDate, adapter.addDays(adapter.date(testDateISO)!, 5))).to.equal(
      false,
    );
  });

  it('Method: getCurrentLocaleCode', () => {
    // Returns the default location
    expect(adapter.getCurrentLocaleCode()).to.match(/en/);
  });

  it('Method: toJsDate', () => {
    expect(adapter.toJsDate(testDate)).to.be.instanceOf(Date);
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

    // Should use inclusivity of range
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
  });
};
