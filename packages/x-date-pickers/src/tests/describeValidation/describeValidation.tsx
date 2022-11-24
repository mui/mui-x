/* eslint-env mocha */
import * as React from 'react';
import { testDayViewValidation } from './testDayViewValidation';
import { testMonthViewValidation } from './testMonthViewValidation';
import { testTextFieldValidation } from './testTextFieldValidation';
import { testYearViewValidation } from './testYearViewValidation';
import { DescribeValidationInputOptions } from './describeValidation.types';

const TEST_SUITES = [
  testYearViewValidation,
  testMonthViewValidation,
  testDayViewValidation,
  testTextFieldValidation,
];

/**
 * Tests various aspects of the picker validation.
 */
export function describeValidation(
  ElementToTest: React.ElementType,
  getOptions: () => DescribeValidationInputOptions,
) {
  describe('Pickers validation API', () => {
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
