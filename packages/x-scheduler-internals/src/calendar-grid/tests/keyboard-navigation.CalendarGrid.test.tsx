import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import type { GridCellCoordinates, GridRowType } from '@mui/x-scheduler-internals/models';
import { CALENDAR_GRID_ITEM_PROPS, toZonedDateTime } from '@mui/x-scheduler-internals/internals';
import {
  addDays,
  addHours,
  createDate,
  createSchedulerRenderer,
  endOfDay,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { toPlainDate } from '../../internals/utils/plain-date-utils/timeZone';

/**
 * Integration tests for keyboard navigation across the CalendarGrid.
 * These test the full navigation flow: arrow keys → getNavigationTarget → focusCell → DOM focus.
 */
describe('CalendarGrid keyboard navigation', () => {
  const { render } = createSchedulerRenderer();

  const baseDay = createDate('2025-05-05T12:00:00');
  const days = Array.from({ length: 7 }, (_, i) => addDays(baseDay, i));

  function getTabbableCells() {
    return [...screen.queryAllByRole('gridcell'), ...screen.queryAllByRole('columnheader')].filter(
      (cell) => cell.getAttribute('tabindex') === '0',
    );
  }

  // The days of the cells of a row.
  const toRowDays = (rowDays: Date[]) =>
    rowDays.map((day) => toPlainDate(day.getTime(), 'default'));

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
                date={toPlainDate(day.getTime(), 'default')}
                data-testid={`header-${i}`}
              >
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </CalendarGrid.HeaderCell>
            ))}
          </CalendarGrid.HeaderRow>
          <CalendarGrid.DayRow
            start={days[0].getTime()}
            end={endOfDay(days[6]).getTime()}
            days={toRowDays(days)}
          >
            {days.map((day, i) => (
              <CalendarGrid.DayCell
                key={i}
                value={toPlainDate(day.getTime(), 'default')}
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

    it('should move focus to the next column on ArrowLeft in RTL', async () => {
      const { user } = render(
        <DirectionProvider direction="rtl">
          <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />
        </DirectionProvider>,
      );

      await user.click(screen.getByTestId('day-2'));
      await user.keyboard('{ArrowLeft}');

      expect(screen.getByTestId('day-3')).toHaveFocus();
    });

    it('should move focus to the previous column on ArrowRight in RTL', async () => {
      const { user } = render(
        <DirectionProvider direction="rtl">
          <GridWithHeaderAndDayCells rowTypes={['header', 'day-grid']} />
        </DirectionProvider>,
      );

      await user.click(screen.getByTestId('header-2'));
      await user.keyboard('{ArrowRight}');

      expect(screen.getByTestId('header-1')).toHaveFocus();
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
      const week0Start = createDate('2025-05-05T12:00:00');
      const week1Start = addDays(week0Start, 7);
      const week2Start = addDays(week0Start, 14);

      const makeWeekDays = (start: Date) => Array.from({ length: 7 }, (_, i) => addDays(start, i));

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
                  date={toPlainDate(day.getTime(), 'default')}
                  data-testid={`header-${i}`}
                >
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </CalendarGrid.HeaderCell>
              ))}
            </CalendarGrid.HeaderRow>
            <CalendarGrid.DayRow
              rowIndex={0}
              start={week0Days[0].getTime()}
              end={endOfDay(week0Days[6]).getTime()}
              days={toRowDays(week0Days)}
            >
              {week0Days.map((day, i) => (
                <CalendarGrid.DayCell
                  key={i}
                  value={toPlainDate(day.getTime(), 'default')}
                  data-testid={`w0-${i}`}
                />
              ))}
            </CalendarGrid.DayRow>
            <CalendarGrid.DayRow
              rowIndex={1}
              start={week1Days[0].getTime()}
              end={endOfDay(week1Days[6]).getTime()}
              days={toRowDays(week1Days)}
            >
              {week1Days.map((day, i) => (
                <CalendarGrid.DayCell
                  key={i}
                  value={toPlainDate(day.getTime(), 'default')}
                  data-testid={`w1-${i}`}
                />
              ))}
            </CalendarGrid.DayRow>
            <CalendarGrid.DayRow
              rowIndex={2}
              start={week2Days[0].getTime()}
              end={endOfDay(week2Days[6]).getTime()}
              days={toRowDays(week2Days)}
            >
              {week2Days.map((day, i) => (
                <CalendarGrid.DayCell
                  key={i}
                  value={toPlainDate(day.getTime(), 'default')}
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

    it('should make only the focused cell tabbable', async () => {
      const { user } = render(<MonthLikeGrid />);

      await user.click(screen.getByTestId('w0-3'));
      expect(getTabbableCells()).to.deep.equal([screen.getByTestId('w0-3')]);

      await user.keyboard('{ArrowDown}');
      expect(getTabbableCells()).to.deep.equal([screen.getByTestId('w1-3')]);
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

  describe('navigation with all three row types', () => {
    function FullGrid() {
      return (
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root rowTypes={['header', 'day-grid', 'time-grid']} rowsPerType={{}}>
            <CalendarGrid.HeaderRow>
              {days.slice(0, 3).map((day, i) => (
                <CalendarGrid.HeaderCell
                  key={i}
                  date={toPlainDate(day.getTime(), 'default')}
                  data-testid={`header-${i}`}
                >
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </CalendarGrid.HeaderCell>
              ))}
            </CalendarGrid.HeaderRow>
            <CalendarGrid.DayRow
              start={days[0].getTime()}
              end={endOfDay(days[2]).getTime()}
              days={toRowDays(days.slice(0, 3))}
            >
              {days.slice(0, 3).map((day, i) => (
                <CalendarGrid.DayCell
                  key={i}
                  value={toPlainDate(day.getTime(), 'default')}
                  data-testid={`day-${i}`}
                />
              ))}
            </CalendarGrid.DayRow>
            <CalendarGrid.TimeScrollableContent>
              {days.slice(0, 3).map((day, i) => (
                <CalendarGrid.TimeColumn
                  key={i}
                  value={toPlainDate(day.getTime(), 'default')}
                  data-testid={`time-${i}`}
                />
              ))}
            </CalendarGrid.TimeScrollableContent>
          </CalendarGrid.Root>
        </EventCalendarProvider>
      );
    }

    it('should move focus to the next time column on ArrowLeft in RTL', async () => {
      const { user } = render(
        <DirectionProvider direction="rtl">
          <FullGrid />
        </DirectionProvider>,
      );

      await user.click(screen.getByTestId('time-1'));
      await user.keyboard('{ArrowLeft}');

      expect(screen.getByTestId('time-2')).toHaveFocus();
    });

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

  describe('single tab stop', () => {
    function GridBetweenButtons(props: { defaultFocusedCell?: GridCellCoordinates }) {
      return (
        <EventCalendarProvider events={[]}>
          <button type="button">before</button>
          <CalendarGrid.Root rowTypes={['header', 'day-grid']} {...props}>
            <CalendarGrid.HeaderRow>
              {days.map((day, i) => (
                <CalendarGrid.HeaderCell
                  key={i}
                  date={toPlainDate(day.getTime(), 'default')}
                  data-testid={`header-${i}`}
                />
              ))}
            </CalendarGrid.HeaderRow>
            <CalendarGrid.DayRow
              start={days[0].getTime()}
              end={endOfDay(days[6]).getTime()}
              days={toRowDays(days)}
            >
              {days.map((day, i) => (
                <CalendarGrid.DayCell
                  key={i}
                  value={toPlainDate(day.getTime(), 'default')}
                  data-testid={`day-${i}`}
                />
              ))}
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
          <button type="button">after</button>
        </EventCalendarProvider>
      );
    }

    it('should make the first day cell the tab stop by default', () => {
      render(<GridBetweenButtons />);

      expect(getTabbableCells()).to.deep.equal([screen.getByTestId('day-0')]);
    });

    it('should make the default focused cell the tab stop', () => {
      render(
        <GridBetweenButtons
          defaultFocusedCell={{ rowType: 'day-grid', rowIndex: 0, columnIndex: 3 }}
        />,
      );

      expect(getTabbableCells()).to.deep.equal([screen.getByTestId('day-3')]);
    });

    it('should move into the grid and out of it with a single Tab each', async () => {
      const { user } = render(<GridBetweenButtons />);

      await user.click(screen.getByRole('button', { name: 'before' }));
      await user.keyboard('{Tab}');
      expect(screen.getByTestId('day-0')).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
    });

    it('should come back to the last focused cell', async () => {
      const { user } = render(<GridBetweenButtons />);

      await user.click(screen.getByTestId('day-2'));
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Tab}');
      expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(screen.getByTestId('day-3')).toHaveFocus();
    });

    it('should reset the tab stop when a new default focused cell is passed', async () => {
      const { user, setProps } = render(
        <GridBetweenButtons
          defaultFocusedCell={{ rowType: 'day-grid', rowIndex: 0, columnIndex: 1 }}
        />,
      );

      await user.click(screen.getByTestId('day-4'));
      await user.click(screen.getByRole('button', { name: 'after' }));
      expect(getTabbableCells()).to.deep.equal([screen.getByTestId('day-4')]);

      setProps({ defaultFocusedCell: { rowType: 'day-grid', rowIndex: 0, columnIndex: 1 } });

      expect(getTabbableCells()).to.deep.equal([screen.getByTestId('day-1')]);
    });
  });

  describe('moving into a cell', () => {
    const day1 = createDate('2025-05-05T12:00:00');
    const day2 = addDays(day1, 1);

    function DayEvent(props: { id: string; day: Date; hidden?: boolean }) {
      return (
        <CalendarGrid.DayEvent
          eventId={props.id}
          occurrenceKey={`${props.id}-key`}
          start={toZonedDateTime(props.day.getTime(), 'default')}
          end={toZonedDateTime(addHours(props.day, 1).getTime(), 'default')}
          renderDragPreview={() => null}
          aria-hidden={props.hidden}
          data-testid={props.hidden ? `${props.id}-copy` : props.id}
        />
      );
    }

    function GridWithEvents() {
      return (
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root rowTypes={['day-grid']}>
            <CalendarGrid.DayRow
              start={day1.getTime()}
              end={endOfDay(addDays(day1, 2)).getTime()}
              days={toRowDays([day1, day2, addDays(day1, 2)])}
            >
              <CalendarGrid.DayCell
                value={toPlainDate(day1.getTime(), 'default')}
                data-testid="cell-0"
              >
                <button type="button" data-testid="day-button" {...CALENDAR_GRID_ITEM_PROPS}>
                  5
                </button>
                <DayEvent id="event-1" day={day1} />
                <DayEvent id="event-2" day={day1} />
              </CalendarGrid.DayCell>
              <CalendarGrid.DayCell
                value={toPlainDate(day2.getTime(), 'default')}
                data-testid="cell-1"
              >
                {/* The copy of a multi-day event that starts in the previous cell. */}
                <DayEvent id="event-1" day={day1} hidden />
                <DayEvent id="event-3" day={day2} />
              </CalendarGrid.DayCell>
              <CalendarGrid.DayCell
                value={toPlainDate(addDays(day1, 2).getTime(), 'default')}
                data-testid="cell-2"
              />
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>
      );
    }

    it('should keep the events out of the Tab sequence', () => {
      render(<GridWithEvents />);

      ['event-1', 'event-2', 'event-3'].forEach((id) => {
        expect(screen.getByTestId(id)).to.have.attribute('tabindex', '-1');
      });
    });

    it.each([
      { name: 'Enter', keys: '{Enter}' },
      { name: 'F2', keys: '{F2}' },
    ])('should move focus to the first item of the cell on $name', async ({ keys }) => {
      const { user } = render(<GridWithEvents />);

      await user.click(screen.getByTestId('cell-0'));
      await user.keyboard(keys);

      expect(screen.getByTestId('day-button')).toHaveFocus();
    });

    it.each([
      { name: 'the arrow keys', next: '{ArrowDown}', previous: '{ArrowUp}' },
      { name: 'Tab', next: '{Tab}', previous: '{Shift>}{Tab}{/Shift}' },
    ])('should move between the items of the cell with $name and wrap', async (keys) => {
      const { user } = render(<GridWithEvents />);

      await user.click(screen.getByTestId('cell-0'));
      await user.keyboard('{Enter}');

      await user.keyboard(keys.next);
      expect(screen.getByTestId('event-1')).toHaveFocus();
      await user.keyboard(keys.next);
      expect(screen.getByTestId('event-2')).toHaveFocus();
      await user.keyboard(keys.next);
      expect(screen.getByTestId('day-button')).toHaveFocus();
      await user.keyboard(keys.previous);
      expect(screen.getByTestId('event-2')).toHaveFocus();
    });

    it.each([
      { direction: 'ltr' as const, next: '{ArrowRight}', previous: '{ArrowLeft}' },
      { direction: 'rtl' as const, next: '{ArrowLeft}', previous: '{ArrowRight}' },
    ])(
      'should move between the items of the cell with the inline arrow keys in $direction',
      async ({ direction, next, previous }) => {
        const { user } = render(
          <DirectionProvider direction={direction}>
            <GridWithEvents />
          </DirectionProvider>,
        );

        await user.click(screen.getByTestId('cell-0'));
        await user.keyboard('{Enter}');

        await user.keyboard(next);
        expect(screen.getByTestId('event-1')).toHaveFocus();
        await user.keyboard(previous);
        expect(screen.getByTestId('day-button')).toHaveFocus();
      },
    );

    it.each([
      { name: 'Escape', keys: '{Escape}' },
      { name: 'F2', keys: '{F2}' },
    ])('should move focus back to the cell on $name', async ({ keys }) => {
      const { user } = render(<GridWithEvents />);

      await user.click(screen.getByTestId('cell-0'));
      await user.keyboard('{Enter}{ArrowDown}');
      await user.keyboard(keys);

      expect(screen.getByTestId('cell-0')).toHaveFocus();
    });

    it('should do nothing on Enter in a cell without items', async () => {
      const { user } = render(<GridWithEvents />);

      await user.click(screen.getByTestId('cell-2'));
      await user.keyboard('{Enter}');

      expect(screen.getByTestId('cell-2')).toHaveFocus();
    });

    it('should reach a multi-day event from a later cell it covers', async () => {
      const { user } = render(<GridWithEvents />);

      await user.click(screen.getByTestId('cell-1'));
      await user.keyboard('{Enter}');
      expect(screen.getByTestId('event-1')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('event-3')).toHaveFocus();

      await user.keyboard('{ArrowDown}{Escape}');
      expect(screen.getByTestId('cell-1')).toHaveFocus();
    });

    it('should move back to the cell of an event focused with the pointer', async () => {
      const { user } = render(<GridWithEvents />);

      await user.click(screen.getByTestId('event-3'));
      await user.keyboard('{Escape}');

      expect(screen.getByTestId('cell-1')).toHaveFocus();
      expect(getTabbableCells()).to.deep.equal([screen.getByTestId('cell-1')]);
    });

    function GridWithTimeEvents() {
      return (
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root rowTypes={['time-grid']}>
            <CalendarGrid.TimeScrollableContent>
              <CalendarGrid.TimeColumn
                value={toPlainDate(day1.getTime(), 'default')}
                data-testid="col-0"
              >
                {[9, 11].map((hour) => (
                  <CalendarGrid.TimeEvent
                    key={hour}
                    eventId={`event-${hour}`}
                    occurrenceKey={`occ-${hour}`}
                    start={toZonedDateTime(addHours(day1, hour - 12).getTime(), 'default')}
                    end={toZonedDateTime(addHours(day1, hour - 11).getTime(), 'default')}
                    renderDragPreview={() => null}
                    data-testid={`time-event-${hour}`}
                  />
                ))}
              </CalendarGrid.TimeColumn>
            </CalendarGrid.TimeScrollableContent>
          </CalendarGrid.Root>
        </EventCalendarProvider>
      );
    }

    it('should move through the events of a time column', async () => {
      const { user } = render(<GridWithTimeEvents />);

      expect(screen.getByTestId('time-event-9')).to.have.attribute('tabindex', '-1');

      await user.click(screen.getByTestId('col-0'));
      await user.keyboard('{Enter}');
      expect(screen.getByTestId('time-event-9')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('time-event-11')).toHaveFocus();

      await user.keyboard('{Escape}');
      expect(screen.getByTestId('col-0')).toHaveFocus();
    });
  });
});
