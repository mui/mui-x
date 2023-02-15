import * as React from 'react';
import createDescribe from '@mui/monorepo/test/utils/createDescribe';
import {
  BasePickerInputProps,
  FieldSection,
  UsePickerValueNonStaticProps,
} from '@mui/x-date-pickers/internals';
import { PickerComponentFamily } from '../describe.types';
import { DescribeValueOptions } from './describeValue.types';
import { testControlledUnControlled } from './testControlledUnControlled';
import { testPickerOpenCloseLifeCycle } from './testPickerOpenCloseLifeCycle';
import { testPickerActionBar } from './testPickerActionBar';

const TEST_SUITES = [testControlledUnControlled, testPickerOpenCloseLifeCycle, testPickerActionBar];

function innerDescribeValue<TValue, C extends PickerComponentFamily>(
  ElementToTest: React.ElementType,
  getOptions: () => DescribeValueOptions<C, TValue>,
) {
  const { defaultProps } = getOptions();

  function WrappedElementToTest(
    props: BasePickerInputProps<TValue, any, any, any> &
      UsePickerValueNonStaticProps<TValue, FieldSection>,
  ) {
    return <ElementToTest {...defaultProps} {...props} />;
  }

  TEST_SUITES.forEach((testSuite) => {
    testSuite(WrappedElementToTest, getOptions);
  });
}

type P<TValue, C extends PickerComponentFamily> = [
  React.ElementType,
  () => DescribeValueOptions<C, TValue>,
];

type DescribeValue = {
  <TValue, C extends PickerComponentFamily>(...args: P<TValue, C>): void;
  skip: <TValue, C extends PickerComponentFamily>(...args: P<TValue, C>) => void;
  only: <TValue, C extends PickerComponentFamily>(...args: P<TValue, C>) => void;
};

/**
 * Tests various aspects of the picker value.
 */
export const describeValue = createDescribe('Value API', innerDescribeValue) as DescribeValue;
