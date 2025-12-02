import * as React from 'react';
import { DescribeValidationInputOptions, DescribeValidationOptions } from '../describeValidation';

interface DescribeRangeValidationKeyboardOptions {
  setValue?: (
    value: any,
    context?: {
      setEndDate?: boolean;
    },
  ) => void;
}

export interface DescribeRangeValidationInputOptions
  extends DescribeValidationInputOptions,
    DescribeRangeValidationKeyboardOptions {
  fieldType: 'single-input' | 'multi-input' | 'no-input';
}

export interface DescribeRangeValidationOptions
  extends DescribeValidationOptions,
    DescribeRangeValidationKeyboardOptions {
  fieldType: 'single-input' | 'multi-input' | 'no-input';
}

export type DescribeRangeValidationTestSuite = (
  ElementToTest: React.ElementType,
  getOptions: () => DescribeRangeValidationOptions,
) => void;
