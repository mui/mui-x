import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  describeConformance,
  fireTouchChangedEvent,
  screen,
  userEvent,
  act,
} from '@mui/monorepo/test/utils';
import { Unstable_MobileNextTimePicker as MobileNextTimePicker } from '@mui/x-date-pickers/MobileNextTimePicker';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
  openPicker,
  getClockTouchEvent,
} from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

describe('<MobileTimePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MobileNextTimePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'new-picker',
  }));

  describeConformance(<MobileNextTimePicker />, () => ({
    classes: {},
    muiName: 'MuiMobileTimePicker',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'reactTestRenderer',
    ],
  }));

  ['readOnly', 'disabled'].forEach((prop) => {
    it(`cannot be opened when "Choose time" is clicked when ${prop}={true}`, () => {
      const handleOpen = spy();
      render(
        <MobileNextTimePicker
          defaultValue={adapterToUse.date(new Date(2019, 0, 1))}
          {...{ [prop]: true }}
          onOpen={handleOpen}
          open={false}
        />,
      );

      act(() => {
        userEvent.mousePress(screen.getByLabelText(/Choose time/));
      });

      expect(handleOpen.callCount).to.equal(0);
    });
  });

  it('fires a change event when meridiem changes', () => {
    const handleChange = spy();
    render(
      <MobileNextTimePicker
        ampm
        onChange={handleChange}
        open
        showToolbar
        value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))}
      />,
    );
    const buttonPM = screen.getByRole('button', { name: 'PM' });

    act(() => {
      buttonPM.click();
    });

    expect(handleChange.callCount).to.equal(1);
    expect(handleChange.firstCall.args[0]).toEqualDateTime(new Date(2019, 0, 1, 16, 20));
  });

  describe('picker state', () => {
    it('should open when clicking the textbox', () => {
      const onOpen = spy();

      render(<MobileNextTimePicker onOpen={onOpen} />);

      userEvent.mousePress(screen.getByRole('textbox'));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onChange when selecting each view', function test() {
      if (typeof window.Touch === 'undefined' || typeof window.TouchEvent === 'undefined') {
        this.skip();
      }

      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'time', variant: 'mobile' });

      // Change the hours
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2018, 0, 1, 11)),
      );

      // Change the minutes
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', getClockTouchEvent());
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', getClockTouchEvent());
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2018, 0, 1, 11, 53)),
      );
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept when selecting the minutes if props.closeOnSelect = true', function test() {
      if (typeof window.Touch === 'undefined' || typeof window.TouchEvent === 'undefined') {
        this.skip();
      }

      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextTimePicker
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'time', variant: 'mobile' });

      // Change the hours (already tested)
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Change the minutes (already tested)
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', getClockTouchEvent());
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', getClockTouchEvent());

      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2018, 0, 1, 11, 53)),
      );
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onChange with the initial time when clicking the "Cancel" button', function test() {
      if (typeof window.Touch === 'undefined' || typeof window.TouchEvent === 'undefined') {
        this.skip();
      }

      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'time', variant: 'mobile' });

      // Change the hours (already tested)
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Cancel the modifications
      userEvent.mousePress(screen.getByText(/cancel/i));
      expect(onChange.callCount).to.equal(2); // Hours change + reset
      expect(onChange.lastCall.args[0]).toEqualDateTime(defaultValue);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value and onAccept with the live value when clicking the "OK"', function test() {
      if (typeof window.Touch === 'undefined' || typeof window.TouchEvent === 'undefined') {
        this.skip();
      }

      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'time', variant: 'mobile' });

      // Change the hours (already tested)
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Accept the modifications
      userEvent.mousePress(screen.getByText(/ok/i));
      expect(onChange.callCount).to.equal(1); // Hours change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2018, 0, 1, 11)),
      );
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'time', variant: 'mobile' });

      // Clear the date
      userEvent.mousePress(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).to.equal(null);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).to.equal(null);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange or onAccept when pressing "Clear" button with an already null value', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <MobileNextTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'time', variant: 'mobile' });

      // Clear the date
      userEvent.mousePress(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    // TODO: Write test
    // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
    // })
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<MobileNextTimePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);
      openPicker({ type: 'time', variant: 'mobile' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
