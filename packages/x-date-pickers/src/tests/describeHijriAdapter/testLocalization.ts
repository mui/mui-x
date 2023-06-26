import { expect } from 'chai';
import { DescribeHijriAdapterTestSuite } from './describeHijriAdapter.types';

export const testLocalization: DescribeHijriAdapterTestSuite = ({ adapter }) => {
  it('Method: formatNumber', () => {
    expect(adapter.formatNumber('1')).to.equal('١');
    expect(adapter.formatNumber('2')).to.equal('٢');
  });

  it('Method: getMeridiemText', () => {
    expect(adapter.getMeridiemText('am')).to.equal('ص');
    expect(adapter.getMeridiemText('pm')).to.equal('م');
  });

  it('Method: getFormatHelperText', () => {
    expect(adapter.getFormatHelperText(adapter.formats.keyboardDate)).to.equal('yyyy/mm/dd');
    expect(adapter.getFormatHelperText(adapter.formats.keyboardDateTime12h)).to.equal(
      'yyyy/mm/dd hh:mm (a|p)m',
    );
  });

  it('Method: getCurrentLocaleCode', () => {
    // Returns the default locale
    expect(adapter.getCurrentLocaleCode()).to.match(/ar/);
  });
};
