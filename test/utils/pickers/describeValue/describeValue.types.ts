import * as React from 'react';
import { createRenderer, MuiRenderResult } from '@mui/internal-test-utils/createRenderer';
import { InferNonNullablePickerValue, PickerValidValue } from '@mui/x-date-pickers/internals';
import {
  BuildFieldInteractionsResponse,
  FieldPressCharacter,
  FieldSectionSelector,
  OpenPickerParams,
} from 'test/utils/pickers';
import { PickerComponentFamily } from '../describe.types';

interface DescribeValueBaseOptions<
  TValue extends PickerValidValue,
  C extends PickerComponentFamily,
> {
  componentFamily: C;
  render: (node: React.ReactElement<any>) => MuiRenderResult;
  assertRenderedValue: (expectedValue: TValue) => void;
  values: [InferNonNullablePickerValue<TValue>, InferNonNullablePickerValue<TValue>];
  emptyValue: TValue;
  defaultProps?: object;
  // TODO: Export `Clock` from monorepo
  clock: ReturnType<typeof createRenderer>['clock'];
}

export type DescribeValueOptions<
  C extends PickerComponentFamily,
  TValue extends PickerValidValue,
> = DescribeValueBaseOptions<TValue, C> &
  (C extends 'picker'
    ? OpenPickerParams & {
        setNewValue: (
          value: InferNonNullablePickerValue<TValue>,
          options: {
            selectSection: FieldSectionSelector;
            pressKey: FieldPressCharacter;
            isOpened?: boolean;
            applySameValue?: boolean;
            setEndDate?: boolean;
          },
        ) => InferNonNullablePickerValue<TValue>;
      }
    : {
        setNewValue: (
          value: TValue,
          options: { selectSection: FieldSectionSelector; pressKey: FieldPressCharacter },
        ) => TValue;
      });

export type DescribeValueTestSuite<
  TValue extends PickerValidValue,
  C extends PickerComponentFamily,
> = (
  ElementToTest: React.FunctionComponent<any>,
  options: DescribeValueOptions<C, TValue> & {
    renderWithProps: BuildFieldInteractionsResponse<any>['renderWithProps'];
  },
) => void;
