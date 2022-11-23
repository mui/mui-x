import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireTouchChangedEvent, screen, userEvent, act } from '@mui/monorepo/test/utils';
import { Unstable_MobileNextTimePicker as MobileNextTimePicker } from '@mui/x-date-pickers/MobileNextTimePicker';
import {
  createPickerRenderer,
  adapterToUse,
  openPicker,
  getClockTouchEvent,
} from 'test/utils/pickers-utils';

describe('<MobileTimePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describe('picker state', () => {
    it('should open when clicking the textbox', () => {
      const onOpen = spy();

      render(<MobileNextTimePicker onOpen={onOpen} />);

      userEvent.mousePress(screen.getByRole('textbox'));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should fire a change event when meridiem changes', () => {
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
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<MobileNextTimePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);
      openPicker({ type: 'time', variant: 'mobile' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
