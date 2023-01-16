import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';
import { createPickerRenderer, adapterToUse, openPicker } from 'test/utils/pickers-utils';

describe('<MobileNextDatePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake', clockConfig: new Date() });

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

    it('should render the toolbar when `hidden` is `false`', () => {
      render(<MobileNextDatePicker open componentsProps={{ toolbar: { hidden: false } }} />);

      expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
    });
  });

  describe('Slots: Toolbar', () => {
    it('should render custom toolbar component', () => {
      render(
        <MobileNextDatePicker
          open
          slots={{
            toolbar: () => <div data-testid="custom-toolbar" />,
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
          slotProps={{
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

  describe('Slots: Day', () => {
    it('should render custom day', () => {
      render(
        <MobileNextDatePicker
          open
          defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
          slots={{
            day: (props) => <PickersDay {...props} data-testid="test-day" />,
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
        slotProps={{ actionBar: { actions: ['today'] } }}
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

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<MobileNextDatePicker onOpen={onOpen} />);

      userEvent.mousePress(screen.getByRole('textbox'));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });
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
