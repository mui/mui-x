import * as React from 'react';
import { createRenderer, MuiRenderResult } from '@mui/monorepo/test/utils/createRenderer';
import { OpenPickerParams } from 'test/utils/pickers-utils';
import { PickerComponentFamily } from '@mui/x-date-pickers/tests/describe.types';

interface DescribeValueBaseOptions<TValue> {
  render: (node: React.ReactElement) => MuiRenderResult;
  assertRenderedValue: (expectedValue: TValue) => void;
  values: [TValue, TValue];
  emptyValue: TValue;
  defaultProps?: object;
  // TODO: Export `Clock` from monorepo
  clock: ReturnType<typeof createRenderer>['clock'];
}

type DescribeValueNonStaticPickerOptions<TValue> = DescribeValueBaseOptions<TValue> &
  OpenPickerParams & {
    componentFamily: 'picker';
    setNewValue: (
      value: TValue,
      pickerParams?: { isOpened?: boolean; applySameValue?: boolean; setEndDate?: boolean },
    ) => TValue;
  };

interface DescribeValueOtherComponentOptions<TValue> extends DescribeValueBaseOptions<TValue> {
  componentFamily: Exclude<PickerComponentFamily, 'picker'>;
  setNewValue: (value: TValue) => TValue;
}

export type DescribeValueOptions<C extends PickerComponentFamily, TValue> = C extends 'picker'
  ? DescribeValueNonStaticPickerOptions<TValue>
  : DescribeValueOtherComponentOptions<TValue>;

export type DescribeValueTestSuite<TValue, C extends PickerComponentFamily> = (
  ElementToTest: React.ElementType,
  getOptions: () => DescribeValueOptions<C, TValue>,
) => void;
