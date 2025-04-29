import * as React from 'react';
import { MuiRenderResult } from '@mui/internal-test-utils/createRenderer';
import { DateOrTimeView } from '@mui/x-date-pickers/models';
import { PickerComponentFamily } from '../describe.types';

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
