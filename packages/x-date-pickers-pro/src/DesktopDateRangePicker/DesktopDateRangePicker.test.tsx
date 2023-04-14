import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  describeConformance,
  screen,
  fireEvent,
  userEvent,
  act,
  getByRole,
} from '@mui/monorepo/test/utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { DateRange, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
  AdapterClassToUse,
  openPicker,
} from 'test/utils/pickers-utils';

const getPickerDay = (name: string, picker = 'January 2018'): HTMLButtonElement =>
  getByRole(screen.getByText(picker)?.parentElement?.parentElement!, 'gridcell', { name });

describe('<DesktopDateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 10),
  });

  describeConformance(<DesktopDateRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopDateRangePicker',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'reactTestRenderer',
    ],
  }));

  describeRangeValidation(DesktopDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'picker',
    views: ['day'],
  }));

  it('should scroll current month to the active selection when focusing appropriate field', () => {
    render(
      <DesktopDateRangePicker
        reduceAnimations
        defaultValue={[
          adapterToUse.date(new Date(2019, 4, 19)),
          adapterToUse.date(new Date(2019, 9, 30)),
        ]}
      />,
    );

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
    expect(screen.getByText('May 2019')).toBeVisible();

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });
    expect(screen.getByText('October 2019')).toBeVisible();

    // scroll back
    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
    expect(screen.getByText('May 2019')).toBeVisible();
  });

  it(`should not crash when opening picker with invalid date value`, async () => {
    render(
      <DesktopDateRangePicker
        defaultValue={[new Date(NaN), adapterToUse.date(new Date(2019, 0, 31))]}
      />,
    );

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
    expect(screen.getByRole('tooltip')).toBeVisible();
  });

  it('should respect localeText from the theme', () => {
    const theme = createTheme({
      components: {
        MuiLocalizationProvider: {
          defaultProps: {
            localeText: { start: 'Início', end: 'Fim' },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterClassToUse}>
          <DesktopDateRangePicker
            // We set the variant to standard to avoid having the label rendered in two places.
            slotProps={{
              textField: {
                variant: 'standard',
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.queryByText('Início')).not.to.equal(null);
    expect(screen.queryByText('Fim')).not.to.equal(null);
  });

  describe('Component slots: Popper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDateRangePicker
          open
          slotProps={{
            popper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'popper',
            },
          }}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('Slots: Popper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDateRangePicker
          open
          slotProps={{
            popper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'popper',
            },
          }}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('picker state', () => {
    it('should open when clicking the start input', () => {
      const onOpen = spy();

      render(<DesktopDateRangePicker onOpen={onOpen} />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    it('should open when clicking the end input', () => {
      const onOpen = spy();

      render(<DesktopDateRangePicker onOpen={onOpen} />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    ['Enter', ' '].forEach((key) =>
      it(`should open when pressing "${key}" in the start input`, () => {
        const onOpen = spy();

        render(<DesktopDateRangePicker onOpen={onOpen} />);

        const startInput = screen.getAllByRole('textbox')[0];
        act(() => startInput.focus());
        fireEvent.keyDown(startInput, { key });

        expect(onOpen.callCount).to.equal(1);
        expect(screen.getByRole('tooltip')).toBeVisible();
      }),
    );

    ['Enter', ' '].forEach((key) =>
      it(`should open when pressing "${key}" in the end input`, () => {
        const onOpen = spy();

        render(<DesktopDateRangePicker onOpen={onOpen} />);

        const endInput = screen.getAllByRole('textbox')[1];
        act(() => endInput.focus());
        fireEvent.keyDown(endInput, { key });

        expect(onOpen.callCount).to.equal(1);
        expect(screen.getByRole('tooltip')).toBeVisible();
      }),
    );

    it('should call onChange with updated start date then call onChange with updated end date, onClose and onAccept with update date range when opening from start input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the start date
      userEvent.mousePress(getPickerDay('3'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);

      // Change the end date
      userEvent.mousePress(getPickerDay('5'));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 5));

      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 5));
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onChange with updated end date, onClose and onAccept with update date range when opening from end input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the end date
      userEvent.mousePress(getPickerDay('3'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose and onAccept when selecting the end date if props.closeOnSelect = false', () => {
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <DesktopDateRangePicker
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect={false}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      // Change the end date
      userEvent.mousePress(getPickerDay('3'));

      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept with the live value when pressing Escape', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Change the start date (already tested)
      userEvent.mousePress(getPickerDay('3'));

      // Dismiss the picker
      // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target -- don't care
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose when clicking outside of the picker without prior change', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <div>
          <DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} />
          <input id="test-id" />
        </div>,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Dismiss the picker
      const input = document.getElementById('test-id')!;

      act(() => {
        fireEvent.mouseDown(input);
        input.focus();
        fireEvent.mouseUp(input);
        clock.runToLast();
      });

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <div>
          <DesktopDateRangePicker
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={defaultValue}
          />
          <input id="test-id" />
        </div>,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Change the start date (already tested)
      userEvent.mousePress(getPickerDay('3'));
      clock.runToLast();

      // Dismiss the picker
      const input = document.getElementById('test-id')!;

      act(() => {
        fireEvent.mouseDown(input);
        input.focus();
        fireEvent.mouseUp(input);
      });

      clock.runToLast();

      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      // expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      // expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      // expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when clicking outside of the picker if not opened', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(<DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} />);

      // Dismiss the picker
      userEvent.mousePress(document.body);
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose when blur the current field without prior change', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <React.Fragment>
          <DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} />
          <button type="button"> focus me </button>
        </React.Fragment>,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(screen.getByRole('tooltip')).toBeVisible();

      act(() => {
        screen.getAllByRole('textbox')[0].blur();
      });
      clock.runToLast();

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept when blur the current field', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <DesktopDateRangePicker
          defaultValue={defaultValue}
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(screen.getByRole('tooltip')).toBeVisible();

      // Change the start date (already tested)
      userEvent.mousePress(getPickerDay('3'));
      clock.runToLast();

      act(() => {
        screen.getAllByRole('textbox')[1].blur();
      });
      clock.runToLast();

      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          slotProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Clear the date
      userEvent.mousePress(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onChange.lastCall.args[0]).to.deep.equal([null, null]);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).to.deep.equal([null, null]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange or onAccept when pressing "Clear" button with an already null value', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          slotProps={{ actionBar: { actions: ['clear'] } }}
          value={[null, null]}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Clear the date
      userEvent.mousePress(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    // TODO: Write test
    // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
    // })
    it('should not close picker when switching focus from start to end input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={[
            adapterToUse.date(new Date(2018, 0, 1)),
            adapterToUse.date(new Date(2018, 0, 6)),
          ]}
        />,
      );

      // Open the picker (already tested)
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Switch to end date
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should not close picker when switching focus from end to start input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={[
            adapterToUse.date(new Date(2018, 0, 1)),
            adapterToUse.date(new Date(2018, 0, 6)),
          ]}
        />,
      );

      // Open the picker (already tested)
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      // Switch to start date
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });

  describe('disabled dates', () => {
    it('should respect the disablePast prop', () => {
      render(<DesktopDateRangePicker disablePast />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(getPickerDay('8')).to.have.attribute('disabled');
      expect(getPickerDay('9')).to.have.attribute('disabled');
      expect(getPickerDay('10')).not.to.have.attribute('disabled');
      expect(getPickerDay('11')).not.to.have.attribute('disabled');
      expect(getPickerDay('12')).not.to.have.attribute('disabled');
    });

    it('should respect the disableFuture prop', () => {
      render(<DesktopDateRangePicker disableFuture />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(getPickerDay('8')).not.to.have.attribute('disabled');
      expect(getPickerDay('9')).not.to.have.attribute('disabled');
      expect(getPickerDay('10')).not.to.have.attribute('disabled');
      expect(getPickerDay('11')).to.have.attribute('disabled');
      expect(getPickerDay('12')).to.have.attribute('disabled');
    });

    it('should respect the minDate prop', () => {
      render(<DesktopDateRangePicker minDate={adapterToUse.date(new Date(2018, 0, 15))} />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(getPickerDay('13')).to.have.attribute('disabled');
      expect(getPickerDay('14')).to.have.attribute('disabled');
      expect(getPickerDay('15')).not.to.have.attribute('disabled');
      expect(getPickerDay('16')).not.to.have.attribute('disabled');
      expect(getPickerDay('17')).not.to.have.attribute('disabled');
    });

    it('should respect the maxDate prop', () => {
      render(<DesktopDateRangePicker maxDate={adapterToUse.date(new Date(2018, 0, 15))} />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(getPickerDay('13')).not.to.have.attribute('disabled');
      expect(getPickerDay('14')).not.to.have.attribute('disabled');
      expect(getPickerDay('15')).not.to.have.attribute('disabled');
      expect(getPickerDay('16')).to.have.attribute('disabled');
      expect(getPickerDay('17')).to.have.attribute('disabled');
    });
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(
        <DesktopDateRangePicker
          localeText={{ cancelButtonLabel: 'Custom cancel' }}
          slotProps={{ actionBar: { actions: ['cancel'] } }}
        />,
      );
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
