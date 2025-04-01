import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { adapterToUse, createPickerRenderer, openPicker } from 'test/utils/pickers';
import { hasTouchSupport, testSkipIf } from 'test/utils/skipIf';

describe('<MobileDateTimePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  it('should render date and time by default', () => {
    render(
      <MobileDateTimePicker
        open
        slotProps={{ toolbar: { hidden: false } }}
        defaultValue={adapterToUse.date('2021-11-20T10:01:22')}
      />,
    );

    expect(screen.queryByTestId('seconds')).to.equal(null);
    expect(screen.getByTestId('hours')).to.have.text('10');
    expect(screen.getByTestId('minutes')).to.have.text('01');
    expect(screen.getByTestId('datetimepicker-toolbar-year')).to.have.text('2021');
    expect(screen.getByTestId('datetimepicker-toolbar-day')).to.have.text('Nov 20');
  });

  it('should render toolbar and tabs by default', () => {
    render(<MobileDateTimePicker open value={adapterToUse.date('2021-11-20T10:01:22')} />);

    expect(screen.queryByTestId('picker-toolbar-title')).not.to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  it('can render seconds on view', () => {
    render(
      <MobileDateTimePicker
        open
        slotProps={{ toolbar: { hidden: false } }}
        openTo="seconds"
        views={['seconds']}
        defaultValue={adapterToUse.date('2021-11-20T10:01:22')}
      />,
    );
    expect(screen.getByTestId('seconds')).to.have.text('22');
  });

  describe('Component slot: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <MobileDateTimePicker
          open
          defaultValue={adapterToUse.date('2021-11-20T10:01:22')}
          slotProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.queryByTestId('picker-toolbar-title')).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });
  });

  describe('Component slot: Toolbar', () => {
    it('should not render only toolbar when `hidden` is `true`', () => {
      render(
        <MobileDateTimePicker
          open
          slotProps={{ toolbar: { hidden: true } }}
          defaultValue={adapterToUse.date('2021-11-20T10:01:22')}
        />,
      );

      expect(screen.queryByTestId('picker-toolbar-title')).to.equal(null);
      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
    });
  });

  describe('picker state', () => {
    testSkipIf(!hasTouchSupport)('should call onChange when selecting each view', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date('2018-01-01');

      render(
        <MobileDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          ampm
        />,
      );

      openPicker({ type: 'date-time' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the year view
      fireEvent.click(screen.getByLabelText(/switch to year view/));
      fireEvent.click(screen.getByText('2010', { selector: 'button' }));

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 1));

      clock.runToLast();

      // Change the date
      fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 15));

      // Change the hours
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('option', { name: '11 hours' }));
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2010-01-15T11:00:00'));

      // Change the minutes
      fireEvent.click(screen.getByRole('option', { name: '55 minutes' }));
      expect(onChange.callCount).to.equal(4);
      expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2010-01-15T11:55:00'));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });
});
