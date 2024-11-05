import * as React from 'react';
import { createRenderer, MuiRenderResult } from '@mui/internal-test-utils/createRenderer';
import { InferPickerValue, InferNonNullablePickerValue } from '@mui/x-date-pickers/internals';
import {
  BuildFieldInteractionsResponse,
  FieldPressCharacter,
  FieldSectionSelector,
  OpenPickerParams,
} from 'test/utils/pickers';
import { PickerComponentFamily } from '../describe.types';

interface DescribeValueBaseOptions<TIsRange extends boolean, C extends PickerComponentFamily> {
  componentFamily: C;
  render: (node: React.ReactElement) => MuiRenderResult;
  assertRenderedValue: (expectedValue: InferPickerValue<TIsRange>) => void;
  values: [InferNonNullablePickerValue<TIsRange>, InferNonNullablePickerValue<TIsRange>];
  emptyValue: InferPickerValue<TIsRange>;
  defaultProps?: object;
  // TODO: Export `Clock` from monorepo
  clock: ReturnType<typeof createRenderer>['clock'];
}

export type DescribeValueOptions<
  C extends PickerComponentFamily,
  TIsRange extends boolean,
> = DescribeValueBaseOptions<TIsRange, C> &
  (C extends 'picker'
    ? OpenPickerParams & {
        setNewValue: (
          value: InferNonNullablePickerValue<TIsRange>,
          options: {
            selectSection: FieldSectionSelector;
            pressKey: FieldPressCharacter;
            isOpened?: boolean;
            applySameValue?: boolean;
            setEndDate?: boolean;
          },
        ) => InferNonNullablePickerValue<TIsRange>;
      }
    : {
        setNewValue: (
          value: InferPickerValue<TIsRange>,
          options: { selectSection: FieldSectionSelector; pressKey: FieldPressCharacter },
        ) => InferPickerValue<TIsRange>;
      });

export type DescribeValueTestSuite<TIsRange extends boolean, C extends PickerComponentFamily> = (
  ElementToTest: React.FunctionComponent<any>,
  options: DescribeValueOptions<C, TIsRange> & {
    renderWithProps: BuildFieldInteractionsResponse<any>['renderWithProps'];
  },
) => void;
