import { expect } from 'chai';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';
import { DescribeHijriAdapterTestSuite } from './describeHijriAdapter.types';

export const testFormat: DescribeHijriAdapterTestSuite = ({ adapter }) => {
  testSkipIf(!isJSDOM)('should format the seconds without leading zeroes for format "s"', () => {
    const date = adapter.date('2020-01-01T23:44:09.000Z')!;
    expect(adapter.formatByString(date, 's')).to.equal('٩');
  });
};
