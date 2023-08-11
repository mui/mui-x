import * as React from 'react';
import { createRenderer, MuiRenderResult } from '@mui/monorepo/test/utils/createRenderer';
import {
  BuildFieldInteractionsResponse,
  FieldSectionSelector,
  OpenPickerParams,
} from 'test/utils/pickers';
import { PickerComponentFamily } from '../describe.types';

interface DescribeValueBaseOptions<TValue, C extends PickerComponentFamily> {
  componentFamily: C;
  render: (node: React.ReactElement) => MuiRenderResult;
  assertRenderedValue: (expectedValue: TValue) => void;
  values: [TValue, TValue];
  emptyValue: TValue;
  defaultProps?: object;
  // TODO: Export `Clock` from monorepo
  clock: ReturnType<typeof createRenderer>['clock'];
}

export type DescribeValueOptions<
  C extends PickerComponentFamily,
  TValue,
> = DescribeValueBaseOptions<TValue, C> &
  (C extends 'picker'
    ? OpenPickerParams & {
        setNewValue: (
          value: TValue,
          options: {
            selectSection: FieldSectionSelector;
            isOpened?: boolean;
            applySameValue?: boolean;
            setEndDate?: boolean;
          },
        ) => TValue;
      }
    : {
        setNewValue: (value: TValue, options: { selectSection: FieldSectionSelector }) => TValue;
      });

export type DescribeValueTestSuite<TValue, C extends PickerComponentFamily> = (
  ElementToTest: React.FunctionComponent<any>,
  options: DescribeValueOptions<C, TValue> & {
    renderWithProps: BuildFieldInteractionsResponse<any>['renderWithProps'];
  },
) => void;
