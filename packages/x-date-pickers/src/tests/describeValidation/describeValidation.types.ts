import * as React from 'react';
import { MuiRenderResult, createRenderer } from '@mui/monorepo/test/utils/createRenderer';
import { DateOrTimeView } from '@mui/x-date-pickers/models';
import { PickerComponentFamily } from '../describe.types';

export interface DescribeValidationInputOptions {
  render: (node: React.ReactElement) => MuiRenderResult;
  // TODO: Export `Clock` from monorepo
  clock: ReturnType<typeof createRenderer>['clock'];
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
