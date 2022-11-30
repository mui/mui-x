import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { DescribeValueTestSuite } from './describeValue.types';

export const testControlledUnControlled: DescribeValueTestSuite<any, any> = (
  ElementToTest,
  getOptions,
) => {
  const { render, values, componentFamily, emptyValue, assertRenderedValue, setNewValue } =
    getOptions();

  describe('Controlled / uncontrolled value', () => {
    it('should render `props.defaultValue` if no `props.value` is passed', () => {
      render(<ElementToTest defaultValue={values[0]} />);
      assertRenderedValue(values[0]);
    });

    it('should render `props.value` if passed', () => {
      render(<ElementToTest value={values[0]} />);
      assertRenderedValue(values[0]);
    });

    it('should render `props.value` if both `props.defaultValue` and `props.value` are passed', () => {
      render(<ElementToTest defaultValue={values[0]} value={values[1]} />);
      assertRenderedValue(values[1]);
    });

    it('should render nothing if neither `props.defaultValue` or `props.value` are passed', () => {
      render(<ElementToTest />);
      assertRenderedValue(emptyValue);
    });

    it('should call onChange when updating a value defined with `props.defaultValue` and update the rendered value', () => {
      const onChange = spy();

      render(<ElementToTest defaultValue={values[0]} onChange={onChange} />);
      const newValue = setNewValue(values[0]);

      assertRenderedValue(newValue);
      // TODO: Clean this exception or change the clock behavior
      expect(onChange.callCount).to.equal(componentFamily === 'clock' ? 2 : 1);
      // TODO: Support range
      expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
    });

    it('should call onChange when updating a value defined with `props.value`', () => {
      const onChange = spy();

      render(<ElementToTest value={values[0]} onChange={onChange} />);
      const newValue = setNewValue(values[0]);

      expect(onChange.callCount).to.equal(componentFamily === 'clock' ? 2 : 1);
      // TODO: Support range
      expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
    });

    it('should react to `props.value` update', () => {
      const { setProps } = render(<ElementToTest value={values[0]} />);
      setProps({ value: values[1] });
      assertRenderedValue(values[1]);
    });
  });
};
