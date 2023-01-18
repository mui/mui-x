import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, act, userEvent } from '@mui/monorepo/test/utils';
import { DescribeValueOptions, DescribeValueTestSuite } from './describeValue.types';

export const testControlledUnControlled: DescribeValueTestSuite<any, any> = (
  ElementToTest,
  getOptions,
) => {
  const {
    render,
    values,
    componentFamily,
    emptyValue,
    assertRenderedValue,
    setNewValue,
    clock,
    ...pickerParams
  } = getOptions();

  describe('Controlled / uncontrolled value', () => {
    const defaultProps = {
      label: 'test controlled uncontrolled',
    };
    it('should render `props.defaultValue` if no `props.value` is passed', () => {
      render(<ElementToTest {...defaultProps} defaultValue={values[0]} />);
      assertRenderedValue(values[0]);
    });

    it('should render `props.value` if passed', () => {
      render(<ElementToTest {...defaultProps} value={values[0]} />);
      assertRenderedValue(values[0]);
    });

    it('should render `props.value` if both `props.defaultValue` and `props.value` are passed', () => {
      render(<ElementToTest {...defaultProps} defaultValue={values[0]} value={values[1]} />);
      assertRenderedValue(values[1]);
    });

    it('should render nothing if neither `props.defaultValue` or `props.value` are passed', () => {
      render(<ElementToTest {...defaultProps} />);
      assertRenderedValue(emptyValue);
    });

    it('should call onChange when updating a value defined with `props.defaultValue` and update the rendered value', () => {
      const onChange = spy();

      render(<ElementToTest {...defaultProps} defaultValue={values[0]} onChange={onChange} />);
      const newValue = setNewValue(values[0]);

      assertRenderedValue(newValue);
      // TODO: Clean this exception or change the clock behavior
      expect(onChange.callCount).to.equal(componentFamily === 'clock' ? 2 : 1);
      if (Array.isArray(newValue)) {
        newValue.forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
      }
    });

    it('should call onChange when updating a value defined with `props.value`', () => {
      const onChange = spy();

      render(<ElementToTest {...defaultProps} value={values[0]} onChange={onChange} />);
      const newValue = setNewValue(values[0]);

      expect(onChange.callCount).to.equal(componentFamily === 'clock' ? 2 : 1);
      if (Array.isArray(newValue)) {
        newValue.forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
      }
    });

    it('should react to `props.value` update', () => {
      const { setProps } = render(<ElementToTest {...defaultProps} value={values[0]} />);
      setProps({ value: values[1] });
      assertRenderedValue(values[1]);
    });

    ['readOnly', 'disabled'].forEach((prop) => {
      it(`should apply ${prop}="true" prop`, () => {
        if (!['field', 'picker'].includes(componentFamily)) {
          return;
        }
        const handleChange = spy();
        render(
          <ElementToTest
            {...defaultProps}
            value={values[0]}
            onChange={handleChange}
            {...{ [prop]: true }}
          />,
        );

        const textBoxes = screen.getAllByRole('textbox');
        textBoxes.forEach((textbox) => {
          expect(textbox).to.have.attribute(prop.toLowerCase());
        });
      });
    });

    it('should not allow editing with keyboard in mobile pickers', () => {
      if (
        componentFamily !== 'picker' ||
        (pickerParams as DescribeValueOptions<'picker', any>).variant !== 'mobile'
      ) {
        return;
      }
      const handleChange = spy();

      render(<ElementToTest {...defaultProps} defaultValue={values[0]} onChange={handleChange} />);
      const input = screen.getAllByRole('textbox')[0];
      act(() => {
        input.focus();
      });
      clock.runToLast();
      userEvent.keyPress(input, { key: 'ArrowUp' });
      clock.runToLast();
      expect(handleChange.callCount).to.equal(0);
    });
  });
};
