import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireTouchChangedEvent, screen, userEvent, act } from '@mui/monorepo/test/utils';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import {
  createPickerRenderer,
  adapterToUse,
  openPicker,
  getClockTouchEvent,
} from 'test/utils/pickers';

describe('<MobileTimePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describe('picker state', () => {
    it('should open when clicking the textbox', () => {
      const onOpen = spy();

      render(<MobileTimePicker onOpen={onOpen} />);

      userEvent.mousePress(screen.getByRole('textbox'));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should fire a change event when meridiem changes', () => {
      const handleChange = spy();
      render(
        <MobileTimePicker
          ampm
          onChange={handleChange}
          open
          componentsProps={{ toolbar: { hidden: false } }}
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
        <MobileTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'time', variant: 'mobile' });

      // Change the hours
      const hourClockEvent = getClockTouchEvent(11, '12hours');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2018, 0, 1, 11)),
      );

      // Change the minutes
      const minuteClockEvent = getClockTouchEvent(53, 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', minuteClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', minuteClockEvent);
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2018, 0, 1, 11, 53)),
      );
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });
});
