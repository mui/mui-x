import * as React from 'react';
import { DescribeValidationInputOptions, DescribeValidationOptions } from '../describeValidation';

interface DescribeRangeValidationKeyboardOptions {
  inputValue?: (
    value: any,
    context?: {
      setEndDate?: boolean;
    },
  ) => void;
}

export interface DescribeRangeValidationInputOptions
  extends DescribeValidationInputOptions,
    DescribeRangeValidationKeyboardOptions {
  isSingleInput?: boolean;
  variant?: 'mobile' | 'desktop';
}

export interface DescribeRangeValidationOptions
  extends DescribeValidationOptions,
    DescribeRangeValidationKeyboardOptions {
  isSingleInput?: boolean;
}

export type DescribeRangeValidationTestSuite = (
  ElementToTest: React.ElementType,
  getOptions: () => DescribeRangeValidationOptions,
) => void;
