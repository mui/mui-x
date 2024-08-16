import * as React from 'react';
import { expect } from 'chai';
import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers';

describe('<DateCalendar /> keyboard interactions', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describe('Calendar keyboard navigation', () => {
    it('can autofocus selected day on mount', () => {
      render(<DateCalendar defaultValue={adapterToUse.date('2022-08-13')} autoFocus />);

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
        render(<DateCalendar defaultValue={adapterToUse.date('2020-08-13')} />);

        act(() => screen.getByText('13').focus());
        // Don't care about what's focused.
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key });

        // Based on column header, screen reader should pronounce <Day Number> <Week Day>
        // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
        expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
      });
    });

    it('should manage a sequence of keyboard interactions', () => {
      render(<DateCalendar defaultValue={adapterToUse.date('2020-08-13')} />);

      act(() => screen.getByText('13').focus());
      const interactions = [
        { key: 'End', expectFocusedDay: '15' },
        { key: 'ArrowLeft', expectFocusedDay: '14' },
        { key: 'ArrowUp', expectFocusedDay: '7' },
        { key: 'Home', expectFocusedDay: '2' },
        { key: 'ArrowDown', expectFocusedDay: '9' },
      ];
      interactions.forEach(({ key, expectFocusedDay }) => {
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
        render(<DateCalendar defaultValue={adapterToUse.date(`2020-08-${initialDay}`)} />);

        act(() => screen.getByText(`${Number(initialDay)}`).focus());
        // Don't care about what's focused.
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key });

        clock.runToLast();
        // Based on column header, screen reader should pronounce <Day Number> <Week Day>
        // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
        expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
      });
    });

    describe('navigation with disabled dates', () => {
      const disabledDates = [
        adapterToUse.date('2020-01-10'),
        // month extremities
        adapterToUse.date('2019-12-31'),
        adapterToUse.date('2020-01-01'),
        adapterToUse.date('2020-01-02'),
        adapterToUse.date('2020-01-31'),
        adapterToUse.date('2020-02-01'),
      ];
      [
        { initialDay: '11', key: 'ArrowLeft', expectFocusedDay: '9' },
        { initialDay: '09', key: 'ArrowRight', expectFocusedDay: '11' },
        // Switch between months
        { initialDay: '03', key: 'ArrowLeft', expectFocusedDay: '30' },
        { initialDay: '30', key: 'ArrowRight', expectFocusedDay: '2' },
      ].forEach(({ initialDay, key, expectFocusedDay }) => {
        it(key, () => {
          render(
            <DateCalendar
              defaultValue={adapterToUse.date(`2020-01-${initialDay}`)}
              shouldDisableDate={(date) =>
                disabledDates.some((disabled) => adapterToUse.isSameDay(date, disabled))
              }
            />,
          );

          act(() => screen.getByText(`${Number(initialDay)}`).focus());
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

    describe('navigate months', () => {
      it('should keep focus on arrow when switching month', () => {
        render(<DateCalendar />);

        const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
        act(() => nextMonthButton.focus());
        // Don't care about what's focused.
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key: 'Enter' });

        clock.runToLast();
        expect(document.activeElement).toHaveAccessibleName('Next month');
      });
    });
  });
});
