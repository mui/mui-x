import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  screen,
  fireEvent,
  getByRole,
  describeConformance,
  createEvent,
} from '@mui/monorepo/test/utils';
import {
  adapterToUse,
  createPickerRenderer,
  DragEventTypes,
  MockedDataTransfer,
  wrapPickerMount,
} from 'test/utils/pickers-utils';
import {
  DateRangeCalendar,
  dateRangeCalendarClasses as classes,
} from '@mui/x-date-pickers-pro/DateRangeCalendar/index';

const getPickerDay = (name: string, picker = 'January 2018') =>
  getByRole(screen.getByText(picker)?.parentElement?.parentElement, 'gridcell', { name });

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
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'reactTestRenderer', 'themeVariants'],
  }));

  describe('Selection', () => {
    it('should select the range from the next month', () => {
      const onChange = spy();

      render(
        <DateRangeCalendar
          onChange={onChange}
          defaultValue={[adapterToUse.date(new Date(2019, 0, 1)), null]}
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
        <DateRangeCalendar
          onChange={onChange}
          defaultCalendarMonth={adapterToUse.date(new Date(2019, 0, 1))}
        />,
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
          defaultValue={[
            adapterToUse.date(new Date(2018, 0, 1)),
            adapterToUse.date(new Date(2018, 0, 31)),
          ]}
        />,
      );

      expect(screen.getAllByMuiTest('DateRangeHighlight')).to.have.length(31);
    });

    it('prop: disableDragEditing - should not allow dragging range', () => {
      render(
        <DateRangeCalendar
          defaultValue={[
            adapterToUse.date(new Date(2018, 0, 1)),
            adapterToUse.date(new Date(2018, 0, 31)),
          ]}
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

      const createDragEvent = (type: DragEventTypes, target: ChildNode) => {
        const createdEvent = createEvent[type](target);
        Object.defineProperty(createdEvent, 'dataTransfer', {
          value: dataTransfer,
        });
        return createdEvent;
      };

      const executeDateDrag = (startDate: ChildNode, ...otherDates: ChildNode[]) => {
        const endDate = otherDates[otherDates.length - 1];
        fireEvent(startDate, createDragEvent('dragStart', startDate));
        fireEvent(startDate, createDragEvent('dragLeave', startDate));
        otherDates.slice(0, otherDates.length - 1).forEach((date) => {
          fireEvent(date, createDragEvent('dragEnter', date));
          fireEvent(date, createDragEvent('dragOver', date));
          fireEvent(date, createDragEvent('dragLeave', date));
        });
        fireEvent(endDate, createDragEvent('dragEnter', endDate));
        fireEvent(endDate, createDragEvent('dragOver', endDate));
        fireEvent(endDate, createDragEvent('drop', endDate));
        fireEvent(endDate, createDragEvent('dragEnd', endDate));
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
            defaultValue={[
              adapterToUse.date(new Date(2018, 0, 1)),
              adapterToUse.date(new Date(2018, 0, 31)),
            ]}
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
          adapterToUse.date(new Date(2018, 0, 10)),
          adapterToUse.date(new Date(2018, 0, 31)),
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

        // test range expansion
        executeDateDrag(
          screen.getByRole('gridcell', { name: '29', selected: true }),
          screen.getByRole('gridcell', { name: '30' }),
        );

        expect(onChange.callCount).to.equal(2);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(initialValue[0]));
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 30));

        // test range flip
        executeDateDrag(
          screen.getByRole('gridcell', { name: '30', selected: true }),
          getPickerDay('2'),
        );

        expect(onChange.callCount).to.equal(3);
        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 2));
        expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[0]);
      });
    });
  });

  describe('Component slots: Day', () => {
    it('should render custom day component', () => {
      render(
        <DateRangeCalendar
          components={{
            Day: (day) => <div key={String(day)} data-testid="slot used" />,
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
          defaultValue={[
            adapterToUse.date(new Date(2018, 0, 1)),
            adapterToUse.date(new Date(2018, 6, 1)),
          ]}
        />,
      );

      fireEvent.click(getPickerDay('5', 'January 2018'));
      clock.runToLast();
      expect(getPickerDay('1', 'July 2018')).not.to.equal(null);
    });

    it('should not go to the month of the end date when changing the start date and props.disableAutoMonthSwitching = true', () => {
      render(
        <DateRangeCalendar
          defaultValue={[
            adapterToUse.date(new Date(2018, 0, 1)),
            adapterToUse.date(new Date(2018, 6, 1)),
          ]}
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
          value={[adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 6, 1))]}
        />,
      );

      setProps({
        value: [adapterToUse.date(new Date(2018, 3, 1)), adapterToUse.date(new Date(2018, 3, 1))],
      });
      clock.runToLast();
      expect(getPickerDay('1', 'April 2018')).not.to.equal(null);
    });
  });

  it('prop: calendars - should render the provided amount of calendars', () => {
    render(<DateRangeCalendar calendars={3} />);

    expect(screen.getAllByMuiTest('pickers-calendar')).to.have.length(3);
  });
});
