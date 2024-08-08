/* eslint-env mocha */
import * as React from 'react';
import createDescribe from '@mui/internal-test-utils/createDescribe';
import { testDayViewRangeValidation } from './testDayViewRangeValidation';
import { testTextFieldRangeValidation } from './testTextFieldRangeValidation';
import { DescribeRangeValidationInputOptions } from './describeRangeValidation.types';
import { testTextFieldKeyboardRangeValidation } from './testTextFieldKeyboardRangeValidation';

const TEST_SUITES = [
  testDayViewRangeValidation,
  testTextFieldRangeValidation,
  testTextFieldKeyboardRangeValidation,
];

function innerDescribeRangeValidation(
  ElementToTest: React.ElementType,
  getOptions: () => DescribeRangeValidationInputOptions,
) {
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
}

/**
 * Tests various aspects of the range picker validation.
 */
export const describeRangeValidation = createDescribe(
  'Range pickers validation API',
  innerDescribeRangeValidation,
);
