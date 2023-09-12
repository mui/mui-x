import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  fireEvent,
  fireTouchChangedEvent,
  screen,
  within,
  getAllByRole,
} from '@mui/monorepo/test/utils';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { createPickerRenderer, adapterToUse, timeClockHandler } from 'test/utils/pickers';

describe('<TimeClock />', () => {
  const { render } = createPickerRenderer();

  it('renders a listbox with a name', () => {
    render(<TimeClock value={null} onChange={() => {}} />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAccessibleName('Select hours. No time selected');
  });

  it('has a name depending on the `date`', () => {
    render(
      <TimeClock value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))} onChange={() => {}} />,
    );

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAccessibleName('Select hours. Selected time is 4:20 AM');
  });

  it('renders the current value as an accessible option', () => {
    render(
      <TimeClock value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))} onChange={() => {}} />,
    );

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
    render(
      <TimeClock value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))} onChange={() => {}} />,
    );

    const selectedOption = screen.getByRole('option', { selected: true });
    expect(selectedOption).toHaveAccessibleName('4 hours');
  });

  it('selects the first hour on Home press', () => {
    const handleChange = spy();
    render(
      <TimeClock
        autoFocus
        value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))}
        onChange={handleChange}
      />,
    );
    const listbox = screen.getByRole('listbox');

    fireEvent.keyDown(listbox, { key: 'Home' });

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    // TODO: Can't find the GH issue regarding this
    // expect(newDate).toEqualDateTime(new Date(2019, 0, 1, 0, 20));
    // but the year, mont, day is different
    expect(adapterToUse.getHours(newDate)).to.equal(0);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('selects the last hour on End press', () => {
    const handleChange = spy();
    render(
      <TimeClock
        autoFocus
        value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))}
        onChange={handleChange}
      />,
    );
    const listbox = screen.getByRole('listbox');

    fireEvent.keyDown(listbox, { key: 'End' });

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    expect(adapterToUse.getHours(newDate)).to.equal(11);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('selects the next hour on ArrowUp press', () => {
    const handleChange = spy();
    render(
      <TimeClock
        autoFocus
        value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))}
        onChange={handleChange}
      />,
    );
    const listbox = screen.getByRole('listbox');

    fireEvent.keyDown(listbox, { key: 'ArrowUp' });

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    expect(adapterToUse.getHours(newDate)).to.equal(5);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('selects the previous hour on ArrowDown press', () => {
    const handleChange = spy();
    render(
      <TimeClock
        autoFocus
        value={adapterToUse.date(new Date(2019, 0, 1, 4, 20))}
        onChange={handleChange}
      />,
    );
    const listbox = screen.getByRole('listbox');

    fireEvent.keyDown(listbox, { key: 'ArrowDown' });

    expect(handleChange.callCount).to.equal(1);
    const [newDate, reason] = handleChange.firstCall.args;
    expect(adapterToUse.getHours(newDate)).to.equal(3);
    expect(adapterToUse.getMinutes(newDate)).to.equal(20);
    expect(reason).to.equal('partial');
  });

  it('should call `shouldDisableClock` with the hours with meridiem', () => {
    const shouldDisableClock = spy(() => false);

    render(
      <TimeClock
        autoFocus
        value={adapterToUse.date(new Date(2019, 0, 1, 18, 20))}
        onChange={() => {}}
        shouldDisableClock={shouldDisableClock}
        ampm
      />,
    );

    const hours = shouldDisableClock
      .getCalls()
      .filter((el) => el.lastArg === 'hours')
      .map((el) => el.firstArg);

    // Should be called with every hour post meridiem (from 12 to 23) since current date hour is 6PM
    expect(Math.min(...hours)).to.equal(12);
    expect(Math.max(...hours)).to.equal(23);
  });

  it('should display options, but not update value when readOnly prop is passed', function test() {
    // Only run in supported browsers
    if (typeof Touch === 'undefined') {
      this.skip();
    }
    const selectEvent = {
      changedTouches: [
        {
          clientX: 150,
          clientY: 60,
        },
      ],
    };
    const onChangeMock = spy();
    render(
      <TimeClock
        value={adapterToUse.date(new Date(2019, 0, 1))}
        onChange={onChangeMock}
        readOnly
      />,
    );

    fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', selectEvent);
    expect(onChangeMock.callCount).to.equal(0);

    // hours are not disabled
    const hoursContainer = screen.getByRole('listbox');
    const hours = getAllByRole(hoursContainer, 'option');
    const disabledHours = hours.filter((hour) => hour.getAttribute('aria-disabled') === 'true');

    expect(hours.length).to.equal(12);
    expect(disabledHours.length).to.equal(0);
  });

  it('should display disabled options when disabled prop is passed', function test() {
    // Only run in supported browsers
    if (typeof Touch === 'undefined') {
      this.skip();
    }
    const selectEvent = {
      changedTouches: [
        {
          clientX: 150,
          clientY: 60,
        },
      ],
    };
    const onChangeMock = spy();
    render(
      <TimeClock
        value={adapterToUse.date(new Date(2019, 0, 1))}
        onChange={onChangeMock}
        disabled
      />,
    );

    fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', selectEvent);
    expect(onChangeMock.callCount).to.equal(0);

    // hours are disabled
    const hoursContainer = screen.getByRole('listbox');
    const hours = getAllByRole(hoursContainer, 'option');
    const disabledHours = hours.filter((hour) => hour.getAttribute('aria-disabled') === 'true');

    expect(hours.length).to.equal(12);
    expect(disabledHours.length).to.equal(12);
  });

  describe('Time validation on touch ', () => {
    before(function beforeHook() {
      if (typeof window.Touch === 'undefined' || typeof window.TouchEvent === 'undefined') {
        this.skip();
      }
    });

    const clockTouchEvent = {
      '13:--': {
        changedTouches: [
          {
            clientX: 150,
            clientY: 60,
          },
        ],
      },
      '20:--': {
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
          value={adapterToUse.date(new Date(2018, 0, 1))}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          onViewChange={handleViewChange}
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['13:--']);

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
          value={adapterToUse.date(new Date(2018, 0, 1, 13))}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          onViewChange={handleViewChange}
          view="minutes"
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['--:20']);

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
          value={adapterToUse.date(new Date(2018, 0, 1, 20))}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          view="minutes"
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should not select minute when time is disabled (no current value)', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={null}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          view="minutes"
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should not select disabled hour', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date(new Date(2018, 0, 1, 13))}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          view="hours"
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['20:--']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should not select disabled hour (no current value)', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={null}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          view="hours"
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['20:--']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should visually disable the dates not matching minutesStep', () => {
      render(
        <TimeClock
          ampm={false}
          value={adapterToUse.date(new Date(2018, 0, 1, 13, 20))}
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
          value={adapterToUse.date(new Date(2018, 0, 1, 13, 20))}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          onViewChange={handleViewChange}
          views={['seconds']}
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['--:10']);

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
          value={adapterToUse.date(new Date(2018, 0, 1))}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          views={['seconds']}
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(0);
    });

    it('should not select second when time is disabled (no current value)', () => {
      const handleChange = spy();
      render(
        <TimeClock
          ampm={false}
          value={null}
          minTime={adapterToUse.date(new Date(2018, 0, 1, 12, 15))}
          maxTime={adapterToUse.date(new Date(2018, 0, 1, 15, 45, 30))}
          onChange={handleChange}
          views={['seconds']}
        />,
      );

      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', clockTouchEvent['--:20']);

      expect(handleChange.callCount).to.equal(0);
    });
  });

  describe('default value', () => {
    it('if value is provided, keeps minutes and seconds when changing hour', () => {
      const handleChange = spy();
      render(
        <TimeClock
          autoFocus
          value={adapterToUse.date(new Date(2019, 0, 1, 4, 19, 47))}
          onChange={handleChange}
        />,
      );
      const listbox = screen.getByRole('listbox');

      fireEvent.keyDown(listbox, { key: 'ArrowUp' });

      expect(handleChange.callCount).to.equal(1);
      const [newDate] = handleChange.firstCall.args;
      expect(adapterToUse.getHours(newDate)).to.equal(5);
      expect(adapterToUse.getMinutes(newDate)).to.equal(19);
      expect(adapterToUse.getSeconds(newDate)).to.equal(47);
    });

    it('if value is not provided, uses zero as default for minutes and seconds when selecting hour', () => {
      const handleChange = spy();
      render(<TimeClock autoFocus value={null} onChange={handleChange} />);
      const listbox = screen.getByRole('listbox');

      fireEvent.keyDown(listbox, { key: 'ArrowUp' });

      expect(handleChange.callCount).to.equal(1);
      const [newDate] = handleChange.firstCall.args;
      expect(adapterToUse.getHours(newDate)).to.equal(1);
      expect(adapterToUse.getMinutes(newDate)).to.equal(0);
      expect(adapterToUse.getSeconds(newDate)).to.equal(0);
    });
  });

  describe('Reference date', () => {
    it('should use `referenceDate` when no value defined', () => {
      const onChange = spy();

      render(
        <TimeClock
          onChange={onChange}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 12, 30))}
        />,
      );

      timeClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setHours(adapterToUse.date(), 3),
        'hours',
      );
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
    });

    it('should not use `referenceDate` when a value is defined', () => {
      const onChange = spy();

      render(
        <TimeClock
          onChange={onChange}
          value={adapterToUse.date(new Date(2019, 0, 1, 12, 20))}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 15, 30))}
        />,
      );

      timeClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setHours(adapterToUse.date(), 3),
        'hours',
      );
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 20));
    });

    it('should not use `referenceDate` when a defaultValue is defined', () => {
      const onChange = spy();

      render(
        <TimeClock
          onChange={onChange}
          defaultValue={adapterToUse.date(new Date(2019, 0, 1, 12, 20))}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 15, 30))}
        />,
      );

      timeClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setHours(adapterToUse.date(), 3),
        'hours',
      );
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 20));
    });
  });
});
