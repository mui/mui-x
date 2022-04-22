import * as React from 'react';
import TextField from '@mui/material/TextField';
import { spy } from 'sinon';
import { expect } from 'chai';
import { act, describeConformance, fireEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { TransitionProps } from '@mui/material/transitions';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
} from '../../../../test/utils/pickers-utils';

describe('<DesktopTimePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

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

  const NoTransition = React.forwardRef(function NoTransition(
    props: TransitionProps & { children?: React.ReactNode },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { children, in: inProp } = props;

    if (!inProp) {
      return null;
    }
    return (
      <div ref={ref} tabIndex={-1}>
        {children}
      </div>
    );
  });

  it('opens when "Choose time" is clicked', () => {
    const handleClose = spy();
    const handleOpen = spy();
    render(
      <DesktopTimePicker
        value={null}
        onChange={() => {}}
        onClose={handleClose}
        onOpen={handleOpen}
        renderInput={(params) => <TextField {...params} />}
        TransitionComponent={NoTransition}
      />,
    );

    userEvent.mousePress(screen.getByLabelText(/choose time/i));

    expect(handleClose.callCount).to.equal(0);
    expect(handleOpen.callCount).to.equal(1);
  });

  ['readOnly', 'disabled'].forEach((prop) => {
    it(`cannot be opened when "Choose time" is clicked when ${prop}={true}`, () => {
      const handleOpen = spy();
      render(
        <DesktopTimePicker
          value={adapterToUse.date('2019-01-01T00:00:00.000')}
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

  it('closes on clickaway', () => {
    const handleClose = spy();
    render(
      <DesktopTimePicker
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
        value={null}
        open
        onClose={handleClose}
      />,
    );

    userEvent.mousePress(document.body);

    expect(handleClose.callCount).to.equal(1);
  });

  it('does not close on clickaway when it is not open', () => {
    const handleClose = spy();
    render(
      <DesktopTimePicker
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
        value={null}
        onClose={handleClose}
      />,
    );

    userEvent.mousePress(document.body);

    expect(handleClose.callCount).to.equal(0);
  });

  it('does not close on click inside', () => {
    const handleClose = spy();
    render(
      <DesktopTimePicker
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
        value={null}
        open
        onClose={handleClose}
      />,
    );

    userEvent.mousePress(screen.getByLabelText('open next view'));

    expect(handleClose.callCount).to.equal(0);
  });

  it('closes on Escape press', () => {
    const handleClose = spy();
    render(
      <DesktopTimePicker
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
        value={null}
        open
        onClose={handleClose}
      />,
    );
    act(() => {
      (document.activeElement as HTMLElement).blur();
    });

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(handleClose.callCount).to.equal(1);
  });

  it('allows to navigate between timepicker views using arrow switcher', () => {
    render(
      <DesktopTimePicker
        open
        views={['hours', 'minutes', 'seconds']}
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
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
        value={adapterToUse.date('2019-01-01T04:20:00.000')}
      />,
    );
    const buttonPM = screen.getByRole('button', { name: 'PM' });

    act(() => {
      buttonPM.click();
    });

    expect(handleChange.callCount).to.equal(1);
    expect(handleChange.firstCall.args[0]).toEqualDateTime(
      adapterToUse.date('2019-01-01T16:20:00.000'),
    );
  });

  it('should only update the time change editing through the input', () => {
    const handleChange = spy();
    render(
      <DesktopTimePicker
        ampm
        onChange={handleChange}
        open
        renderInput={(params) => <TextField {...params} />}
        value={adapterToUse.date('2019-01-01T04:20:00.000')}
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
    expect(handleChange.lastCall.args[0]).toEqualDateTime(
      adapterToUse.date('2019-01-01T19:00:00.000'),
    );
  });

  it('should keep the date when time value is cleaned', function test() {
    const handleChange = spy();

    render(
      <DesktopTimePicker
        ampm
        onChange={handleChange}
        open
        renderInput={(params) => <TextField {...params} />}
        value={adapterToUse.date('2019-01-01T04:20:00.000')}
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
    expect(handleChange.lastCall.args[0]).toEqualDateTime(
      adapterToUse.date('2019-01-01T19:00:00.000'),
    );
  });

  context('input validation', () => {
    const shouldDisableTime: TimePickerProps['shouldDisableTime'] = (value) => value === 10;

    [
      { expectedError: 'invalidDate', props: {}, input: 'invalidText' },
      {
        expectedError: 'minTime',
        props: { minTime: adapterToUse.date(`2000-01-01T08:00:00.000`) },
        input: '03:00',
      },
      {
        expectedError: 'maxTime',
        props: { maxTime: adapterToUse.date(`2000-01-01T08:00:00.000`) },
        input: '12:00',
      },
      { expectedError: 'shouldDisableTime-hours', props: { shouldDisableTime }, input: '10:00' },
      { expectedError: 'shouldDisableTime-minutes', props: { shouldDisableTime }, input: '00:10' },
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

  describe('prop: PopperProps', () => {
    it('forwards onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopTimePicker
          open
          onChange={() => {}}
          PopperProps={{
            onClick: handleClick,
            onTouchStart: handleTouchStart,
            // @ts-expect-error `data-*` attributes are not recognized in props objects
            'data-testid': 'popper',
          }}
          renderInput={(params) => <TextField {...params} />}
          value={null}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('prop: PaperProps', () => {
    it('forwards onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopTimePicker
          open
          onChange={() => {}}
          PaperProps={{
            onClick: handleClick,
            onTouchStart: handleTouchStart,
            // @ts-expect-error `data-*` attributes are not recognized in props objects
            'data-testid': 'paper',
          }}
          renderInput={(params) => <TextField {...params} />}
          value={null}
        />,
      );
      const paper = screen.getByTestId('paper');

      fireEvent.click(paper);
      fireEvent.touchStart(paper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });
});
