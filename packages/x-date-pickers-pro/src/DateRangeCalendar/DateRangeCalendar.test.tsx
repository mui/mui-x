import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { screen, fireEvent, within, fireTouchChangedEvent } from '@mui/internal-test-utils';
import {
  adapterToUse,
  buildPickerDragInteractions,
  rangeCalendarDayTouches,
  createPickerRenderer,
} from 'test/utils/pickers';
import { MockedDataTransfer } from 'test/utils/dragAndDrop';
import {
  DateRangeCalendar,
  dateRangeCalendarClasses as classes,
} from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { describeConformance } from 'test/utils/describeConformance';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { RangePosition } from '../models';

const getPickerDay = (name: string, picker = 'January 2018') =>
  within(screen.getByRole('grid', { name: picker })).getByRole('gridcell', { name });

const dynamicShouldDisableDate = (date, position: RangePosition) => {
  if (position === 'end') {
    return adapterToUse.getDate(date) % 3 === 0;
  }
  return adapterToUse.getDate(date) % 5 === 0;
};

describe('<DateRangeCalendar />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 10),
  });

  describeConformance(<DateRangeCalendar />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDateRangeCalendar',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  describe('Selection', () => {
    it('should select the range from the next month', () => {
      const onChange = spy();

      render(
        <DateRangeCalendar
          onChange={onChange}
          defaultValue={[adapterToUse.date('2019-01-01'), null]}
        />,
      );

      fireEvent.click(getPickerDay('1', 'January 2019'));

      // FIXME use `getByRole(role, {hidden: false})` and skip JSDOM once this suite can run in JSDOM
      const [visibleButton] = screen.getAllByRole('button', {
        hidden: true,
        name: 'Next month',
      });
      fireEvent.click(visibleButton);
      clock.runToLast();
      fireEvent.click(getPickerDay('19', 'March 2019'));

      expect(onChange.callCount).to.equal(2);

      const rangeOn1stCall = onChange.firstCall.firstArg;
      expect(rangeOn1stCall[0]).to.toEqualDateTime(new Date(2019, 0, 1));
      expect(rangeOn1stCall[1]).to.equal(null);

      const rangeOn2ndCall = onChange.lastCall.firstArg;
      expect(rangeOn2ndCall[0]).to.toEqualDateTime(new Date(2019, 0, 1));
      expect(rangeOn2ndCall[1]).to.toEqualDateTime(new Date(2019, 2, 19));
    });

    it('should continue start selection if selected "end" date is before start', () => {
      const onChange = spy();

      render(
        <DateRangeCalendar onChange={onChange} referenceDate={adapterToUse.date('2019-01-01')} />,
      );

      fireEvent.click(getPickerDay('30', 'January 2019'));
      fireEvent.click(getPickerDay('19', 'January 2019'));

      expect(screen.queryByMuiTest('DateRangeHighlight')).to.equal(null);

      fireEvent.click(getPickerDay('30', 'January 2019'));

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

      expect(screen.getAllByMuiTest('DateRangeHighlight')).to.have.length(31);
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
      let dataTransfer: DataTransfer | null;

      const { executeDateDragWithoutDrop, executeDateDrag } = buildPickerDragInteractions(
        () => dataTransfer,
      );

      type TouchTarget = Pick<Touch, 'clientX' | 'clientY'>;

      const fireTouchEvent = (
        type: 'touchstart' | 'touchmove' | 'touchend',
        target: Element,
        touch: TouchTarget,
      ) => {
        fireTouchChangedEvent(target, type, { changedTouches: [touch] });
      };

      const executeDateTouchDragWithoutEnd = (target: Element, ...touchTargets: TouchTarget[]) => {
        fireTouchEvent('touchstart', target, touchTargets[0]);
        touchTargets.slice(0, touchTargets.length - 1).forEach((touch) => {
          fireTouchEvent('touchmove', target, touch);
        });
      };

      const executeDateTouchDrag = (target: Element, ...touchTargets: TouchTarget[]) => {
        const endTouchTarget = touchTargets[touchTargets.length - 1];
        executeDateTouchDragWithoutEnd(target, ...touchTargets);
        fireTouchEvent('touchend', target, endTouchTarget);
      };

      beforeEach(() => {
        dataTransfer = new MockedDataTransfer();
      });

      afterEach(() => {
        dataTransfer = null;
      });

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

      it('should not emit "onChange" when touch dragging is ended where it was started', function test() {
        if (!document.elementFromPoint) {
          this.skip();
        }
        const onChange = spy();
        render(
          <DateRangeCalendar
            onChange={onChange}
            defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-10')]}
          />,
        );

        const startDay = screen.getByRole('gridcell', { name: '1', selected: true });
        expect(onChange.callCount).to.equal(0);

        executeDateTouchDrag(
          startDay,
          rangeCalendarDayTouches['2018-01-01'],
          rangeCalendarDayTouches['2018-01-02'],
          rangeCalendarDayTouches['2018-01-01'],
        );

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

      it('should emit "onChange" when touch dragging end date', function test() {
        if (!document.elementFromPoint) {
          this.skip();
        }
        const onChange = spy();
        const initialValue: [any, any] = [
          adapterToUse.date('2018-01-02'),
          adapterToUse.date('2018-01-11'),
        ];
        render(<DateRangeCalendar onChange={onChange} defaultValue={initialValue} />);

        // test range reduction
        executeDateTouchDrag(
          getPickerDay('11'),
          rangeCalendarDayTouches['2018-01-11'],
          rangeCalendarDayTouches['2018-01-10'],
        );

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 10));

        // test range expansion
        executeDateTouchDrag(
          getPickerDay('10'),
          rangeCalendarDayTouches['2018-01-10'],
          rangeCalendarDayTouches['2018-01-11'],
        );

        expect(onChange.callCount).to.equal(2);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);

        // test range flip
        executeDateTouchDrag(
          getPickerDay('11'),
          rangeCalendarDayTouches['2018-01-11'],
          rangeCalendarDayTouches['2018-01-01'],
        );

        expect(onChange.callCount).to.equal(3);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 1));
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[0]);
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

      it('should emit "onChange" when touch dragging start date', function test() {
        if (!document.elementFromPoint) {
          this.skip();
        }
        const onChange = spy();
        const initialValue: [any, any] = [
          adapterToUse.date('2018-01-01'),
          adapterToUse.date('2018-01-10'),
        ];
        render(<DateRangeCalendar onChange={onChange} defaultValue={initialValue} />);

        // test range reduction
        executeDateTouchDrag(
          getPickerDay('1'),
          rangeCalendarDayTouches['2018-01-01'],
          rangeCalendarDayTouches['2018-01-02'],
        );

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 2));
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);

        // test range expansion
        executeDateTouchDrag(
          getPickerDay('2'),
          rangeCalendarDayTouches['2018-01-02'],
          rangeCalendarDayTouches['2018-01-01'],
        );

        expect(onChange.callCount).to.equal(2);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);

        // test range flip
        executeDateTouchDrag(
          getPickerDay('1'),
          rangeCalendarDayTouches['2018-01-01'],
          rangeCalendarDayTouches['2018-01-11'],
        );

        expect(onChange.callCount).to.equal(3);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[1]);
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 11));
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

      it('should dynamically update "shouldDisableDate" when flip touch dragging', function test() {
        if (!document.elementFromPoint) {
          this.skip();
        }
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
        executeDateTouchDragWithoutEnd(
          screen.getByRole('gridcell', { name: '1' }),
          rangeCalendarDayTouches['2018-01-01'],
          rangeCalendarDayTouches['2018-01-09'],
          rangeCalendarDayTouches['2018-01-10'],
        );

        expect(screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
        expect(
          screen.getAllByRole<HTMLButtonElement>('gridcell').filter((c) => c.disabled),
        ).to.have.lengthOf(10);
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
    it('should go to the month of the end date when changing the start date', () => {
      render(
        <DateRangeCalendar
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-07-01')]}
        />,
      );

      fireEvent.click(getPickerDay('5', 'January 2018'));
      clock.runToLast();
      expect(getPickerDay('1', 'July 2018')).not.to.equal(null);
    });

    it('should not go to the month of the end date when changing the start date and props.disableAutoMonthSwitching = true', () => {
      render(
        <DateRangeCalendar
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-07-01')]}
          disableAutoMonthSwitching
        />,
      );

      fireEvent.click(getPickerDay('5', 'January 2018'));
      clock.runToLast();
      expect(getPickerDay('1', 'January 2018')).not.to.equal(null);
    });

    it('should go to the month of the start date when changing both date from the outside', () => {
      const { setProps } = render(
        <DateRangeCalendar
          value={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-07-01')]}
        />,
      );

      setProps({
        value: [adapterToUse.date('2018-04-01'), adapterToUse.date('2018-04-01')],
      });
      clock.runToLast();
      expect(getPickerDay('1', 'April 2018')).not.to.equal(null);
    });
  });

  ['readOnly', 'disabled'].forEach((prop) => {
    it(`prop: ${prop}="true" should not allow date editing`, () => {
      const handleChange = spy();
      render(
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
        expect(screen.getByRole('gridcell', { name: '1', selected: true })).to.have.attribute(
          'disabled',
        );
      }
      fireEvent.click(getPickerDay('2'));
      expect(handleChange.callCount).to.equal(0);
    });
  });

  it('prop: calendars - should render the provided amount of calendars', () => {
    render(<DateRangeCalendar calendars={3} />);

    expect(screen.getAllByMuiTest('pickers-calendar')).to.have.length(3);
  });

  describe('Performance', () => {
    it('should only render the new start day when selecting a start day without a previously selected start day', () => {
      const RenderCount = spy((props) => <DateRangePickerDay {...props} />);

      render(
        <DateRangeCalendar
          slots={{
            day: React.memo(RenderCount),
          }}
        />,
      );

      const renderCountBeforeChange = RenderCount.callCount;
      fireUserEvent.mousePress(getPickerDay('2'));
      expect(RenderCount.callCount - renderCountBeforeChange).to.equal(2); // 2 render * 1 day
    });

    it('should only render the day inside range when selecting the end day', () => {
      const RenderCount = spy((props) => <DateRangePickerDay {...props} />);

      render(
        <DateRangeCalendar
          slots={{
            day: React.memo(RenderCount),
          }}
        />,
      );

      fireUserEvent.mousePress(getPickerDay('2'));

      const renderCountBeforeChange = RenderCount.callCount;
      fireUserEvent.mousePress(getPickerDay('4'));
      expect(RenderCount.callCount - renderCountBeforeChange).to.equal(6); // 2 render * 3 day
    });
  });
});
