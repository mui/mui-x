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

export function navigateInGrid({
  rows,
  cells,
  target,
  event,
}: {
  rows: (HTMLElement | null)[];
  cells: {
    rowRef: React.RefObject<HTMLElement | null>;
    cellsRef: React.RefObject<(HTMLElement | null)[]>;
  }[];
  target: HTMLElement;
  event: React.KeyboardEvent;
}) {
  if (!GRID_NAVIGATION_SUPPORTED_KEYS.includes(event.key)) {
    return;
  }

  event.preventDefault();

  const navigableCells: HTMLElement[][] = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (isNavigable(row)) {
      const rowNavigableCells: HTMLElement[] = [];
      const rowCells = cells.find((entry) => entry.rowRef.current === row)?.cellsRef.current;
      if (rowCells) {
        for (let j = 0; j < rowCells.length; j += 1) {
          const cell = rowCells[j];
          if (isNavigable(cell)) {
            rowNavigableCells.push(cell);
          }
        }

        if (rowNavigableCells.length > 0) {
          navigableCells.push(rowNavigableCells);
        }
      }
    }
  }

  if (navigableCells.length === 0) {
    return;
  }

  const lastRowIndex = navigableCells.length - 1;
  const currentRowIndex = navigableCells.findIndex((row) => row.includes(target));
  const currentCellIndex = navigableCells[currentRowIndex].indexOf(target);
  let nextRowIndex = -1;
  let nextCellIndex = -1;

  switch (event.key) {
    case 'ArrowRight':
      if (currentCellIndex === navigableCells[currentRowIndex].length - 1) {
        nextRowIndex = currentRowIndex === lastRowIndex ? 0 : currentRowIndex + 1;
        nextCellIndex = 0;
      } else {
        nextRowIndex = currentRowIndex;
        nextCellIndex = currentCellIndex + 1;
      }
      break;
    case 'ArrowLeft':
      if (currentCellIndex === 0) {
        nextRowIndex = currentRowIndex === 0 ? lastRowIndex : currentRowIndex - 1;
        nextCellIndex = navigableCells[nextRowIndex].length - 1;
      } else {
        nextRowIndex = currentRowIndex;
        nextCellIndex = currentCellIndex - 1;
      }
      break;
    case 'ArrowDown':
      // TODO: Add multi month navigation
      if (currentRowIndex === lastRowIndex) {
        nextRowIndex = 0;
      } else {
        nextRowIndex = currentRowIndex + 1;
      }

      nextCellIndex =
        currentCellIndex > navigableCells[nextRowIndex].length - 1
          ? navigableCells[nextRowIndex].length - 1
          : currentCellIndex;
      break;
    case 'ArrowUp':
      // TODO: Add multi month navigation
      if (currentRowIndex === 0) {
        nextRowIndex = lastRowIndex;
      } else {
        nextRowIndex = currentRowIndex - 1;
      }
      nextCellIndex =
        currentCellIndex > navigableCells[nextRowIndex].length - 1
          ? navigableCells[nextRowIndex].length - 1
          : currentCellIndex;
      break;
    case 'Home':
      nextRowIndex = 0;
      nextCellIndex = 0;
      break;
    case 'End':
      nextRowIndex = lastRowIndex;
      nextCellIndex = navigableCells[lastRowIndex].length - 1;
      break;
    default:
      break;
  }

  if (nextRowIndex > -1 && nextCellIndex > -1) {
    navigableCells[nextRowIndex][nextCellIndex].focus();
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
