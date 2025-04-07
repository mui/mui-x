import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import {
  createPickerRenderer,
  adapterToUse,
  openPicker,
  getClockTouchEvent,
} from 'test/utils/pickers';
import { testSkipIf, hasTouchSupport } from 'test/utils/skipIf';

describe('<MobileTimePicker />', () => {
  const { render } = createPickerRenderer();

  describe('picker state', () => {
    it('should fire a change event when meridiem changes', () => {
      const handleChange = spy();
      render(
        <MobileTimePicker
          ampm
          onChange={handleChange}
          open
          slotProps={{ toolbar: { hidden: false } }}
          value={adapterToUse.date('2019-01-01T04:20:00')}
        />,
      );
      const buttonPM = screen.getByRole('button', { name: 'PM' });

      fireEvent.click(buttonPM);

      expect(handleChange.callCount).to.equal(1);
      expect(handleChange.firstCall.args[0]).toEqualDateTime(new Date(2019, 0, 1, 16, 20));
    });

    testSkipIf(!hasTouchSupport)('should call onChange when selecting each view', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date('2018-01-01');

      const { user } = render(
        <MobileTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'time' });

      // Change the hours
      const hourClockEvent = getClockTouchEvent(11, '12hours');

      await user.pointer([
        {
          keys: '[TouchA]',
          target: screen.getByTestId('clock'),
          coords: hourClockEvent.changedTouches[0],
        },
      ]);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-01T11:00:00'));

      // Change the minutes
      const minuteClockEvent = getClockTouchEvent(53, 'minutes');

      await user.pointer([
        {
          keys: '[TouchA]',
          target: screen.getByTestId('clock'),
          coords: minuteClockEvent.changedTouches[0],
        },
      ]);
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-01T11:53:00'));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });
});
