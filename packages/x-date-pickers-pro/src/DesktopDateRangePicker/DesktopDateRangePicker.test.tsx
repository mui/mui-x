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
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

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
            adapterToUse.date('2018-01-01T00:00:00.000'),
            adapterToUse.date('2018-01-01T00:00:00.000'),
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
            adapterToUse.date('2018-01-02T00:00:00.000'),
            adapterToUse.date('2018-01-01T00:00:00.000'),
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
          adapterToUse.date('2018-01-01T00:00:00.000'),
          adapterToUse.date('2018-01-31T00:00:00.000'),
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
          initialValue={[adapterToUse.date('2019-01-01T00:00:00.000'), null]}
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
      expect(changedRange[0]).to.toEqualDateTime(adapterToUse.date('2019-01-01T00:00:00.000'));
      expect(changedRange[1]).to.toEqualDateTime(adapterToUse.date('2019-03-19T00:00:00.000'));
    });

    it('should continue start selection if selected "end" date is before start', () => {
      const handleChange = spy();
      render(
        <WrappedDesktopDateRangePicker
          onChange={handleChange}
          defaultCalendarMonth={adapterToUse.date('2019-01-01T00:00:00.000')}
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
      expect(changedRange[0]).to.toEqualDateTime(adapterToUse.date('2019-01-19T00:00:00.000'));
      expect(changedRange[1]).to.toEqualDateTime(adapterToUse.date('2019-01-30T00:00:00.000'));
    });
  });

  // TODO
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should allow pure keyboard selection of range', () => {
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

    fireEvent.change(screen.getAllByRole('textbox')[1], {
      target: {
        value: '08/08/2019',
      },
    });

    expect(handleChange.callCount).to.equal(1);
    expect(handleChange.args[0][0]).toEqualDateTime(adapterToUse.date('2019-06-06T00:00:00.000'));
    expect(handleChange.args[0][1]).toEqualDateTime(adapterToUse.date('2019-06-06T00:00:00.000'));
  });

  it('should scroll current month to the active selection when focusing appropriate field', () => {
    render(
      <WrappedDesktopDateRangePicker
        reduceAnimations
        initialValue={[
          adapterToUse.date('2019-05-19T00:00:00.000'),
          adapterToUse.date('2019-10-30T00:00:00.000'),
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
        initialValue={[adapterToUse.date(NaN), adapterToUse.date('2018-01-31T00:00:00.000')]}
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
        adapterToUse.date('2018-01-01T00:00:00.000'),
        adapterToUse.date('2018-01-06T00:00:00.000'),
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
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(
        adapterToUse.date('2018-01-03T00:00:00.000'),
      );
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);

      // Change the end date
      userEvent.mousePress(screen.getByLabelText('Jan 5, 2018'));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(
        adapterToUse.date('2018-01-03T00:00:00.000'),
      );
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(
        adapterToUse.date('2018-01-05T00:00:00.000'),
      );

      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(
        adapterToUse.date('2018-01-03T00:00:00.000'),
      );
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(
        adapterToUse.date('2018-01-05T00:00:00.000'),
      );
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onChange with updated end date, onClose and onAccept with update date range when opening from end input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date('2018-01-01T00:00:00.000'),
        adapterToUse.date('2018-01-06T00:00:00.000'),
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
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(
        adapterToUse.date('2018-01-03T00:00:00.000'),
      );
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(
        adapterToUse.date('2018-01-03T00:00:00.000'),
      );
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose and onAccept when selecting the end date if props.closeOnSelect = false', () => {
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date('2018-01-01T00:00:00.000'),
        adapterToUse.date('2018-01-06T00:00:00.000'),
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
        adapterToUse.date('2018-01-01T00:00:00.000'),
        adapterToUse.date('2018-01-06T00:00:00.000'),
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
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(
        adapterToUse.date('2018-01-03T00:00:00.000'),
      );
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
        adapterToUse.date('2018-01-01T00:00:00.000'),
        adapterToUse.date('2018-01-06T00:00:00.000'),
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
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(
        adapterToUse.date('2018-01-03T00:00:00.000'),
      );
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
        adapterToUse.date('2018-01-01T00:00:00.000'),
        adapterToUse.date('2018-01-06T00:00:00.000'),
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
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(
        adapterToUse.date('2018-01-03T00:00:00.000'),
      );
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date('2018-01-01T00:00:00.000'),
        adapterToUse.date('2018-01-06T00:00:00.000'),
      ];

      render(
        <WrappedDesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          clearable
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
          clearable
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
            adapterToUse.date('2018-01-01T00:00:00.000'),
            adapterToUse.date('2018-01-06T00:00:00.000'),
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
            adapterToUse.date('2018-01-01T00:00:00.000'),
            adapterToUse.date('2018-01-06T00:00:00.000'),
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
});
