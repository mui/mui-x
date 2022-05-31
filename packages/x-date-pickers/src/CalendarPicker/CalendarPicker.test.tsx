import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  fireEvent,
  userEvent,
  screen,
  describeConformance,
  getAllByRole,
} from '@mui/monorepo/test/utils';
import {
  CalendarPicker,
  calendarPickerClasses as classes,
} from '@mui/x-date-pickers/CalendarPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  AdapterClassToUse,
  adapterToUse,
  wrapPickerMount,
  createPickerRenderer,
} from '../../../../test/utils/pickers-utils';

describe('<CalendarPicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<CalendarPicker date={adapterToUse.date()} onChange={() => {}} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiCalendarPicker',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: [
      'componentProp',
      'componentsProp',
      'propsSpread',
      'reactTestRenderer',
      // TODO: Fix CalendarPicker is not spreading props on root
      'themeDefaultProps',
      'themeVariants',
    ],
  }));

  it('switches between views uncontrolled', () => {
    const handleViewChange = spy();
    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={() => {}}
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
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        readOnly
      />,
    );

    fireEvent.click(screen.getByTitle('Previous month'));
    expect(onMonthChangeMock.callCount).to.equal(1);

    fireEvent.click(screen.getByTitle('Next month'));
    expect(onMonthChangeMock.callCount).to.equal(2);

    fireEvent.click(screen.getByLabelText(/Jan 5, 2019/i));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('January 2019'));
    expect(screen.queryByLabelText('year view is open, switch to calendar view')).toBeVisible();
  });

  it('should not allow interaction when disabled prop is passed', () => {
    const onChangeMock = spy();
    const onMonthChangeMock = spy();
    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
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

    fireEvent.click(screen.getByLabelText(/Jan 5, 2019/i));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('should display disabled days when disabled prop is passed', () => {
    const onChangeMock = spy();
    const onMonthChangeMock = spy();
    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        disabled
      />,
    );

    // days are disabled
    const daysContainer = screen.getByRole('grid');
    const days = getAllByRole(daysContainer, 'button');
    const disabledDays = days.filter((day) => day.getAttribute('disabled') !== null);

    expect(days.length).to.equal(31);
    expect(disabledDays.length).to.equal(31);
  });

  it('renders header label text according to monthAndYear format', () => {
    render(
      <LocalizationProvider
        dateAdapter={AdapterClassToUse}
        dateFormats={{ monthAndYear: 'yyyy/MM' }}
      >
        <CalendarPicker date={adapterToUse.date('2019-01-01T00:00:00.000')} onChange={() => {}} />,
      </LocalizationProvider>,
    );

    expect(screen.getByText('2019/01')).toBeVisible();
  });

  it('should select the closest enabled date if the prop.date contains a disabled date', () => {
    const onChange = spy();

    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChange}
        maxDate={adapterToUse.date('2018-01-01T00:00:00.000')}
      />,
    );

    // onChange must be dispatched with newly selected date
    expect(onChange.callCount).to.equal(React.version.startsWith('18') ? 2 : 1); // Strict Effects run mount effects twice
    expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-01T00:00:00.000'));
  });

  describe('view: day', () => {
    it('renders day calendar standalone', () => {
      render(
        <CalendarPicker date={adapterToUse.date('2019-01-01T00:00:00.000')} onChange={() => {}} />,
      );

      expect(screen.getByText('January 2019')).toBeVisible();
      expect(screen.getAllByMuiTest('day')).to.have.length(31);
      // It should follow https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
      expect(
        document.querySelector('[role="grid"] > [role="row"] > [role="cell"] > button'),
      ).to.have.text('1');
    });

    it('should set time to be midnight when selecting a date without a previous date', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={null}
          onChange={onChange}
          defaultCalendarMonth={adapterToUse.date('2018-01-01T00:00:00.000')}
          view="day"
        />,
      );

      userEvent.mousePress(screen.getByLabelText('Jan 2, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2018-01-02T00:00:00.000'),
      );
    });

    it('should keep the time of the currently provided date', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2018-01-03T11:11:11.111')}
          onChange={onChange}
          defaultCalendarMonth={adapterToUse.date('2018-01-01T00:00:00.000')}
          view="day"
        />,
      );

      userEvent.mousePress(screen.getByLabelText('Jan 2, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2018-01-02T11:11:11.000'),
      );
    });
  });

  describe('view: month', () => {
    it('should select the closest enabled date in the month if the current date is disabled', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2019-01-01T00:00:00.000')}
          onChange={onChange}
          shouldDisableDate={(date) => {
            // Missing `getDate` in adapters
            // The following disable from Apr 1st to Apr 5th
            return (
              adapterToUse.getMonth(date) === 3 &&
              adapterToUse.getDiff(date, adapterToUse.startOfMonth(date), 'days') < 5
            );
          }}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2019-04-06T00:00:00.000'),
      );
    });

    it('should respect minDate when selecting closest enabled date', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2019-06-01T00:00:00.000')}
          minDate={adapterToUse.date('2019-04-07T00:00:00.000')}
          onChange={onChange}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2019-04-07T00:00:00.000'),
      );
    });

    it('should respect maxDate when selecting closest enabled date', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2019-01-29T00:00:00.000')}
          maxDate={adapterToUse.date('2019-04-22T00:00:00.000')}
          onChange={onChange}
          views={['month', 'day']}
          openTo="month"
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      fireEvent.click(april);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2019-04-22T00:00:00.000'),
      );
    });

    it('should go to next view without changing the date when no date of the new month is enabled', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2019-01-29T00:00:00.000')}
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
  });

  describe('view: year', () => {
    it('renders year selection standalone', () => {
      render(
        <CalendarPicker
          date={adapterToUse.date('2019-01-01T00:00:00.000')}
          openTo="year"
          onChange={() => {}}
        />,
      );

      expect(screen.getAllByMuiTest('year')).to.have.length(200);
    });

    it('should select the closest enabled date in the month if the current date is disabled', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2019-04-29T00:00:00.000')}
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
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2022-05-01T00:00:00.000'),
      );
    });

    it('should respect minDate when selecting closest enabled date', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2019-04-29T00:00:00.000')}
          minDate={adapterToUse.date('2017-05-12T00:00:00.000')}
          onChange={onChange}
          views={['year', 'day']}
          openTo="year"
        />,
      );

      const year2017 = screen.getByText('2017', { selector: 'button' });
      fireEvent.click(year2017);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2017-05-12T00:00:00.000'),
      );
    });

    it('should respect maxDate when selecting closest enabled date', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2019-04-29T00:00:00.000')}
          maxDate={adapterToUse.date('2022-03-31T00:00:00.000')}
          onChange={onChange}
          views={['year', 'day']}
          openTo="year"
        />,
      );

      const year2022 = screen.getByText('2022', { selector: 'button' });
      fireEvent.click(year2022);

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2022-03-31T00:00:00.000'),
      );
    });

    it('should go to next view without changing the date when no date of the new year is enabled', () => {
      const onChange = spy();

      render(
        <CalendarPicker
          date={adapterToUse.date('2019-04-29T00:00:00.000')}
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
  });
});
