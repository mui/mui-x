import * as React from 'react';
import {
  DescribeValidationInputOptions,
  DescribeValidationOptions,
} from '@mui/x-date-pickers/tests/describeValidation';

export interface DescribeRangeValidationInputOptions extends DescribeValidationInputOptions {
  isSingleInput?: boolean;
}

export interface DescribeRangeValidationOptions extends DescribeValidationOptions {
  isSingleInput?: boolean;
}

export type DescribeRangeValidationTestSuite = (
  ElementToTest: React.ElementType,
  getOptions: () => DescribeRangeValidationOptions,
) => void;
