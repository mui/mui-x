import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, userEvent } from '@mui-internal/test-utils';
import { inputBaseClasses } from '@mui/material/InputBase';
import {
  getAllFieldInputRoot,
  getExpectedOnChangeCount,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { DescribeValueOptions, DescribeValueTestSuite } from './describeValue.types';

export const testControlledUnControlled: DescribeValueTestSuite<any, any> = (
  ElementToTest,
  options,
) => {
  const {
    render,
    renderWithProps,
    values,
    componentFamily,
    emptyValue,
    assertRenderedValue,
    setNewValue,
    clock,
    ...pickerParams
  } = options;

  const params = pickerParams as DescribeValueOptions<'picker', any>;

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

      const v7Response = renderWithProps({ defaultValue: values[0], onChange });
      const newValue = setNewValue(values[0], {
        selectSection: v7Response.selectSection,
        pressKey: v7Response.pressKey,
      });

      assertRenderedValue(newValue);
      // TODO: Clean this exception or change the clock behavior
      expect(onChange.callCount).to.equal(getExpectedOnChangeCount(componentFamily, params));
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

      const useControlledElement = (props) => {
        const [value, setValue] = React.useState(props?.value || null);
        const handleChange = React.useCallback(
          (newValue) => {
            setValue(newValue);
            props?.onChange(newValue);
          },
          [props],
        );
        return { value, onChange: handleChange };
      };

      const v7Response = renderWithProps(
        { value: values[0], onChange },
        { hook: useControlledElement },
      );
      const newValue = setNewValue(values[0], {
        selectSection: v7Response.selectSection,
        pressKey: v7Response.pressKey,
      });

      expect(onChange.callCount).to.equal(getExpectedOnChangeCount(componentFamily, params));
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

    it(`should apply disabled="true" prop`, () => {
      if (!['field', 'picker'].includes(componentFamily)) {
        return;
      }
      render(<ElementToTest value={values[0]} disabled />);

      getAllFieldInputRoot().forEach((fieldRoot) => {
        expect(fieldRoot).to.have.class('Mui-disabled');
      });
    });

    it(`should apply readOnly="true" prop`, () => {
      if (!['field', 'picker'].includes(componentFamily)) {
        return;
      }
      render(<ElementToTest value={values[0]} readOnly />);

      getAllFieldInputRoot().forEach((fieldInputRoot) => {
        expect(fieldInputRoot).to.have.class('Mui-readOnly');
      });
    });

    it('should not allow editing with keyboard in mobile pickers', () => {
      if (componentFamily !== 'picker' || params.variant !== 'mobile') {
        return;
      }

      const handleChange = spy();

      const v7Response = renderWithProps({ onChange: handleChange });
      v7Response.selectSection(undefined);
      userEvent.keyPress(v7Response.getActiveSection(0), { key: 'ArrowUp' });
      expect(handleChange.callCount).to.equal(0);
    });

    it('should have correct labelledby relationship when toolbar is shown', () => {
      if (
        componentFamily !== 'picker' ||
        (params.variant === 'desktop' && params.type === 'date-range')
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
      if (
        componentFamily !== 'picker' ||
        (params.variant === 'desktop' && params.type === 'date-range')
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
      if (
        componentFamily !== 'picker' ||
        (params.variant === 'desktop' && params.type === 'date-range')
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

    describe('slots: textField', () => {
      it('should respect provided `error="true"` prop', () => {
        if (!['field', 'picker'].includes(componentFamily)) {
          return;
        }
        render(<ElementToTest slotProps={{ textField: { error: true } }} />);

        const fieldRoot = getFieldInputRoot();
        expect(fieldRoot).to.have.class(inputBaseClasses.error);
        expect(fieldRoot).to.have.attribute('aria-invalid', 'true');

        if (params.type === 'date-range' && !params.isSingleInput) {
          const fieldRootEnd = getFieldInputRoot(1);
          expect(fieldRootEnd).to.have.class(inputBaseClasses.error);
          expect(fieldRootEnd).to.have.attribute('aria-invalid', 'true');
        }
      });
    });
  });
};
