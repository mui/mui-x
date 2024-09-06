import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { inputBaseClasses } from '@mui/material/InputBase';
import {
  getAllFieldInputRoot,
  getExpectedOnChangeCount,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { DescribeValueOptions, DescribeValueTestSuite } from './describeValue.types';
import { fireUserEvent } from '../../fireUserEvent';

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

  const isRangeType = params.type === 'date-range' || params.type === 'date-time-range';
  const isDesktopRange = params.variant === 'desktop' && isRangeType;

  describe('Controlled / uncontrolled value', () => {
    it('should render `props.defaultValue` if no `props.value` is passed', () => {
      renderWithProps({ enableAccessibleFieldDOMStructure: true, defaultValue: values[0] });
      assertRenderedValue(values[0]);
    });

    it('should render `props.value` if passed', () => {
      renderWithProps({ enableAccessibleFieldDOMStructure: true, value: values[0] });
      assertRenderedValue(values[0]);
    });

    it('should render `props.value` if both `props.defaultValue` and `props.value` are passed', () => {
      renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: values[0],
        value: values[1],
      });
      assertRenderedValue(values[1]);
    });

    it('should render nothing if neither `props.defaultValue` or `props.value` are passed', () => {
      renderWithProps({ enableAccessibleFieldDOMStructure: true });
      assertRenderedValue(emptyValue);
    });

    it('should call onChange when updating a value defined with `props.defaultValue` and update the rendered value', () => {
      const onChange = spy();

      const v7Response = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: values[0],
        onChange,
      });
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
        { enableAccessibleFieldDOMStructure: true, value: values[0], onChange },
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
      const v7Response = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        value: values[0],
      });
      v7Response.setProps({ value: values[1] });
      assertRenderedValue(values[1]);
    });

    it(`should apply disabled="true" prop`, () => {
      if (!['field', 'picker'].includes(componentFamily)) {
        return;
      }

      renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        value: values[0],
        disabled: true,
      });

      getAllFieldInputRoot().forEach((fieldRoot) => {
        expect(fieldRoot).to.have.class('Mui-disabled');
      });
    });

    it(`should apply readOnly="true" prop`, () => {
      if (!['field', 'picker'].includes(componentFamily)) {
        return;
      }

      renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        value: values[0],
        readOnly: true,
      });

      getAllFieldInputRoot().forEach((fieldInputRoot) => {
        expect(fieldInputRoot).to.have.class('Mui-readOnly');
      });
    });

    it('should not allow editing with keyboard in mobile pickers', () => {
      if (componentFamily !== 'picker' || params.variant !== 'mobile') {
        return;
      }

      const handleChange = spy();

      const v7Response = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: handleChange,
      });
      v7Response.selectSection(undefined);
      fireUserEvent.keyPress(v7Response.getActiveSection(0), { key: 'ArrowUp' });
      expect(handleChange.callCount).to.equal(0);
    });

    it('should have correct labelledby relationship when toolbar is shown', () => {
      if (componentFamily !== 'picker' || isDesktopRange) {
        return;
      }

      renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        open: true,
        slotProps: { toolbar: { hidden: false } },
        localeText: { toolbarTitle: 'Test toolbar' },
      });

      if (params.variant === 'mobile' && params.type === 'date-time-range') {
        expect(screen.getByLabelText('Start End')).to.have.attribute('role', 'dialog');
      } else {
        expect(screen.getByLabelText('Test toolbar')).to.have.attribute('role', 'dialog');
      }
    });

    it('should have correct labelledby relationship with provided label when toolbar is hidden', () => {
      if (componentFamily !== 'picker' || isDesktopRange) {
        return;
      }

      renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        open: true,
        slotProps: { toolbar: { hidden: true } },
        ...(isRangeType
          ? {
              localeText: {
                start: 'test',
                end: 'relationship',
              },
            }
          : { label: 'test relationship' }),
      });

      expect(screen.getByRole('dialog', { name: 'test relationship' })).not.to.equal(null);
    });

    it('should have correct labelledby relationship without label and hidden toolbar but external props', () => {
      if (componentFamily !== 'picker' || isDesktopRange) {
        return;
      }

      render(
        <div>
          <div id="label-id">external label</div>
          <ElementToTest
            enableAccessibleFieldDOMStructure
            open
            {...(isRangeType && {
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

        renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          slotProps: { textField: { error: true } },
        });

        const fieldRoot = getFieldInputRoot();
        expect(fieldRoot).to.have.class(inputBaseClasses.error);
        expect(fieldRoot).to.have.attribute('aria-invalid', 'true');

        if (isRangeType && !params.isSingleInput) {
          const fieldRootEnd = getFieldInputRoot(1);
          expect(fieldRootEnd).to.have.class(inputBaseClasses.error);
          expect(fieldRootEnd).to.have.attribute('aria-invalid', 'true');
        }
      });
    });
  });
};
