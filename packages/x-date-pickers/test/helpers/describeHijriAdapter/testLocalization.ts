import { expect } from 'chai';
import { DescribeHijriAdapterTestSuite } from './describeHijriAdapter.types';

export const testLocalization: DescribeHijriAdapterTestSuite = ({ adapter }) => {
  it('Method: formatNumber', () => {
    expect(adapter.formatNumber('1')).to.equal('١');
    expect(adapter.formatNumber('2')).to.equal('٢');
  });

  it('Method: getCurrentLocaleCode', () => {
    // Returns the default locale
    expect(adapter.getCurrentLocaleCode()).to.match(/ar/);
  });
};
