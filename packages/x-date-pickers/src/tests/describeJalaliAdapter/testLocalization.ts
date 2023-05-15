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

  it('Method: getFormatHelperText', () => {
    expect(adapter.getFormatHelperText(adapter.formats.keyboardDate)).to.equal('yyyy/mm/dd');
    expect(adapter.getFormatHelperText(adapter.formats.keyboardDateTime12h)).to.equal(
      'yyyy/mm/dd hh:mm (a|p)m',
    );
  });

  it('Method: getCurrentLocaleCode', () => {
    // Returns the default locale
    expect(adapter.getCurrentLocaleCode()).to.match(/fa/);
  });
};
