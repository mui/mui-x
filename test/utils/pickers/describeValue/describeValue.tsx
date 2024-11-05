import * as React from 'react';
import createDescribe from '@mui/internal-test-utils/createDescribe';
import { BasePickerInputProps, UsePickerValueNonStaticProps } from '@mui/x-date-pickers/internals';
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

function innerDescribeValue<TIsRange extends boolean, C extends PickerComponentFamily>(
  ElementToTest: React.FunctionComponent<any>,
  getOptions: () => DescribeValueOptions<C, TIsRange>,
) {
  const options = getOptions();
  const { defaultProps, render, clock, componentFamily } = options;

  function WrappedElementToTest(
    props: BasePickerInputProps<TIsRange, any, any> & UsePickerValueNonStaticProps & { hook?: any },
  ) {
    const { hook, ...other } = props;
    const hookResult = hook?.(props);
    return <ElementToTest {...defaultProps} {...other} {...hookResult} />;
  }

  let renderWithProps: BuildFieldInteractionsResponse<any>['renderWithProps'];
  if (componentFamily === 'field' || componentFamily === 'picker') {
    const interactions = buildFieldInteractions({ clock, render, Component: ElementToTest });

    renderWithProps = (props: any, config?: any) =>
      interactions.renderWithProps({ ...defaultProps, ...props }, { ...config, componentFamily });
  } else {
    renderWithProps = ({ enableAccessibleFieldDOMStructure, ...props }: any, config?: any) => {
      const response = render(<WrappedElementToTest {...props} hook={config?.hook} />);

      return {
        ...response,
        getSectionsContainer: () => {
          throw new Error(
            'You can only use `getSectionsContainer` on components that render a field',
          );
        },
        selectSection: () => {
          throw new Error('You can only use `selectSection` on components that render a field');
        },
        getHiddenInput: () => {
          throw new Error('You can only use `getHiddenInput` on components that render a field');
        },
        getActiveSection: () => {
          throw new Error('You can only use `getActiveSection` on components that render a field');
        },
        getSection: () => {
          throw new Error('You can only use `getSection` on components that render a field');
        },
        pressKey: () => {
          throw new Error('You can only use `pressKey` on components that render a field');
        },
      };
    };
  }

  TEST_SUITES.forEach((testSuite) => {
    const typedTestSuite = testSuite as DescribeValueTestSuite<TIsRange, any>;
    typedTestSuite(WrappedElementToTest, { ...options, renderWithProps });
  });
}

type P<TIsRange extends boolean, C extends PickerComponentFamily> = [
  React.FunctionComponent,
  () => DescribeValueOptions<C, TIsRange>,
];

type DescribeValue = {
  <TIsRange extends boolean, C extends PickerComponentFamily>(...args: P<TIsRange, C>): void;
  skip: <TIsRange extends boolean, C extends PickerComponentFamily>(
    ...args: P<TIsRange, C>
  ) => void;
  only: <TIsRange extends boolean, C extends PickerComponentFamily>(
    ...args: P<TIsRange, C>
  ) => void;
};

/**
 * Tests various aspects of component value.
 */
export const describeValue = createDescribe('Value API', innerDescribeValue) as DescribeValue;
