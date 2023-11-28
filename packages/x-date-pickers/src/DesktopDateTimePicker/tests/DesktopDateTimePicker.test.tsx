import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, userEvent } from '@mui-internal/test-utils';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { adapterToUse, createPickerRenderer, openPicker } from 'test/utils/pickers';

describe('<DesktopDateTimePicker />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2018-01-01T10:05:05.000'),
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<DesktopDateTimePicker onOpen={onOpen} defaultValue={null} />);

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onAccept when selecting the same date and time after changing the year', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={adapterToUse.date('2018-01-01T11:55:00')}
          openTo="year"
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Select year
      userEvent.mousePress(screen.getByRole('radio', { name: '2025' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1, 11, 55));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date (same value)
      userEvent.mousePress(screen.getByRole('gridcell', { name: '1' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the hours (same value)
      userEvent.mousePress(screen.getByRole('option', { name: '11 hours' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the minutes (same value)
      userEvent.mousePress(screen.getByRole('option', { name: '55 minutes' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the meridiem (same value)
      userEvent.mousePress(screen.getByRole('option', { name: 'AM' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });
  });

  describe('prop: timeSteps', () => {
    it('should use "DigitalClock" view renderer, when "timeSteps.minutes" = 60', () => {
      const onChange = spy();
      const onAccept = spy();
      render(
        <DesktopDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          timeSteps={{ minutes: 60 }}
        />,
      );

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      userEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      userEvent.mousePress(screen.getByRole('option', { name: '03:00 AM' }));

      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 2, 3, 0, 0));
      expect(onAccept.callCount).to.equal(1);
    });

    it('should accept value and close picker when selecting time on "DigitalClock" view renderer', () => {
      const onChange = spy();
      const onAccept = spy();
      render(
        <DesktopDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          timeSteps={{ minutes: 60 }}
        />,
      );

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      userEvent.mousePress(screen.getByRole('option', { name: '03:00 AM' }));

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 3, 0, 0));
      expect(onAccept.callCount).to.equal(1);
    });
  });
});
