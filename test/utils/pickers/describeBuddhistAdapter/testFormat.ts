import { DescribeBuddhistAdapterTestSuite } from './describeBuddhistAdapter.types';
import { TEST_DATE_ISO_STRING } from '../describeGregorianAdapter';

export const testFormat: DescribeBuddhistAdapterTestSuite = ({ adapter }) => {
  const testDateIso = adapter.date(TEST_DATE_ISO_STRING)!;

  it('should format with Buddhist year using BBBB token', () => {
    // 2018 + 543 = 2561
    expect(adapter.formatByString(testDateIso, 'DD/MM/BBBB')).to.equal('30/10/2561');
  });

  it('should use BBBB format for year by default', () => {
    expect(adapter.formats.year).to.equal('BBBB');
  });

  it('should format fullDate with Buddhist year', () => {
    const formatted = adapter.format(testDateIso, 'fullDate');
    expect(formatted).to.include('2561');
  });
};
