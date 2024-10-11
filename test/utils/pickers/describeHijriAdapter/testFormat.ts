import { expect } from 'chai';
import { DescribeHijriAdapterTestSuite } from './describeHijriAdapter.types';

export const testFormat: DescribeHijriAdapterTestSuite = ({ adapter }) => {
  it('should format the seconds without leading zeroes for format "s"', (t = {}) => {
    if (process.env.MUI_BROWSER === 'true') {
      // @ts-expect-error to support mocha and vitest
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      t?.skip();
    }
    const date = adapter.date('2020-01-01T23:44:09.000Z')!;
    expect(adapter.formatByString(date, 's')).to.equal('٩');
  });
};
