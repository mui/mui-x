import * as React from 'react';
import TextField from '@mui/material/TextField';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireTouchChangedEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { Unstable_MobileNextDateTimePicker as MobileNextDateTimePicker } from '@mui/x-date-pickers/MobileNextDateTimePicker';
import {
  adapterToUse,
  createPickerRenderer,
  openPicker,
  getClockTouchEvent,
} from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

describe('<MobileNextDateTimePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2018-01-01T00:00:00.000'),
  });

  describeValidation(MobileNextDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'new-picker',
  }));

  it('prop: open – overrides open state', () => {
    render(
      <MobileNextDateTimePicker open defaultValue={adapterToUse.date(new Date(2018, 0, 1))} />,
    );

    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('should render date and time by default', () => {
    render(
      <MobileNextDateTimePicker
        open
        showToolbar
        defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
      />,
    );

    expect(screen.queryByMuiTest('seconds')).to.equal(null);
    expect(screen.getByMuiTest('hours')).to.have.text('10');
    expect(screen.getByMuiTest('minutes')).to.have.text('01');
    expect(screen.getByMuiTest('datetimepicker-toolbar-year')).to.have.text('2021');
    expect(screen.getByMuiTest('datetimepicker-toolbar-day')).to.have.text('Nov 20');
  });

  it('should render toolbar and tabs by default', () => {
    render(
      <MobileNextDateTimePicker
        open
        value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
        defaultValue={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  it('should not render only toolbar when `showToolbar` is `false`', () => {
    render(
      <MobileNextDateTimePicker
        open
        showToolbar={false}
        defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
      />,
    );

    expect(screen.queryByMuiTest('picker-toolbar-title')).to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  it('can render seconds on view', () => {
    render(
      <MobileNextDateTimePicker
        open
        showToolbar
        openTo="seconds"
        views={['seconds']}
        defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
      />,
    );
    expect(screen.getByMuiTest('seconds')).to.have.text('22');
  });

  describe('Component slots: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <MobileNextDateTimePicker
          open
          defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
          componentsProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<MobileNextDateTimePicker onOpen={onOpen} defaultValue={null} />);

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
        <MobileNextDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the year view
      userEvent.mousePress(screen.getByLabelText(/switch to year view/));
      userEvent.mousePress(screen.getByText('2010', { selector: 'button' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 1));

      // Change the date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '15' }));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 15));

      // Change the hours
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2010, 0, 15, 11)),
      );

      // Change the minutes
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', getClockTouchEvent());
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', getClockTouchEvent());
      expect(onChange.callCount).to.equal(4);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2010, 0, 15, 11, 53)),
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
        <MobileNextDateTimePicker
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByRole('gridcell', { name: '15' }));

      // Change the hours (already tested)
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Change the minutes (already tested)
      const minuteClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', minuteClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', minuteClockEvent);

      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2018, 0, 15, 11, 53)),
      );
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onChange with the initial value when clicking the "Cancel" button', function test() {
      if (typeof window.Touch === 'undefined' || typeof window.TouchEvent === 'undefined') {
        this.skip();
      }

      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByRole('gridcell', { name: '15' }));

      // Change the hours (already tested)
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Cancel the modifications
      userEvent.mousePress(screen.getByText(/cancel/i));
      expect(onChange.callCount).to.equal(3); // Date change + hours change + reset
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
        <MobileNextDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByRole('gridcell', { name: '15' }));

      // Change the hours (already tested)
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Accept the modifications
      userEvent.mousePress(screen.getByText(/ok/i));
      expect(onChange.callCount).to.equal(2); // Date change + hours change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2018, 0, 15, 11)),
      );
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });

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
        <MobileNextDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });

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
      render(<MobileNextDateTimePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);
      openPicker({ type: 'date-time', variant: 'mobile' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
