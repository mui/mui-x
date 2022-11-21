import * as React from 'react';
import { MuiRenderResult, createRenderer } from '@mui/monorepo/test/utils/createRenderer';
import { DateOrTimeView } from '@mui/x-date-pickers/internals';

type DescribeValidationComponentFamily =
  | 'legacy-picker'
  | 'new-picker'
  | 'field'
  | 'calendar'
  | 'clock'
  | 'new-static-picker'
  | 'legacy-static-picker';

export interface DescribeValidationInputOptions {
  render: (node: React.ReactElement) => MuiRenderResult;
  // TODO: Export `Clock` from monorepo
  clock: ReturnType<typeof createRenderer>['clock'];
  after?: () => void;
  componentFamily: DescribeValidationComponentFamily;
  views: DateOrTimeView[];
}

export interface DescribeValidationOptions extends DescribeValidationInputOptions {
  withDate: boolean;
  withTime: boolean;
}

export type DescribeValidationTestSuite = (
  ElementToTest: React.ElementType,
  getOptions: () => DescribeValidationOptions,
) => void;
