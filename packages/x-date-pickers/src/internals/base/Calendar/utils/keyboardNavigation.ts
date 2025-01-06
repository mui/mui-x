import type { useCalendarDaysGridBody } from '../days-grid-body/useCalendarDaysGridBody';

const LIST_NAVIGATION_SUPPORTED_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

export function navigateInList({
  cells,
  target,
  event,
  loop,
}: {
  cells: (HTMLElement | null)[];
  target: HTMLElement;
  event: React.KeyboardEvent;
  loop: boolean;
}) {
  if (!LIST_NAVIGATION_SUPPORTED_KEYS.includes(event.key)) {
    return;
  }

  event.preventDefault();

  const navigableCells: HTMLElement[] = [];
  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    if (isNavigable(cell)) {
      navigableCells.push(cell);
    }
  }

  const lastIndex = navigableCells.length - 1;
  const currentIndex = navigableCells.indexOf(target);
  let nextIndex = -1;

  switch (event.key) {
    case 'ArrowDown':
      if (loop) {
        nextIndex = currentIndex + 1 > lastIndex ? 0 : currentIndex + 1;
      } else {
        nextIndex = Math.min(currentIndex + 1, lastIndex);
      }
      break;
    case 'ArrowUp':
      if (loop) {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      } else {
        nextIndex = currentIndex - 1;
      }
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = lastIndex;
      break;
    default:
      break;
  }

  if (nextIndex > -1) {
    navigableCells[nextIndex].focus();
  }
}

const GRID_NAVIGATION_SUPPORTED_KEYS = [
  'ArrowDown',
  'ArrowUp',
  'ArrowRight',
  'ArrowLeft',
  'Home',
  'End',
];

type Grid = { cells: useCalendarDaysGridBody.CellsRef; rows: useCalendarDaysGridBody.RowsRef };

/* eslint-disable no-bitwise */
function sortGridByDocumentPosition(a: HTMLElement[][], b: HTMLElement[][]) {
  const position = a[0][0].compareDocumentPosition(b[0][0]);

  if (
    position & Node.DOCUMENT_POSITION_FOLLOWING ||
    position & Node.DOCUMENT_POSITION_CONTAINED_BY
  ) {
    return -1;
  }

  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }

  return 0;
}
/* eslint-enable no-bitwise */

function getCellsInCalendar(grids: Grid[]) {
  const cells: HTMLElement[][][] = [];

  let rowCount = 0;
  for (let i = 0; i < grids.length; i += 1) {
    const grid = grids[i];
    const gridCells: HTMLElement[][] = [];
    for (let j = 0; j < grid.rows.current.length; j += 1) {
      const row = grid.rows.current[j];
      const rowCells = grid.cells.current
        .find((entry) => entry.rowRef.current === row)
        ?.cellsRef.current?.filter((cell) => cell !== null);
      if (rowCells && rowCells.length > 0) {
        rowCount += 1;
        gridCells.push(rowCells);
      }
    }

    if (gridCells.length > 0) {
      cells.push(gridCells);
    }
  }

  const sortedCells = cells.sort(sortGridByDocumentPosition);

  return {
    list: sortedCells.flat(2),
    rows: sortedCells.flat(1),
    nested: sortedCells,
    rowCount,
  };
}

const localeTargetInCalendar = (
  target: HTMLElement,
  cells: ReturnType<typeof getCellsInCalendar>,
) => {
  let rowInAllGrids = 0;
  for (let i = 0; i < cells.nested.length; i += 1) {
    for (let j = 0; j < cells.nested[i].length; j += 1) {
      for (let k = 0; k < cells.nested[i][j].length; k += 1) {
        if (cells.nested[i][j][k] === target) {
          return { calendar: i, row: rowInAllGrids, col: k };
        }
      }

      rowInAllGrids += 1;
    }
  }

  throw new Error('Could not find target in calendar');
};

