import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { adapterToUse, createPickerRenderer, openPicker } from 'test/utils/pickers';

describe('<DesktopDateTimePicker />', () => {
  const { render } = createPickerRenderer();

  describe('picker state', () => {
    it('should open when clicking "Choose date"', async () => {
      const onOpen = spy();

      const { user } = render(<DesktopDateTimePicker onOpen={onOpen} defaultValue={null} />);

      await user.click(screen.getByLabelText(/Choose date/));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onAccept when selecting the same date and time after changing the year', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={adapterToUse.date('2018-01-01T11:55:00')}
          openTo="year"
        />,
      );

      await openPicker({ type: 'date-time', variant: 'desktop', click: user.click });

      // Select year
      await user.click(screen.getByRole('radio', { name: '2025' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1, 11, 55));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date (same value)
      await user.click(screen.getByRole('gridcell', { name: '1' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the hours (same value)
      await user.click(screen.getByRole('option', { name: '11 hours' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the minutes (same value)
      await user.click(screen.getByRole('option', { name: '55 minutes' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      // Change the meridiem (same value)
      await user.click(screen.getByRole('option', { name: 'AM' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });
  });

  it('should allow selecting same view multiple times', async () => {
    const onChange = spy();
    const onAccept = spy();
    const onClose = spy();

    const { user } = render(
      <DesktopDateTimePicker
        onChange={onChange}
        onAccept={onAccept}
        onClose={onClose}
        defaultValue={adapterToUse.date('2018-01-01T11:55:00')}
      />,
    );

    await openPicker({ type: 'date-time', variant: 'desktop', click: user.click });

    // Change the date multiple times to check that picker doesn't close after cycling through all views internally
    await user.click(screen.getByRole('gridcell', { name: '2' }));
    await user.click(screen.getByRole('gridcell', { name: '3' }));
    await user.click(screen.getByRole('gridcell', { name: '4' }));
    await user.click(screen.getByRole('gridcell', { name: '5' }));
    expect(onChange.callCount).to.equal(4);
    expect(onAccept.callCount).to.equal(0);
    expect(onClose.callCount).to.equal(0);

    // Change the hours
    await user.click(screen.getByRole('option', { name: '10 hours' }));
    await user.click(screen.getByRole('option', { name: '9 hours' }));
    expect(onChange.callCount).to.equal(6);
    expect(onAccept.callCount).to.equal(0);
    expect(onClose.callCount).to.equal(0);

    // Change the minutes
    await user.click(screen.getByRole('option', { name: '50 minutes' }));
    expect(onChange.callCount).to.equal(7);
    // Change the meridiem
    await user.click(screen.getByRole('option', { name: 'PM' }));
    expect(onChange.callCount).to.equal(8);
    expect(onAccept.callCount).to.equal(1);
    expect(onClose.callCount).to.equal(1);
  });

  describe('prop: timeSteps', () => {
    it('should use "DigitalClock" view renderer, when "timeSteps.minutes" = 60', async () => {
      const onChange = spy();
      const onAccept = spy();
      const { user } = render(
        <DesktopDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          timeSteps={{ minutes: 60 }}
          referenceDate={adapterToUse.date('2018-01-01')}
        />,
      );

      await user.click(screen.getByLabelText(/Choose date/));

      await user.click(screen.getByRole('gridcell', { name: '2' }));
      await user.click(screen.getByRole('option', { name: '03:00 AM' }));

      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 2, 3, 0, 0));
      expect(onAccept.callCount).to.equal(1);
    });

    it('should accept value and close picker when selecting time on "DigitalClock" view renderer', async () => {
      const onChange = spy();
      const onAccept = spy();
      const { user } = render(
        <DesktopDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          timeSteps={{ minutes: 60 }}
          referenceDate={adapterToUse.date('2018-01-01')}
        />,
      );

      await user.click(screen.getByLabelText(/Choose date/));

      await user.click(screen.getByRole('option', { name: '03:00 AM' }));

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 3, 0, 0));
      expect(onAccept.callCount).to.equal(1);
    });
  });
});
