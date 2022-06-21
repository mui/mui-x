import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import TextField from '@mui/material/TextField';
import { fireEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { CalendarPickerSkeleton } from '@mui/x-date-pickers/CalendarPickerSkeleton';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import {
  createPickerRenderer,
  FakeTransitionComponent,
  adapterToUse,
  withPickerControls,
  openPicker,
} from '../../../../test/utils/pickers-utils';

const WrappedMobileDatePicker = withPickerControls(MobileDatePicker)({
  DialogProps: { TransitionComponent: FakeTransitionComponent },
  renderInput: (params) => <TextField {...params} />,
});

describe('<MobileDatePicker />', () => {
  const { clock, render } = createPickerRenderer({ clock: 'fake', clockConfig: new Date() });

  it('allows to change only year', () => {
    const onChangeMock = spy();
    render(
      <MobileDatePicker
        open
        value={adapterToUse.date(new Date(2019, 0, 1))}
        onChange={onChangeMock}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    fireEvent.click(screen.getByLabelText(/switch to year view/i));
    fireEvent.click(screen.getByText('2010', { selector: 'button' }));

    expect(screen.getAllByMuiTest('calendar-month-and-year-text')[0]).to.have.text('January 2010');
    expect(onChangeMock.callCount).to.equal(1);
  });

  it('allows to select edge years from list', () => {
    render(
      <MobileDatePicker
        open
        reduceAnimations
        value={null}
        onChange={() => {}}
        openTo="year"
        minDate={adapterToUse.date(new Date(2000, 0, 1))}
        maxDate={adapterToUse.date(new Date(2010, 0, 1))}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    fireEvent.click(screen.getByText('2010', { selector: 'button' }));
    expect(screen.getByMuiTest('datepicker-toolbar-date')).to.have.text('Fri, Jan 1');
  });

  it('prop `toolbarTitle` – should render title from the prop', () => {
    render(
      <MobileDatePicker
        renderInput={(params) => <TextField {...params} />}
        open
        toolbarTitle="test"
        label="something"
        onChange={() => {}}
        value={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    expect(screen.getByMuiTest('picker-toolbar-title').textContent).to.equal('test');
  });

  it('prop `toolbarTitle` – should use label if no toolbar title', () => {
    render(
      <MobileDatePicker
        open
        label="Default label"
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
        value={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    expect(screen.getByMuiTest('picker-toolbar-title').textContent).to.equal('Default label');
  });

  it('prop `toolbarFormat` – should format toolbar according to passed format', () => {
    render(
      <MobileDatePicker
        renderInput={(params) => <TextField {...params} />}
        open
        onChange={() => {}}
        toolbarFormat="MMMM"
        value={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    expect(screen.getByMuiTest('datepicker-toolbar-date').textContent).to.equal('January');
  });

  it('prop `onMonthChange` – dispatches callback when months switching', () => {
    const onMonthChangeMock = spy();
    render(
      <MobileDatePicker
        open
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        onMonthChange={onMonthChangeMock}
        value={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    fireEvent.click(screen.getByLabelText('Next month'));
    expect(onMonthChangeMock.callCount).to.equal(1);
  });

  it('prop `loading` – displays default loading indicator', () => {
    render(
      <MobileDatePicker
        open
        loading
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        value={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    expect(screen.queryAllByMuiTest('day')).to.have.length(0);
    expect(screen.getByMuiTest('loading-progress')).toBeVisible();
  });

  it('prop `renderLoading` – displays custom loading indicator', () => {
    render(
      <MobileDatePicker
        loading
        renderLoading={() => <CalendarPickerSkeleton data-testid="custom-loading" />}
        open
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
        value={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    expect(screen.queryByTestId('loading-progress')).to.equal(null);
    expect(screen.getByTestId('custom-loading')).toBeVisible();
  });

  it('prop `ToolbarComponent` – render custom toolbar component', () => {
    render(
      <MobileDatePicker
        renderInput={(params) => <TextField {...params} />}
        open
        value={adapterToUse.date()}
        onChange={() => {}}
        ToolbarComponent={() => <div data-testid="custom-toolbar" />}
      />,
    );

    expect(screen.getByTestId('custom-toolbar')).toBeVisible();
  });

  it('prop `renderDay` – renders custom day', () => {
    render(
      <MobileDatePicker
        renderInput={(params) => <TextField {...params} />}
        open
        value={adapterToUse.date(new Date(2018, 0, 1))}
        onChange={() => {}}
        renderDay={(day, _selected, pickersDayProps) => (
          <PickersDay {...pickersDayProps} data-testid="test-day" />
        )}
      />,
    );

    expect(screen.getAllByTestId('test-day')).to.have.length(31);
  });

  it('prop `defaultCalendarMonth` – opens on provided month if date is `null`', () => {
    render(
      <MobileDatePicker
        renderInput={(params) => <TextField {...params} />}
        open
        value={null}
        onChange={() => {}}
        defaultCalendarMonth={adapterToUse.date(new Date(2018, 6, 1))}
      />,
    );

    expect(screen.getByText('July 2018')).toBeVisible();
  });

  it('prop `showTodayButton` – should accept current date when "today" button is clicked', () => {
    const onCloseMock = spy();
    const handleChange = spy();
    render(
      <MobileDatePicker
        renderInput={(params) => <TextField {...params} />}
        onClose={onCloseMock}
        onChange={handleChange}
        value={adapterToUse.date(new Date(2018, 0, 1))}
        DialogProps={{ TransitionComponent: FakeTransitionComponent }}
        componentsProps={{ actionBar: { actions: ['today'] } }}
      />,
    );
    const start = adapterToUse.date();
    fireEvent.click(screen.getByRole('textbox'));
    clock.tick(10);
    fireEvent.click(screen.getByText(/today/i));

    expect(onCloseMock.callCount).to.equal(1);
    expect(handleChange.callCount).to.equal(1);
    expect(adapterToUse.getDiff(handleChange.args[0][0], start)).to.equal(10);
  });

  it('prop `showToolbar` – renders the toolbar', () => {
    render(
      <MobileDatePicker
        open
        showToolbar
        onChange={() => {}}
        value={null}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
  });

  ['readOnly', 'disabled'].forEach((prop) => {
    it(`should not be opened when "Choose date" is clicked when ${prop}={true}`, () => {
      const handleOpen = spy();
      render(
        <MobileDatePicker
          value={adapterToUse.date(new Date(2019, 0, 1))}
          {...{ [prop]: true }}
          onChange={() => {}}
          onOpen={handleOpen}
          open={false}
          renderInput={(params) => <TextField {...params} />}
        />,
      );

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      expect(handleOpen.callCount).to.equal(0);
    });
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<WrappedMobileDatePicker onOpen={onOpen} initialValue={null} />);

      userEvent.mousePress(screen.getByRole('textbox'));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onChange when selecting a date', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date
      userEvent.mousePress(screen.getByLabelText('Jan 8, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 8));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date
      userEvent.mousePress(screen.getByLabelText('Jan 6, 2018'));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 6));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept when selecting a date and props.closeOnSelect = true', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Change the date
      userEvent.mousePress(screen.getByLabelText('Jan 8, 2018'));
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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 8, 2018'));

      // Cancel the modifications
      userEvent.mousePress(screen.getByText(/cancel/i));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(initialValue);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value when clicking the "OK" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'date', variant: 'mobile' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 8, 2018'));

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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedMobileDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
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
        <WrappedMobileDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={null}
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
});
