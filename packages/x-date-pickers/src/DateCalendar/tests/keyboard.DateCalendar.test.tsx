import { act, screen } from '@mui/internal-test-utils';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers';

describe('<DateCalendar /> keyboard interactions', () => {
  const { render } = createPickerRenderer();

  describe('Calendar keyboard navigation', () => {
    it('can autofocus selected day on mount', () => {
      render(<DateCalendar defaultValue={adapterToUse.date('2022-08-13')} autoFocus />);

      expect(screen.getByRole('gridcell', { name: '13' })).toHaveFocus();
    });

    [
      { key: 'End', userEventKey: '{End}', expectFocusedDay: '15' },
      { key: 'Home', userEventKey: '{Home}', expectFocusedDay: '9' },
      { key: 'ArrowLeft', userEventKey: '{ArrowLeft}', expectFocusedDay: '12' },
      { key: 'ArrowUp', userEventKey: '{ArrowUp}', expectFocusedDay: '6' },
      { key: 'ArrowRight', userEventKey: '{ArrowRight}', expectFocusedDay: '14' },
      { key: 'ArrowDown', userEventKey: '{ArrowDown}', expectFocusedDay: '20' },
    ].forEach(({ key, userEventKey, expectFocusedDay }) => {
      it(`${key}`, async () => {
        const { user } = render(<DateCalendar defaultValue={adapterToUse.date('2020-08-13')} />);

        await act(async () => screen.getByText('13').focus());
        await user.keyboard(userEventKey);

        // Based on column header, screen reader should pronounce <Day Number> <Week Day>
        // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
        expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
      });
    });

    it('should manage a sequence of keyboard interactions', async () => {
      const { user } = render(<DateCalendar defaultValue={adapterToUse.date('2020-08-13')} />);

      await act(async () => screen.getByText('13').focus());
      const interactions = [
        { userEventKey: '{End}', expectFocusedDay: '15' },
        { userEventKey: '{ArrowLeft}', expectFocusedDay: '14' },
        { userEventKey: '{ArrowUp}', expectFocusedDay: '7' },
        { userEventKey: '{Home}', expectFocusedDay: '2' },
        { userEventKey: '{ArrowDown}', expectFocusedDay: '9' },
      ];
      for (const { userEventKey, expectFocusedDay } of interactions) {
        // eslint-disable-next-line no-await-in-loop
        await user.keyboard(userEventKey);

        // Based on column header, screen reader should pronounce <Day Number> <Week Day>
        // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
        expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
      }
    });

    [
      // Switch between months
      { initialDay: '01', key: 'ArrowLeft', userEventKey: '{ArrowLeft}', expectFocusedDay: '31' },
      { initialDay: '05', key: 'ArrowUp', userEventKey: '{ArrowUp}', expectFocusedDay: '29' },
      { initialDay: '31', key: 'ArrowRight', userEventKey: '{ArrowRight}', expectFocusedDay: '1' },
      { initialDay: '30', key: 'ArrowDown', userEventKey: '{ArrowDown}', expectFocusedDay: '6' },
      // Switch between weeks
      { initialDay: '10', key: 'ArrowLeft', userEventKey: '{ArrowLeft}', expectFocusedDay: '9' },
      { initialDay: '09', key: 'ArrowRight', userEventKey: '{ArrowRight}', expectFocusedDay: '10' },
    ].forEach(({ initialDay, key, userEventKey, expectFocusedDay }) => {
      it(`${key}`, async () => {
        const { user } = render(
          <DateCalendar defaultValue={adapterToUse.date(`2020-08-${initialDay}`)} />,
        );

        await act(async () => screen.getByText(`${Number(initialDay)}`).focus());
        await user.keyboard(userEventKey);

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
        { initialDay: '11', key: 'ArrowLeft', userEventKey: '{ArrowLeft}', expectFocusedDay: '9' },
        { initialDay: '09', key: 'ArrowRight', userEventKey: '{ArrowRight}', expectFocusedDay: '11' },
        // Switch between months
        { initialDay: '03', key: 'ArrowLeft', userEventKey: '{ArrowLeft}', expectFocusedDay: '30' },
        { initialDay: '30', key: 'ArrowRight', userEventKey: '{ArrowRight}', expectFocusedDay: '2' },
      ].forEach(({ initialDay, key, userEventKey, expectFocusedDay }) => {
        it(`${key}`, async () => {
          const { user } = render(
            <DateCalendar
              defaultValue={adapterToUse.date(`2020-01-${initialDay}`)}
              shouldDisableDate={(date) =>
                disabledDates.some((disabled) => adapterToUse.isSameDay(date, disabled))
              }
            />,
          );

          await act(async () => screen.getByText(`${Number(initialDay)}`).focus());
          await user.keyboard(userEventKey);

          // Based on column header, screen reader should pronounce <Day Number> <Week Day>
          // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
          expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
        });
      });
    });

    describe('navigate months', () => {
      it('should keep focus on arrow when switching month', async () => {
        const { user } = render(<DateCalendar />);

        const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
        await act(async () => nextMonthButton.focus());
        await user.keyboard('{Enter}');

        expect(document.activeElement).toHaveAccessibleName('Next month');
      });
    });
  });
});
