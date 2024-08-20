import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireTouchChangedEvent, screen } from '@mui/internal-test-utils';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import {
  adapterToUse,
  createPickerRenderer,
  openPicker,
  getClockTouchEvent,
  getFieldSectionsContainer,
} from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<MobileDateTimePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  it('should render date and time by default', () => {
    render(
      <MobileDateTimePicker
        enableAccessibleFieldDOMStructure
        open
        slotProps={{ toolbar: { hidden: false } }}
        defaultValue={adapterToUse.date('2021-11-20T10:01:22')}
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
        enableAccessibleFieldDOMStructure
        open
        value={adapterToUse.date('2021-11-20T10:01:22')}
      />,
    );

    expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  it('can render seconds on view', () => {
    render(
      <MobileDateTimePicker
        enableAccessibleFieldDOMStructure
        open
        slotProps={{ toolbar: { hidden: false } }}
        openTo="seconds"
        views={['seconds']}
        defaultValue={adapterToUse.date('2021-11-20T10:01:22')}
      />,
    );
    expect(screen.getByMuiTest('seconds')).to.have.text('22');
  });

  describe('Component slot: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <MobileDateTimePicker
          enableAccessibleFieldDOMStructure
          open
          defaultValue={adapterToUse.date('2021-11-20T10:01:22')}
          slotProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });
  });

  describe('Component slot: Toolbar', () => {
    it('should not render only toolbar when `hidden` is `true`', () => {
      render(
        <MobileDateTimePicker
          enableAccessibleFieldDOMStructure
          open
          slotProps={{ toolbar: { hidden: true } }}
          defaultValue={adapterToUse.date('2021-11-20T10:01:22')}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).to.equal(null);
      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
    });
  });

  describe('picker state', () => {
    it('should open when clicking the input', () => {
      const onOpen = spy();

      render(<MobileDateTimePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />);

      fireUserEvent.mousePress(getFieldSectionsContainer());

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
      const defaultValue = adapterToUse.date('2018-01-01');

      render(
        <MobileDateTimePicker
          enableAccessibleFieldDOMStructure
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
      fireUserEvent.mousePress(screen.getByLabelText(/switch to year view/));
      fireUserEvent.mousePress(screen.getByText('2010', { selector: 'button' }));

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 1));

      clock.runToLast();

      // Change the date
      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '15' }));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 15));

      // Change the hours
      const hourClockEvent = getClockTouchEvent(11, '12hours');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2010-01-15T11:00:00'));

      // Change the minutes
      const minuteClockEvent = getClockTouchEvent(53, 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', minuteClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', minuteClockEvent);
      expect(onChange.callCount).to.equal(4);
      expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2010-01-15T11:53:00'));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });
});
