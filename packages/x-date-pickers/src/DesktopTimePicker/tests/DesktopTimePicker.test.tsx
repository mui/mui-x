import * as React from 'react';
import { spy } from 'sinon';
import { screen, waitFor } from '@mui/internal-test-utils';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { adapterToUse, createPickerRenderer, openPickerAsync } from 'test/utils/pickers';

describe('<DesktopTimePicker />', () => {
  const { render } = createPickerRenderer();

  describe('rendering behavior', () => {
    it('should render "accept" action and 3 time sections by default', () => {
      render(<DesktopTimePicker open />);

      expect(screen.getByRole('button', { name: 'OK' })).not.to.equal(null);
      expect(screen.getByRole('listbox', { name: 'Select hours' })).not.to.equal(null);
      expect(screen.getByRole('option', { name: '1 hours' })).not.to.equal(null);
      expect(screen.getByRole('listbox', { name: 'Select minutes' })).not.to.equal(null);
      expect(screen.getByRole('option', { name: '5 minutes' })).not.to.equal(null);
      expect(screen.getByRole('listbox', { name: 'Select meridiem' })).not.to.equal(null);
      expect(screen.getByRole('option', { name: 'AM' })).not.to.equal(null);
    });

    it('should render single column Picker given big enough "thresholdToRenderTimeInASingleColumn" number', () => {
      render(<DesktopTimePicker open thresholdToRenderTimeInASingleColumn={1000} />);

      expect(screen.getByRole('listbox', { name: 'Select time' })).not.to.equal(null);
      expect(screen.getByRole('option', { name: '09:35 AM' })).not.to.equal(null);
    });

    it('should render single column Picker given big enough "timeSteps.minutes" number', () => {
      render(<DesktopTimePicker open timeSteps={{ minutes: 60 }} />);

      expect(screen.getByRole('listbox', { name: 'Select time' })).not.to.equal(null);
      expect(screen.getByRole('option', { name: '09:00 AM' })).not.to.equal(null);
    });

    it('should correctly use all "timeSteps"', () => {
      render(
        <DesktopTimePicker
          open
          views={['hours', 'minutes', 'seconds']}
          timeSteps={{ hours: 3, minutes: 15, seconds: 20 }}
        />,
      );

      Array.from({ length: 12 / 3 }).forEach((_, i) => {
        expect(screen.getByRole('option', { name: `${i * 3 || 12} hours` })).not.to.equal(null);
      });
      Array.from({ length: 60 / 15 }).forEach((_, i) => {
        expect(screen.getByRole('option', { name: `${i * 15} minutes` })).not.to.equal(null);
      });
      Array.from({ length: 60 / 20 }).forEach((_, i) => {
        expect(screen.getByRole('option', { name: `${i * 20} seconds` })).not.to.equal(null);
      });
    });
  });

  describe('selecting behavior', () => {
    it('should call "onAccept", "onChange", and "onClose" when selecting a single option', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopTimePicker
          timeSteps={{ minutes: 60 }}
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          referenceDate={adapterToUse.date('2018-01-01')}
        />,
      );

      await openPickerAsync(user, { type: 'time' });

      await user.click(screen.getByRole('option', { name: '09:00 AM' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 9, 0));
      // closeOnSelect false by default
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Click on 'accept' action to close the picker
      await user.click(screen.getByText(/ok/i));
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call "onAccept", "onChange", and "onClose" when selecting all section', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          referenceDate={adapterToUse.date('2018-01-01')}
        />,
      );

      await openPickerAsync(user, { type: 'time' });

      await user.click(screen.getByRole('option', { name: '2 hours' }));
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      await user.click(screen.getByRole('option', { name: '15 minutes' }));
      expect(onChange.callCount).to.equal(2);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      await user.click(screen.getByRole('option', { name: 'PM' }));
      expect(onChange.callCount).to.equal(3);
      // closeOnSelect false by default
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Click on 'accept' action to close the picker
      await user.click(screen.getByText(/ok/i));
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });

    it('should allow out of order section selection', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          referenceDate={adapterToUse.date('2018-01-01')}
        />,
      );

      await openPickerAsync(user, { type: 'time' });

      await user.click(screen.getByRole('option', { name: '15 minutes' }));
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      await user.click(screen.getByRole('option', { name: '2 hours' }));
      expect(onChange.callCount).to.equal(2);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      await user.click(screen.getByRole('option', { name: '25 minutes' }));
      expect(onChange.callCount).to.equal(3);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      await user.click(screen.getByRole('option', { name: 'PM' }));
      expect(onChange.callCount).to.equal(4);
      // closeOnSelect false by default
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Click on 'accept' action to close the picker
      await user.click(screen.getByText(/ok/i));
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });

    it('should finish selection when selecting only the last section', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          referenceDate={adapterToUse.date('2018-01-01')}
        />,
      );

      await openPickerAsync(user, { type: 'time' });

      await user.click(screen.getByRole('option', { name: 'PM' }));
      expect(onChange.callCount).to.equal(1);
      // closeOnSelect false by default
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Click on 'accept' action to close the picker
      await user.click(screen.getByText(/ok/i));
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });
  });

  describe('focus behavior', () => {
    it('should close the Picker and move focus to the text field when clicking it', async () => {
      const { user } = render(
        <React.Fragment>
          <input aria-label="decoy" />
          <DesktopTimePicker />
        </React.Fragment>,
      );

      await user.click(screen.getByRole('button', { name: 'Choose time' }));

      const decoyInput = screen.getByRole('textbox', { name: 'decoy' });
      await user.click(decoyInput);

      await waitFor(() => expect(screen.queryByRole('dialog')).to.equal(null));
      // the input should be focused—the new active element
      expect(document.activeElement!).to.equal(decoyInput);
    });

    it('should close the Picker with digital clock and move focus to the text field when clicking it', async () => {
      const { user } = render(
        <React.Fragment>
          <input aria-label="decoy" />
          <DesktopTimePicker timeSteps={{ minutes: 60 }} />
        </React.Fragment>,
      );

      await user.click(screen.getByRole('button', { name: 'Choose time' }));

      const decoyInput = screen.getByRole('textbox', { name: 'decoy' });
      await user.click(decoyInput);

      await waitFor(() => expect(screen.queryByRole('dialog')).to.equal(null));
      // the input should be focused—the new active element
      expect(document.activeElement!).to.equal(decoyInput);
    });
  });
});
