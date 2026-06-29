import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { vi } from 'vitest';

describe('<MonthCalendar />', () => {
  const { render } = createPickerRenderer();

  it('should allow to pick month standalone by click, `Enter` and `Space`', async () => {
    const onChange = spy();
    const { user } = render(
      <MonthCalendar value={adapterToUse.date('2019-02-02')} onChange={onChange} />,
    );
    const targetMonth = screen.getByRole('radio', { name: 'February' });

    // A native button implies Enter and Space keydown behavior
    // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
    // If this breaks, make sure to add tests for
    // - fireEvent.keyDown(targetDay, { key: 'Enter' })
    // - fireEvent.keyUp(targetDay, { key: 'Space' })
    expect(targetMonth.tagName).to.equal('BUTTON');

    await user.click(targetMonth);

    expect(onChange.callCount).to.equal(1);
    expect(onChange.args[0][0]).toEqualDateTime(new Date(2019, 1, 2));
  });

  describe('with fake timers', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date(2019, 0, 1));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should select start of month without time when no initial value is present', async () => {
      const onChange = spy();
      const { user } = render(<MonthCalendar onChange={onChange} />);

      await user.click(screen.getByRole('radio', { name: 'February' }));

      expect(onChange.callCount).to.equal(1);
      expect(onChange.args[0][0]).toEqualDateTime(new Date(2019, 1, 1, 0, 0, 0));
    });

    it('should mark only the month in the current year as `aria-current="date"`', () => {
      const { setProps } = render(<MonthCalendar />);

      expect(screen.getByRole('radio', { name: 'January' })).to.have.attribute(
        'aria-current',
        'date',
      );

      setProps({ currentMonth: adapterToUse.date('2018-01-01') });

      expect(screen.getByRole('radio', { name: 'January' })).not.to.have.attribute('aria-current');
    });

    it('should mark the month as selected only if the year matches', async () => {
      const { setProps, user } = render(<MonthCalendar />);

      expect(screen.getByRole('radio', { name: 'February', checked: false })).not.to.equal(null);

      await user.click(screen.getByRole('radio', { name: 'February' }));

      expect(screen.getByRole('radio', { name: 'February', checked: true })).not.to.equal(null);

      setProps({ currentMonth: adapterToUse.date('2018-02-01') });

      expect(screen.getByRole('radio', { name: 'January', checked: false })).not.to.equal(null);
      expect(screen.getByRole('radio', { name: 'February', checked: false })).not.to.equal(null);
    });
  });

  it('should not mark the `referenceDate` month as selected', () => {
    render(<MonthCalendar referenceDate={adapterToUse.date('2018-02-02')} />);

    expect(screen.getByRole('radio', { name: 'February', checked: false })).not.to.equal(null);
  });

  it('does not allow to pick months if readOnly prop is passed', async () => {
    const onChangeMock = spy();
    const { user } = render(
      <MonthCalendar value={adapterToUse.date('2019-02-02')} onChange={onChangeMock} readOnly />,
    );

    await user.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    await user.click(screen.getByText('Apr', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    await user.click(screen.getByText('Jul', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('clicking on a month button should not trigger the form submit', async () => {
    const onSubmitMock = spy();
    const { user } = render(
      <form onSubmit={onSubmitMock}>
        <MonthCalendar defaultValue={adapterToUse.date('2018-02-02')} />
      </form>,
    );

    await user.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onSubmitMock.callCount).to.equal(0);
  });

  describe('Disabled', () => {
    it('should disable all months if props.disabled = true', async () => {
      const onChange = spy();
      const { user } = render(
        <MonthCalendar value={adapterToUse.date('2019-02-15')} onChange={onChange} disabled />,
      );

      // Hoist the user-event instance so we don't recreate it on every
      // iteration; all we need is to bypass the pointer-events check on
      // disabled buttons.
      const userWithoutPointerEventsCheck = user.setup({ pointerEventsCheck: 0 });
      const monthButtons = screen.getAllByRole('radio');
      for (const monthButton of monthButtons) {
        expect(monthButton).to.have.attribute('disabled');
        // eslint-disable-next-line no-await-in-loop
        await userWithoutPointerEventsCheck.click(monthButton);
        expect(onChange.callCount).to.equal(0);
      }
    });

    it('should disable months before props.minDate but not the month in which props.minDate is', async () => {
      const onChange = spy();
      const { user } = render(
        <MonthCalendar
          value={adapterToUse.date('2019-02-15')}
          onChange={onChange}
          minDate={adapterToUse.date('2019-02-12')}
        />,
      );

      const january = screen.getByText('Jan', { selector: 'button' });
      const february = screen.getByText('Feb', { selector: 'button' });

      expect(january).to.have.attribute('disabled');
      expect(february).not.to.have.attribute('disabled');

      await user.setup({ pointerEventsCheck: 0 }).click(january);
      expect(onChange.callCount).to.equal(0);

      await user.click(february);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable months after props.maxDate but not the month in which props.maxDate is', async () => {
      const onChange = spy();
      const { user } = render(
        <MonthCalendar
          value={adapterToUse.date('2019-02-15')}
          onChange={onChange}
          maxDate={adapterToUse.date('2019-04-12')}
        />,
      );

      const may = screen.getByText('May', { selector: 'button' });
      const april = screen.getByText('Apr', { selector: 'button' });

      expect(may).to.have.attribute('disabled');
      expect(april).not.to.have.attribute('disabled');

      await user.setup({ pointerEventsCheck: 0 }).click(may);
      expect(onChange.callCount).to.equal(0);

      await user.click(april);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable months if props.shouldDisableMonth returns true', async () => {
      const onChange = spy();
      const { user } = render(
        <MonthCalendar
          value={adapterToUse.date('2019-02-02')}
          onChange={onChange}
          shouldDisableMonth={(month) => adapterToUse.getMonth(month) === 3}
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      const jun = screen.getByText('Jun', { selector: 'button' });

      expect(april).to.have.attribute('disabled');
      expect(jun).not.to.have.attribute('disabled');

      await user.setup({ pointerEventsCheck: 0 }).click(april);
      expect(onChange.callCount).to.equal(0);

      await user.click(jun);
      expect(onChange.callCount).to.equal(1);
    });

    describe('with fake timers', () => {
      beforeEach(() => {
        vi.setSystemTime(new Date(2019, 0, 1));
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should disable months after initial render when "disableFuture" prop changes', async () => {
        const { setProps } = render(<MonthCalendar />);

        const january = screen.getByText('Jan', { selector: 'button' });
        const february = screen.getByText('Feb', { selector: 'button' });

        expect(january).not.to.have.attribute('disabled');
        expect(february).not.to.have.attribute('disabled');

        setProps({ disableFuture: true });

        expect(january).not.to.have.attribute('disabled');
        expect(february).to.have.attribute('disabled');
      });
    });
  });
});
