import * as React from 'react';
import { MuiRenderResult } from '@mui/monorepo/test/utils/createRenderer';
import { OpenPickerParams } from 'test/utils/pickers-utils';
import { PickerV6ComponentFamily } from '@mui/x-date-pickers/tests/describe.types';

interface DescribeValueBaseOptions<TValue> {
  render: (node: React.ReactElement) => MuiRenderResult;
  assertRenderedValue: (expectedValue: TValue) => void;
  values: [TValue, TValue];
  emptyValue: TValue;
  defaultProps?: object;
}

type DescribeValueNonStaticPickerOptions<TValue> = DescribeValueBaseOptions<TValue> &
  OpenPickerParams & {
    componentFamily: 'new-picker';
    setNewValue: (
      value: TValue,
      pickerParams?: { isOpened?: boolean; applySameValue?: boolean },
    ) => TValue;
  };

interface DescribeValueOtherComponentOptions<TValue> extends DescribeValueBaseOptions<TValue> {
  componentFamily: Exclude<PickerV6ComponentFamily, 'new-picker'>;
  setNewValue: (value: TValue) => TValue;
}

export type DescribeValueOptions<C extends PickerV6ComponentFamily, TValue> = C extends 'new-picker'
  ? DescribeValueNonStaticPickerOptions<TValue>
  : DescribeValueOtherComponentOptions<TValue>;

export type DescribeValueTestSuite<TValue, C extends PickerV6ComponentFamily> = (
  ElementToTest: React.ElementType,
  getOptions: () => DescribeValueOptions<C, TValue>,
) => void;
