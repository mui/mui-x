import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DateCalendar />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2019-01-02'),
  });

  it('switches between views uncontrolled', () => {
    const handleViewChange = spy();
    render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        onViewChange={handleViewChange}
      />,
    );

    fireEvent.click(screen.getByLabelText(/switch to year view/i));

    expect(handleViewChange.callCount).to.equal(1);
    expect(screen.queryByLabelText(/switch to year view/i)).to.equal(null);
    expect(screen.getByLabelText('year view is open, switch to calendar view')).toBeVisible();
  });

  it('should allow month and view changing, but not selection when readOnly prop is passed', () => {
    const onChangeMock = spy();
    const onMonthChangeMock = spy();
    render(
      <DateCalendar
        value={adapterToUse.date('2019-01-01')}
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        readOnly
      />,
    );

    fireEvent.click(screen.getByTitle('Previous month'));
    expect(onMonthChangeMock.callCount).to.equal(1);

    fireEvent.click(screen.getByTitle('Next month'));
    expect(onMonthChangeMock.callCount).to.equal(2);

    clock.runToLast();

    fireEvent.click(screen.getByRole('gridcell', { name: '5' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('January 2019'));
    expect(screen.queryByLabelText('year view is open, switch to calendar view')).toBeVisible();
  });

  it('should not allow interaction when disabled prop is passed', () => {
    const onChangeMock = spy();
    const onMonthChangeMock = spy();
    render(
      <DateCalendar
        value={adapterToUse.date('2019-01-01')}
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        disabled
      />,
    );

    fireEvent.click(screen.getByText('January 2019'));
    expect(screen.queryByText('January 2019')).toBeVisible();
    expect(screen.queryByLabelText('year view is open, switch to calendar view')).to.equal(null);

    fireEvent.click(screen.getByTitle('Previous month'));
    expect(onMonthChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByTitle('Next month'));
    expect(onMonthChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByRole('gridcell', { name: '5' }));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('should display disabled days when disabled prop is passed', () => {
    const onChangeMock = spy();
    const onMonthChangeMock = spy();
    render(
      <DateCalendar
        value={adapterToUse.date('2019-01-01')}
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        disabled
      />,
    );

    // days are disabled
    const cells = screen.getAllByRole('gridcell');
    const disabledDays = cells.filter(
      (cell) => cell.getAttribute('disabled') !== null && cell.tagName === 'BUTTON',
    );

    expect(cells.length).to.equal(35);
    expect(disabledDays.length).to.equal(31);
  });

  it('should render column header according to dayOfWeekFormatter', () => {
    render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        dayOfWeekFormatter={(day) => `${adapterToUse.format(day, 'weekdayShort')}.`}
      />,
    );

    ['Su.', 'Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.'].forEach((formattedDay) => {
      expect(screen.getByText(formattedDay)).toBeVisible();
    });
  });

  it('should render week number when `displayWeekNumber=true`', () => {
    render(
      <DateCalendar
        value={adapterToUse.date('2019-01-01')}
        onChange={() => {}}
        displayWeekNumber
      />,
    );

    expect(screen.getAllByRole('rowheader').length).to.equal(5);
  });

  // test: https://github.com/mui/mui-x/issues/12373
  it('should not reset day to `startOfDay` if value already exists when finding the closest enabled date', () => {
    const onChange = spy();
    const defaultDate = adapterToUse.date('2019-01-02T11:12:13.550Z');
    render(<DateCalendar onChange={onChange} disablePast defaultValue={defaultDate} />);

    fireUserEvent.mousePress(
      screen.getByRole('button', { name: 'calendar view is open, switch to year view' }),
    );
    fireUserEvent.mousePress(screen.getByRole('radio', { name: '2020' }));

    // Finish the transition to the day view
    clock.runToLast();

    fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '1' }));
    fireUserEvent.mousePress(
      screen.getByRole('button', { name: 'calendar view is open, switch to year view' }),
    );
    // select the current year with a date in the past to trigger "findClosestEnabledDate"
    fireUserEvent.mousePress(screen.getByRole('radio', { name: '2019' }));

    expect(onChange.lastCall.firstArg).toEqualDateTime(defaultDate);
  });

  describe('Slot: calendarHeader', () => {
    it('should allow to override the format', () => {
      render(
        <DateCalendar
          defaultValue={adapterToUse.date('2019-01-01')}
          slotProps={{ calendarHeader: { format: 'yyyy/MM' } }}
        />,
      );

      expect(screen.getByText('2019/01')).toBeVisible();
    });
  });

  describe('view: day', () => {
    it('renders day calendar standalone', () => {
      render(<DateCalendar defaultValue={adapterToUse.date('2019-01-01')} />);

      expect(screen.getByText('January 2019')).toBeVisible();
      expect(screen.getAllByMuiTest('day')).to.have.length(31);
      // It should follow https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
      expect(
        document.querySelector(
          '[role="grid"] [role="rowgroup"] > [role="row"] button[role="gridcell"]',
        ),
      ).to.have.text('1');
    });

    it('should use `referenceDate` when no value defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          referenceDate={adapterToUse.date('2022-04-17T12:30:00')}
          view="day"
        />,
      );

      // should make the reference day firstly focusable
      expect(screen.getByRole('gridcell', { name: '17' })).to.have.attribute('tabindex', '0');

      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 3, 2, 12, 30));
    });

    it('should not use `referenceDate` when a value is defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          value={adapterToUse.date('2019-01-01T12:20:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
          view="day"
        />,
      );

      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 2, 12, 20));
    });

    it('should not use `referenceDate` when a defaultValue is defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01T12:20:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
          view="day"
        />,
      );

      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 2, 12, 20));
    });

    it('should keep the time of the currently provided date', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2018-01-03T11:11:11.111')}
          onChange={onChange}
          view="day"
        />,
      );

      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(
        adapterToUse.date('2018-01-02T11:11:11.111'),
      );
    });

    it('should complete weeks when showDaysOutsideCurrentMonth=true', () => {
      render(
        <DateCalendar
          defaultValue={adapterToUse.date('2018-01-03T11:11:11:111')}
          view="day"
          showDaysOutsideCurrentMonth
        />,
      );
      expect(screen.getAllByRole('gridcell', { name: '31' }).length).to.equal(2);
    });

    it('should complete weeks up to match `fixedWeekNumber`', () => {
      render(
        <DateCalendar
          defaultValue={adapterToUse.date('2018-01-03T11:11:11:111')}
          view="day"
          showDaysOutsideCurrentMonth
          fixedWeekNumber={6}
        />,
      );
      expect(screen.getAllByRole('row').length).to.equal(7); // 6 weeks + header
    });

    it('should open after `minDate` if now is outside', () => {
      render(<DateCalendar view="day" minDate={adapterToUse.date('2031-03-03')} />);

      expect(screen.getByText('March 2031')).not.to.equal(null);
    });

    it('should open before `maxDate` if now is outside', () => {
      render(<DateCalendar view="day" maxDate={adapterToUse.date('1534-03-03')} />);

      expect(screen.getByText('March 1534')).not.to.equal(null);
    });
  });

  describe('view: month', () => {
    it('should select the closest enabled date in the month if the current date is disabled', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2019-01-01')}
          onChange={onChange}
          shouldDisableDate={(date) =>
            adapterToUse.getMonth(date) === 3 && adapterToUse.getDate(date) < 6
          }
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 6));
    });

    it('should respect minDate when selecting closest enabled date', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2019-06-01')}
          minDate={adapterToUse.date('2019-04-07')}
          onChange={onChange}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 7));
    });

    it('should respect maxDate when selecting closest enabled date', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2019-01-29')}
          maxDate={adapterToUse.date('2019-04-22')}
          onChange={onChange}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 22));
    });

    it('should go to next view without changing the date when no date of the new month is enabled', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2019-01-29')}
          onChange={onChange}
          shouldDisableDate={(date) => adapterToUse.getMonth(date) === 3}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);
      clock.runToLast();

      expect(onChange.callCount).to.equal(0);
      expect(screen.getByMuiTest('calendar-month-and-year-text')).to.have.text('April 2019');
    });

    it('should use `referenceDate` when no value defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          referenceDate={adapterToUse.date('2018-01-01T12:30:00')}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 3, 1, 12, 30));
    });

    it('should not use `referenceDate` when a value is defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          value={adapterToUse.date('2019-01-01T12:20:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 1, 12, 20));
    });

    it('should not use `referenceDate` when a defaultValue is defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01T12:20:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 1, 12, 20));
    });
  });

  describe('view: year', () => {
    it('renders year selection standalone', () => {
      render(<DateCalendar defaultValue={adapterToUse.date('2019-01-01')} openTo="year" />);

      expect(screen.getAllByMuiTest('year')).to.have.length(200);
    });

    it('should select the closest enabled date in the month if the current date is disabled', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2019-04-29')}
          onChange={onChange}
          shouldDisableDate={(date) =>
            adapterToUse.getYear(date) === 2022 && adapterToUse.getMonth(date) === 3
          }
          views={['year', 'day']}
          openTo="year"
        />,
      );

      const year2022 = screen.getByText('2022', { selector: 'button' });
      fireEvent.click(year2022);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 4, 1));
    });

    it('should respect minDate when selecting closest enabled date', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2019-04-29')}
          minDate={adapterToUse.date('2017-05-12')}
          onChange={onChange}
          views={['year', 'day']}
          openTo="year"
        />,
      );

      const year2017 = screen.getByText('2017', { selector: 'button' });
      fireEvent.click(year2017);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2017, 4, 12));
    });

    it('should respect maxDate when selecting closest enabled date', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2019-04-29')}
          maxDate={adapterToUse.date('2022-03-31')}
          onChange={onChange}
          views={['year', 'day']}
          openTo="year"
        />,
      );

      const year2022 = screen.getByText('2022', { selector: 'button' });
      fireEvent.click(year2022);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 2, 31));
    });

    it('should go to next view without changing the date when no date of the new year is enabled', () => {
      const onChange = spy();

      render(
        <DateCalendar
          value={adapterToUse.date('2019-04-29')}
          onChange={onChange}
          shouldDisableDate={(date) => adapterToUse.getYear(date) === 2022}
          views={['year', 'day']}
          openTo="year"
        />,
      );

      const year2022 = screen.getByText('2022', { selector: 'button' });
      fireEvent.click(year2022);
      clock.runToLast();

      expect(onChange.callCount).to.equal(0);
      expect(screen.getByMuiTest('calendar-month-and-year-text')).to.have.text('January 2022');
    });

    it('should scroll to show the selected year', function test() {
      if (isJSDOM) {
        this.skip(); // Needs layout
      }
      render(
        <DateCalendar
          defaultValue={adapterToUse.date('2019-04-29')}
          views={['year']}
          openTo="year"
        />,
      );

      const rootElement = document.querySelector('.MuiDateCalendar-root')!;
      const selectedButton = document.querySelector('.Mui-selected')!;

      expect(rootElement).not.to.equal(null);
      expect(selectedButton).not.to.equal(null);

      const parentBoundingBox = rootElement.getBoundingClientRect();
      const buttonBoundingBox = selectedButton.getBoundingClientRect();

      expect(parentBoundingBox.top).not.to.greaterThan(buttonBoundingBox.top);
      expect(parentBoundingBox.bottom).not.to.lessThan(buttonBoundingBox.bottom);
    });

    it('should use `referenceDate` when no value defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          referenceDate={adapterToUse.date('2018-01-01T12:30:00')}
          views={['year']}
          openTo="year"
        />,
      );

      const year2022 = screen.getByText('2022', { selector: 'button' });
      fireEvent.click(year2022);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 0, 1, 12, 30));
    });

    it('should not use `referenceDate` when a value is defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          value={adapterToUse.date('2019-01-01T12:20:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
          views={['year']}
          openTo="year"
        />,
      );

      const year2022 = screen.getByText('2022', { selector: 'button' });
      fireEvent.click(year2022);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 0, 1, 12, 20));
    });

    it('should not use `referenceDate` when a defaultValue is defined', () => {
      const onChange = spy();

      render(
        <DateCalendar
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01T12:20:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
          views={['year']}
          openTo="year"
        />,
      );

      const year2022 = screen.getByText('2022', { selector: 'button' });
      fireEvent.click(year2022);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 0, 1, 12, 20));
    });
  });

  describe('Performance', () => {
    it('should only render newly selected day when selecting a day without a previously selected day', () => {
      const RenderCount = spy((props) => <PickersDay {...props} />);

      render(
        <DateCalendar
          slots={{
            day: React.memo(RenderCount),
          }}
        />,
      );

      const renderCountBeforeChange = RenderCount.callCount;
      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      expect(RenderCount.callCount - renderCountBeforeChange).to.equal(2); // 2 render * 1 day
    });

    it('should only re-render previously selected day and newly selected day when selecting a day', () => {
      const RenderCount = spy((props) => <PickersDay {...props} />);

      render(
        <DateCalendar
          defaultValue={adapterToUse.date('2019-04-29')}
          slots={{
            day: React.memo(RenderCount),
          }}
        />,
      );

      const renderCountBeforeChange = RenderCount.callCount;
      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      expect(RenderCount.callCount - renderCountBeforeChange).to.equal(4); // 2 render * 2 days
    });
  });
});
