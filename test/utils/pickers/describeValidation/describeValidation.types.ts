import type * as React from 'react';
import type { MuiRenderResult } from '@mui/internal-test-utils/createRenderer';
import type { DateOrTimeView } from '@mui/x-date-pickers/models';
import type { PickerComponentFamily } from '../describe.types';

export interface DescribeValidationInputOptions {
  render: (node: React.ReactElement<any>) => MuiRenderResult;
  after?: () => void;
  componentFamily: PickerComponentFamily;
  views: DateOrTimeView[];
  variant?: 'mobile' | 'desktop';
}

export interface DescribeValidationOptions extends DescribeValidationInputOptions {
  withDate: boolean;
  withTime: boolean;
}

export type DescribeValidationTestSuite = (
  ElementToTest: React.ElementType,
  getOptions: () => DescribeValidationOptions,
) => void;
