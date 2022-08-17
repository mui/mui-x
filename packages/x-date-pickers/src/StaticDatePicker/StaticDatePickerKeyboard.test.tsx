import * as React from 'react';
import { expect } from 'chai';
import TextField from '@mui/material/TextField';
import { fireEvent, screen } from '@mui/monorepo/test/utils';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { adapterToUse, createPickerRenderer } from '../../../../test/utils/pickers-utils';
import { CalendarPickerView } from '../internals/models/views';

describe('<StaticDatePicker /> keyboard interactions', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describe('Calendar keyboard navigation', () => {
    it('can autofocus selected day on mount', () => {
      render(
        <StaticDatePicker
          autoFocus
          displayStaticWrapperAs="desktop"
          value={adapterToUse.date(new Date(2020, 7, 13))}
          onChange={() => {}}
          renderInput={(params) => <TextField placeholder="10/10/2018" {...params} />}
        />,
      );

      expect(screen.getByLabelText('Aug 13, 2020')).toHaveFocus();
    });

    [
      { keyCode: 35, key: 'End', expectFocusedDay: 'Aug 15, 2020' },
      { keyCode: 36, key: 'Home', expectFocusedDay: 'Aug 9, 2020' },
      { keyCode: 37, key: 'ArrowLeft', expectFocusedDay: 'Aug 12, 2020' },
      { keyCode: 38, key: 'ArrowUp', expectFocusedDay: 'Aug 6, 2020' },
      { keyCode: 39, key: 'ArrowRight', expectFocusedDay: 'Aug 14, 2020' },
      { keyCode: 40, key: 'ArrowDown', expectFocusedDay: 'Aug 20, 2020' },
    ].forEach(({ key, keyCode, expectFocusedDay }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            autoFocus
            displayStaticWrapperAs="desktop"
            value={adapterToUse.date(new Date(2020, 7, 13))}
            onChange={() => {}}
            renderInput={(params) => <TextField placeholder="10/10/2018" {...params} />}
          />,
        );

        // Don't care about what's focused.
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { keyCode, key });

        expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
      });
    });
  });

  it("doesn't allow to select disabled date from keyboard", async () => {
    render(
      <StaticDatePicker
        autoFocus
        displayStaticWrapperAs="desktop"
        value={adapterToUse.date(new Date(2020, 7, 13))}
        minDate={adapterToUse.date(new Date(2020, 7, 13))}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(document.activeElement).toHaveAccessibleName('Aug 13, 2020');

    for (let i = 0; i < 3; i += 1) {
      // Don't care about what's focused.
      // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
      fireEvent.keyDown(document.activeElement!, { keyCode: 37, key: 'ArrowLeft' });
    }

    // leaves focus on the same date
    expect(document.activeElement).toHaveAccessibleName('Aug 13, 2020');
  });

  describe('YearPicker keyboard navigation', () => {
    [
      { keyCode: 37, key: 'ArrowLeft', expectFocusedYear: '2019' },
      { keyCode: 38, key: 'ArrowUp', expectFocusedYear: '2016' },
      { keyCode: 39, key: 'ArrowRight', expectFocusedYear: '2021' },
      { keyCode: 40, key: 'ArrowDown', expectFocusedYear: '2024' },
    ].forEach(({ key, keyCode, expectFocusedYear }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            openTo="year"
            reduceAnimations
            displayStaticWrapperAs="desktop"
            value={adapterToUse.date(new Date(2020, 7, 13))}
            onChange={() => {}}
            renderInput={(params) => <TextField {...params} />}
          />,
        );

        const year = screen.getByText('2020', { selector: 'button' });
        year.focus();
        fireEvent.keyDown(year, { keyCode, key });

        expect(document.activeElement).to.have.text(expectFocusedYear);
      });
    });
  });
  describe('MonthPicker keyboard navigation', () => {
    [
      { keyCode: 37, key: 'ArrowLeft', expectFocusedMonth: 'Jul' },
      { keyCode: 38, key: 'ArrowUp', expectFocusedMonth: 'May' },
      { keyCode: 39, key: 'ArrowRight', expectFocusedMonth: 'Sep' },
      { keyCode: 40, key: 'ArrowDown', expectFocusedMonth: 'Nov' },
    ].forEach(({ key, keyCode, expectFocusedMonth }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            openTo="month"
            views={['month']}
            reduceAnimations
            displayStaticWrapperAs="desktop"
            value={adapterToUse.date(new Date(2020, 7, 13))}
            onChange={() => {}}
            renderInput={(params) => <TextField {...params} />}
          />,
        );

        const aug = screen.getByText('Aug', { selector: 'button' });
        aug.focus();
        fireEvent.keyDown(aug, { keyCode, key });

        expect(document.activeElement).to.have.text(expectFocusedMonth);
      });
    });
  });

  describe('DayPicker keyboard navigation', () => {
    [
      { keyCode: 37, key: 'ArrowLeft', expectFocusedDay: '12' },
      { keyCode: 38, key: 'ArrowUp', expectFocusedDay: '6' },
      { keyCode: 39, key: 'ArrowRight', expectFocusedDay: '14' },
      { keyCode: 40, key: 'ArrowDown', expectFocusedDay: '20' },
    ].forEach(({ key, keyCode, expectFocusedDay }) => {
      it(key, () => {
        render(
          <StaticDatePicker
            openTo="day"
            reduceAnimations
            displayStaticWrapperAs="desktop"
            value={adapterToUse.date(new Date(2020, 7, 13))}
            onChange={() => {}}
            renderInput={(params) => <TextField {...params} />}
          />,
        );

        // Don't care about what's focused.
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        const startDay = screen.getByText('13', { selector: 'button' });
        startDay.focus();
        fireEvent.keyDown(startDay, { keyCode, key });

        expect(document.activeElement).to.have.text(expectFocusedDay);
      });
    });
  });

  const viewsToTest: { view: CalendarPickerView; textSelector: string }[] = [
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
          value={adapterToUse.date(new Date(2020, 7, 13))}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
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
        value={adapterToUse.date(new Date(2020, 7, 13))}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    fireEvent.click(screen.getByTitle('Next month'));
    const day13 = screen.getByText('13', { selector: 'button' });
    const day1 = screen.getByText('1', { selector: 'button' });
    expect(day1).to.have.attribute('tabindex', '0');
    expect(day13).to.have.attribute('tabindex', '-1');
  });
});
