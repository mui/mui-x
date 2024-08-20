import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { adapterToUse, createPickerRenderer, openPicker } from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DesktopDateTimePicker />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2018-01-01T10:05:05.000'),
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<DesktopDateTimePicker onOpen={onOpen} defaultValue={null} />);

      fireUserEvent.mousePress(screen.getByLabelText(/Choose date/));

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

      openPicker({ type: 'date-time', variant: 'desktop' });

      // Select year
      fireUserEvent.mousePress(screen.getByRole('radio', { name: '2025' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1, 11, 55));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date (same value)
      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '1' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the hours (same value)
      fireUserEvent.mousePress(screen.getByRole('option', { name: '11 hours' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the minutes (same value)
      fireUserEvent.mousePress(screen.getByRole('option', { name: '55 minutes' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the meridiem (same value)
      fireUserEvent.mousePress(screen.getByRole('option', { name: 'AM' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });
  });

  it('should allow selecting same view multiple times', () => {
    const onChange = spy();
    const onAccept = spy();
    const onClose = spy();

    render(
      <DesktopDateTimePicker
        onChange={onChange}
        onAccept={onAccept}
        onClose={onClose}
        defaultValue={adapterToUse.date('2018-01-01T11:55:00')}
      />,
    );

    openPicker({ type: 'date-time', variant: 'desktop' });

    // Change the date multiple times to check that picker doesn't close after cycling through all views internally
    fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
    fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));
    fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '4' }));
    fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '5' }));
    expect(onChange.callCount).to.equal(4);
    expect(onAccept.callCount).to.equal(0);
    expect(onClose.callCount).to.equal(0);

    // Change the hours
    fireUserEvent.mousePress(screen.getByRole('option', { name: '10 hours' }));
    fireUserEvent.mousePress(screen.getByRole('option', { name: '9 hours' }));
    expect(onChange.callCount).to.equal(6);
    expect(onAccept.callCount).to.equal(0);
    expect(onClose.callCount).to.equal(0);

    // Change the minutes
    fireUserEvent.mousePress(screen.getByRole('option', { name: '50 minutes' }));
    expect(onChange.callCount).to.equal(7);
    // Change the meridiem
    fireUserEvent.mousePress(screen.getByRole('option', { name: 'PM' }));
    expect(onChange.callCount).to.equal(8);
    expect(onAccept.callCount).to.equal(1);
    expect(onClose.callCount).to.equal(1);
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

      fireUserEvent.mousePress(screen.getByLabelText(/Choose date/));

      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      fireUserEvent.mousePress(screen.getByRole('option', { name: '03:00 AM' }));

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

      fireUserEvent.mousePress(screen.getByLabelText(/Choose date/));

      fireUserEvent.mousePress(screen.getByRole('option', { name: '03:00 AM' }));

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 3, 0, 0));
      expect(onAccept.callCount).to.equal(1);
    });
  });
});
