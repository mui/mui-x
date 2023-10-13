import { expect } from 'chai';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { DescribeGregorianAdapterTestSuite } from './describeGregorianAdapter.types';

export const testFormat: DescribeGregorianAdapterTestSuite = ({ adapter }) => {
  const expectDate = (format: keyof AdapterFormats, expected: string) => {
    const date = adapter.date('2020-01-01T23:44:00.000Z')!;
    const result = adapter.format(date, format);

    expect(result).to.equal(expected);
  };

  it('should correctly format standalone hardcoded formats', () => {
    expectDate('normalDate', '1 January');
    expectDate('normalDateWithWeekday', 'Wed, Jan 1');
    expectDate('shortDate', 'Jan 1');
    expectDate('year', '2020');
    expectDate('month', 'January');
    expectDate('monthAndDate', 'January 1');
    expectDate('weekday', 'Wednesday');
    expectDate('weekdayShort', 'Wed');
    expectDate('dayOfMonth', '1');
    expectDate('fullTime12h', '11:44 PM');
    expectDate('fullTime24h', '23:44');
    expectDate('hours12h', '11');
    expectDate('hours24h', '23');
    expectDate('minutes', '44');
    expectDate('seconds', '00');
  });
};
