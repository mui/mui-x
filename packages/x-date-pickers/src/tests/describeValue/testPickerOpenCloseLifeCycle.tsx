import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, userEvent } from '@mui/monorepo/test/utils';
import { getTextbox, openPicker } from 'test/utils/pickers-utils';
import { DescribeValueTestSuite } from './describeValue.types';

export const testPickerOpenCloseLifeCycle: DescribeValueTestSuite<any, 'picker'> = (
  ElementToTest,
  getOptions,
) => {
  const { componentFamily, render, values, setNewValue, ...pickerParams } = getOptions();

  if (componentFamily !== 'picker') {
    return;
  }

  // No view to test
  if (pickerParams.variant === 'desktop' && pickerParams.type === 'time') {
    return;
  }

  const viewWrapperRole =
    pickerParams.type === 'date-range' && pickerParams.variant === 'desktop' ? 'tooltip' : 'dialog';

  describe('Picker open / close lifecycle', () => {
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

      openPicker(pickerParams);
      expect(onOpen.callCount).to.equal(0);
    });

    it('should not open when `prop.readOnly` is true ', () => {
      const onOpen = spy();
      render(<ElementToTest readOnly onOpen={onOpen} />);

      openPicker(pickerParams);
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
      let newValue = setNewValue(values[0], { isOpened: true });
      expect(onChange.callCount).to.equal(1);
      if (pickerParams.type === 'date-range') {
        newValue = setNewValue(newValue, { isOpened: true, setEndDate: true });
        newValue.forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
      }
      expect(onAccept.callCount).to.equal(pickerParams.variant === 'mobile' ? 0 : 1);
      expect(onClose.callCount).to.equal(pickerParams.variant === 'mobile' ? 0 : 1);
    });

    it('should not select input content after closing on mobile', () => {
      if (pickerParams.variant !== 'mobile') {
        return;
      }
      render(<ElementToTest defaultValue={values[0]} />);

      // Change the value
      setNewValue(values[0]);
      let textbox: HTMLInputElement;
      if (pickerParams.type === 'date-range') {
        textbox = screen.getAllByRole<HTMLInputElement>('textbox')[0];
      } else {
        textbox = getTextbox();
      }
      expect(textbox.scrollLeft).to.be.equal(0);
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
      let newValue = setNewValue(values[0], { isOpened: true });
      expect(onChange.callCount).to.equal(1);
      if (pickerParams.type === 'date-range') {
        newValue = setNewValue(newValue, { isOpened: true, setEndDate: true });
        newValue.forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
      }
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange or onAccept when selecting the same value', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <ElementToTest
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          open
          value={values[0]}
          closeOnSelect
        />,
      );

      // Change the value (same value)
      setNewValue(values[0], { isOpened: true, applySameValue: true });
      if (pickerParams.type === 'date-range') {
        setNewValue(values[0], { isOpened: true, applySameValue: true, setEndDate: true });
      }

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when selecting a date and `props.closeOnSelect` is false', () => {
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
      let newValue = setNewValue(values[0], { isOpened: true });
      expect(onChange.callCount).to.equal(1);
      if (pickerParams.type === 'date-range') {
        newValue = setNewValue(newValue, { isOpened: true, setEndDate: true });
        newValue.forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
      }
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the value
      let newValueBis = setNewValue(newValue, { isOpened: true });
      if (pickerParams.type === 'date-range') {
        expect(onChange.callCount).to.equal(3);
        newValueBis = setNewValue(newValueBis, { isOpened: true, setEndDate: true });
        newValueBis.forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.callCount).to.equal(2);
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValueBis as any);
      }
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
      userEvent.keyPress(document.activeElement!, { key: 'Escape' });
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(1);
      if (pickerParams.type === 'date-range') {
        newValue.forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
      }
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose when clicking outside of the picker without prior change', function test() {
      // TODO: Fix this test and enable it on mobile and date-range
      if (pickerParams.variant === 'mobile' || pickerParams.type === 'date-range') {
        this.skip();
      }

      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <ElementToTest
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          value={values[0]}
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

    it('should call onClose and onAccept with the live value when clicking outside of the picker', function test() {
      // TODO: Fix this test and enable it on mobile and date-range
      if (pickerParams.variant === 'mobile' || pickerParams.type === 'date-range') {
        this.skip();
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
  });
};
