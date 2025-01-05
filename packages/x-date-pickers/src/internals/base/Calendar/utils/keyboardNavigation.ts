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

function getCellsInGrid({
  rows,
  rowsCells,
}: {
  rows: (HTMLElement | null)[];
  rowsCells: {
    rowRef: React.RefObject<HTMLElement | null>;
    cellsRef: React.RefObject<(HTMLElement | null)[]>;
  }[];
}) {
  const cells: HTMLElement[][] = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const rowCells = rowsCells
      .find((entry) => entry.rowRef.current === row)
      ?.cellsRef.current?.filter((cell) => cell !== null);
    if (rowCells && rowCells.length > 0) {
      cells.push(rowCells);
    }
  }

  return cells;
}

export function navigateInGrid({
  rows,
  rowsCells,
  target,
  event,
  changePage,
}: {
  rows: (HTMLElement | null)[];
  rowsCells: {
    rowRef: React.RefObject<HTMLElement | null>;
    cellsRef: React.RefObject<(HTMLElement | null)[]>;
  }[];
  target: HTMLElement;
  event: React.KeyboardEvent;
  changePage: NavigateInGridChangePage | undefined;
}) {
  if (!GRID_NAVIGATION_SUPPORTED_KEYS.includes(event.key)) {
    return;
  }

  event.preventDefault();

  const cells = getCellsInGrid({ rows, rowsCells });
  if (cells.length === 0) {
    return;
  }

  const moveToRowBelow = () => {
    const currentRowIndex = cells.findIndex((row) => row.includes(target));
    const currentColIndex = cells[currentRowIndex].indexOf(target);
    let nextRowIndex = -1;
    let i = currentRowIndex + 1;

    while (nextRowIndex === -1 && i < currentRowIndex + cells.length) {
      if (changePage && i > cells.length - 1) {
        changePage({
          direction: 'next',
          target: { type: 'first-cell-in-col', colIndex: currentColIndex },
        });
        break;
      }

      const rowIndex = i % cells.length;
      const cell = cells[rowIndex][currentColIndex];
      if (isNavigable(cell)) {
        nextRowIndex = rowIndex;
      }
      i += 1;
    }

    if (nextRowIndex > -1) {
      cells[nextRowIndex][currentColIndex].focus();
    }
  };

  const moveToRowAbove = () => {
    const currentRowIndex = cells.findIndex((row) => row.includes(target));
    const currentColIndex = cells[currentRowIndex].indexOf(target);
    let nextRowIndex = -1;
    let i = currentRowIndex - 1;
    while (nextRowIndex === -1 && i > currentRowIndex - cells.length) {
      if (changePage && i < 0) {
        changePage({
          direction: 'previous',
          target: { type: 'last-cell-in-col', colIndex: currentColIndex },
        });
        break;
      }

      const rowIndex = (cells.length + i) % cells.length;
      const cell = cells[rowIndex][currentColIndex];
      if (isNavigable(cell)) {
        nextRowIndex = rowIndex;
      }
      i -= 1;
    }

    if (nextRowIndex > -1) {
      cells[nextRowIndex][currentColIndex].focus();
    }
  };

  const moveToRowOnTheRight = () => {
    const flatCells = cells.flat();
    const currentCellIndex = flatCells.indexOf(target);
    let nextCellIndex = -1;
    let i = currentCellIndex + 1;

    while (nextCellIndex === -1 && i < currentCellIndex + flatCells.length) {
      if (changePage && i > flatCells.length - 1) {
        changePage({
          direction: 'next',
          target: { type: 'first-cell' },
        });
        break;
      }

      const cellIndex = i % flatCells.length;
      const cell = flatCells[cellIndex];
      if (isNavigable(cell)) {
        nextCellIndex = cellIndex;
      }
      i += 1;
    }

    if (nextCellIndex > -1) {
      flatCells[nextCellIndex].focus();
    }
  };

  const moveToRowOnTheLeft = () => {
    const flatCells = cells.flat();
    const currentCellIndex = flatCells.indexOf(target);
    let nextCellIndex = -1;
    let i = currentCellIndex - 1;

    while (nextCellIndex === -1 && i > currentCellIndex - flatCells.length) {
      if (changePage && i < 0) {
        changePage({
          direction: 'previous',
          target: { type: 'last-cell' },
        });
        break;
      }

      const cellIndex = (flatCells.length + i) % flatCells.length;
      const cell = flatCells[cellIndex];
      if (isNavigable(cell)) {
        nextCellIndex = cellIndex;
      }
      i -= 1;
    }

    if (nextCellIndex > -1) {
      flatCells[nextCellIndex].focus();
    }
  };

  const moveToFirstCell = () => {
    const cell = cells.flat().find(isNavigable);
    if (cell) {
      cell.focus();
    }
  };

  const moveToLastCell = () => {
    const cell = cells.flat().findLast(isNavigable);
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
      moveToFirstCell();
      break;
    case 'End':
      moveToLastCell();
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
  rows,
  rowsCells,
  target,
}: {
  rows: (HTMLElement | null)[];
  rowsCells: {
    rowRef: React.RefObject<HTMLElement | null>;
    cellsRef: React.RefObject<(HTMLElement | null)[]>;
  }[];
  target: PageNavigationTarget;
}) {
  const cells = getCellsInGrid({ rows, rowsCells });
  let cell: HTMLElement | undefined;

  if (target.type === 'first-cell') {
    cell = cells.flat().find(isNavigable);
  }

  if (target.type === 'last-cell') {
    cell = cells.flat().findLast(isNavigable);
  }

  if (target.type === 'first-cell-in-col') {
    cell = cells.map((row) => row[target.colIndex]).find(isNavigable);
  }

  if (target.type === 'last-cell-in-col') {
    cell = cells.map((row) => row[target.colIndex]).findLast(isNavigable);
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

  const dimensions = element?.getBoundingClientRect();
  if (dimensions?.width === 0 || dimensions?.height === 0) {
    return false;
  }

  return true;
}
