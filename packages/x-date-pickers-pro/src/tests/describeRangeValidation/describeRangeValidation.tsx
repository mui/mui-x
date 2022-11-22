/* eslint-env mocha */
import * as React from 'react';
// import { testDayViewRangeValidation  from './testDayViewRangeValidation';
import { testTextFieldRangeValidation } from './testTextFieldRangeValidation';
import { DescribeRangeValidationInputOptions } from './describeRangeValidation.types';

const TEST_SUITES = [
  // testDayViewRangeValidation,
  testTextFieldRangeValidation,
];

/**
 * Tests various aspects of the range picker validation.
 */
export function describeRangeValidation(
  ElementToTest: React.ElementType,
  getOptions: () => DescribeRangeValidationInputOptions,
) {
  describe('Range pickers validation API', () => {
    const { after: runAfterHook = () => {}, views } = getOptions();

    after(runAfterHook);

    function getTestOptions() {
      return {
        ...getOptions(),
        withDate: views.includes('year') || views.includes('month') || views.includes('day'),
        withTime: views.includes('hours') || views.includes('minutes') || views.includes('seconds'),
      };
    }

    TEST_SUITES.forEach((testSuite) => {
      testSuite(ElementToTest, getTestOptions);
    });
  });
}
