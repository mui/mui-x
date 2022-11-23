import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, userEvent } from '@mui/monorepo/test/utils';
import { MuiRenderResult } from '@mui/monorepo/test/utils/createRenderer';
import { openPicker, OpenPickerParams } from 'test/utils/pickers-utils';
import { PickerComponentFamily } from './describe.types';

interface DescribeValueBaseOptions<TValue> {
  render: (node: React.ReactElement) => MuiRenderResult;
  assertRenderedValue: (expectedValue: TValue) => void;
  values: [TValue, TValue];
  emptyValue: TValue;
}

type DescribeValueNonStaticPickerOptions<TValue> = DescribeValueBaseOptions<TValue> &
  OpenPickerParams & {
    componentFamily: 'new-picker';
    setNewValue: (
      value: TValue,
      pickerParams?: { isOpened?: boolean; applySameValue?: boolean },
    ) => TValue;
  };

interface DescribeValueOtherComponentOptions<TValue> extends DescribeValueBaseOptions<TValue> {
  componentFamily: Exclude<
    PickerComponentFamily,
    'new-picker' | 'legacy-picker' | 'legacy-static-picker'
  >;
  setNewValue: (value: TValue) => TValue;
}

type DescribeValueOptions<TValue> =
  | DescribeValueNonStaticPickerOptions<TValue>
  | DescribeValueOtherComponentOptions<TValue>;

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

  describe.only('Pickers value', () => {
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

    describe('Pickers lifecycle', () => {
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

      it('should not open when `prop.readOnly` is true ', () => {
        const onOpen = spy();
        render(<ElementToTest readOnly onOpen={onOpen} />);

        openPicker(pickerParams as OpenPickerParams);
        expect(onOpen.callCount).to.equal(0);
      });

      it('should call onChange, onClose (if desktop) and onAccept (if desktop) when selecting a value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
          />,
        );

        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(0);

        // Change the value
        const newValue = setNewValue(values[0], { isOpened: true });
        expect(onChange.callCount).to.equal(1);
        // TODO: Support range
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
        expect(onAccept.callCount).to.equal(variant === 'mobile' ? 0 : 1);
        expect(onClose.callCount).to.equal(variant === 'mobile' ? 0 : 1);
      });

      it('should call onChange, onClose and onAccept when selecting a value and `props.closeOnSelect` is true', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            closeOnSelect
          />,
        );

        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(0);

        // Change the value
        const newValue = setNewValue(values[0], { isOpened: true });
        expect(onChange.callCount).to.equal(1);
        // TODO: Support range
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
        expect(onAccept.callCount).to.equal(1);
        expect(onClose.callCount).to.equal(1);
      });

      it.only('should not call onChange and onAccept when selecting the same value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            defaultValue={values[0]}
            closeOnSelect
          />,
        );

        // Change the value (same value)
        setNewValue(values[0], { isOpened: true, applySameValue: true });
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onClose and onAccept when selection a date and `props.closeOnSelect` is false', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            closeOnSelect={false}
          />,
        );

        // Change the value
        const newValue = setNewValue(values[0], { isOpened: true });
        expect(onChange.callCount).to.equal(1);
        // TODO: Support range
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(0);

        // Change the value
        const newValueBis = setNewValue(newValue, { isOpened: true });
        expect(onChange.callCount).to.equal(2);
        // TODO: Support range
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValueBis as any);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(0);
      });

      it('should call onClose and onAccept with the live value when pressing Escape', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            closeOnSelect={false}
          />,
        );

        // Change the value (already tested)
        const newValue = setNewValue(values[0], { isOpened: true });

        // Dismiss the picker
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target -- don't care
        userEvent.keyPress(document.activeElement!, { key: 'Escape' });
        expect(onChange.callCount).to.equal(1);
        expect(onAccept.callCount).to.equal(1);
        // TODO: Support range
        expect(onAccept.lastCall.args[0]).toEqualDateTime(newValue as any);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onClose when clicking outside of the picker without prior change', () => {
        // TODO: Fix this test and enable it on mobile
        if (variant === 'mobile') {
          return;
        }

        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            closeOnSelect={false}
          />,
        );

        // Dismiss the picker
        userEvent.mousePress(document.body);
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
        // TODO: Fix this test and enable it on mobile
        if (variant === 'mobile') {
          return;
        }

        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            closeOnSelect={false}
          />,
        );

        // Change the value (already tested)
        const newValue = setNewValue(values[0], { isOpened: true });

        // Dismiss the picker
        userEvent.mousePress(document.body);
        expect(onChange.callCount).to.equal(1);
        expect(onAccept.callCount).to.equal(1);
        // TODO: Support range
        expect(onAccept.lastCall.args[0]).toEqualDateTime(newValue as any);
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onClose or onAccept when clicking outside of the picker if not opened', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            closeOnSelect={false}
          />,
        );

        // Dismiss the picker
        userEvent.mousePress(document.body);
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(0);
      });

      it('should not call onClose or onAccept when pressing escape when picker is not opened', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} />);

        // Dismiss the picker
        userEvent.keyPress(document.body, { key: 'Escape' });
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(0);
      });

      it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            componentsProps={{ actionBar: { actions: ['clear'] } }}
          />,
        );

        // Clear the date
        userEvent.mousePress(screen.getByText(/clear/i));
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0]).to.equal(emptyValue);
        expect(onAccept.callCount).to.equal(1);
        expect(onAccept.lastCall.args[0]).to.equal(emptyValue);
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onChange or onAccept when pressing "Clear" button with an already empty value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            componentsProps={{ actionBar: { actions: ['clear'] } }}
          />,
        );

        // Clear the date
        userEvent.mousePress(screen.getByText(/clear/i));
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onClose and onChange with the initial value when clicking the "Cancel" button', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            defaultValue={values[0]}
            componentsProps={{ actionBar: { actions: ['cancel'] } }}
            closeOnSelect={false}
          />,
        );

        // Change the value (already tested)
        setNewValue(values[0], { isOpened: true });

        // Cancel the modifications
        userEvent.mousePress(screen.getByText(/cancel/i));
        expect(onChange.callCount).to.equal(2);
        // TODO: Support range
        expect(onChange.lastCall.args[0]).toEqualDateTime(values[0] as any);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onChange when clicking the "Cancel" button without prior value modification', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            defaultValue={values[0]}
            componentsProps={{ actionBar: { actions: ['cancel'] } }}
            closeOnSelect={false}
          />,
        );

        // Cancel the modifications
        userEvent.mousePress(screen.getByText(/cancel/i));
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onClose and onAccept with the live value when clicking the "OK" button', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            defaultValue={values[0]}
            componentsProps={{ actionBar: { actions: ['accept'] } }}
            closeOnSelect={false}
          />,
        );

        // Change the value (already tested)
        setNewValue(values[0], { isOpened: true });

        // Accept the modifications
        userEvent.mousePress(screen.getByText(/ok/i));
        expect(onChange.callCount).to.equal(1); // The accepted value as already been committed, don't call onChange again
        expect(onAccept.callCount).to.equal(1);
        expect(onClose.callCount).to.equal(1);
      });
    });
  }
}
