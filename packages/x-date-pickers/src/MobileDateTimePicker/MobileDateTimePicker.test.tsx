import * as React from 'react';
import TextField from '@mui/material/TextField';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireTouchChangedEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import {
  adapterToUse,
  createPickerRenderer,
  openPicker,
  getClockTouchEvent,
} from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

describe('<MobileDateTimePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 2, 12, 8, 16, 0),
  });

  describeValidation(MobileDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'mobile',
  }));

  it('should render date and time by default', () => {
    render(
      <MobileDateTimePicker
        open
        componentsProps={{ toolbar: { hidden: false } }}
        defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
      />,
    );

    expect(screen.queryByMuiTest('seconds')).to.equal(null);
    expect(screen.getByMuiTest('hours')).to.have.text('10');
    expect(screen.getByMuiTest('minutes')).to.have.text('01');
    expect(screen.getByMuiTest('datetimepicker-toolbar-year')).to.have.text('2021');
    expect(screen.getByMuiTest('datetimepicker-toolbar-day')).to.have.text('Nov 20');
  });

  it('should render toolbar and tabs by default', () => {
    render(
      <MobileDateTimePicker
        open
        value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
        defaultValue={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  it('can render seconds on view', () => {
    render(
      <MobileDateTimePicker
        open
        componentsProps={{ toolbar: { hidden: false } }}
        openTo="seconds"
        views={['seconds']}
        defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
      />,
    );
    expect(screen.getByMuiTest('seconds')).to.have.text('22');
  });

  describe('Component slots: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <MobileDateTimePicker
          open
          defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
          slotProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });
  });

  describe('Slots: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <MobileDateTimePicker
          open
          defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
          slotProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });
  });

  describe('Component slots: Toolbar', () => {
    it('should not render only toolbar when `hidden` is `true`', () => {
      render(
        <MobileDateTimePicker
          open
          componentsProps={{ toolbar: { hidden: true } }}
          defaultValue={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).to.equal(null);
      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
    });
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<MobileDateTimePicker onOpen={onOpen} defaultValue={null} />);

      userEvent.mousePress(screen.getByRole('textbox'));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
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
        <MobileDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          ampm
        />,
      );

      openPicker({ type: 'date-time', variant: 'mobile' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the year view
      userEvent.mousePress(screen.getByLabelText(/switch to year view/));
      userEvent.mousePress(screen.getByText('2010', { selector: 'button' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 1));

      // Change the date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '15' }));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 15));

      // Change the hours
      const hourClockEvent = getClockTouchEvent(11, '12hours');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2010, 0, 15, 11)),
      );

      // Change the minutes
      const minuteClockEvent = getClockTouchEvent(53, 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', minuteClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', minuteClockEvent);
      expect(onChange.callCount).to.equal(4);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date(new Date(2010, 0, 15, 11, 53)),
      );
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<MobileDateTimePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);
      openPicker({ type: 'date-time', variant: 'mobile' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
