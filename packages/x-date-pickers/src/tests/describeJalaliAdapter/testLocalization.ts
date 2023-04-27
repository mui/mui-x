import { expect } from 'chai';
import { DescribeJalaliAdapterTestSuite } from './describeJalaliAdapter.types';

export const testLocalization: DescribeJalaliAdapterTestSuite = ({ adapter }) => {
  it('Method: formatNumber', () => {
    expect(adapter.formatNumber('1')).to.equal('۱');
    expect(adapter.formatNumber('2')).to.equal('۲');
  });

  it('Method: getMeridiemText', () => {
    expect(adapter.getMeridiemText('am')).to.equal('ق.ظ');
    expect(adapter.getMeridiemText('pm')).to.equal('ب.ظ');
  });
};
