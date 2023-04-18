import { expect } from 'chai';
import { DescribeGregorianAdapterTestSuite } from './describeGregorianAdapter.types';

export const testLocalization: DescribeGregorianAdapterTestSuite = ({ adapter }) => {
  it('Method: formatNumber', () => {
    expect(adapter.formatNumber('1')).to.equal('1');
  });

  it('Method: getMeridiemText', () => {
    expect(adapter.getMeridiemText('am')).to.equal('AM');
    expect(adapter.getMeridiemText('pm')).to.equal('PM');
  });

  it('Method: getFormatHelperText', () => {
    expect(adapter.getFormatHelperText(adapter.formats.keyboardDate)).to.equal('mm/dd/yyyy');
    expect(adapter.getFormatHelperText(adapter.formats.keyboardDateTime12h)).to.equal(
      'mm/dd/yyyy hh:mm (a|p)m',
    );
  });
};
