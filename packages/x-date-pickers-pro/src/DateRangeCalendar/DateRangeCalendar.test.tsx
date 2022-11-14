import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { screen, fireEvent, getByRole, describeConformance } from '@mui/monorepo/test/utils';
import { adapterToUse, createPickerRenderer, wrapPickerMount } from 'test/utils/pickers-utils';
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
    skip: [
      'componentProp',
      'componentsProp',
      'reactTestRenderer',
      'themeVariants',
      'componentProp',
      // TODO: Fix DateRangeCalendar is not spreading props on root
        'propsSpread',
      'themeDefaultProps',
      'themeVariants',
    ],
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
