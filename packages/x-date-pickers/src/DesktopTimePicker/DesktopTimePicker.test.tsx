import * as React from 'react';
import TextField from '@mui/material/TextField';
import { spy } from 'sinon';
import { expect } from 'chai';
import { act, describeConformance, fireEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { inputBaseClasses } from '@mui/material/InputBase';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
  withPickerControls,
  FakeTransitionComponent,
  openPicker,
  getClockMouseEvent,
} from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

const WrappedDesktopTimePicker = withPickerControls(DesktopTimePicker)({
  components: { DesktopTransition: FakeTransitionComponent },
  renderInput: (params) => <TextField {...params} />,
});

describe('<DesktopTimePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2018-01-01T10:05:05.000'),
  });

  describeValidation(DesktopTimePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'legacy-picker',
  }));

  describeConformance(
    <DesktopTimePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={null}
    />,
    () => ({
      classes: {},
      muiName: 'MuiDesktopTimePicker',
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

  ['readOnly', 'disabled'].forEach((prop) => {
    it(`cannot be opened when "Choose time" is clicked when ${prop}={true}`, () => {
      const handleOpen = spy();
      render(
        <DesktopTimePicker
          value={adapterToUse.date(new Date(2019, 0, 1))}
          {...{ [prop]: true }}
          onChange={() => {}}
          onOpen={handleOpen}
          open={false}
          renderInput={(params) => <TextField {...params} />}
        />,
      );

      act(() => {
        userEvent.mousePress(screen.getByLabelText(/Choose time/));
      });

      expect(handleOpen.callCount).to.equal(0);
    });
  });

  it('allows to navigate between timepicker views using arrow switcher', () => {
    render(
      <DesktopTimePicker
        open
        views={['hours', 'minutes', 'seconds']}
        value={adapterToUse.date(new Date(2018, 0, 1))}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    const prevViewButton = screen.getByLabelText('open previous view');
    const nextViewButton = screen.getByLabelText('open next view');

    expect(screen.getByLabelText(/Select Hours/i)).toBeVisible();
    expect(prevViewButton).to.have.attribute('disabled');

    fireEvent.click(nextViewButton);
    expect(screen.getByLabelText(/Select minutes/)).toBeVisible();

    expect(prevViewButton).not.to.have.attribute('disabled');
    expect(nextViewButton).not.to.have.attribute('disabled');

    fireEvent.click(nextViewButton);
    expect(screen.getByLabelText(/Select seconds/)).toBeVisible();
    expect(nextViewButton).to.have.attribute('disabled');
  });

  it('fires a change event when meridiem changes', () => {
    const handleChange = spy();
    render(
      <DesktopTimePicker
        ampm
        onChange={handleChange}
        open
        renderInput={(params) => <TextField {...params} />}
        value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))}
      />,
    );
    const buttonPM = screen.getByRole('button', { name: 'PM' });

    act(() => {
      buttonPM.click();
    });

    expect(handleChange.callCount).to.equal(1);
    expect(handleChange.firstCall.args[0]).toEqualDateTime(new Date(2019, 0, 1, 16, 20));
  });

  it('should only update the time change editing through the input', () => {
    const handleChange = spy();
    render(
      <DesktopTimePicker
        ampm
        onChange={handleChange}
        open
        renderInput={(params) => <TextField {...params} />}
        value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))}
      />,
    );

    // call `onChange` with an invalid time
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: ':00 pm' },
    });

    expect(handleChange.callCount).to.equal(1);
    expect(adapterToUse.isValid(handleChange.lastCall.args[0])).to.equal(false);

    // call `onChange` with a valid time
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '07:00 pm' },
    });

    expect(handleChange.callCount).to.equal(2);
    expect(handleChange.lastCall.args[0]).toEqualDateTime(new Date(2019, 0, 1, 19));
  });

  it('should keep the date when time value is cleaned', () => {
    const handleChange = spy();

    render(
      <DesktopTimePicker
        ampm
        onChange={handleChange}
        open
        renderInput={(params) => <TextField {...params} />}
        value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))}
      />,
    );

    // reset the time value
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
    expect(handleChange.callCount).to.equal(1);
    expect(handleChange.lastCall.args[0]).to.equal(null);

    // call `onChange` with a valid time
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '07:00 pm' },
    });
    expect(handleChange.callCount).to.equal(2);
    expect(handleChange.lastCall.args[0]).toEqualDateTime(new Date(2019, 0, 1, 19));
  });

  describe('input validation', () => {
    [true, false].forEach((ampm) =>
      it(`prop: ampm - should set working default mask/inputFormat when ampm=${ampm}`, () => {
        const onChange = spy();
        render(
          <DesktopTimePicker
            ampm={ampm}
            renderInput={(params) => <TextField {...params} />}
            onChange={onChange}
            value={null}
          />,
        );

        // Call `onChange` with a 24h time
        fireEvent.change(screen.getByRole('textbox'), {
          target: { value: '10:12' },
        });
        expect(adapterToUse.isValid(onChange.lastCall.args[0])).to.equal(!ampm);

        // Call `onChange` with a 12h time. The mask will remove the am/pm
        fireEvent.change(screen.getByRole('textbox'), {
          target: { value: '10:12 am' },
        });
        expect(adapterToUse.isValid(onChange.lastCall.args[0])).to.equal(true);
      }),
    );

    const shouldDisableTime: TimePickerProps<any>['shouldDisableTime'] = (value) => value === 10;

    [
      { expectedError: 'invalidDate', props: { disableMaskedInput: true }, input: 'invalidText' },
      {
        expectedError: 'minTime',
        props: { minTime: adapterToUse.date(new Date(2000, 0, 1, 8)) },
        input: '03:00',
      },
      {
        expectedError: 'maxTime',
        props: { maxTime: adapterToUse.date(new Date(2000, 0, 1, 8)) },
        input: '12:00',
      },
      { expectedError: 'shouldDisableTime-hours', props: { shouldDisableTime }, input: '10:00' },
      { expectedError: 'shouldDisableTime-minutes', props: { shouldDisableTime }, input: '00:10' },
      { expectedError: 'disableFuture', props: { disableFuture: true }, input: '10:06' },
      { expectedError: 'disablePast', props: { disablePast: true }, input: '10:05' },
    ].forEach(({ props, input, expectedError }) => {
      it(`should dispatch "${expectedError}" error`, () => {
        const onErrorMock = spy();

        // we are running validation on value change
        function TimePickerInput() {
          const [time, setTime] = React.useState<Date | null>(null);

          return (
            <DesktopTimePicker
              ampm={false}
              value={time}
              onError={onErrorMock}
              onChange={(newTime) => setTime(newTime)}
              renderInput={(inputProps) => <TextField {...inputProps} />}
              {...props}
            />
          );
        }

        render(<TimePickerInput />);

        fireEvent.change(screen.getByRole('textbox'), {
          target: {
            value: input,
          },
        });

        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.args[0][0]).to.equal(expectedError);
      });
    });
  });

  describe('Component slots: Popper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <WrappedDesktopTimePicker
          open
          componentsProps={{
            popper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'popper',
            },
          }}
          initialValue={null}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('Component slots: DesktopPaper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <WrappedDesktopTimePicker
          open
          componentsProps={{
            desktopPaper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'paper',
            },
          }}
          initialValue={null}
        />,
      );
      const paper = screen.getByTestId('paper');

      fireEvent.click(paper);
      fireEvent.touchStart(paper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<WrappedDesktopTimePicker onOpen={onOpen} initialValue={null} />);

      userEvent.mousePress(screen.getByLabelText(/Choose time/));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onChange when selecting each view and onClose and onAccept when selecting the minutes', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedDesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'time', variant: 'desktop' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the hours
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove'));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 11));

      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the minutes
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove'));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup'));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 11, 53));

      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose and onAccept when selecting the minutes if props.closeOnSelect = false', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedDesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect={false}
        />,
      );

      openPicker({ type: 'time', variant: 'desktop' });

      // Change the hours (already tested)
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove'));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup'));

      // Change the minutes (already tested)
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove'));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup'));

      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept with the live value when pressing Escape', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedDesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'time', variant: 'desktop' });

      // Change the hours (already tested)
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove'));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup'));

      // Dismiss the picker
      // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target -- don't care
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      expect(onChange.callCount).to.equal(1); // Hours change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 11));
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose when clicking outside of the picker without prior change', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedDesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'time', variant: 'desktop' });

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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedDesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'time', variant: 'desktop' });

      // Change the hours (already tested)
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove'));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup'));

      // Dismiss the picker
      userEvent.mousePress(document.body);
      expect(onChange.callCount).to.equal(1); // Hours change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 11));
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when clicking outside of the picker if not opened', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedDesktopTimePicker
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
      const initialValue = adapterToUse.date(new Date(2018, 0, 1));

      render(
        <WrappedDesktopTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'time', variant: 'desktop' });

      // Clear the date
      fireEvent.click(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).to.equal(null);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).to.equal(null);
      expect(onClose.callCount).to.equal(1);
    });

    it('should respect `disableFuture` prop', async () => {
      const onChange = spy();
      render(
        <WrappedDesktopTimePicker
          initialValue={adapterToUse.date(new Date('2018-01-01T11:00:00.000'))}
          onChange={onChange}
          ampm={false}
          disableFuture
        />,
      );

      expect(screen.getByRole('textbox').parentElement).to.have.class(inputBaseClasses.error);

      openPicker({ type: 'time', variant: 'desktop' });

      expect(screen.getByRole('option', { name: '11 hours' })).to.have.class(
        inputBaseClasses.disabled,
      );
      expect(screen.getByRole('option', { name: '12 hours' })).to.have.class(
        inputBaseClasses.disabled,
      );

      // click on `10 hours`
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove', 30, 65));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup', 30, 65));
      expect(screen.getByRole('option', { name: '10 minutes' })).to.have.class(
        inputBaseClasses.disabled,
      );

      // click on `05 minutes`
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove', 155, 30));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup', 155, 30));

      expect(screen.getByRole('textbox').parentElement).not.to.have.class(inputBaseClasses.error);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date('2018-01-01T10:05:00.000'));
    });

    it('should respect `disablePast` prop', () => {
      const onChange = spy();
      render(
        <WrappedDesktopTimePicker
          initialValue={adapterToUse.date(new Date('2018-01-01T09:00:00.000'))}
          onChange={onChange}
          ampm={false}
          disablePast
        />,
      );

      openPicker({ type: 'time', variant: 'desktop' });

      expect(screen.getByRole('textbox').parentElement).to.have.class(inputBaseClasses.error);

      expect(screen.getByRole('option', { name: '8 hours' })).to.have.class(
        inputBaseClasses.disabled,
      );
      expect(screen.getByRole('option', { name: '9 hours' })).to.have.class(
        inputBaseClasses.disabled,
      );

      // click on `10 hours`
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove', 30, 65));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup', 30, 65));
      expect(screen.getByRole('option', { name: '00 minutes' })).to.have.class(
        inputBaseClasses.disabled,
      );
      expect(screen.getByRole('option', { name: '05 minutes' })).to.have.class(
        inputBaseClasses.disabled,
      );

      // click minutes
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mousemove'));
      fireEvent(screen.getByMuiTest('clock'), getClockMouseEvent('mouseup'));

      expect(screen.getByRole('textbox').parentElement).not.to.have.class(inputBaseClasses.error);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date('2018-01-01T10:53:00.000'));
    });
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(
        <WrappedDesktopTimePicker
          initialValue={null}
          localeText={{ cancelButtonLabel: 'Custom cancel' }}
          componentsProps={{ actionBar: { actions: () => ['cancel'] } }}
        />,
      );
      openPicker({ type: 'time', variant: 'desktop' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
