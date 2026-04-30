import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { GridRowType } from '@mui/x-scheduler-internals/models';
import { processDate } from '@mui/x-scheduler-internals/process-date';
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
    rowsPerType,
  }: {
    rowTypes?: GridRowType[];
    rowsPerType?: Partial<Record<GridRowType, number>>;
  }) {
    return (
      <EventCalendarProvider events={[]}>
        <CalendarGrid.Root rowTypes={rowTypes} rowsPerType={rowsPerType}>
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
              <CalendarGrid.DayCell key={i} value={day} data-testid={`day-${i}`} />
            ))}
          </CalendarGrid.DayRow>
        </CalendarGrid.Root>
      </EventCalendarProvider>
    );
  }

  describe('horizontal navigation (ArrowLeft / ArrowRight)', () => {
    it('should move focus between header cells', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

      const header0 = screen.getByTestId('header-0');
      const header1 = screen.getByTestId('header-1');
      await user.click(header0);
      await user.keyboard('{ArrowRight}');

      expect(header1).toHaveFocus();
    });

    it('should move focus between day cells', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

      const cell2 = screen.getByTestId('day-2');
      const cell3 = screen.getByTestId('day-3');
      await user.click(cell2);
      await user.keyboard('{ArrowRight}');

      expect(cell3).toHaveFocus();
    });

    it('should not move past the last column on ArrowRight', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

      const lastHeader = screen.getByTestId('header-6');
      await user.click(lastHeader);
      await user.keyboard('{ArrowRight}');

      expect(lastHeader).toHaveFocus();
    });

    it('should not move past the first column on ArrowLeft', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

      const firstCell = screen.getByTestId('day-0');
      await user.click(firstCell);
      await user.keyboard('{ArrowLeft}');

      expect(firstCell).toHaveFocus();
    });
  });

  describe('vertical navigation between row types (ArrowDown / ArrowUp)', () => {
    it('should move from header to day cell on ArrowDown', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

      const header3 = screen.getByTestId('header-3');
      const cell3 = screen.getByTestId('day-3');
      await user.click(header3);
      await user.keyboard('{ArrowDown}');

      expect(cell3).toHaveFocus();
    });

    it('should move from day cell to header on ArrowUp', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

      const header3 = screen.getByTestId('header-3');
      const cell3 = screen.getByTestId('day-3');
      await user.click(cell3);
      await user.keyboard('{ArrowUp}');

      expect(header3).toHaveFocus();
    });

    it('should not move up from header row', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

      const header0 = screen.getByTestId('header-0');
      await user.click(header0);
      await user.keyboard('{ArrowUp}');

      expect(header0).toHaveFocus();
    });

    it('should not move down from the last row type', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

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
          <CalendarGrid.Root rowTypes={['header', 'day-grid']} rowsPerType={{ 'day-grid': 3 }}>
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
                <CalendarGrid.DayCell key={i} value={day} data-testid={`w0-${i}`} />
              ))}
            </CalendarGrid.DayRow>
            <CalendarGrid.DayRow
              rowIndex={1}
              start={week1Days[0]}
              end={adapter.endOfDay(week1Days[6])}
            >
              {week1Days.map((day, i) => (
                <CalendarGrid.DayCell key={i} value={day} data-testid={`w1-${i}`} />
              ))}
            </CalendarGrid.DayRow>
            <CalendarGrid.DayRow
              rowIndex={2}
              start={week2Days[0]}
              end={adapter.endOfDay(week2Days[6])}
            >
              {week2Days.map((day, i) => (
                <CalendarGrid.DayCell key={i} value={day} data-testid={`w2-${i}`} />
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

    it('should keep all cells tabbable but only move DOM focus to one', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w0-3'));

      // All cells are tabbable (tabindex=0) so Tab flows through the grid
      const allCells = screen.getAllByRole('gridcell');
      const tabbableCells = allCells.filter((cell) => cell.getAttribute('tabindex') === '0');
      expect(tabbableCells).toHaveLength(allCells.length);

      // But only one cell has DOM focus
      expect(screen.getByTestId('w0-3')).toHaveFocus();

      // After navigating down, all cells remain tabbable but DOM focus moves
      await user.keyboard('{ArrowDown}');
      const newTabbableCells = allCells.filter((cell) => cell.getAttribute('tabindex') === '0');
      expect(newTabbableCells).toHaveLength(allCells.length);
      expect(screen.getByTestId('w1-3')).toHaveFocus();
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

  describe('tabIndex behavior', () => {
    it('should keep all cells tabbable so Tab flows through the grid', async () => {
      const { user } = render(<GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />);

      const cell0 = screen.getByTestId('day-0');
      const cell1 = screen.getByTestId('day-1');

      // All cells always have tabindex=0
      await user.click(cell0);
      expect(cell0).to.have.attribute('tabindex', '0');
      expect(cell1).to.have.attribute('tabindex', '0');

      await user.keyboard('{ArrowRight}');
      expect(cell0).to.have.attribute('tabindex', '0');
      expect(cell1).to.have.attribute('tabindex', '0');
      expect(cell1).toHaveFocus();
    });
  });

  describe('navigation with all three row types', () => {
    function FullGrid() {
      return (
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root rowTypes={['header', 'day-grid', 'time-grid']} rowsPerType={{}}>
            <CalendarGrid.HeaderRow>
              {days.slice(0, 3).map((day, i) => (
                <CalendarGrid.HeaderCell
                  key={i}
                  date={processDate(day, adapter)}
                  data-testid={`header-${i}`}
                >
                  {adapter.format(day, 'weekday3Letters')}
                </CalendarGrid.HeaderCell>
              ))}
            </CalendarGrid.HeaderRow>
            <CalendarGrid.DayRow start={days[0]} end={adapter.endOfDay(days[2])}>
              {days.slice(0, 3).map((day, i) => (
                <CalendarGrid.DayCell key={i} value={day} data-testid={`day-${i}`} />
              ))}
            </CalendarGrid.DayRow>
            <CalendarGrid.TimeScrollableContent>
              {days.slice(0, 3).map((day, i) => (
                <CalendarGrid.TimeColumn
                  key={i}
                  start={day}
                  end={adapter.endOfDay(day)}
                  data-testid={`time-${i}`}
                />
              ))}
            </CalendarGrid.TimeScrollableContent>
          </CalendarGrid.Root>
        </EventCalendarProvider>
      );
    }

    it('should navigate from header to day-grid to time-grid with ArrowDown', async () => {
      const { user } = render(<FullGrid />);

      await user.click(screen.getByTestId('header-1'));
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('day-1')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('time-1')).toHaveFocus();
    });

    it('should navigate from time-grid to day-grid to header with ArrowUp', async () => {
      const { user } = render(<FullGrid />);

      await user.click(screen.getByTestId('time-1'));
      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('day-1')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('header-1')).toHaveFocus();
    });

    it('should not move past header on ArrowUp or past time-grid on ArrowDown', async () => {
      const { user } = render(<FullGrid />);

      await user.click(screen.getByTestId('header-0'));
      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('header-0')).toHaveFocus();

      await user.click(screen.getByTestId('time-0'));
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('time-0')).toHaveFocus();
    });
  });

  describe('event tabIndex follows cell focus', () => {
    function GridWithEvents() {
      const day1 = adapter.date('2025-05-05T12:00:00', 'default');
      const day2 = adapter.addDays(day1, 1);

      return (
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root rowTypes={['day-grid']} rowsPerType={{}}>
            <CalendarGrid.DayRow start={day1} end={adapter.endOfDay(day2)}>
              <CalendarGrid.DayCell value={day1} data-testid="cell-0">
                <CalendarGrid.DayEvent
                  eventId="event-1"
                  occurrenceKey="occ-1"
                  start={processDate(day1, adapter)}
                  end={processDate(adapter.addHours(day1, 1), adapter)}
                  renderDragPreview={() => null}
                  data-testid="event-1"
                />
              </CalendarGrid.DayCell>
              <CalendarGrid.DayCell value={day2} data-testid="cell-1">
                <CalendarGrid.DayEvent
                  eventId="event-2"
                  occurrenceKey="occ-2"
                  start={processDate(day2, adapter)}
                  end={processDate(adapter.addHours(day2, 1), adapter)}
                  renderDragPreview={() => null}
                  data-testid="event-2"
                />
              </CalendarGrid.DayCell>
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>
      );
    }

    it('should make day events tabbable only when their parent cell is focused', async () => {
      const { user } = render(<GridWithEvents />);

      const event1 = screen.getByTestId('event-1');
      const event2 = screen.getByTestId('event-2');

      // Before any cell is focused, all events are not tabbable
      expect(event1).to.have.attribute('tabindex', '-1');
      expect(event2).to.have.attribute('tabindex', '-1');

      // Focus cell-0 → event-1 becomes tabbable
      await user.click(screen.getByTestId('cell-0'));
      expect(event1).to.have.attribute('tabindex', '0');
      expect(event2).to.have.attribute('tabindex', '-1');

      // Navigate to cell-1 → event-2 becomes tabbable, event-1 becomes not tabbable
      await user.keyboard('{ArrowRight}');
      expect(event1).to.have.attribute('tabindex', '-1');
      expect(event2).to.have.attribute('tabindex', '0');
    });

    function GridWithTimeEvents() {
      const day1 = adapter.date('2025-05-05T12:00:00', 'default');
      const day2 = adapter.addDays(day1, 1);

      return (
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root rowTypes={['time-grid']} rowsPerType={{}}>
            <CalendarGrid.TimeScrollableContent>
              <CalendarGrid.TimeColumn
                start={day1}
                end={adapter.endOfDay(day1)}
                data-testid="col-0"
              >
                <CalendarGrid.TimeEvent
                  eventId="event-1"
                  occurrenceKey="occ-1"
                  start={processDate(adapter.addHours(day1, 9), adapter)}
                  end={processDate(adapter.addHours(day1, 10), adapter)}
                  renderDragPreview={() => null}
                  data-testid="time-event-1"
                />
              </CalendarGrid.TimeColumn>
              <CalendarGrid.TimeColumn
                start={day2}
                end={adapter.endOfDay(day2)}
                data-testid="col-1"
              >
                <CalendarGrid.TimeEvent
                  eventId="event-2"
                  occurrenceKey="occ-2"
                  start={processDate(adapter.addHours(day2, 9), adapter)}
                  end={processDate(adapter.addHours(day2, 10), adapter)}
                  renderDragPreview={() => null}
                  data-testid="time-event-2"
                />
              </CalendarGrid.TimeColumn>
            </CalendarGrid.TimeScrollableContent>
          </CalendarGrid.Root>
        </EventCalendarProvider>
      );
    }

    it('should make time events tabbable only when their parent column is focused', async () => {
      const { user } = render(<GridWithTimeEvents />);

      const timeEvent1 = screen.getByTestId('time-event-1');
      const timeEvent2 = screen.getByTestId('time-event-2');

      // Before any column is focused, all events are not tabbable
      expect(timeEvent1).to.have.attribute('tabindex', '-1');
      expect(timeEvent2).to.have.attribute('tabindex', '-1');

      // Focus col-0 → time-event-1 becomes tabbable
      await user.click(screen.getByTestId('col-0'));
      expect(timeEvent1).to.have.attribute('tabindex', '0');
      expect(timeEvent2).to.have.attribute('tabindex', '-1');

      // Navigate to col-1 → time-event-2 becomes tabbable, time-event-1 becomes not tabbable
      await user.keyboard('{ArrowRight}');
      expect(timeEvent1).to.have.attribute('tabindex', '-1');
      expect(timeEvent2).to.have.attribute('tabindex', '0');
    });
  });
});
