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

      render(<ElementToTest value={values[0]} onChange={onChange} />);
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
      const { setProps } = render(<ElementToTest value={values[0]} />);
      setProps({ value: values[1] });
      assertRenderedValue(values[1]);
    });

    ['readOnly', 'disabled'].forEach((prop) => {
      it(`should apply ${prop}="true" prop`, () => {
        if (!['field', 'picker'].includes(componentFamily)) {
          return;
        }
        const handleChange = spy();
        render(<ElementToTest value={values[0]} onChange={handleChange} {...{ [prop]: true }} />);

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

      render(<ElementToTest defaultValue={values[0]} onChange={handleChange} />);
      const input = screen.getAllByRole('textbox')[0];
      act(() => {
        input.focus();
      });
      clock.runToLast();
      userEvent.keyPress(input, { key: 'ArrowUp' });
      clock.runToLast();
      expect(handleChange.callCount).to.equal(0);
    });

    it('should have correct labelledby relationship when toolbar is shown', () => {
      const params = pickerParams as DescribeValueOptions<'picker', any>;
      if (
        componentFamily !== 'picker' ||
        (params.variant === 'desktop' && (params.type === 'time' || params.type === 'date-range'))
      ) {
        return;
      }

      render(
        <ElementToTest
          open
          slotProps={{ toolbar: { hidden: false } }}
          localeText={{ toolbarTitle: 'Test toolbar' }}
        />,
      );
      expect(screen.getByLabelText('Test toolbar')).to.have.attribute('role', 'dialog');
    });

    it('should have correct labelledby relationship with provided label when toolbar is hidden', () => {
      const params = pickerParams as DescribeValueOptions<'picker', any>;
      if (
        componentFamily !== 'picker' ||
        (params.variant === 'desktop' && (params.type === 'time' || params.type === 'date-range'))
      ) {
        return;
      }

      render(
        <ElementToTest
          open
          {...(params.type === 'date-range'
            ? {
                localeText: {
                  start: 'test',
                  end: 'relationship',
                },
              }
            : { label: 'test relationship' })}
          slotProps={{ toolbar: { hidden: true } }}
        />,
      );
      expect(screen.getByLabelText('test relationship', { selector: 'div' })).to.have.attribute(
        'role',
        'dialog',
      );
    });

    it('should have correct labelledby relationship without label and hidden toolbar but external props', () => {
      const params = pickerParams as DescribeValueOptions<'picker', any>;
      if (
        componentFamily !== 'picker' ||
        (params.variant === 'desktop' && (params.type === 'time' || params.type === 'date-range'))
      ) {
        return;
      }

      render(
        <div>
          <div id="label-id">external label</div>
          <ElementToTest
            open
            {...(params.type === 'date-range' && {
              localeText: {
                start: '',
                end: '',
              },
            })}
            slotProps={{
              toolbar: { hidden: true },
              [params.variant === 'desktop' ? 'popper' : 'mobilePaper']: {
                'aria-labelledby': 'label-id',
              },
            }}
          />
        </div>,
      );
      expect(screen.getByLabelText('external label')).to.have.attribute('role', 'dialog');
    });
  });
};
