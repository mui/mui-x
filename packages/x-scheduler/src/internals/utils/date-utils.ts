import { createStartOfPlainDate, getDayNumber } from '@mui/x-scheduler-internals/internals';
import type { BaseTemporal } from '@mui/x-scheduler-internals/internals';
import type { GridCellCoordinates, GridRowType } from '@mui/x-scheduler-internals/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';

/**
 * The first instant of the month `delta` months after the month of the visible date, for the
 * navigation of the views that show months.
 */
export function getSiblingMonthStart(state: EventCalendarState, delta: number) {
  return createStartOfPlainDate(
    schedulerOtherSelectors.visiblePlainDate(state).with({ day: 1 }).add({ months: delta }),
    state.displayTimezone,
  );
}

/**
 * The cell a calendar grid makes its tab stop until one is focused: the first of `dayNumbers`
 * rendered in `rows`, or the first cell.
 */
export function getDefaultFocusedCell(
  rows: BaseTemporal.PlainDate[][],
  rowType: GridRowType,
  dayNumbers: number[],
): GridCellCoordinates {
  for (const dayNumber of dayNumbers) {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const columnIndex = rows[rowIndex].findIndex((day) => getDayNumber(day) === dayNumber);
      if (columnIndex !== -1) {
        return { rowType, rowIndex, columnIndex };
      }
    }
  }
  return { rowType, rowIndex: 0, columnIndex: 0 };
}
