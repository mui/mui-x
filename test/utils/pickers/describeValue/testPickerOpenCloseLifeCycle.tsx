import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { config } from 'react-transition-group';
import { fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { PickerRangeValue, PickerValidValue } from '@mui/x-date-pickers/internals';
import {
  getExpectedOnChangeCount,
  getFieldInputRoot,
  isPickerRangeType,
  isPickerSingleInput,
  openPicker,
  openPickerAsync,
  PickerRangeComponentType,
} from 'test/utils/pickers';
import { describeSkipIf, testSkipIf } from 'test/utils/skipIf';
import { DescribeValueTestSuite } from './describeValue.types';
import { fireUserEvent } from '../../fireUserEvent';

export const testPickerOpenCloseLifeCycle: DescribeValueTestSuite<PickerValidValue, 'picker'> = (
  ElementToTest,
  options,
) => {
  const { componentFamily, render, renderWithProps, values, setNewValue, ...pickerParams } =
    options;

  const isRangeType = isPickerRangeType(pickerParams.type);
  const viewWrapperRole =
    isPickerSingleInput(options) || pickerParams.variant === 'mobile' ? 'dialog' : 'tooltip';
  const shouldCloseOnSelect =
    (pickerParams.type === 'date' || pickerParams.type === 'date-range') &&
    pickerParams.variant === 'desktop';

  describeSkipIf(componentFamily !== 'picker')('Picker open / close lifecycle', () => {
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

    it('should call onChange, onClose and onAccept (if Desktop Date Picker or Desktop Date Range Picker) when selecting a value', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { selectSection, pressKey } = renderWithProps(
        {
          enableAccessibleFieldDOMStructure: true,
          onChange,
          onAccept,
          onClose,
          defaultValue: values[0],
          open: true,
        },
        { componentFamily },
      );

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the value
      let newValue = setNewValue(values[0], { isOpened: true, selectSection, pressKey });
      expect(onChange.callCount).to.equal(getExpectedOnChangeCount(componentFamily, pickerParams));
      if (isRangeType) {
        newValue = setNewValue(newValue, {
          isOpened: true,
          setEndDate: true,
          selectSection,
          pressKey,
        });
        (newValue as PickerRangeValue).forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
      }

      expect(onAccept.callCount).to.equal(!shouldCloseOnSelect ? 0 : 1);
      expect(onClose.callCount).to.equal(!shouldCloseOnSelect ? 0 : 1);
    });

    testSkipIf(pickerParams.variant !== 'mobile')(
      'should not select input content after closing on mobile',
      () => {
        const { selectSection, pressKey } = renderWithProps(
          { enableAccessibleFieldDOMStructure: true, defaultValue: values[0] },
          { componentFamily },
        );

        // Change the value
        setNewValue(values[0], { selectSection, pressKey, closeMobilePicker: true });
        const fieldRoot = getFieldInputRoot();
        expect(fieldRoot.scrollLeft).to.be.equal(0);
      },
    );

    it('should call onChange, onClose and onAccept when selecting a value and `props.closeOnSelect` is true', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { selectSection, pressKey } = renderWithProps(
        {
          enableAccessibleFieldDOMStructure: true,
          onChange,
          onAccept,
          onClose,
          defaultValue: values[0],
          open: true,
          closeOnSelect: true,
        },
        { componentFamily },
      );

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the value
      let newValue = setNewValue(values[0], { isOpened: true, selectSection, pressKey });
      expect(onChange.callCount).to.equal(getExpectedOnChangeCount(componentFamily, pickerParams));
      if (isRangeType) {
        newValue = setNewValue(newValue, {
          isOpened: true,
          setEndDate: true,
          selectSection,
          pressKey,
        });
        (newValue as PickerRangeValue).forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
      }
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange or onAccept when selecting the same value', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { selectSection, pressKey } = renderWithProps(
        {
          enableAccessibleFieldDOMStructure: true,
          onChange,
          onAccept,
          onClose,
          open: true,
          value: values[0],
          closeOnSelect: true,
        },
        { componentFamily },
      );

      // Change the value (same value)
      setNewValue(values[0], { isOpened: true, applySameValue: true, selectSection, pressKey });
      if (isRangeType) {
        setNewValue(values[0], {
          isOpened: true,
          applySameValue: true,
          setEndDate: true,
          selectSection,
          pressKey,
        });
      }

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when selecting a date and `props.closeOnSelect` is false', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { selectSection, pressKey } = renderWithProps(
        {
          enableAccessibleFieldDOMStructure: true,
          onChange,
          onAccept,
          onClose,
          defaultValue: values[0],
          open: true,
          closeOnSelect: false,
        },
        { componentFamily },
      );

      // Change the value
      let newValue = setNewValue(values[0], { isOpened: true, selectSection, pressKey });
      const initialChangeCount = getExpectedOnChangeCount(componentFamily, pickerParams);
      expect(onChange.callCount).to.equal(initialChangeCount);
      if (isRangeType) {
        newValue = setNewValue(newValue, {
          isOpened: true,
          setEndDate: true,
          selectSection,
          pressKey,
        });
        (newValue as PickerRangeValue).forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
      }
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the value
      let newValueBis = setNewValue(newValue, { isOpened: true, selectSection, pressKey });
      if (isRangeType) {
        expect(onChange.callCount).to.equal(
          initialChangeCount +
            getExpectedOnChangeCount(componentFamily, pickerParams) * 2 -
            (pickerParams.type === 'date-time-range' || pickerParams.type === 'time-range' ? 1 : 0),
        );
        newValueBis = setNewValue(newValueBis, {
          isOpened: true,
          setEndDate: true,
          selectSection,
          pressKey,
        });
        (newValueBis as PickerRangeValue).forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.callCount).to.equal(
          initialChangeCount +
            getExpectedOnChangeCount(componentFamily, pickerParams) -
            // meridiem does not change this time in case of multi section digital clock
            (pickerParams.type === 'time' || pickerParams.type === 'date-time' ? 1 : 0),
        );
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValueBis);
      }
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept with the live value when pressing Escape', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { selectSection, pressKey, user } = renderWithProps(
        {
          enableAccessibleFieldDOMStructure: true,
          onChange,
          onAccept,
          onClose,
          defaultValue: values[0],
          open: true,
          closeOnSelect: false,
        },
        { componentFamily },
      );

      // Change the value (already tested)
      const newValue = setNewValue(values[0], { isOpened: true, selectSection, pressKey });

      // Dismiss the picker
      await user.keyboard('[Escape]');
      expect(onChange.callCount).to.equal(getExpectedOnChangeCount(componentFamily, pickerParams));
      expect(onAccept.callCount).to.equal(1);
      if (isRangeType) {
        (newValue as PickerRangeValue).forEach((value, index) => {
          expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
        });
      } else {
        expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
      }
      expect(onClose.callCount).to.equal(1);
    });

    // TODO: Fix this test and enable it on mobile and date-range
    testSkipIf(pickerParams.variant === 'mobile' || isRangeType)(
      'should call onClose when clicking outside of the picker without prior change',
      () => {
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
        fireUserEvent.mousePress(document.body);
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      },
    );

    // TODO: Fix this test and enable it on mobile and date-range
    testSkipIf(pickerParams.variant === 'mobile' || isRangeType)(
      'should call onClose and onAccept with the live value when clicking outside of the picker',
      () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { selectSection, pressKey } = renderWithProps(
          {
            enableAccessibleFieldDOMStructure: true,
            onChange,
            onAccept,
            onClose,
            defaultValue: values[0],
            open: true,
            closeOnSelect: false,
          },
          { componentFamily },
        );

        // Change the value (already tested)
        const newValue = setNewValue(values[0], { isOpened: true, selectSection, pressKey });

        // Dismiss the picker
        fireUserEvent.keyPress(document.activeElement!, { key: 'Escape' });
        expect(onChange.callCount).to.equal(
          getExpectedOnChangeCount(componentFamily, pickerParams),
        );
        expect(onAccept.callCount).to.equal(1);
        expect(onAccept.lastCall.args[0]).toEqualDateTime(newValue);
        expect(onClose.callCount).to.equal(1);
      },
    );

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
      fireEvent.click(document.body);
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
      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });

  testSkipIf(
    !['date-range', 'time-range', 'date-time-range'].includes(pickerParams.type) ||
      (pickerParams as any).fieldType !== 'single-input',
  )('should return back to start range position after reopening a range picker', async () => {
    const pickerType = pickerParams.type as PickerRangeComponentType;
    // If transitions are disabled, the `onExited` event is not triggered
    config.disabled = false;
    const { user } = render(<ElementToTest slotProps={{ toolbar: { hidden: false } }} />);

    await openPickerAsync(user, {
      type: pickerType,
      fieldType: 'single-input',
      initialFocus: 'start',
    });

    const isDateTimeRangePicker = pickerParams.type === 'date-time-range';
    if (isDateTimeRangePicker) {
      // click the end date toolbar button
      await user.click(screen.getAllByTestId('datetimepicker-toolbar-day')[1]);
    } else {
      const toolbarButtons = screen.getAllByTestId('toolbar-button');
      // click the first button of the end toolbar
      await user.click(toolbarButtons[toolbarButtons.length / 2]);
    }

    await user.keyboard('[Escape]');

    await waitFor(() => expect(screen.queryByRole(viewWrapperRole)).to.equal(null));

    // open the picker again
    await openPickerAsync(user, {
      type: pickerType,
      fieldType: 'single-input',
      initialFocus: 'start',
    });

    let toolbarButton: HTMLElement;
    if (isDateTimeRangePicker) {
      toolbarButton = screen.getAllByTestId('datetimepicker-toolbar-day')[0];
    } else {
      toolbarButton = screen.getAllByTestId('toolbar-button')[0];
    }
    expect(toolbarButton.querySelector('[data-selected="true"]')).to.not.equal(null);
  });
};
