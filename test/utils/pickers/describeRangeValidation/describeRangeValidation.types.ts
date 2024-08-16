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
  isSingleInput?: boolean;
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
