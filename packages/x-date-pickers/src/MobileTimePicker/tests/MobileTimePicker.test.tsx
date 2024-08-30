import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireTouchChangedEvent, screen } from '@mui/internal-test-utils';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import {
  createPickerRenderer,
  adapterToUse,
  openPicker,
  getClockTouchEvent,
  getFieldSectionsContainer,
} from 'test/utils/pickers';

describe('<MobileTimePicker />', () => {
  const { render } = createPickerRenderer();

  describe('picker state', () => {
    it('should open when clicking the input', async () => {
      const onOpen = spy();

      const { user } = render(
        <MobileTimePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />,
      );

      await user.click(getFieldSectionsContainer());

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should fire a change event when meridiem changes', async () => {
      const handleChange = spy();
      const { user } = render(
        <MobileTimePicker
          enableAccessibleFieldDOMStructure
          ampm
          onChange={handleChange}
          open
          slotProps={{ toolbar: { hidden: false } }}
          value={adapterToUse.date('2019-01-01T04:20:00')}
        />,
      );
      const buttonPM = screen.getByRole('button', { name: 'PM' });

      await user.click(buttonPM);

      expect(handleChange.callCount).to.equal(1);
      expect(handleChange.firstCall.args[0]).toEqualDateTime(new Date(2019, 0, 1, 16, 20));
    });

    it('should call onChange when selecting each view', async function test() {
      if (typeof window.Touch === 'undefined' || typeof window.TouchEvent === 'undefined') {
        this.skip();
      }

      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date('2018-01-01');

      const { user } = render(
        <MobileTimePicker
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      await openPicker({ type: 'time', variant: 'mobile', click: user.click });

      // Change the hours
      const hourClockEvent = getClockTouchEvent(11, '12hours');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-01T11:00:00'));

      // Change the minutes
      const minuteClockEvent = getClockTouchEvent(53, 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', minuteClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', minuteClockEvent);
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-01T11:53:00'));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });
});
