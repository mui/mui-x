import { expect } from 'chai';
import { DescribeJalaliAdapterTestSuite } from './describeJalaliAdapter.types';

export const testLocalization: DescribeJalaliAdapterTestSuite = ({ adapter }) => {
  it('Method: formatNumber', () => {
    expect(adapter.formatNumber('1')).to.equal('۱');
    expect(adapter.formatNumber('2')).to.equal('۲');
  });

  it('Method: getCurrentLocaleCode', () => {
    // Returns the default locale
    expect(adapter.getCurrentLocaleCode()).to.match(/fa/);
  });
};
