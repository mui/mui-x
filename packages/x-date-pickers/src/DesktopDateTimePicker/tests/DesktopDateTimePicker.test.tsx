import * as React from 'react';
import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import {
  adapterToUse,
  createPickerRenderer,
  openPicker,
  openPickerAsync,
  getFieldSectionsContainer,
  expectFieldValueV7,
} from 'test/utils/pickers';

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

      openPicker({ type: 'date-time' });

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
      // closeOnSelect false by default
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Click on 'accept' action to close the picker
      await user.click(screen.getByText(/ok/i));
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

    openPicker({ type: 'date-time' });

    // Change the date multiple times to check that Picker doesn't close after cycling through all views internally
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
    // closeOnSelect false by default
    expect(onAccept.callCount).to.equal(0);
    expect(onClose.callCount).to.equal(0);

    // Click on 'accept' action to close the picker
    await user.click(screen.getByText(/ok/i));
    expect(onAccept.callCount).to.equal(1);
    expect(onClose.callCount).to.equal(1);
  });

  it('should cycle focused views among the visible step after selection', async () => {
    const { user } = render(
      <DesktopDateTimePicker referenceDate={adapterToUse.date('2018-01-10')} />,
    );

    await openPickerAsync(user, { type: 'date-time' });

    const day = screen.getByRole('gridcell', { name: '10' });
    expect(day).toHaveFocus();
    await user.click(day);

    const hours = screen.getByRole('option', { name: '12 hours' });
    expect(hours).toHaveFocus();
    await user.click(hours);

    const minutes = screen.getByRole('option', { name: '0 minutes' });
    expect(minutes).toHaveFocus();
    await user.click(minutes);

    const meridiem = screen.getByRole('option', { name: 'AM' });
    expect(meridiem).toHaveFocus();
    const sectionsContainer = getFieldSectionsContainer();
    expectFieldValueV7(sectionsContainer, '01/10/2018 12:00 AM');
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
      expect(onAccept.callCount).to.equal(0); // onAccept false by default

      // Click on 'accept' action to close the picker
      await user.click(screen.getByText(/ok/i));
      expect(onAccept.callCount).to.equal(1);
    });

    it('should accept value and close Picker when selecting time on "DigitalClock" view renderer', async () => {
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
      expect(onAccept.callCount).to.equal(0); // onAccept false by default

      // Click on 'accept' action to close the picker
      await user.click(screen.getByText(/ok/i));
      expect(onAccept.callCount).to.equal(1);
    });
  });
});
