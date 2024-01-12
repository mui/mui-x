import { expect } from 'chai';
import { DescribeJalaliAdapterTestSuite } from './describeJalaliAdapter.types';

export const testFormat: DescribeJalaliAdapterTestSuite = ({ adapter }) => {
  it.only('should format the seconds without leading zeroes for format "s"', () => {
    const date = adapter.date('2020-01-01T23:44:09.000Z')!;
    expect(adapter.formatByString(date, 's')).to.equal('9');
  });
};
