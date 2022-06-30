import * as React from 'react';
import TextField from '@mui/material/TextField';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireTouchChangedEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import {
  adapterToUse,
  createPickerRenderer,
  FakeTransitionComponent,
  openPicker,
  getClockTouchEvent,
  withPickerControls,
} from '../../../../test/utils/pickers-utils';

const WrappedMobileDateTimePicker = withPickerControls(MobileDateTimePicker)({
  DialogProps: { TransitionComponent: FakeTransitionComponent },
  renderInput: (params) => <TextField {...params} />,
});

describe('<MobileDateTimePicker />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2018-01-01T00:00:00.000'),
  });

  it('prop: open – overrides open state', () => {
    render(
      <MobileDateTimePicker
        renderInput={(params) => <TextField {...params} />}
        open
        onChange={() => {}}
        value={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('should render date and time by default', () => {
    render(
      <MobileDateTimePicker
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        open
        showToolbar
        value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
      />,
    );

    expect(screen.queryByMuiTest('seconds')).to.equal(null);
    expect(screen.getByMuiTest('hours')).to.have.text('10');
    expect(screen.getByMuiTest('minutes')).to.have.text('01');
    expect(screen.getByMuiTest('datetimepicker-toolbar-year')).to.have.text('2021');
    expect(screen.getByMuiTest('datetimepicker-toolbar-day')).to.have.text('Nov 20');
  });

  it('prop `showToolbar` – renders toolbar in MobileDateTimePicker', () => {
    render(
      <MobileDateTimePicker
        open
        showToolbar
        onChange={() => {}}
        value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
  });

  it('can render seconds on view', () => {
    render(
      <MobileDateTimePicker
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        open
        showToolbar
        views={['seconds']}
        value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
      />,
    );
    expect(screen.getByMuiTest('seconds')).to.have.text('22');
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<WrappedMobileDateTimePicker onOpen={onOpen} initialValue={null} />);

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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
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
      userEvent.mousePress(screen.getByLabelText('Jan 15, 2010'));
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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDateTimePicker
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 15, 2018'));

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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 15, 2018'));

      // Change the hours (already tested)
      const hourClockEvent = getClockTouchEvent();
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Cancel the modifications
      userEvent.mousePress(screen.getByText(/cancel/i));
      expect(onChange.callCount).to.equal(3); // Date change + hours change + reset
      expect(onChange.lastCall.args[0]).toEqualDateTime(initialValue);
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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 15, 2018'));

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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
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
        <WrappedMobileDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={null}
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
});
