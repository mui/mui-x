import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { adapter, createSchedulerRenderer } from 'test/utils/scheduler';

/**
 * Integration tests for keyboard navigation across the CalendarGrid.
 * These test the full navigation flow: arrow keys → getNavigationTarget → setFocusedCell → DOM focus.
 */
describe('CalendarGrid keyboard navigation', () => {
  const { render } = createSchedulerRenderer();

  const baseDay = adapter.date('2025-05-05T12:00:00', 'default');
  const days = Array.from({ length: 7 }, (_, i) => adapter.addDays(baseDay, i));

  function GridWithHeaderAndDayCells({
    rowTypes,
    rowCounts,
  }: {
    rowTypes?: React.ComponentProps<typeof CalendarGrid.Root>['rowTypes'];
    rowCounts?: React.ComponentProps<typeof CalendarGrid.Root>['rowCounts'];
  }) {
    return (
      <EventCalendarProvider events={[]}>
        <CalendarGrid.Root rowTypes={rowTypes} rowCounts={rowCounts}>
          <CalendarGrid.HeaderRow>
            {days.map((day, i) => (
              <CalendarGrid.HeaderCell
                key={i}
                date={processDate(day, adapter)}
                data-testid={`header-${i}`}
              >
                {adapter.format(day, 'weekday3Letters')}
              </CalendarGrid.HeaderCell>
            ))}
          </CalendarGrid.HeaderRow>
          <CalendarGrid.DayRow start={days[0]} end={adapter.endOfDay(days[6])}>
            {days.map((day, i) => (
              <CalendarGrid.DayCell
                key={i}
                value={day}
                data-testid={`day-${i}`}
              />
            ))}
          </CalendarGrid.DayRow>
        </CalendarGrid.Root>
      </EventCalendarProvider>
    );
  }

  describe('horizontal navigation (ArrowLeft / ArrowRight)', () => {
    it('should move focus between header cells', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const header0 = screen.getByTestId('header-0');
      const header1 = screen.getByTestId('header-1');
      await user.click(header0);
      await user.keyboard('{ArrowRight}');

      expect(header1).toHaveFocus();
    });

    it('should move focus between day cells', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const cell2 = screen.getByTestId('day-2');
      const cell3 = screen.getByTestId('day-3');
      await user.click(cell2);
      await user.keyboard('{ArrowRight}');

      expect(cell3).toHaveFocus();
    });

    it('should not move past the last column on ArrowRight', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const lastHeader = screen.getByTestId('header-6');
      await user.click(lastHeader);
      await user.keyboard('{ArrowRight}');

      expect(lastHeader).toHaveFocus();
    });

    it('should not move past the first column on ArrowLeft', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const firstCell = screen.getByTestId('day-0');
      await user.click(firstCell);
      await user.keyboard('{ArrowLeft}');

      expect(firstCell).toHaveFocus();
    });
  });

  describe('vertical navigation between row types (ArrowDown / ArrowUp)', () => {
    it('should move from header to day cell on ArrowDown', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const header3 = screen.getByTestId('header-3');
      const cell3 = screen.getByTestId('day-3');
      await user.click(header3);
      await user.keyboard('{ArrowDown}');

      expect(cell3).toHaveFocus();
    });

    it('should move from day cell to header on ArrowUp', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const header3 = screen.getByTestId('header-3');
      const cell3 = screen.getByTestId('day-3');
      await user.click(cell3);
      await user.keyboard('{ArrowUp}');

      expect(header3).toHaveFocus();
    });

    it('should not move up from header row', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const header0 = screen.getByTestId('header-0');
      await user.click(header0);
      await user.keyboard('{ArrowUp}');

      expect(header0).toHaveFocus();
    });

    it('should not move down from the last row type', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const cell0 = screen.getByTestId('day-0');
      await user.click(cell0);
      await user.keyboard('{ArrowDown}');

      expect(cell0).toHaveFocus();
    });
  });

  describe('multi-row navigation (month view pattern)', () => {
    function MonthLikeGrid() {
      const week0Start = adapter.date('2025-05-05T12:00:00', 'default');
      const week1Start = adapter.addDays(week0Start, 7);
      const week2Start = adapter.addDays(week0Start, 14);

      const makeWeekDays = (start: ReturnType<typeof adapter.date>) =>
        Array.from({ length: 7 }, (_, i) => adapter.addDays(start, i));

      const week0Days = makeWeekDays(week0Start);
      const week1Days = makeWeekDays(week1Start);
      const week2Days = makeWeekDays(week2Start);

      return (
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root
            rowTypes={['header', 'day-grid']}
            rowCounts={{ 'day-grid': 3 }}
          >
            <CalendarGrid.HeaderRow>
              {week0Days.map((day, i) => (
                <CalendarGrid.HeaderCell
                  key={i}
                  date={processDate(day, adapter)}
                  data-testid={`header-${i}`}
                >
                  {adapter.format(day, 'weekday3Letters')}
                </CalendarGrid.HeaderCell>
              ))}
            </CalendarGrid.HeaderRow>
            <CalendarGrid.DayRow
              rowIndex={0}
              start={week0Days[0]}
              end={adapter.endOfDay(week0Days[6])}
            >
              {week0Days.map((day, i) => (
                <CalendarGrid.DayCell
                  key={i}
                  value={day}
                  data-testid={`w0-${i}`}
                />
              ))}
            </CalendarGrid.DayRow>
            <CalendarGrid.DayRow
              rowIndex={1}
              start={week1Days[0]}
              end={adapter.endOfDay(week1Days[6])}
            >
              {week1Days.map((day, i) => (
                <CalendarGrid.DayCell
                  key={i}
                  value={day}
                  data-testid={`w1-${i}`}
                />
              ))}
            </CalendarGrid.DayRow>
            <CalendarGrid.DayRow
              rowIndex={2}
              start={week2Days[0]}
              end={adapter.endOfDay(week2Days[6])}
            >
              {week2Days.map((day, i) => (
                <CalendarGrid.DayCell
                  key={i}
                  value={day}
                  data-testid={`w2-${i}`}
                />
              ))}
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>
      );
    }

    it('should move from week 0 to week 1 on ArrowDown', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w0-3'));
      await user.keyboard('{ArrowDown}');

      expect(screen.getByTestId('w1-3')).toHaveFocus();
    });

    it('should move from week 1 to week 0 on ArrowUp', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w1-3'));
      await user.keyboard('{ArrowUp}');

      expect(screen.getByTestId('w0-3')).toHaveFocus();
    });

    it('should move from week 0 to header on ArrowUp', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w0-3'));
      await user.keyboard('{ArrowUp}');

      expect(screen.getByTestId('header-3')).toHaveFocus();
    });

    it('should move from header to week 0 on ArrowDown', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('header-3'));
      await user.keyboard('{ArrowDown}');

      expect(screen.getByTestId('w0-3')).toHaveFocus();
    });

    it('should not move down from the last week row', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w2-4'));
      await user.keyboard('{ArrowDown}');

      expect(screen.getByTestId('w2-4')).toHaveFocus();
    });

    it('should navigate through all weeks vertically', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w0-2'));
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('w1-2')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('w2-2')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('w1-2')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('w0-2')).toHaveFocus();
    });

    it('should only focus one cell at a time across all weeks', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w0-3'));

      // Only the focused cell should have tabindex=0 among all gridcells
      const allCells = screen.getAllByRole('gridcell');
      const focusedCells = allCells.filter((cell) => cell.getAttribute('tabindex') === '0');
      expect(focusedCells).toHaveLength(1);
      expect(focusedCells[0]).to.equal(screen.getByTestId('w0-3'));

      // After navigating down, only the new cell should have tabindex=0
      await user.keyboard('{ArrowDown}');
      const newFocusedCells = allCells.filter((cell) => cell.getAttribute('tabindex') === '0');
      expect(newFocusedCells).toHaveLength(1);
      expect(newFocusedCells[0]).to.equal(screen.getByTestId('w1-3'));
    });

    it('should combine horizontal and vertical navigation', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w0-0'));

      // Right twice → column 2
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowRight}');
      expect(screen.getByTestId('w0-2')).toHaveFocus();

      // Down → week 1, column 2
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('w1-2')).toHaveFocus();

      // Left → week 1, column 1
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByTestId('w1-1')).toHaveFocus();

      // Up → week 0, column 1
      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('w0-1')).toHaveFocus();
    });
  });

  describe('roving tabIndex', () => {
    it('should set tabIndex=0 on the focused cell and tabIndex=-1 on others', async () => {
      const { user } = render(
        <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />,
      );

      const cell0 = screen.getByTestId('day-0');
      const cell1 = screen.getByTestId('day-1');

      await user.click(cell0);
      expect(cell0).to.have.attribute('tabindex', '0');
      expect(cell1).to.have.attribute('tabindex', '-1');

      await user.keyboard('{ArrowRight}');
      expect(cell0).to.have.attribute('tabindex', '-1');
      expect(cell1).to.have.attribute('tabindex', '0');
    });
  });
});
