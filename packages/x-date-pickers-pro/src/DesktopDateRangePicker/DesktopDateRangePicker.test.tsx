import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { describeConformance, screen, fireEvent, userEvent } from '@mui/monorepo/test/utils';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import {
  wrapPickerMount,
  createPickerRenderer,
  FakeTransitionComponent,
  adapterToUse,
  AdapterClassToUse,
  withPickerControls,
  openPicker,
} from '../../../../test/utils/pickers-utils';

const WrappedDesktopDateRangePicker = withPickerControls(DesktopDateRangePicker)({
  DialogProps: { TransitionComponent: FakeTransitionComponent },
  renderInput: (startProps, endProps) => (
    <React.Fragment>
      <TextField {...startProps} />
      <TextField {...endProps} />
    </React.Fragment>
  ),
});

describe('<DesktopDateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 10),
  });

  describeConformance(
    <DesktopDateRangePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={[null, null]}
    />,
    () => ({
      classes: {},
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
    }),
  );

  describe('validation', () => {
    it('should accept single day range', () => {
      render(
        <WrappedDesktopDateRangePicker
          initialValue={[
            adapterToUse.date(new Date(2018, 0, 1)),
            adapterToUse.date(new Date(2018, 0, 1)),
          ]}
        />,
      );
      const textboxes = screen.getAllByRole('textbox');
      expect(textboxes[0]).to.have.attribute('aria-invalid', 'false');
      expect(textboxes[1]).to.have.attribute('aria-invalid', 'false');
    });

    it('should not accept end date prior to start state', () => {
      render(
        <WrappedDesktopDateRangePicker
          initialValue={[
            adapterToUse.date(new Date(2018, 0, 2)),
            adapterToUse.date(new Date(2018, 0, 1)),
          ]}
        />,
      );
      const textboxes = screen.getAllByRole('textbox');
      expect(textboxes[0]).to.have.attribute('aria-invalid', 'true');
      expect(textboxes[1]).to.have.attribute('aria-invalid', 'true');
    });
  });

  it('should highlight the selected range of dates', () => {
    render(
      <WrappedDesktopDateRangePicker
        initialValue={[
          adapterToUse.date(new Date(2018, 0, 1)),
          adapterToUse.date(new Date(2018, 0, 31)),
        ]}
      />,
    );

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

    expect(screen.getAllByMuiTest('DateRangeHighlight')).to.have.length(31);
  });

  // TODO: Move to DayPicker test file ?
  describe('selection behavior', () => {
    it('should select the range from the next month', () => {
      const handleChange = spy();

      render(
        <WrappedDesktopDateRangePicker
          onChange={handleChange}
          initialValue={[adapterToUse.date(new Date(2019, 0, 1)), null]}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      fireEvent.click(screen.getByLabelText('Jan 1, 2019'));
      // FIXME use `getByRole(role, {hidden: false})` and skip JSDOM once this suite can run in JSDOM
      const [visibleButton] = screen.getAllByRole('button', {
        hidden: true,
        name: 'Next month',
      });
      fireEvent.click(visibleButton);
      fireEvent.click(screen.getByLabelText('Mar 19, 2019'));

      expect(handleChange.callCount).to.equal(1);
      const [changedRange] = handleChange.lastCall.args;
      expect(changedRange[0]).to.toEqualDateTime(new Date(2019, 0, 1));
      expect(changedRange[1]).to.toEqualDateTime(new Date(2019, 2, 19));
    });

    it('should continue start selection if selected "end" date is before start', () => {
      const handleChange = spy();
      render(
        <WrappedDesktopDateRangePicker
          onChange={handleChange}
          defaultCalendarMonth={adapterToUse.date(new Date(2019, 0, 1))}
          initialValue={[null, null]}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      fireEvent.click(screen.getByLabelText('Jan 30, 2019'));
      fireEvent.click(screen.getByLabelText('Jan 19, 2019'));

      expect(screen.queryByMuiTest('DateRangeHighlight')).to.equal(null);

      fireEvent.click(screen.getByLabelText('Jan 30, 2019'));

      expect(handleChange.callCount).to.equal(3);
      const [changedRange] = handleChange.lastCall.args;
      expect(changedRange[0]).to.toEqualDateTime(new Date(2019, 0, 19));
      expect(changedRange[1]).to.toEqualDateTime(new Date(2019, 0, 30));
    });
  });

  it('should allow pure keyboard selection of range', () => {
    const handleChange = spy();
    render(
      <WrappedDesktopDateRangePicker
        reduceAnimations
        initialValue={[null, null]}
        onChange={handleChange}
      />,
    );

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: {
        value: '06/06/2019',
      },
    });

    // TODO: remove, the `onChange` should be called immediately
    clock.runToLast();

    fireEvent.change(screen.getAllByRole('textbox')[1], {
      target: {
        value: '08/08/2019',
      },
    });

    // TODO: remove, the `onChange` should be called immediately
    clock.runToLast();

    expect(handleChange.callCount).to.equal(2);
    const firstChangeValues = handleChange.args[0][0];

    expect(firstChangeValues[0]).toEqualDateTime(new Date(2019, 5, 6));
    expect(firstChangeValues[1]).to.equal(null);

    const secondChangeValues = handleChange.args[1][0];
    expect(secondChangeValues[0]).toEqualDateTime(new Date(2019, 5, 6));
    expect(secondChangeValues[1]).toEqualDateTime(new Date(2019, 7, 8));
  });

  it('should allow partial date enter', () => {
    const handleChange = spy();
    render(
      <WrappedDesktopDateRangePicker
        reduceAnimations
        initialValue={[null, null]}
        onChange={handleChange}
      />,
    );

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: {
        value: '0',
      },
    });

    // TODO: remove, the `onChange` should be called immediately
    clock.runToLast();

    expect(handleChange.callCount).to.equal(1);

    expect(screen.getAllByRole('textbox')[0].value).to.equal('0');

    const firstChangeValues = handleChange.args[0][0];
    expect(adapterToUse.isValid(firstChangeValues[0])).to.equal(false);
    expect(firstChangeValues[1]).to.equal(null);
  });

  it('should allow partial year without adding zeros', () => {
    const handleChange = spy();
    render(
      <WrappedDesktopDateRangePicker
        reduceAnimations
        initialValue={[null, null]}
        onChange={handleChange}
      />,
    );

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: {
        value: '01/01/19',
      },
    });

    // TODO: remove, the `onChange` should be called immediately
    clock.runToLast();

    expect(handleChange.callCount).to.equal(1);
    expect(screen.getAllByRole('textbox')[0].value).to.equal('01/01/19');
  });

  it('should scroll current month to the active selection when focusing appropriate field', () => {
    render(
      <WrappedDesktopDateRangePicker
        reduceAnimations
        initialValue={[
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
      <WrappedDesktopDateRangePicker
        initialValue={[new Date(NaN), adapterToUse.date(new Date(2019, 0, 31))]}
      />,
    );

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
    expect(screen.getByRole('tooltip')).toBeVisible();
  });

  it('respect localeText', () => {
    const theme = createTheme({
      components: {
        MuiLocalizationProvider: {
          defaultProps: {
            localeText: { start: 'Início', end: 'Fim' },
          },
        },
      } as any,
    });

    render(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterClassToUse}>
          <DesktopDateRangePicker
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} variant="standard" />
                <TextField {...endProps} variant="standard" />
              </React.Fragment>
            )}
            onChange={() => {}}
            TransitionComponent={FakeTransitionComponent}
            value={[null, null]}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.queryByText('Início')).not.to.equal(null);
    expect(screen.queryByText('Fim')).not.to.equal(null);
  });

  it('prop: renderDay - should be called and render days', async () => {
    render(
      <WrappedDesktopDateRangePicker
        renderDay={(day) => <div key={String(day)} data-testid="renderDayCalled" />}
        initialValue={[null, null]}
      />,
    );

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

    expect(screen.getAllByTestId('renderDayCalled')).not.to.have.length(0);
  });

  it('prop: calendars - should render the provided amount of calendars', () => {
    render(<WrappedDesktopDateRangePicker calendars={3} initialValue={[null, null]} />);

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

    expect(screen.getAllByMuiTest('pickers-calendar')).to.have.length(3);
  });

  it('componentsProps `actionBar` - allows to renders clear button in Desktop mode', () => {
    function DesktopDateRangePickerClearable() {
      return (
        <WrappedDesktopDateRangePicker
          initialValue={[
            adapterToUse.date(new Date(2018, 0, 1)),
            adapterToUse.date(new Date(2018, 0, 31)),
          ]}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />
      );
    }
    render(<DesktopDateRangePickerClearable />);

    openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

    expect(screen.getAllByRole('textbox')[0]).to.have.value('01/01/2018');
    expect(screen.getAllByRole('textbox')[1]).to.have.value('01/31/2018');

    fireEvent.click(screen.getByText('Clear'));

    expect(screen.getAllByRole('textbox')[0]).to.have.value('');
    expect(screen.getAllByRole('textbox')[1]).to.have.value('');
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  describe('prop: PopperProps', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDateRangePicker
          open
          onChange={() => {}}
          PopperProps={{
            onClick: handleClick,
            onTouchStart: handleTouchStart,
            // @ts-expect-error `data-*` attributes are not recognized in props objects
            'data-testid': 'popper',
          }}
          renderInput={(params) => <TextField {...params} />}
          value={[null, null]}
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

      render(<WrappedDesktopDateRangePicker onOpen={onOpen} initialValue={[null, null]} />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    it('should open when clicking the end input', () => {
      const onOpen = spy();

      render(<WrappedDesktopDateRangePicker onOpen={onOpen} initialValue={[null, null]} />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    ['Enter', ' '].forEach((key) =>
      it(`should open when pressing "${key}" in the start input`, () => {
        const onOpen = spy();

        render(<WrappedDesktopDateRangePicker onOpen={onOpen} initialValue={[null, null]} />);

        const startInput = screen.getAllByRole('textbox')[0];
        startInput.focus();
        fireEvent.keyDown(startInput, { key });

        expect(onOpen.callCount).to.equal(1);
        expect(screen.getByRole('tooltip')).toBeVisible();
      }),
    );

    ['Enter', ' '].forEach((key) =>
      it(`should open when pressing "${key}" in the end input`, () => {
        const onOpen = spy();

        render(<WrappedDesktopDateRangePicker onOpen={onOpen} initialValue={[null, null]} />);

        const endInput = screen.getAllByRole('textbox')[1];
        endInput.focus();
        fireEvent.keyDown(endInput, { key });

        expect(onOpen.callCount).to.equal(1);
        expect(screen.getByRole('tooltip')).toBeVisible();
      }),
    );

    it('should call onChange with updated start date then call onChange with updated end date, onClose and onAccept with update date range when opening from start input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the start date
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);

      // Change the end date
      userEvent.mousePress(screen.getByLabelText('Jan 5, 2018'));
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
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the end date
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose and onAccept when selecting the end date if props.closeOnSelect = false', () => {
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedDesktopDateRangePicker
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect={false}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      // Change the end date
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));

      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept with the live value when pressing Escape', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Change the start date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));

      // Dismiss the picker
      // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target -- don't care
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose when clicking outside of the picker without prior change', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={[null, null]}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Dismiss the picker
      userEvent.mousePress(document.body);
      clock.runToLast();

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Change the start date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));

      // Dismiss the picker
      userEvent.mousePress(document.body);
      clock.runToLast();

      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when clicking outside of the picker if not opened', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={[null, null]}
        />,
      );

      // Dismiss the picker
      userEvent.mousePress(document.body);
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept when blur the current field', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <React.Fragment>
          <WrappedDesktopDateRangePicker
            initialValue={[null, null]}
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
          />
          <button type="button"> focus me </button>
        </React.Fragment>,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(screen.getByRole('tooltip')).toBeVisible();

      fireEvent.blur(screen.getAllByRole('textbox')[0]);
      clock.runToLast();

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose when blur the current field without prior change', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedDesktopDateRangePicker
          initialValue={initialValue}
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(screen.getByRole('tooltip')).toBeVisible();

      // Change the start date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));

      fireEvent.blur(screen.getAllByRole('textbox')[0]);
      clock.runToLast();

      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
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
      const initialValue = [null, null];

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
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
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={[
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
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={[
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
      render(<WrappedDesktopDateRangePicker initialValue={[null, null]} disablePast />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(screen.getByLabelText('Jan 8, 2018')).to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 9, 2018')).to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 10, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 11, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 11, 2018')).not.to.have.attribute('disabled');
    });

    it('should respect the disableFuture prop', () => {
      render(<WrappedDesktopDateRangePicker initialValue={[null, null]} disableFuture />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(screen.getByLabelText('Jan 8, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 9, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 10, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 11, 2018')).to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 12, 2018')).to.have.attribute('disabled');
    });

    it('should respect the minDate prop', () => {
      render(
        <WrappedDesktopDateRangePicker
          initialValue={[null, null]}
          minDate={adapterToUse.date(new Date(2018, 0, 15))}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(screen.getByLabelText('Jan 13, 2018')).to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 14, 2018')).to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 15, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 16, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 17, 2018')).not.to.have.attribute('disabled');
    });

    it('should respect the maxDate prop', () => {
      render(
        <WrappedDesktopDateRangePicker
          initialValue={[null, null]}
          maxDate={adapterToUse.date(new Date(2018, 0, 15))}
        />,
      );

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(screen.getByLabelText('Jan 13, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 14, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 15, 2018')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 16, 2018')).to.have.attribute('disabled');
      expect(screen.getByLabelText('Jan 17, 2018')).to.have.attribute('disabled');
    });
  });
});
