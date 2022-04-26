import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { describeConformance, screen, fireEvent, userEvent } from '@mui/monorepo/test/utils';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  wrapPickerMount,
  createPickerRenderer,
  FakeTransitionComponent,
  adapterToUse,
  withPickerControls,
  openPicker,
} from '../../../../test/utils/pickers-utils';

const defaultRangeRenderInput = (startProps: TextFieldProps, endProps: TextFieldProps) => (
  <React.Fragment>
    <TextField {...startProps} />
    <TextField {...endProps} />
  </React.Fragment>
);

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
  const { render } = createPickerRenderer({ clock: 'fake' });

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

  it('allows a single day range', () => {
    render(
      <DesktopDateRangePicker
        renderInput={defaultRangeRenderInput}
        onChange={() => {}}
        value={[
          adapterToUse.date('2018-01-01T00:00:00.000'),
          adapterToUse.date('2018-01-01T00:00:00.000'),
        ]}
      />,
    );
    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes[0]).to.have.attribute('aria-invalid', 'false');
    expect(textboxes[1]).to.have.attribute('aria-invalid', 'false');
  });

  it('highlights the selected range of dates', () => {
    render(
      <DesktopDateRangePicker
        open
        renderInput={defaultRangeRenderInput}
        onChange={() => {}}
        value={[
          adapterToUse.date('2018-01-01T00:00:00.000'),
          adapterToUse.date('2018-01-31T00:00:00.000'),
        ]}
      />,
    );

    expect(screen.getAllByMuiTest('DateRangeHighlight')).to.have.length(31);
  });

  it('should select the range from the next month', function test() {
    const onChangeMock = spy();
    render(
      <DesktopDateRangePicker
        open
        renderInput={defaultRangeRenderInput}
        onChange={onChangeMock}
        value={[adapterToUse.date('2019-01-01T00:00:00.000'), null]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Jan 1, 2019'));
    // FIXME use `getByRole(role, {hidden: false})` and skip JSDOM once this suite can run in JSDOM
    const [visibleButton] = screen.getAllByRole('button', {
      hidden: true,
      name: 'Next month',
    });
    fireEvent.click(visibleButton);
    fireEvent.click(screen.getByLabelText('Mar 19, 2019'));

    expect(onChangeMock.callCount).to.equal(1);
    const [changedRange] = onChangeMock.lastCall.args;
    expect(changedRange[0]).to.toEqualDateTime(adapterToUse.date('2019-01-01T00:00:00.000'));
    expect(changedRange[1]).to.toEqualDateTime(adapterToUse.date('2019-03-19T00:00:00.000'));
  });

  it('continues start selection if selected "end" date is before start', () => {
    const onChangeMock = spy();
    render(
      <DesktopDateRangePicker
        open
        renderInput={defaultRangeRenderInput}
        onChange={onChangeMock}
        defaultCalendarMonth={adapterToUse.date('2019-01-01T00:00:00.000')}
        value={[null, null]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Jan 30, 2019'));
    fireEvent.click(screen.getByLabelText('Jan 19, 2019'));

    expect(screen.queryByMuiTest('DateRangeHighlight')).to.equal(null);

    fireEvent.click(screen.getByLabelText('Jan 30, 2019'));

    expect(onChangeMock.callCount).to.equal(3);
    const [changedRange] = onChangeMock.lastCall.args;
    expect(changedRange[0]).to.toEqualDateTime(adapterToUse.date('2019-01-19T00:00:00.000'));
    expect(changedRange[1]).to.toEqualDateTime(adapterToUse.date('2019-01-30T00:00:00.000'));
  });

  it('starts selection from end if end text field was focused', function test() {
    const onChangeMock = spy();
    render(
      <DesktopDateRangePicker
        renderInput={defaultRangeRenderInput}
        onChange={onChangeMock}
        defaultCalendarMonth={adapterToUse.date('2019-01-01T00:00:00.000')}
        value={[null, null]}
      />,
    );

    fireEvent.focus(screen.getAllByRole('textbox')[1]);

    fireEvent.click(screen.getByLabelText('Jan 30, 2019'));
    fireEvent.click(screen.getByLabelText('Jan 19, 2019'));

    expect(screen.getAllByMuiTest('DateRangeHighlight')).to.have.length(12);
    expect(onChangeMock.callCount).to.equal(2);
    const [changedRange] = onChangeMock.lastCall.args;
    expect(changedRange[0]).toEqualDateTime(adapterToUse.date('2019-01-19T00:00:00.000'));
    expect(changedRange[1]).toEqualDateTime(adapterToUse.date('2019-01-30T00:00:00.000'));
  });

  it('closes on focus out of fields', () => {
    render(
      <React.Fragment>
        <DesktopDateRangePicker
          value={[null, null]}
          renderInput={defaultRangeRenderInput}
          onChange={() => {}}
          TransitionComponent={FakeTransitionComponent}
        />
        <button type="button"> focus me </button>
      </React.Fragment>,
    );

    fireEvent.focus(screen.getAllByRole('textbox')[0]);
    expect(screen.getByRole('tooltip')).toBeVisible();

    fireEvent.focus(screen.getByText('focus me'));
    expect(screen.getByRole('tooltip')).not.toBeVisible();
  });

  // TODO
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('allows pure keyboard selection of range', () => {
    const onChangeMock = spy();
    render(
      <DesktopDateRangePicker
        reduceAnimations
        value={[null, null]}
        renderInput={defaultRangeRenderInput}
        onChange={onChangeMock}
        TransitionComponent={FakeTransitionComponent}
      />,
    );

    fireEvent.focus(screen.getAllByRole('textbox')[0]);
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

    expect(onChangeMock.callCount).to.equal(1);
    expect(onChangeMock.args[0][0]).toEqualDateTime(adapterToUse.date('2019-06-06T00:00:00.000'));
    expect(onChangeMock.args[0][1]).toEqualDateTime(adapterToUse.date('2019-06-06T00:00:00.000'));
  });

  it('scrolls current month to the active selection on focusing appropriate field', () => {
    render(
      <DesktopDateRangePicker
        reduceAnimations
        value={[
          adapterToUse.date('2019-05-19T00:00:00.000'),
          adapterToUse.date('2019-10-30T00:00:00.000'),
        ]}
        renderInput={defaultRangeRenderInput}
        onChange={() => {}}
        TransitionComponent={FakeTransitionComponent}
      />,
    );

    fireEvent.focus(screen.getAllByRole('textbox')[0]);
    expect(screen.getByText('May 2019')).toBeVisible();

    fireEvent.focus(screen.getAllByRole('textbox')[1]);
    expect(screen.getByText('October 2019')).toBeVisible();

    // scroll back
    fireEvent.focus(screen.getAllByRole('textbox')[0]);
    expect(screen.getByText('May 2019')).toBeVisible();
  });

  it(`doesn't crash if opening picker with invalid date input`, async () => {
    render(
      <DesktopDateRangePicker
        renderInput={defaultRangeRenderInput}
        calendars={3}
        onChange={() => {}}
        TransitionComponent={FakeTransitionComponent}
        value={[adapterToUse.date(NaN), adapterToUse.date('2018-01-31T00:00:00.000')]}
      />,
    );

    fireEvent.focus(screen.getAllByRole('textbox')[0]);
    expect(screen.getByRole('tooltip')).toBeVisible();
  });

  it('prop – `renderDay` should be called and render days', async () => {
    render(
      <DesktopDateRangePicker
        open
        renderInput={defaultRangeRenderInput}
        onChange={() => {}}
        renderDay={(day) => <div key={String(day)} data-testid="renderDayCalled" />}
        value={[null, null]}
      />,
    );

    expect(screen.getAllByTestId('renderDayCalled')).not.to.have.length(0);
  });

  it('prop – `calendars` renders provided amount of calendars', () => {
    render(
      <DesktopDateRangePicker
        open
        renderInput={defaultRangeRenderInput}
        calendars={3}
        onChange={() => {}}
        value={[
          adapterToUse.date('2018-01-01T00:00:00.000'),
          adapterToUse.date('2018-01-31T00:00:00.000'),
        ]}
      />,
    );

    expect(screen.getAllByMuiTest('pickers-calendar')).to.have.length(3);
  });

  it('prop `clearable` - renders clear button in Desktop mode', () => {
    function DesktopDateRangePickerClearable() {
      const [value, setValue] = React.useState<DateRange<Date>>([
        adapterToUse.date('2018-01-01T00:00:00.000'),
        adapterToUse.date('2018-01-31T00:00:00.000'),
      ]);
      const [open, setOpen] = React.useState<boolean | undefined>(true);
      const handleChange = (newValue: DateRange<Date>) => {
        setValue(newValue);
      };

      return (
        <DesktopDateRangePicker
          clearable
          onChange={handleChange}
          value={value}
          renderInput={defaultRangeRenderInput}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onOpen={() => {
            setOpen(true);
          }}
        />
      );
    }
    render(<DesktopDateRangePickerClearable />);
    expect(screen.getAllByRole('textbox')[0]).to.have.value('01/01/2018');
    expect(screen.getAllByRole('textbox')[1]).to.have.value('01/31/2018');

    fireEvent.click(screen.getByText('Clear'));

    expect(screen.getAllByRole('textbox')[0]).to.have.value('');
    expect(screen.getAllByRole('textbox')[1]).to.have.value('');
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  describe('prop: PopperProps', () => {
    it('forwards onClick and onTouchStart', () => {
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
    it('should open when focusing the start input', () => {
      const onOpen = spy();

      render(<WrappedDesktopDateRangePicker onOpen={onOpen} initialValue={[null, null]} />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    it('should open when focusing the end input', () => {
      const onOpen = spy();

      render(<WrappedDesktopDateRangePicker onOpen={onOpen} initialValue={[null, null]} />);

      openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

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

      // Dismiss the picker
      userEvent.mousePress(document.body);
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

      // Dismiss the picker
      userEvent.mousePress(document.body);
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
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
  });
});
