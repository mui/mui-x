/* eslint-env mocha */
import * as React from 'react';
import createDescribe from '@mui/monorepo/test/utils/createDescribe';
import { testDayViewValidation } from './testDayViewValidation';
import { testMonthViewValidation } from './testMonthViewValidation';
import { testTextFieldValidation } from './testTextFieldValidation';
import { testYearViewValidation } from './testYearViewValidation';
import { DescribeValidationInputOptions } from './describeValidation.types';
import { testMinutesViewValidation } from './testMinutesViewValidation';

const TEST_SUITES = [
  testYearViewValidation,
  testMonthViewValidation,
  testDayViewValidation,
  testMinutesViewValidation,
  testTextFieldValidation,
];

function innerDescribeValidation(
  ElementToTest: React.ElementType,
  getOptions: () => DescribeValidationInputOptions,
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
 * Tests various aspects of the picker validation.
 */
export const describeValidation = createDescribe('Pickers validation API', innerDescribeValidation);
