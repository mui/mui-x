import { expect } from 'chai';
import { DescribeJalaliAdapterTestSuite } from './describeJalaliAdapter.types';

export const testFormat: DescribeJalaliAdapterTestSuite = ({ adapter }) => {
  it('should format the seconds without leading zeroes for format "s"', () => {
    const date = adapter.date('2020-01-01T23:44:09.000Z')!;
    // Should be either ۹ or 9 depending on the config of the adapter.
    expect(adapter.formatByString(date, 's').replace('9', '۹')).to.equal('۹');
  });
};
