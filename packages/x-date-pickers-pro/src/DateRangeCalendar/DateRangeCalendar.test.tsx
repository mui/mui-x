import * as React from 'react';
import { spy } from 'sinon';
import { screen, fireEvent, within, waitFor } from '@mui/internal-test-utils';
import {
  adapterToUse,
  executeDateDrag,
  executeDateDragWithoutDrop,
  createPickerRenderer,
} from 'test/utils/pickers';
import {
  DateRangeCalendar,
  dateRangeCalendarClasses as classes,
} from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { describeConformance } from 'test/utils/describeConformance';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { RangePosition } from '../models';

const getPickerDay = (name: string, picker = 'January 2018') =>
  within(screen.getByRole('grid', { name: picker })).getByRole('gridcell', { name });

const dynamicShouldDisableDate = (date: PickerValidDate, position: RangePosition) => {
  if (position === 'end') {
    return adapterToUse.getDate(date) % 3 === 0;
  }
  return adapterToUse.getDate(date) % 5 === 0;
};

describe('<DateRangeCalendar />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DateRangeCalendar />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDateRangeCalendar',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'themeVariants'],
  }));

  describe('Selection', () => {
    it('should select the range from the next month', async () => {
      const onChange = spy();

      const { user } = render(
        <DateRangeCalendar
          onChange={onChange}
          defaultValue={[adapterToUse.date('2019-01-01'), null]}
        />,
      );

      await user.click(getPickerDay('1', 'January 2019'));

      const [visibleButton] = screen.getAllByRole('button', {
        name: 'Next month',
      });
      await user.click(visibleButton);

      await waitFor(() => {
        getPickerDay('19', 'March 2019');
      });

      await user.click(getPickerDay('19', 'March 2019'));

      expect(onChange.callCount).to.equal(2);

      const rangeOn1stCall = onChange.firstCall.firstArg;
      expect(rangeOn1stCall[0]).to.toEqualDateTime(new Date(2019, 0, 1));
      expect(rangeOn1stCall[1]).to.equal(null);

      const rangeOn2ndCall = onChange.lastCall.firstArg;
      expect(rangeOn2ndCall[0]).to.toEqualDateTime(new Date(2019, 0, 1));
      expect(rangeOn2ndCall[1]).to.toEqualDateTime(new Date(2019, 2, 19));
    });

    it('should continue start selection if selected "end" date is before start', async () => {
      const onChange = spy();

      const { user } = render(
        <DateRangeCalendar onChange={onChange} referenceDate={adapterToUse.date('2019-01-01')} />,
      );

      await user.click(getPickerDay('30', 'January 2019'));
      await user.click(getPickerDay('19', 'January 2019'));

      expect(screen.queryByTestId('DateRangeHighlight')).to.equal(null);

      await user.click(getPickerDay('30', 'January 2019'));

      expect(onChange.callCount).to.equal(3);
      const range = onChange.lastCall.firstArg;
      expect(range[0]).to.toEqualDateTime(new Date(2019, 0, 19));
      expect(range[1]).to.toEqualDateTime(new Date(2019, 0, 30));
    });

    it('should highlight the selected range of dates', () => {
      render(
        <DateRangeCalendar
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-31')]}
        />,
      );

      expect(screen.getAllByTestId('DateRangeHighlight')).to.have.length(31);
    });

    it('prop: disableDragEditing - should not allow dragging range', () => {
      render(
        <DateRangeCalendar
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-31')]}
          disableDragEditing
        />,
      );

      expect(screen.getByRole('gridcell', { name: '1', selected: true })).to.not.have.attribute(
        'draggable',
      );
      expect(screen.getByRole('gridcell', { name: '31', selected: true })).to.not.have.attribute(
        'draggable',
      );
    });

    describe('dragging behavior', () => {
      it('should not emit "onChange" when dragging is ended where it was started', () => {
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });
        const dragToDay = screen.getByRole('gridcell', { name: '30' });
        expect(onChange.callCount).to.equal(0);

        executeDateDrag(startDay, dragToDay, startDay);

        expect(onChange.callCount).to.equal(0);
      });

      it('should emit "onChange" when dragging end date', () => {
        const onChange = spy();
        const initialValue: [any, any] = [
          adapterToUse.date('2018-01-10'),
          adapterToUse.date('2018-01-31'),
        ];
        render(<DateRangeCalendar onChange={onChange} defaultValue={initialValue} />);

        // test range reduction
        executeDateDrag(
          screen.getByRole('gridcell', { name: '31', selected: true }),
          screen.getByRole('gridcell', { name: '30' }),
          screen.getByRole('gridcell', { name: '29' }),
        );

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 29));
        expect(document.activeElement).toHaveAccessibleName('29');

        // test range expansion
        executeDateDrag(
          screen.getByRole('gridcell', { name: '29', selected: true }),
          screen.getByRole('gridcell', { name: '30' }),
        );

        expect(onChange.callCount).to.equal(2);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 30));
        expect(document.activeElement).toHaveAccessibleName('30');

        // test range flip
        executeDateDrag(
          screen.getByRole('gridcell', { name: '30', selected: true }),
          getPickerDay('2'),
        );

        expect(onChange.callCount).to.equal(3);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 2));
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[0]);
        expect(document.activeElement).toHaveAccessibleName('2');
      });

      it('should emit "onChange" when dragging start date', () => {
        const onChange = spy();
        const initialValue: [any, any] = [
          adapterToUse.date('2018-01-01'),
          adapterToUse.date('2018-01-20'),
        ];
        render(<DateRangeCalendar onChange={onChange} defaultValue={initialValue} />);

        // test range reduction
        executeDateDrag(getPickerDay('1'), getPickerDay('2'), getPickerDay('3'));

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
        expect(document.activeElement).toHaveAccessibleName('3');

        // test range expansion
        executeDateDrag(getPickerDay('3'), getPickerDay('1'));

        expect(onChange.callCount).to.equal(2);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
        expect(document.activeElement).toHaveAccessibleName('1');

        // test range flip
        executeDateDrag(getPickerDay('1'), getPickerDay('22'));

        expect(onChange.callCount).to.equal(3);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[1]);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 22));
        expect(document.activeElement).toHaveAccessibleName('22');
      });

      it('should dynamically update "shouldDisableDate" when flip dragging', () => {
        const initialValue: [any, any] = [
          adapterToUse.date('2018-01-01'),
          adapterToUse.date('2018-01-07'),
        ];
        render(
          <DateRangeCalendar
            defaultValue={initialValue}
            shouldDisableDate={dynamicShouldDisableDate}
            calendars={1}
          />,
        );

        expect(screen.getByRole('gridcell', { name: '5' })).to.have.attribute('disabled');
        expect(
          screen.getAllByRole<HTMLButtonElement>('gridcell').filter((c) => c.disabled),
        ).to.have.lengthOf(6);
        // flip date range
        executeDateDragWithoutDrop(
          screen.getByRole('gridcell', { name: '1' }),
          screen.getByRole('gridcell', { name: '4' }),
          screen.getByRole('gridcell', { name: '10' }),
        );

        expect(screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
        expect(
          screen.getAllByRole<HTMLButtonElement>('gridcell').filter((c) => c.disabled),
        ).to.have.lengthOf(10);
      });

      it('should not initiate drag on non-draggable dates', () => {
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-20')]}
          />,
        );

        // Try to drag from a non-selected (non-endpoint) date
        const middleDay = getPickerDay('15');
        const targetDay = getPickerDay('25');

        executeDateDrag(middleDay, targetDay);

        // No change should occur since middle day is not draggable
        expect(onChange.callCount).to.equal(0);
      });

      it('should ignore secondary multi-touch pointers (isPrimary === false)', () => {
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });
        const intermediateDay = getPickerDay('30');
        const endDay = getPickerDay('29');

        fireEvent.pointerDown(startDay, { pointerId: 1, button: 0, isPrimary: true });
        // Second finger lands on a different cell — must not start a competing drag.
        fireEvent.pointerDown(endDay, { pointerId: 2, button: 0, isPrimary: false });
        fireEvent.pointerOver(intermediateDay, { pointerId: 1 });
        fireEvent.pointerOver(endDay, { pointerId: 1 });
        fireEvent.pointerUp(endDay, { pointerId: 1 });

        // The first finger's gesture survives intact — exactly one drop, from
        // pointerId 1.
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 29));
      });

      it('should recover from a stuck gesture when a fresh primary pointerdown arrives', () => {
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });
        const intermediateDay = getPickerDay('30');
        const endDay = getPickerDay('29');

        // Simulate a stuck gesture: pointerdown, no matching pointerup arrives.
        fireEvent.pointerDown(startDay, { pointerId: 1, button: 0, isPrimary: true });
        // A fresh primary pointerdown must reset the prior gesture and proceed.
        fireEvent.pointerDown(startDay, { pointerId: 2, button: 0, isPrimary: true });
        fireEvent.pointerOver(intermediateDay, { pointerId: 2 });
        fireEvent.pointerOver(endDay, { pointerId: 2 });
        fireEvent.pointerUp(endDay, { pointerId: 2 });

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 29));
      });

      it('should commit the drop when the gesture is canceled after movement', () => {
        // `pointercancel` after the user has crossed cells should be treated
        // as "UA interrupted, not the user" and commit the drop.
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });
        const endDay = getPickerDay('29');

        fireEvent.pointerDown(startDay, { pointerId: 1, button: 0, isPrimary: true });
        fireEvent.pointerOver(endDay, { pointerId: 1 });
        fireEvent.pointerCancel(document, { pointerId: 1 });

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 29));
      });

      it('should not commit a drop on pointercancel before any movement', () => {
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });

        fireEvent.pointerDown(startDay, { pointerId: 1, button: 0, isPrimary: true });
        fireEvent.pointerCancel(document, { pointerId: 1 });

        expect(onChange.callCount).to.equal(0);
      });

      it('should clean up listeners after pointercancel and allow a new drag', () => {
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });
        const otherEndpoint = getPickerDay('10');
        const newEndDay = getPickerDay('29');

        // First gesture is canceled before any movement.
        fireEvent.pointerDown(startDay, { pointerId: 1, button: 0, isPrimary: true });
        fireEvent.pointerCancel(document, { pointerId: 1 });

        // A second, independent drag must still work — listeners and refs were
        // properly torn down.
        executeDateDrag(otherEndpoint, newEndDay);

        expect(onChange.callCount).to.equal(1);
      });

      it('should suppress the click that follows a moved drag', () => {
        // The browser fires a synthesized click after pointerup. Without
        // suppression it would re-enter the day's normal selection logic and
        // overwrite the drop.
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });
        const endDay = getPickerDay('29');

        executeDateDrag(startDay, endDay);
        // Simulate the synthesized click on the drop target.
        fireEvent.click(endDay);

        // Exactly one onChange — from the drop, not double-counted by the click.
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 29));
      });

      it('should cancel the drop when the pointer is released outside any cell', () => {
        // Native HTML5 drag cancels when the user releases outside any drop
        // target. Match that — releasing into a gap or off the calendar
        // entirely must not commit the last cell the user happened to hover.
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });
        const endDay = getPickerDay('29');

        executeDateDragWithoutDrop(startDay, endDay);
        // Release on something that isn't a day cell (no `data-timestamp`).
        // `event.target` doesn't resolve to a cell, so the drop is cancelled.
        fireEvent.pointerUp(document.body, { pointerId: 1 });

        expect(onChange.callCount).to.equal(0);
      });

      it('should cancel an in-flight drag on Escape', () => {
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-31')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '31', selected: true });
        const endDay = getPickerDay('29');

        executeDateDragWithoutDrop(startDay, endDay);
        fireEvent.keyDown(document.body, { key: 'Escape' });
        // pointerup arriving after Escape is a no-op (cleanup already ran).
        fireEvent.pointerUp(document, { pointerId: 1 });

        expect(onChange.callCount).to.equal(0);
      });
    });
  });

  describe('Component slot: Day', () => {
    it('should render custom day component', () => {
      render(
        <DateRangeCalendar
          slots={{
            day: (day) => <div key={String(day)} data-testid="slot used" />,
          }}
        />,
      );

      expect(screen.getAllByTestId('slot used')).not.to.have.length(0);
    });
  });

  describe('prop: disableAutoMonthSwitching', () => {
    it('should go to the month of the end date when changing the start date', async () => {
      const { user } = render(
        <DateRangeCalendar
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-07-01')]}
        />,
      );

      await user.click(getPickerDay('5', 'January 2018'));
      await waitFor(() => {
        expect(getPickerDay('1', 'July 2018')).not.to.equal(null);
      });
    });

    it('should not go to the month of the end date when changing the start date and props.disableAutoMonthSwitching = true', async () => {
      const { user } = render(
        <DateRangeCalendar
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-07-01')]}
          disableAutoMonthSwitching
        />,
      );

      await user.click(getPickerDay('5', 'January 2018'));
      await waitFor(() => {
        expect(getPickerDay('1', 'January 2018')).not.to.equal(null);
      });
    });

    it('should go to the month of the start date when changing both date from the outside', async () => {
      const { setProps } = render(
        <DateRangeCalendar
          value={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-07-01')]}
        />,
      );

      setProps({
        value: [adapterToUse.date('2018-04-01'), adapterToUse.date('2018-04-01')],
      });
      await waitFor(() => {
        expect(getPickerDay('1', 'April 2018')).not.to.equal(null);
      });
    });

    describe('prop: currentMonthCalendarPosition', () => {
      it('should switch to the selected month when changing value from the outside', async () => {
        const { setProps } = render(
          <DateRangeCalendar
            value={[adapterToUse.date('2018-01-10'), adapterToUse.date('2018-01-15')]}
            currentMonthCalendarPosition={2}
          />,
        );

        setProps({
          value: [adapterToUse.date('2018-02-11'), adapterToUse.date('2018-02-22')],
        });

        await waitFor(() => {
          expect(getPickerDay('1', 'February 2018')).not.to.equal(null);
        });
      });
    });
  });

  ['readOnly', 'disabled'].forEach((prop) => {
    it(`prop: ${prop}="true" should not allow date editing`, async () => {
      const handleChange = spy();
      const { user } = render(
        <DateRangeCalendar
          value={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-10')]}
          onChange={handleChange}
          {...{ [prop]: true }}
        />,
      );
      expect(screen.getByRole('gridcell', { name: '1', selected: true })).to.not.have.attribute(
        'draggable',
      );
      expect(screen.getByRole('gridcell', { name: '10', selected: true })).to.not.have.attribute(
        'draggable',
      );
      if (prop === 'disabled') {
        // eslint-disable-next-line vitest/no-conditional-expect
        expect(screen.getByRole('gridcell', { name: '1', selected: true })).to.have.attribute(
          'disabled',
        );
      }
      await user.setup({ pointerEventsCheck: 0 }).click(getPickerDay('2'));
      expect(handleChange.callCount).to.equal(0);
    });
  });

  it('prop: calendars - should render the provided amount of calendars', () => {
    render(<DateRangeCalendar calendars={3} />);

    expect(screen.getAllByTestId('pickers-calendar')).to.have.length(3);
  });

  describe('Performance', () => {
    it('should only render the new start day when selecting a start day without a previously selected start day', () => {
      const RenderCount = spy((props) => <DateRangePickerDay {...props} />);

      render(
        <DateRangeCalendar
          referenceDate={adapterToUse.date('2018-01-01')}
          slots={{
            day: React.memo(RenderCount),
          }}
        />,
      );

      const renderCountBeforeChange = RenderCount.callCount;
      // sticking with `fireEvent` for simplified performance test
      fireEvent.click(getPickerDay('2'));
      expect(RenderCount.callCount - renderCountBeforeChange).to.equal(2); // 2 render * 1 day
    });

    it('should only render the day inside range when selecting the end day', () => {
      const RenderCount = spy((props) => <DateRangePickerDay {...props} />);

      render(
        <DateRangeCalendar
          referenceDate={adapterToUse.date('2018-01-01')}
          slots={{
            day: React.memo(RenderCount),
          }}
        />,
      );

      fireEvent.click(getPickerDay('2'));

      const renderCountBeforeChange = RenderCount.callCount;
      // sticking with `fireEvent` for simplified performance test
      fireEvent.click(getPickerDay('4'));
      expect(RenderCount.callCount - renderCountBeforeChange).to.equal(6); // 2 render * 3 day
    });
  });
});