export function navigateInGrid({
  grids,
  event,
  changePage,
}: {
  grids: Grid[];
  event: React.KeyboardEvent;
  changePage: NavigateInGridChangePage | undefined;
}) {
  if (!GRID_NAVIGATION_SUPPORTED_KEYS.includes(event.key)) {
    return;
  }

  event.preventDefault();

  const cells = getCellsInCalendar(grids);
  if (cells.nested.length === 0) {
    return;
  }

  const target = event.target as HTMLElement;
  const coordinates = localeTargetInCalendar(target, cells);

  const moveToRowBelow = () => {
    let nextRowIndex = -1;
    let i = coordinates.row + 1;

    while (nextRowIndex === -1 && i < coordinates.row + cells.rowCount) {
      if (changePage && i > cells.rowCount - 1) {
        changePage({
          direction: 'next',
          target: { type: 'first-cell-in-col', colIndex: coordinates.col },
        });
        break;
      }

      const rowIndex = i % cells.rowCount;
      const cell = cells.rows[rowIndex][coordinates.col];
      if (isNavigable(cell)) {
        nextRowIndex = rowIndex;
      }
      i += 1;
    }

    if (nextRowIndex > -1) {
      cells.rows[nextRowIndex][coordinates.col].focus();
    }
  };

  const moveToRowAbove = () => {
    let nextRowIndex = -1;
    let i = coordinates.row - 1;
    while (nextRowIndex === -1 && i > coordinates.row - cells.rowCount) {
      if (changePage && i < 0) {
        changePage({
          direction: 'previous',
          target: { type: 'last-cell-in-col', colIndex: coordinates.col },
        });
        break;
      }

      const rowIndex = (cells.rowCount + i) % cells.rowCount;
      const cell = cells.rows[rowIndex][coordinates.col];
      if (isNavigable(cell)) {
        nextRowIndex = rowIndex;
      }
      i -= 1;
    }

    if (nextRowIndex > -1) {
      cells.rows[nextRowIndex][coordinates.col].focus();
    }
  };

  const moveToRowOnTheRight = () => {
    const currentCellIndex = cells.list.indexOf(target);
    let nextCellIndex = -1;
    let i = currentCellIndex + 1;

    while (nextCellIndex === -1 && i < currentCellIndex + cells.list.length) {
      if (changePage && i > cells.list.length - 1) {
        changePage({
          direction: 'next',
          target: { type: 'first-cell' },
        });
        break;
      }

      const cellIndex = i % cells.list.length;
      const cell = cells.list[cellIndex];
      if (isNavigable(cell)) {
        nextCellIndex = cellIndex;
      }
      i += 1;
    }

    if (nextCellIndex > -1) {
      cells.list[nextCellIndex].focus();
    }
  };

  const moveToRowOnTheLeft = () => {
    const currentCellIndex = cells.list.indexOf(target);
    let nextCellIndex = -1;
    let i = currentCellIndex - 1;

    while (nextCellIndex === -1 && i > currentCellIndex - cells.list.length) {
      if (changePage && i < 0) {
        changePage({
          direction: 'previous',
          target: { type: 'last-cell' },
        });
        break;
      }

      const cellIndex = (cells.list.length + i) % cells.list.length;
      const cell = cells.list[cellIndex];
      if (isNavigable(cell)) {
        nextCellIndex = cellIndex;
      }
      i -= 1;
    }

    if (nextCellIndex > -1) {
      cells.list[nextCellIndex].focus();
    }
  };

  const moveToFirstCellInGrid = () => {
    const cell = cells.nested[coordinates.calendar].flat().find(isNavigable);
    if (cell) {
      cell.focus();
    }
  };

  const moveToLastCellInGrid = () => {
    const cell = cells.nested[coordinates.calendar].flat().findLast(isNavigable);
    if (cell) {
      cell.focus();
    }
  };

  switch (event.key) {
    case 'ArrowRight':
      moveToRowOnTheRight();
      break;
    case 'ArrowLeft':
      moveToRowOnTheLeft();
      break;
    case 'ArrowDown':
      // TODO: Add multi month navigation
      moveToRowBelow();
      break;
    case 'ArrowUp':
      // TODO: Add multi month navigation
      moveToRowAbove();
      break;
    case 'Home':
      moveToFirstCellInGrid();
      break;
    case 'End':
      moveToLastCellInGrid();
      break;
    default:
      break;
  }
}

export type PageNavigationTarget =
  | { type: 'first-cell' }
  | { type: 'last-cell' }
  | { type: 'first-cell-in-col'; colIndex: number }
  | { type: 'last-cell-in-col'; colIndex: number }
  | { type: 'first-cell-in-row'; rowIndex: number }
  | { type: 'last-cell-in-row'; rowIndex: number };

export type NavigateInGridChangePage = (params: {
  direction: 'next' | 'previous';
  target: PageNavigationTarget;
}) => void;

export function applyInitialFocusInGrid({
  grids,
  target,
}: {
  grids: Grid[];
  target: PageNavigationTarget;
}) {
  const cells = getCellsInCalendar(grids);
  let cell: HTMLElement | undefined;

  if (target.type === 'first-cell') {
    cell = cells.list.find(isNavigable);
  }

  if (target.type === 'last-cell') {
    cell = cells.list.findLast(isNavigable);
  }

  if (target.type === 'first-cell-in-col') {
    cell = cells.rows.map((row) => row[target.colIndex]).find(isNavigable);
  }

  // TODO: Support when the 1st month is fully disabled.
  if (target.type === 'last-cell-in-col') {
    cell = cells.rows.map((row) => row[target.colIndex]).findLast(isNavigable);
  }

  if (cell) {
    cell.focus();
  }
}

function isNavigable(element: HTMLElement | null): element is HTMLElement {
  if (element === null) {
    return false;
  }

  if (element.hasAttribute('disabled') || element.getAttribute('data-disabled') === 'true') {
    return false;
  }

  if (element.dataset.outsidemonth != null) {
    return false;
  }

  return true;
}
