import * as React from 'react';
import createDescribe from '@mui/monorepo/test/utils/createDescribe';
import { BasePickerInputProps, UsePickerValueNonStaticProps } from '@mui/x-date-pickers/internals';
import { FieldSection } from '@mui/x-date-pickers/models';
import { buildFieldInteractions, BuildFieldInteractionsResponse } from 'test/utils/pickers';
import { PickerComponentFamily } from '../describe.types';
import { DescribeValueOptions, DescribeValueTestSuite } from './describeValue.types';
import { testControlledUnControlled } from './testControlledUnControlled';
import { testPickerOpenCloseLifeCycle } from './testPickerOpenCloseLifeCycle';
import { testPickerActionBar } from './testPickerActionBar';
import { testShortcuts } from './testShortcuts';

const TEST_SUITES: DescribeValueTestSuite<any, any>[] = [
  testControlledUnControlled,
  testPickerOpenCloseLifeCycle,
  testPickerActionBar,
  testShortcuts,
];

function innerDescribeValue<TValue, C extends PickerComponentFamily>(
  ElementToTest: React.FunctionComponent<any>,
  getOptions: () => DescribeValueOptions<C, TValue>,
) {
  const options = getOptions();
  const { defaultProps, render, clock, componentFamily } = options;

  function WrappedElementToTest(
    props: BasePickerInputProps<TValue, any, any, any> &
      UsePickerValueNonStaticProps<TValue, FieldSection> & { hook?: any },
  ) {
    const { hook, ...other } = props;
    const hookResult = hook?.(props);
    return <ElementToTest {...defaultProps} {...other} {...hookResult} />;
  }

  let renderWithProps: BuildFieldInteractionsResponse<any>['renderWithProps'];
  if (componentFamily === 'field' || componentFamily === 'picker') {
    const interactions = buildFieldInteractions({ clock, render, Component: ElementToTest });

    renderWithProps = (props: any, hook?: any) =>
      interactions.renderWithProps({ ...defaultProps, ...props }, hook, componentFamily);
  } else {
    renderWithProps = (props: any, hook?: any) => {
      const response = render(<WrappedElementToTest {...props} hook={hook} />);

      return {
        ...response,
        input: null as any,
        selectSection: () => {
          throw new Error('You can only select a section on components that render a field');
        },
      };
    };
  }

  TEST_SUITES.forEach((testSuite) => {
    testSuite(WrappedElementToTest, { ...options, renderWithProps });
  });
}

type P<TValue, C extends PickerComponentFamily> = [
  React.FunctionComponent,
  () => DescribeValueOptions<C, TValue>,
];

type DescribeValue = {
  <TValue, C extends PickerComponentFamily>(...args: P<TValue, C>): void;
  skip: <TValue, C extends PickerComponentFamily>(...args: P<TValue, C>) => void;
  only: <TValue, C extends PickerComponentFamily>(...args: P<TValue, C>) => void;
};

/**
 * Tests various aspects of component value.
 */
export const describeValue = createDescribe('Value API', innerDescribeValue) as DescribeValue;
