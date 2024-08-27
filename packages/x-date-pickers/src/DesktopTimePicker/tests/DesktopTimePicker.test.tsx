import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { createPickerRenderer, openPicker } from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DesktopTimePicker />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2018-01-01T10:05:05.000'),
  });

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

    it('should render single column picker given big enough "thresholdToRenderTimeInASingleColumn" number', () => {
      render(<DesktopTimePicker open thresholdToRenderTimeInASingleColumn={1000} />);

      expect(screen.getByRole('listbox', { name: 'Select time' })).not.to.equal(null);
      expect(screen.getByRole('option', { name: '09:35 AM' })).not.to.equal(null);
    });

    it('should render single column picker given big enough "timeSteps.minutes" number', () => {
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
    it('should call "onAccept", "onChange", and "onClose" when selecting a single option', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopTimePicker
          timeSteps={{ minutes: 60 }}
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
        />,
      );

      openPicker({ type: 'time', variant: 'desktop' });

      fireUserEvent.mousePress(screen.getByRole('option', { name: '09:00 AM' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 9, 0));
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 9, 0));
      expect(onClose.callCount).to.equal(1);
    });

    it('should call "onAccept", "onChange", and "onClose" when selecting all section', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(<DesktopTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} />);

      openPicker({ type: 'time', variant: 'desktop' });

      fireUserEvent.mousePress(screen.getByRole('option', { name: '2 hours' }));
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      fireUserEvent.mousePress(screen.getByRole('option', { name: '15 minutes' }));
      expect(onChange.callCount).to.equal(2);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      fireUserEvent.mousePress(screen.getByRole('option', { name: 'PM' }));
      expect(onChange.callCount).to.equal(3);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 14, 15));
      expect(onClose.callCount).to.equal(1);
    });

    it('should allow out of order section selection', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(<DesktopTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} />);

      openPicker({ type: 'time', variant: 'desktop' });

      fireUserEvent.mousePress(screen.getByRole('option', { name: '15 minutes' }));
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      fireUserEvent.mousePress(screen.getByRole('option', { name: '2 hours' }));
      expect(onChange.callCount).to.equal(2);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      fireUserEvent.mousePress(screen.getByRole('option', { name: '25 minutes' }));
      expect(onChange.callCount).to.equal(3);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      fireUserEvent.mousePress(screen.getByRole('option', { name: 'PM' }));
      expect(onChange.callCount).to.equal(4);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 14, 25));
      expect(onClose.callCount).to.equal(1);
    });

    it('should finish selection when selecting only the last section', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(<DesktopTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} />);

      openPicker({ type: 'time', variant: 'desktop' });

      fireUserEvent.mousePress(screen.getByRole('option', { name: 'PM' }));
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 12, 0));
      expect(onClose.callCount).to.equal(1);
    });
  });
});
