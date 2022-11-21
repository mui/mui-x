import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';
import { createPickerRenderer, adapterToUse, openPicker } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

describe('<MobileNextDatePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake', clockConfig: new Date() });

  describeValidation(MobileNextDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'new-picker',
  }));

  it('allows to change only year', () => {
    const onChangeMock = spy();
    render(
      <MobileNextDatePicker
        open
        value={adapterToUse.date(new Date(2019, 0, 1))}
        onChange={onChangeMock}
      />,
    );

    fireEvent.click(screen.getByLabelText(/switch to year view/i));
    fireEvent.click(screen.getByText('2010', { selector: 'button' }));

    expect(screen.getAllByMuiTest('calendar-month-and-year-text')[0]).to.have.text('January 2010');
    expect(onChangeMock.callCount).to.equal(1);
  });

  it('allows to select edge years from list', () => {
    render(
      <MobileNextDatePicker
        open
        reduceAnimations
        openTo="year"
        minDate={adapterToUse.date(new Date(2000, 0, 1))}
        maxDate={adapterToUse.date(new Date(2010, 0, 1))}
      />,
    );

    fireEvent.click(screen.getByText('2010', { selector: 'button' }));
    expect(screen.getByMuiTest('datepicker-toolbar-date')).to.have.text('Fri, Jan 1');
  });

  it('prop `onMonthChange` – dispatches callback when months switching', () => {
    const onMonthChangeMock = spy();
    render(<MobileNextDatePicker open onMonthChange={onMonthChangeMock} />);

    fireEvent.click(screen.getByLabelText('Next month'));
    expect(onMonthChangeMock.callCount).to.equal(1);
  });

  it('prop `loading` – displays default loading indicator', () => {
    render(<MobileNextDatePicker open loading />);

    expect(screen.queryAllByMuiTest('day')).to.have.length(0);
    expect(screen.getByMuiTest('loading-progress')).toBeVisible();
  });

  it('prop `renderLoading` – displays custom loading indicator', () => {
    render(
      <MobileNextDatePicker
        loading
        renderLoading={() => <DayCalendarSkeleton data-testid="custom-loading" />}
        open
      />,
    );

    expect(screen.queryByTestId('loading-progress')).to.equal(null);
    expect(screen.getByTestId('custom-loading')).toBeVisible();
  });

  describe('Component slots: Toolbar', () => {
    it('should render custom toolbar component', () => {
      render(
        <MobileNextDatePicker
          open
          components={{
            Toolbar: () => <div data-testid="custom-toolbar" />,
          }}
        />,
      );

      expect(screen.getByTestId('custom-toolbar')).toBeVisible();
    });

    it('should format toolbar according to `toolbarFormat` prop', () => {
      render(
        <MobileNextDatePicker
          open
          defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
          componentsProps={{
            toolbar: {
              toolbarFormat: 'MMMM',
            },
          }}
        />,
      );

      expect(screen.getByMuiTest('datepicker-toolbar-date').textContent).to.equal('January');
    });
  });

  describe('Component slots: Day', () => {
    it('should render custom day', () => {
      render(
        <MobileNextDatePicker
          open
          defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
          components={{
            Day: (props) => <PickersDay {...props} data-testid="test-day" />,
          }}
        />,
      );

      expect(screen.getAllByTestId('test-day')).to.have.length(31);
    });
  });

  it('prop `defaultCalendarMonth` – opens on provided month if date is `null`', () => {
    render(
      <MobileNextDatePicker open defaultCalendarMonth={adapterToUse.date(new Date(2018, 6, 1))} />,
    );

    expect(screen.getByText('July 2018')).toBeVisible();
  });

  it('prop `showTodayButton` – should accept current date when "today" button is clicked', () => {
    const handleClose = spy();
    const handleChange = spy();
    render(
      <MobileNextDatePicker
        onClose={handleClose}
        onChange={handleChange}
        defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
        componentsProps={{ actionBar: { actions: ['today'] } }}
      />,
    );
    const start = adapterToUse.date();
    userEvent.mousePress(screen.getByRole('textbox'));
    clock.tick(10);
    fireEvent.click(screen.getByText(/today/i));

    expect(handleClose.callCount).to.equal(1);
    expect(handleChange.callCount).to.equal(1);
    expect(adapterToUse.getDiff(handleChange.args[0][0], start)).to.equal(10);
  });

  it('prop `showToolbar` – renders the toolbar', () => {
    render(<MobileNextDatePicker open showToolbar />);

    expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
  });

  ['readOnly', 'disabled'].forEach((prop) => {
    it(`should not be opened when "Choose date" is clicked when ${prop}={true}`, () => {
      const handleOpen = spy();
      render(<MobileNextDatePicker {...{ [prop]: true }} onOpen={handleOpen} open={false} />);

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      expect(handleOpen.callCount).to.equal(0);
    });
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<MobileNextDatePicker onOpen={onOpen} />);

      userEvent.mousePress(screen.getByRole('textbox'));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onChange when selecting a date', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '8' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 8));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '6' }));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 6));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept when selecting a date and props.closeOnSelect = true', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Change the date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '8' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 8));
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 8));
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onChange with the initial value when clicking the "Cancel" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByRole('gridcell', { name: '8' }));

      // Cancel the modifications
      userEvent.mousePress(screen.getByText(/cancel/i));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(defaultValue);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value when clicking the "OK" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByRole('gridcell', { name: '8' }));

      // Accept the modifications
      userEvent.mousePress(screen.getByText(/ok/i));
      expect(onChange.callCount).to.equal(1); // The accepted value as already been committed, don't call onChange again
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange when clicking the "Cancel" button without prior value modification', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Cancel the modifications
      userEvent.mousePress(screen.getByText(/cancel/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <MobileNextDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Clear the date
      userEvent.mousePress(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).to.equal(null);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).to.equal(null);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange or onAccept when pressing "Clear" button with an already null value', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <MobileNextDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Clear the date
      userEvent.mousePress(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    // TODO: Write test
    // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
    // })
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<MobileNextDatePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);
      openPicker({ type: 'date', variant: 'mobile' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });

    it('should render title from the `toolbarTitle` locale key', () => {
      render(
        <MobileNextDatePicker
          open
          label="something"
          localeText={{
            toolbarTitle: 'test',
          }}
        />,
      );

      expect(screen.getByMuiTest('picker-toolbar-title').textContent).to.equal('test');
    });
  });
});
