import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/monorepo/test/utils';
import { MuiRenderResult } from '@mui/monorepo/test/utils/createRenderer';
import { openPicker, OpenPickerParams } from 'test/utils/pickers-utils';
import { PickerComponentFamily } from './describe.types';

interface DescribeValueBaseOptions<TValue> {
  render: (node: React.ReactElement) => MuiRenderResult;
  assertRenderedValue: (expectedValue: TValue) => void;
  setNewValue: (value: TValue) => TValue;
  values: [TValue, TValue];
  emptyValue: TValue;
}

type DescribeValueOptions<TValue> = DescribeValueBaseOptions<TValue> &
  (
    | {
        componentFamily: Exclude<
          PickerComponentFamily,
          'new-picker' | 'legacy-picker' | 'legacy-static-picker'
        >;
      }
    | ({
        componentFamily: 'new-picker';
      } & OpenPickerParams)
  );

/**
 * Tests various aspects of the picker value.
 */
export function describeValue<TValue>(
  ElementToTest: React.ElementType,
  getOptions: () => DescribeValueOptions<TValue>,
) {
  const {
    render,
    values,
    emptyValue,
    assertRenderedValue,
    setNewValue,
    componentFamily,
    ...pickerParams
  } = getOptions();

  describe('Pickers value', () => {
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
      expect(onChange.callCount).to.equal(1);
      // TODO: Support range
      expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
    });

    it('should call onChange when updating a value defined with `props.value`', () => {
      const onChange = spy();

      render(<ElementToTest value={values[0]} onChange={onChange} />);
      const newValue = setNewValue(values[0]);

      expect(onChange.callCount).to.equal(1);
      // TODO: Support range
      expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
    });

    it('should react to `props.value` update', () => {
      const { setProps } = render(<ElementToTest value={values[0]} />);
      setProps({ value: values[1] });
      assertRenderedValue(values[1]);
    });
  });

  if (componentFamily === 'new-picker') {
    const { type, variant } = pickerParams as OpenPickerParams;
    const viewWrapperRole = type === 'date-range' && variant === 'desktop' ? 'tooltip' : 'dialog';

    describe('Pickers opening lifecycle', () => {
      it('should not open on mount if `props.open` is false', () => {
        render(<ElementToTest />);
        expect(screen.queryByRole(viewWrapperRole)).to.equal(null);
      });

      it('should open on mount if `prop.open` is true', () => {
        render(<ElementToTest open />);
        expect(screen.queryByRole(viewWrapperRole)).toBeVisible();
      });

      it('should not open when `prop.disabled` is true ', () => {
        const onOpen = spy();
        render(<ElementToTest disabled onOpen={onOpen} />);

        openPicker(pickerParams as OpenPickerParams);
        expect(onOpen.callCount).to.equal(0);
      });

      it('should not open when "Choose date" is clicked when `prop.readOnly` is true ', () => {
        const onOpen = spy();
        render(<ElementToTest disabled onOpen={onOpen} />);

        openPicker(pickerParams as OpenPickerParams);
        expect(onOpen.callCount).to.equal(0);
      });
    });
  }
}
