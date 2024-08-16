import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  buildFieldInteractions,
  openPicker,
  getFieldSectionsContainer,
} from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<MobileDatePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });
  const { renderWithProps } = buildFieldInteractions({
    render,
    clock,
    Component: MobileDatePicker,
  });

  it('allows to change only year', () => {
    const onChangeMock = spy();
    render(
      <MobileDatePicker
        enableAccessibleFieldDOMStructure
        open
        value={adapterToUse.date('2019-01-01')}
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
      <MobileDatePicker
        enableAccessibleFieldDOMStructure
        open
        reduceAnimations
        openTo="year"
        minDate={adapterToUse.date('2000-01-01')}
        maxDate={adapterToUse.date('2010-01-01')}
      />,
    );

    fireEvent.click(screen.getByText('2010', { selector: 'button' }));
    expect(screen.getByMuiTest('datepicker-toolbar-date')).to.have.text('Fri, Jan 1');
  });

  it('prop `onMonthChange` – dispatches callback when months switching', () => {
    const onMonthChangeMock = spy();
    render(
      <MobileDatePicker enableAccessibleFieldDOMStructure open onMonthChange={onMonthChangeMock} />,
    );

    fireEvent.click(screen.getByLabelText('Next month'));
    expect(onMonthChangeMock.callCount).to.equal(1);
  });

  it('prop `loading` – displays default loading indicator', () => {
    render(<MobileDatePicker enableAccessibleFieldDOMStructure open loading />);

    expect(screen.queryAllByMuiTest('day')).to.have.length(0);
    expect(screen.getByMuiTest('loading-progress')).toBeVisible();
  });

  it('prop `renderLoading` – displays custom loading indicator', () => {
    render(
      <MobileDatePicker
        enableAccessibleFieldDOMStructure
        loading
        renderLoading={() => <DayCalendarSkeleton data-testid="custom-loading" />}
        open
      />,
    );

    expect(screen.queryByTestId('loading-progress')).to.equal(null);
    expect(screen.getByTestId('custom-loading')).toBeVisible();
  });

  describe('Component slot: Toolbar', () => {
    it('should render custom toolbar component', () => {
      render(
        <MobileDatePicker
          enableAccessibleFieldDOMStructure
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
        <MobileDatePicker
          enableAccessibleFieldDOMStructure
          open
          defaultValue={adapterToUse.date('2018-01-01')}
          slotProps={{
            toolbar: {
              toolbarFormat: 'MMMM',
            },
          }}
        />,
      );

      expect(screen.getByMuiTest('datepicker-toolbar-date').textContent).to.equal('January');
    });

    it('should render the toolbar when `hidden` is `false`', () => {
      render(
        <MobileDatePicker
          enableAccessibleFieldDOMStructure
          open
          slotProps={{ toolbar: { hidden: false } }}
        />,
      );

      expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
    });
  });

  describe('Component slot: Day', () => {
    it('should render custom day', () => {
      render(
        <MobileDatePicker
          enableAccessibleFieldDOMStructure
          open
          defaultValue={adapterToUse.date('2018-01-01')}
          slots={{
            day: (props) => <PickersDay {...props} data-testid="test-day" />,
          }}
        />,
      );

      expect(screen.getAllByTestId('test-day')).to.have.length(31);
    });
  });

  describe('picker state', () => {
    it('should open when clicking the input', () => {
      const onOpen = spy();

      render(<MobileDatePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />);

      fireUserEvent.mousePress(getFieldSectionsContainer());

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call `onAccept` even if controlled', () => {
      const onAccept = spy();

      function ControlledMobileDatePicker(props) {
        const [value, setValue] = React.useState(null);

        return (
          <MobileDatePicker
            enableAccessibleFieldDOMStructure
            {...props}
            value={value}
            onChange={setValue}
          />
        );
      }

      render(<ControlledMobileDatePicker onAccept={onAccept} />);

      openPicker({ type: 'date', variant: 'mobile' });

      fireEvent.click(screen.getByText('15', { selector: 'button' }));
      fireEvent.click(screen.getByText('OK', { selector: 'button' }));

      expect(onAccept.callCount).to.equal(1);
    });

    it('should update internal state when controlled value is updated', () => {
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true as const,
        value: adapterToUse.date('2019-01-01'),
      });

      // Set a date
      expectFieldValueV7(view.getSectionsContainer(), '01/01/2019');

      // Clean value using external control
      view.setProps({ value: null });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');

      // Open and Dismiss the picker
      openPicker({ type: 'date', variant: 'mobile' });
      // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      clock.runToLast();

      // Verify it's still a clean value
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
    });
  });
});
