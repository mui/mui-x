import { spy } from 'sinon';
import { fireEvent, screen, within } from '@mui/internal-test-utils';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import {
  createPickerRenderer,
  adapterToUse,
  fireClockPointerEvent,
  timeClockHandler,
} from 'test/utils/pickers';

describe('<TimeClock />', () => {
  const { render } = createPickerRenderer();

  it('renders a listbox with a name', () => {
    render(<TimeClock value={null} onChange={() => {}} />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAccessibleName('Select hours. No time selected');
  });

  it('has a name depending on the `date`', () => {
    render(<TimeClock value={adapterToUse.date('2019-01-01T04:20:00')} onChange={() => {}} />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAccessibleName('Select hours. Selected time is 04:20 AM');
  });

  it('renders the current value as an accessible option', () => {
    render(<TimeClock value={adapterToUse.date('2019-01-01T04:20:00')} onChange={() => {}} />);

    const listbox = screen.getByRole('listbox');
    const selectedOption = within(listbox).getByRole('option', { selected: true });
    expect(selectedOption).toHaveAccessibleName('4 hours');
    expect(listbox).to.have.attribute('aria-activedescendant', selectedOption.id);
  });

  it('can be autofocused on mount', () => {
    render(<TimeClock autoFocus value={null} onChange={() => {}} />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveFocus();
  });

  it('stays focused when the view changes', () => {
    const { setProps } = render(
      <TimeClock autoFocus value={null} onChange={() => {}} view="hours" />,
    );

    setProps({ view: 'minutes' });

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveFocus();
  });

  it('selects the current date on mount', () => {
    render(<TimeClock value={adapterToUse.date('2019-01-01T04:20:00')} onChange={() => {}} />);

    const selectedOption = screen.getByRole('option', { selected: true });
    expect(selectedOption).toHaveAccessibleName('4 hours');
  });

  it('selects the first hour on Home press', async () => {
    const handleChange = spy();
    const { user } = render(
      <TimeClock
        autoFocus
        value={adapterToUse.date('2019-01-01T04:20:00')}
        onChange={handleChange}
      />,
    );

    await user.keyboard('{Home}');

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    // TODO: Can't find the GH issue regarding this
    // expect(newDate).toEqualDateTime(new Date(2019, 0, 1, 0, 20));
    // but the year, mont, day is different
    expect(adapterToUse.getHours(newDate)).to.equal(0);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('selects the last hour on End press', async () => {
    const handleChange = spy();
    const { user } = render(
      <TimeClock
        autoFocus
        value={adapterToUse.date('2019-01-01T04:20:00')}
        onChange={handleChange}
      />,
    );

    await user.keyboard('{End}');

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    expect(adapterToUse.getHours(newDate)).to.equal(11);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('selects the next hour on ArrowUp press', async () => {
    const handleChange = spy();
    const { user } = render(
      <TimeClock
        autoFocus
        value={adapterToUse.date('2019-01-01T04:20:00')}
        onChange={handleChange}
      />,
    );

    await user.keyboard('{ArrowUp}');

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    expect(adapterToUse.getHours(newDate)).to.equal(5);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('selects the previous hour on ArrowDown press', async () => {
    const handleChange = spy();
    const { user } = render(
      <TimeClock
        autoFocus
        value={adapterToUse.date('2019-01-01T04:20:00')}
        onChange={handleChange}
      />,
    );

    await user.keyboard('{ArrowDown}');

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    expect(adapterToUse.getHours(newDate)).to.equal(3);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('should increase hour selection by 5 on PageUp press', async () => {
    const handleChange = spy();
    const { user } = render(
      <TimeClock
        autoFocus
        value={adapterToUse.date('2019-01-01T22:20:00')}
        onChange={handleChange}
      />,
    );

    await user.keyboard('{PageUp}');

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    expect(adapterToUse.getHours(newDate)).to.equal(23);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('should decrease hour selection by 5 on PageDown press', async () => {
    const handleChange = spy();
    const { user } = render(
      <TimeClock
        autoFocus
        value={adapterToUse.date('2019-01-01T02:20:00')}
        onChange={handleChange}
      />,
    );

    await user.keyboard('{PageDown}');

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    expect(adapterToUse.getHours(newDate)).to.equal(0);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  [
    {
      keyName: 'Enter',
      keySequence: '{Enter}',
    },
    {
      keyName: 'Space',
      keySequence: '[Space]',
    },
  ].forEach(({ keyName, keySequence }) => {
    it(`sets value on ${keyName} press`, async () => {
      const handleChange = spy();
      const { user } = render(
        <TimeClock
          autoFocus
          defaultValue={adapterToUse.date('2019-01-01T04:20:00')}
          onChange={handleChange}
        />,
      );

      await user.keyboard('{ArrowDown}');
      await user.keyboard(keySequence);

      expect(handleChange.callCount).to.equal(2);
      let [newDate, reason] = handleChange.lastCall.args;

      expect(adapterToUse.getHours(newDate)).to.equal(3);
      expect(reason).to.equal('partial');

      await user.keyboard('{ArrowUp}');
      await user.keyboard(keySequence);

      expect(handleChange.callCount).to.equal(4);
      [newDate, reason] = handleChange.lastCall.args;

      expect(adapterToUse.getMinutes(newDate)).to.equal(21);
      expect(reason).to.equal('finish');
    });
  });

  it('should display options, but not update value when readOnly prop is passed', () => {
    const selectEvent = {
      changedTouches: [
        {
          clientX: 150,
          clientY: 60,
        },
      ],
    };
    const onChangeMock = spy();
    render(<TimeClock value={adapterToUse.date('2019-01-01')} onChange={onChangeMock} readOnly />);

    fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', selectEvent);
    expect(onChangeMock.callCount).to.equal(0);

    // hours are not disabled
    const hoursContainer = screen.getByRole('listbox');
    const hours = within(hoursContainer).getAllByRole('option');
    const disabledHours = hours.filter((hour) => hour.getAttribute('aria-disabled') === 'true');

    expect(hours.length).to.equal(12);
    expect(disabledHours.length).to.equal(0);
  });

  it('should display disabled options when disabled prop is passed', () => {
    const selectEvent = {
      changedTouches: [
        {
          clientX: 150,
          clientY: 60,
        },
      ],
    };
    const onChangeMock = spy();
    render(<TimeClock value={adapterToUse.date('2019-01-01')} onChange={onChangeMock} disabled />);

    fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', selectEvent);
    expect(onChangeMock.callCount).to.equal(0);

    // hours are disabled
    const hoursContainer = screen.getByRole('listbox');
    const hours = within(hoursContainer).getAllByRole('option');
    const disabledHours = hours.filter((hour) => hour.getAttribute('aria-disabled') === 'true');

    expect(hours.length).to.equal(12);
    expect(disabledHours.length).to.equal(12);
  });

  describe('Time selection on pointer', () => {
    const clockTouchEvent = {
      '13:--': {
        changedTouches: [
          {
            clientX: 150,
            clientY: 60,
          },
        ],
      },
      '19:--': {
        changedTouches: [
          {
            clientX: 66,
            clientY: 157,
          },
        ],
      },
      '--:10': {
        changedTouches: [
          {
            clientX: 190,
            clientY: 60,
          },
        ],
      },
      '--:20': {
        changedTouches: [
          {
            clientX: 222,
            clientY: 180,
          },
        ],
      },
    };

    it('should select enabled hour', () => {
      const handleChange = spy();
      const handleViewChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01')}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          onViewChange={handleViewChange}
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['13:--']);

      expect(handleChange.callCount).to.equal(1);
      const [date, selectionState] = handleChange.firstCall.args;
      expect(date).toEqualDateTime(new Date(2018, 0, 1, 13));
      expect(selectionState).to.equal('shallow');
      expect(handleViewChange.callCount).to.equal(0);
    });

    it('should select enabled minute', () => {
      const handleChange = spy();
      const handleViewChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01T13:00:00')}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          onViewChange={handleViewChange}
          view="minutes"
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(1);
      const [date, selectionState] = handleChange.firstCall.args;
      expect(date).toEqualDateTime(new Date(2018, 0, 1, 13, 20));
      expect(selectionState).to.equal('shallow');
      expect(handleViewChange.callCount).to.equal(0);
    });

    it('should not select minute when time is disabled', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01T01:20:00')}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          view="minutes"
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should not select minute when time is disabled (no current value)', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={null}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          view="minutes"
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should not select disabled hour', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01T13:00:00')}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          view="hours"
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['19:--']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should not select disabled hour (no current value)', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={null}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          view="hours"
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['19:--']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should visually disable the dates not matching minutesStep', () => {
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01T13:20:00')}
          minutesStep={15}
          onChange={() => {}}
          view="minutes"
        />,
      );

      expect(screen.getByLabelText('25 minutes')).to.have.class('Mui-disabled');
      expect(screen.getByLabelText('30 minutes')).not.to.have.class('Mui-disabled');
    });

    it('should select enabled second', () => {
      const handleChange = spy();
      const handleViewChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01T13:20:00')}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          onViewChange={handleViewChange}
          views={['seconds']}
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['--:10']);

      expect(handleChange.callCount).to.equal(1);
      const [date, selectionState] = handleChange.firstCall.args;
      expect(date).toEqualDateTime(new Date(2018, 0, 1, 13, 20, 10));
      expect(selectionState).to.equal('shallow');
      expect(handleViewChange.callCount).to.equal(0);
    });

    it('should not select second when time is disabled', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01')}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          views={['seconds']}
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should not select second when time is disabled (no current value)', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={null}
          minTime={adapterToUse.date('2018-01-01T12:15:00')}
          maxTime={adapterToUse.date('2018-01-01T15:45:30')}
          onChange={handleChange}
          views={['seconds']}
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should select enabled hour on touch and drag', () => {
      const handleChange = spy();
      const handleViewChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01')}
          onChange={handleChange}
          onViewChange={handleViewChange}
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['13:--']);
      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerMove', clockTouchEvent['19:--']);

      expect(handleChange.callCount).to.equal(2);
      const [date, selectionState] = handleChange.lastCall.args;
      expect(date).toEqualDateTime(new Date(2018, 0, 1, 19));
      expect(selectionState).to.equal('shallow');
      expect(handleViewChange.callCount).to.equal(0);
    });

    it('should select enabled hour and move to next view on touch end', () => {
      const handleChange = spy();
      const handleViewChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01')}
          onChange={handleChange}
          onViewChange={handleViewChange}
        />,
      );

      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerDown', clockTouchEvent['13:--']);
      fireClockPointerEvent(screen.getByTestId('clock'), 'pointerUp', clockTouchEvent['13:--']);

      expect(handleChange.callCount).to.equal(2);
      const [date, selectionState] = handleChange.lastCall.args;
      expect(date).toEqualDateTime(new Date(2018, 0, 1, 13));
      expect(selectionState).to.equal('partial');
      expect(handleViewChange.callCount).to.equal(1);
    });
  });

  describe('Time selection on pointer drag', () => {
    // Coordinates relative to the clock mask, turned into viewport `clientX`/
    // `clientY` using the live bounding rect so the test is agnostic to where the
    // clock is rendered (rect is `0, 0` in jsdom, real in the browser).
    const hourOffset = {
      '13:--': { offsetX: 150, offsetY: 60 },
      '19:--': { offsetX: 66, offsetY: 157 },
    };

    it('should keep tracking the drag and commit the value when released outside the clock', () => {
      const handleChange = spy();
      const handleViewChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01')}
          onChange={handleChange}
          onViewChange={handleViewChange}
        />,
      );

      const clock = screen.getByTestId('clock');
      const rect = clock.getBoundingClientRect();
      const toClientCoords = ({ offsetX, offsetY }: { offsetX: number; offsetY: number }) => ({
        clientX: rect.left + offsetX,
        clientY: rect.top + offsetY,
      });

      // Press on "13", drag towards "19", then release the pointer OUTSIDE the
      // clock. The move/up events target the document (not the clock mask) and are
      // caught by the document-level pointer listeners.
      fireEvent.pointerDown(clock, {
        pointerId: 1,
        button: 0,
        isPrimary: true,
        ...toClientCoords(hourOffset['13:--']),
      });
      fireEvent.pointerMove(document.body, {
        pointerId: 1,
        ...toClientCoords(hourOffset['19:--']),
      });
      fireEvent.pointerUp(document.body, { pointerId: 1, ...toClientCoords(hourOffset['19:--']) });

      const [date, selectionState] = handleChange.lastCall.args;
      expect(date).toEqualDateTime(new Date(2018, 0, 1, 19));
      expect(selectionState).to.equal('partial');
      expect(handleViewChange.callCount).to.equal(1);
    });

    it('should drop the gesture without committing when the pointer is cancelled', () => {
      const handleChange = spy();
      const handleViewChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01')}
          onChange={handleChange}
          onViewChange={handleViewChange}
        />,
      );

      const clock = screen.getByTestId('clock');
      const rect = clock.getBoundingClientRect();
      const toClientCoords = ({ offsetX, offsetY }: { offsetX: number; offsetY: number }) => ({
        clientX: rect.left + offsetX,
        clientY: rect.top + offsetY,
      });

      // Press, drag, then let the user agent interrupt the gesture (`pointercancel`).
      fireEvent.pointerDown(clock, {
        pointerId: 1,
        button: 0,
        isPrimary: true,
        ...toClientCoords(hourOffset['13:--']),
      });
      fireEvent.pointerMove(document.body, {
        pointerId: 1,
        ...toClientCoords(hourOffset['19:--']),
      });
      fireEvent.pointerCancel(document.body, {
        pointerId: 1,
        ...toClientCoords(hourOffset['19:--']),
      });

      // The interrupted gesture must not commit (no `finish`) nor advance the view.
      expect(handleChange.lastCall.args[1]).to.equal('shallow');
      expect(handleViewChange.callCount).to.equal(0);
    });

    it('should recover and commit when a new pointerdown supersedes a gesture whose pointerup was lost', () => {
      const handleChange = spy();
      const handleViewChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date('2018-01-01')}
          onChange={handleChange}
          onViewChange={handleViewChange}
        />,
      );

      const clock = screen.getByTestId('clock');
      const rect = clock.getBoundingClientRect();
      const toClientCoords = ({ offsetX, offsetY }: { offsetX: number; offsetY: number }) => ({
        clientX: rect.left + offsetX,
        clientY: rect.top + offsetY,
      });

      // First gesture never receives its `pointerup` (lost release).
      fireEvent.pointerDown(clock, {
        pointerId: 1,
        button: 0,
        isPrimary: true,
        ...toClientCoords(hourOffset['13:--']),
      });
      // A fresh pointerdown supersedes it and must still commit correctly.
      fireEvent.pointerDown(clock, {
        pointerId: 2,
        button: 0,
        isPrimary: true,
        ...toClientCoords(hourOffset['19:--']),
      });
      fireEvent.pointerUp(document.body, { pointerId: 2, ...toClientCoords(hourOffset['19:--']) });

      const [date, selectionState] = handleChange.lastCall.args;
      expect(date).toEqualDateTime(new Date(2018, 0, 1, 19));
      expect(selectionState).to.equal('partial');
      expect(handleViewChange.callCount).to.equal(1);
    });
  });

  describe('default value', () => {
    it('if value is provided, keeps minutes and seconds when changing hour', async () => {
      const handleChange = spy();
      const { user } = render(
        <TimeClock
          autoFocus
          value={adapterToUse.date('2019-01-01T04:19:47')}
          onChange={handleChange}
        />,
      );

      await user.keyboard('{ArrowUp}');

      expect(handleChange.callCount).to.equal(1);
      const [newDate] = handleChange.firstCall.args;
      expect(adapterToUse.getHours(newDate)).to.equal(5);
      expect(adapterToUse.getMinutes(newDate)).to.equal(19);
      expect(adapterToUse.getSeconds(newDate)).to.equal(47);
    });

    it('if value is not provided, uses zero as default for minutes and seconds when selecting hour', async () => {
      const handleChange = spy();
      const { user } = render(<TimeClock autoFocus value={null} onChange={handleChange} />);

      await user.keyboard('{ArrowUp}');

      expect(handleChange.callCount).to.equal(1);
      const [newDate] = handleChange.firstCall.args;
      expect(adapterToUse.getHours(newDate)).to.equal(1);
      expect(adapterToUse.getMinutes(newDate)).to.equal(0);
      expect(adapterToUse.getSeconds(newDate)).to.equal(0);
    });
  });

  describe('Reference date', () => {
    it('should use `referenceDate` when no value defined', async () => {
      const onChange = spy();

      const { user } = render(
        <TimeClock onChange={onChange} referenceDate={adapterToUse.date('2018-01-01T12:30:00')} />,
      );

      await timeClockHandler.setViewValue(
        user,
        adapterToUse,
        adapterToUse.setHours(adapterToUse.date(), 3),
        'hours',
      );
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
    });

    it('should not use `referenceDate` when a value is defined', async () => {
      const onChange = spy();

      const { user } = render(
        <TimeClock
          onChange={onChange}
          value={adapterToUse.date('2019-01-01T12:20:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      await timeClockHandler.setViewValue(
        user,
        adapterToUse,
        adapterToUse.setHours(adapterToUse.date(), 3),
        'hours',
      );
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 20));
    });

    it('should not use `referenceDate` when a defaultValue is defined', async () => {
      const onChange = spy();

      const { user } = render(
        <TimeClock
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01T12:20:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      await timeClockHandler.setViewValue(
        user,
        adapterToUse,
        adapterToUse.setHours(adapterToUse.date(), 3),
        'hours',
      );
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 20));
    });
  });
});
