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

const getTargetCoordinates = (target: HTMLElement, cells: HTMLElement[][][]) => {
  let rowInAllGrids = 0;
  for (let i = 0; i < cells.length; i += 1) {
    for (let j = 0; j < cells[i].length; j += 1) {
      for (let k = 0; k < cells[i][j].length; k += 1) {
        if (cells[i][j][k] === target) {
          return { calendar: i, row: rowInAllGrids, col: k };
        }
      }

      rowInAllGrids += 1;
    }
  }

  throw new Error('Could not find target in calendar');
};

export function navigateInGrid({
  cells,
  event,
  changePage,
}: {
  cells: HTMLElement[][][];
  event: React.KeyboardEvent;
  changePage: NavigateInGridChangePage | undefined;
}) {
  if (!GRID_NAVIGATION_SUPPORTED_KEYS.includes(event.key)) {
    return;
  }

  event.preventDefault();

  if (cells.length === 0) {
    return;
  }

  const target = event.target as HTMLElement;
  const coordinates = getTargetCoordinates(target, cells);

  const moveToRowBelow = () => {
    const rowList = cells.flat(1);
    let nextRowIndex = -1;
    let i = coordinates.row + 1;

    while (nextRowIndex === -1 && i < coordinates.row + rowList.length) {
      if (changePage && i > rowList.length - 1) {
        changePage({
          direction: 'next',
          target: { type: 'first-cell-in-col', colIndex: coordinates.col },
        });
        break;
      }

      const rowIndex = i % rowList.length;
      const cell = rowList[rowIndex][coordinates.col];
      if (isNavigable(cell)) {
        nextRowIndex = rowIndex;
      }
      i += 1;
    }

    if (nextRowIndex > -1) {
      rowList[nextRowIndex][coordinates.col].focus();
    }
  };

  const moveToRowAbove = () => {
    const rowList = cells.flat(1);
    let nextRowIndex = -1;
    let i = coordinates.row - 1;
    while (nextRowIndex === -1 && i > coordinates.row - rowList.length) {
      if (changePage && i < 0) {
        changePage({
          direction: 'previous',
          target: { type: 'last-cell-in-col', colIndex: coordinates.col },
        });
        break;
      }

      const rowIndex = (rowList.length + i) % rowList.length;
      const cell = rowList[rowIndex][coordinates.col];
      if (isNavigable(cell)) {
        nextRowIndex = rowIndex;
      }
      i -= 1;
    }

    if (nextRowIndex > -1) {
      rowList[nextRowIndex][coordinates.col].focus();
    }
  };

  const moveToRowOnTheRight = () => {
    const cellList = cells.flat(2);
    const currentCellIndex = cellList.indexOf(target);
    let nextCellIndex = -1;
    let i = currentCellIndex + 1;

    while (nextCellIndex === -1 && i < currentCellIndex + cellList.length) {
      if (changePage && i > cellList.length - 1) {
        changePage({
          direction: 'next',
          target: { type: 'first-cell' },
        });
        break;
      }

      const cellIndex = i % cellList.length;
      const cell = cellList[cellIndex];
      if (isNavigable(cell)) {
        nextCellIndex = cellIndex;
      }
      i += 1;
    }

    if (nextCellIndex > -1) {
      cellList[nextCellIndex].focus();
    }
  };

  const moveToRowOnTheLeft = () => {
    const cellList = cells.flat(2);
    const currentCellIndex = cellList.indexOf(target);
    let nextCellIndex = -1;
    let i = currentCellIndex - 1;

    while (nextCellIndex === -1 && i > currentCellIndex - cellList.length) {
      if (changePage && i < 0) {
        changePage({
          direction: 'previous',
          target: { type: 'last-cell' },
        });
        break;
      }

      const cellIndex = (cellList.length + i) % cellList.length;
      const cell = cellList[cellIndex];
      if (isNavigable(cell)) {
        nextCellIndex = cellIndex;
      }
      i -= 1;
    }

    if (nextCellIndex > -1) {
      cellList[nextCellIndex].focus();
    }
  };

  const moveToFirstCellInGrid = () => {
    const cell = cells[coordinates.calendar].flat().find(isNavigable);
    if (cell) {
      cell.focus();
    }
  };

  const moveToLastCellInGrid = () => {
    const cell = cells[coordinates.calendar].flat().findLast(isNavigable);
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
  cells,
  target,
}: {
  cells: HTMLElement[][][];
  target: PageNavigationTarget;
}) {
  let cell: HTMLElement | undefined;

  if (target.type === 'first-cell') {
    cell = cells.flat(2).find(isNavigable);
  }

  if (target.type === 'last-cell') {
    cell = cells.flat(2).findLast(isNavigable);
  }

  if (target.type === 'first-cell-in-col') {
    cell = cells
      .flat(1)
      .map((row) => row[target.colIndex])
      .find(isNavigable);
  }

  // TODO: Support when the 1st month is fully disabled.
  if (target.type === 'last-cell-in-col') {
    cell = cells
      .flat(1)
      .map((row) => row[target.colIndex])
      .findLast(isNavigable);
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
