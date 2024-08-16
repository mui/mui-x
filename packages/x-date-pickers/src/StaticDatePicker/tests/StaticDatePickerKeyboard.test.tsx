import * as React from 'react';
import { expect } from 'chai';
import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DateView } from '@mui/x-date-pickers/models';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';

describe('<StaticDatePicker /> - Keyboard interactions', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describe('Calendar keyboard navigation', () => {
    it('can autofocus selected day on mount', () => {
      render(
        <StaticDatePicker
          autoFocus
          displayStaticWrapperAs="desktop"
          defaultValue={adapterToUse.date('2022-08-13')}
        />,
      );

      expect(screen.getByRole('gridcell', { name: '13' })).toHaveFocus();
    });

    [
      { key: 'End', expectFocusedDay: '15' },
      { key: 'Home', expectFocusedDay: '9' },
      { key: 'ArrowLeft', expectFocusedDay: '12' },
      { key: 'ArrowUp', expectFocusedDay: '6' },
      { key: 'ArrowRight', expectFocusedDay: '14' },
      { key: 'ArrowDown', expectFocusedDay: '20' },
    ].forEach(({ key, expectFocusedDay }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            autoFocus
            displayStaticWrapperAs="desktop"
            defaultValue={adapterToUse.date('2020-08-13')}
          />,
        );

        // Don't care about what's focused.
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key });

        // Based on column header, screen reader should pronounce <Day Number> <Week Day>
        // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
        expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
      });
    });

    [
      // Switch between months
      { initialDay: '01', key: 'ArrowLeft', expectFocusedDay: '31' },
      { initialDay: '05', key: 'ArrowUp', expectFocusedDay: '29' },
      { initialDay: '31', key: 'ArrowRight', expectFocusedDay: '1' },
      { initialDay: '30', key: 'ArrowDown', expectFocusedDay: '6' },
      // Switch between weeks
      { initialDay: '10', key: 'ArrowLeft', expectFocusedDay: '9' },
      { initialDay: '09', key: 'ArrowRight', expectFocusedDay: '10' },
    ].forEach(({ initialDay, key, expectFocusedDay }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            autoFocus
            displayStaticWrapperAs="desktop"
            defaultValue={adapterToUse.date(`2020-08-${initialDay}`)}
          />,
        );

        // Don't care about what's focused.
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key });

        clock.runToLast();
        // Based on column header, screen reader should pronounce <Day Number> <Week Day>
        // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
        expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
      });
    });
  });

  it("doesn't allow to select disabled date from keyboard", async () => {
    render(
      <StaticDatePicker
        autoFocus
        displayStaticWrapperAs="desktop"
        defaultValue={adapterToUse.date('2022-08-13')}
        minDate={adapterToUse.date('2022-08-13')}
      />,
    );

    expect(document.activeElement).toHaveAccessibleName('13');

    for (let i = 0; i < 3; i += 1) {
      // Don't care about what's focused.
      // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    }

    // leaves focus on the same date
    expect(document.activeElement).toHaveAccessibleName('13');
  });

  describe('YearCalendar keyboard navigation', () => {
    [
      { key: 'ArrowLeft', expectFocusedYear: '2019' },
      { key: 'ArrowUp', expectFocusedYear: '2016' },
      { key: 'ArrowRight', expectFocusedYear: '2021' },
      { key: 'ArrowDown', expectFocusedYear: '2024' },
    ].forEach(({ key, expectFocusedYear }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            openTo="year"
            reduceAnimations
            displayStaticWrapperAs="desktop"
            defaultValue={adapterToUse.date('2022-08-13')}
          />,
        );

        const year = screen.getByText('2020', { selector: 'button' });
        act(() => year.focus());
        fireEvent.keyDown(year, { key });

        expect(document.activeElement).to.have.text(expectFocusedYear);
      });
    });
  });

  describe('MonthCalendar keyboard navigation', () => {
    [
      { key: 'ArrowLeft', expectFocusedMonth: 'Jul' },
      { key: 'ArrowUp', expectFocusedMonth: 'May' },
      { key: 'ArrowRight', expectFocusedMonth: 'Sep' },
      { key: 'ArrowDown', expectFocusedMonth: 'Nov' },
    ].forEach(({ key, expectFocusedMonth }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            openTo="month"
            views={['month']}
            reduceAnimations
            displayStaticWrapperAs="desktop"
            defaultValue={adapterToUse.date('2022-08-13')}
          />,
        );

        const aug = screen.getByText('Aug', { selector: 'button' });
        act(() => aug.focus());
        fireEvent.keyDown(aug, { key });

        expect(document.activeElement).to.have.text(expectFocusedMonth);
      });
    });
  });

  describe('DayCalendar keyboard navigation', () => {
    [
      { key: 'ArrowLeft', expectFocusedDay: '12' },
      { key: 'ArrowUp', expectFocusedDay: '6' },
      { key: 'ArrowRight', expectFocusedDay: '14' },
      { key: 'ArrowDown', expectFocusedDay: '20' },
    ].forEach(({ key, expectFocusedDay }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            openTo="day"
            reduceAnimations
            displayStaticWrapperAs="desktop"
            defaultValue={adapterToUse.date('2022-08-13')}
          />,
        );

        const startDay = screen.getByText('13', { selector: 'button' });
        act(() => startDay.focus());
        fireEvent.keyDown(startDay, { key });

        expect(document.activeElement).to.have.text(expectFocusedDay);
      });
    });
  });

  const viewsToTest: { view: DateView; textSelector: string }[] = [
    { view: 'day', textSelector: '13' },
    { view: 'month', textSelector: 'Aug' },
    { view: 'year', textSelector: '2020' },
  ];
  viewsToTest.forEach(({ view, textSelector }) => {
    it(`should have one element with tabIndex=0 for view ${view}`, () => {
      render(
        <StaticDatePicker
          openTo={view}
          views={[view]}
          reduceAnimations
          displayStaticWrapperAs="desktop"
          defaultValue={adapterToUse.date('2020-08-13')}
        />,
      );

      const selectedButton = screen.getByText(textSelector, { selector: 'button' });
      expect(selectedButton).to.have.attribute('tabindex', '0');
    });
  });

  it(`should have one element with tabIndex=0 for day view even if not in current month`, () => {
    render(
      <StaticDatePicker
        openTo="day"
        reduceAnimations
        displayStaticWrapperAs="desktop"
        defaultValue={adapterToUse.date('2022-08-13')}
      />,
    );

    fireEvent.click(screen.getByTitle('Next month'));
    const day13 = screen.getByText('13', { selector: 'button' });
    const day1 = screen.getByText('1', { selector: 'button' });
    expect(day1).to.have.attribute('tabindex', '0');
    expect(day13).to.have.attribute('tabindex', '-1');
  });
});
