import { DescribeBuddhistAdapterTestSuite } from './describeBuddhistAdapter.types';

export const testLocalization: DescribeBuddhistAdapterTestSuite = ({ adapter }) => {
  it('Method: getCurrentLocaleCode', () => {
    // Returns the current locale (defaults to 'en' unless configured otherwise)
    expect(adapter.getCurrentLocaleCode()).to.be.a('string');
  });
};
