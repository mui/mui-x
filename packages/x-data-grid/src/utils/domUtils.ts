import { gridClasses } from '../constants/gridClasses';
import type { GridPrivateApiCommunity } from '../models/api/gridApiCommunity';
import type { GridRowId } from '../models/gridRows';

export function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

export function findParentElementFromClassName(elem: Element, className: string): Element | null {
  return elem.closest(`.${className}`);
}

// TODO, eventually replaces this function with CSS.escape, once available in jsdom, either added manually or built in
// https://github.com/jsdom/jsdom/issues/1550#issuecomment-236734471
export function escapeOperandAttributeSelector(operand: string): string {
  return operand.replace(/["\\]/g, '\\$&');
}

export function getGridColumnHeaderElement(root: Element, field: string) {
  return root.querySelector<HTMLDivElement>(
    `[role="columnheader"][data-field="${escapeOperandAttributeSelector(field)}"]`,
  );
}
function getGridRowElementSelector(id: GridRowId): string {
  return `.${gridClasses.row}[data-id="${escapeOperandAttributeSelector(String(id))}"]`;
}

export function getGridRowElement(root: Element, id: GridRowId) {
  return root.querySelector<HTMLDivElement>(getGridRowElementSelector(id));
}

export function getGridCellElement(root: Element, { id, field }: { id: GridRowId; field: string }) {
  const rowSelector = getGridRowElementSelector(id);
  const cellSelector = `.${gridClasses.cell}[data-field="${escapeOperandAttributeSelector(
    field,
  )}"]`;
  const selector = `${rowSelector} ${cellSelector}`;
  return root.querySelector<HTMLDivElement>(selector);
}

// https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
export const getActiveElement = (root: Document | ShadowRoot = document): Element | null => {
  const activeEl = root.activeElement;

  if (!activeEl) {
    return null;
  }

  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot);
  }

  return activeEl;
};

export function isEventTargetInPortal(event: React.SyntheticEvent) {
  if (
    // The target is not an element when triggered by a Select inside the cell
    // See https://github.com/mui/material-ui/issues/10534
    (event.target as any).nodeType === 1 &&
    !event.currentTarget.contains(event.target as Element)
  ) {
    return true;
  }
  return false;
}

export function getFieldFromHeaderElem(colCellEl: Element): string {
  return colCellEl.getAttribute('data-field')!;
}

export function findHeaderElementFromField(elem: Element, field: string): HTMLDivElement {
  return elem.querySelector(`[data-field="${escapeOperandAttributeSelector(field)}"]`)!;
}

export function getFieldsFromGroupHeaderElem(colCellEl: Element): string[] {
  return colCellEl.getAttribute('data-fields')!.slice(2, -2).split('-|-');
}

export function findGroupHeaderElementsFromField(elem: Element, field: string): Element[] {
  return Array.from(
    elem.querySelectorAll<HTMLDivElement>(
      `[data-fields*="|-${escapeOperandAttributeSelector(field)}-|"]`,
    ) ?? [],
  );
}

export function findGridCellElementsFromCol(col: HTMLElement, api: GridPrivateApiCommunity) {
  const root = findParentElementFromClassName(col, gridClasses.root);
  if (!root) {
    throw new Error('MUI X: The root element is not found.');
  }

  const ariaColIndex = col.getAttribute('aria-colindex');
  if (!ariaColIndex) {
    return [];
  }

  const colIndex = Number(ariaColIndex) - 1;
  const cells: Element[] = [];

  if (!api.virtualScrollerRef?.current) {
    return [];
  }

  queryRows(api).forEach((rowElement) => {
    const rowId = rowElement.getAttribute('data-id');
    if (!rowId) {
      return;
    }

    let columnIndex = colIndex;

    const cellColSpanInfo = api.unstable_getCellColSpanInfo(rowId, colIndex);
    if (cellColSpanInfo && cellColSpanInfo.spannedByColSpan) {
      columnIndex = cellColSpanInfo.leftVisibleCellIndex;
    }
    const cell = rowElement.querySelector(`[data-colindex="${columnIndex}"]`);
    if (cell) {
      cells.push(cell);
    }
  });

  return cells;
}

export function findGridElement(api: GridPrivateApiCommunity, klass: keyof typeof gridClasses) {
  return api.rootElementRef.current!.querySelector(`.${gridClasses[klass]}`)! as HTMLElement;
}

const findPinnedCells = ({
  api,
  colIndex,
  position,
  filterFn,
}: {
  api: GridPrivateApiCommunity;
  colIndex: number | null;
  position: 'left' | 'right';
  filterFn: (colIndex: number) => boolean;
}) => {
  if (colIndex === null) {
    return [];
  }

  const cells: HTMLElement[] = [];

  queryRows(api).forEach((rowElement) => {
    const rowId = rowElement.getAttribute('data-id');
    if (!rowId) {
      return;
    }

    rowElement
      .querySelectorAll(
        `.${gridClasses[position === 'left' ? 'cell--pinnedLeft' : 'cell--pinnedRight']}`,
      )
      .forEach((cell) => {
        const currentColIndex = parseCellColIndex(cell);
        if (currentColIndex !== null && filterFn(currentColIndex)) {
          cells.push(cell as HTMLElement);
        }
      });
  });

  return cells;
};

export function findLeftPinnedCellsAfterCol(api: GridPrivateApiCommunity, col: HTMLElement) {
  const colIndex = parseCellColIndex(col);
  return findPinnedCells({
    api,
    colIndex,
    position: 'left',
    filterFn: (index) => index > colIndex!,
  });
}

export function findRightPinnedCellsBeforeCol(api: GridPrivateApiCommunity, col: HTMLElement) {
  const colIndex = parseCellColIndex(col);
  return findPinnedCells({
    api,
    colIndex,
    position: 'right',
    filterFn: (index) => index < colIndex!,
  });
}

const findPinnedHeaders = ({
  api,
  colIndex,
  position,
  filterFn,
}: {
  api: GridPrivateApiCommunity;
  colIndex: number | null;
  position: 'left' | 'right';
  filterFn: (colIndex: number) => boolean;
}) => {
  if (!api.columnHeadersContainerRef?.current) {
    return [];
  }
  if (colIndex === null) {
    return [];
  }

  const elements: HTMLElement[] = [];
  api.columnHeadersContainerRef.current
    .querySelectorAll(
      `.${gridClasses[position === 'left' ? 'columnHeader--pinnedLeft' : 'columnHeader--pinnedRight']}`,
    )
    .forEach((element) => {
      const currentColIndex = parseCellColIndex(element);
      if (currentColIndex !== null && filterFn(currentColIndex)) {
        elements.push(element as HTMLElement);
      }
    });
  return elements;
};

export function findLeftPinnedHeadersAfterCol(api: GridPrivateApiCommunity, col: HTMLElement) {
  const colIndex = parseCellColIndex(col);
  return findPinnedHeaders({
    api,
    position: 'left',
    colIndex,
    filterFn: (index) => index > colIndex!,
  });
}

export function findRightPinnedHeadersBeforeCol(api: GridPrivateApiCommunity, col: HTMLElement) {
  const colIndex = parseCellColIndex(col);
  return findPinnedHeaders({
    api,
    position: 'right',
    colIndex,
    filterFn: (index) => index < colIndex!,
  });
}

export function findGridHeader(api: GridPrivateApiCommunity, field: string) {
  const headers = api.columnHeadersContainerRef!.current!;
  return headers.querySelector(
    `:scope > div > [data-field="${escapeOperandAttributeSelector(field)}"][role="columnheader"]`,
  );
}

export function findGridCells(api: GridPrivateApiCommunity, field: string) {
  const container = api.virtualScrollerRef!.current!;
  return Array.from(
    container.querySelectorAll(
      `:scope > div > div > div > [data-field="${escapeOperandAttributeSelector(field)}"][role="gridcell"]`,
    ),
  );
}

function queryRows(api: GridPrivateApiCommunity) {
  return api.virtualScrollerRef.current!.querySelectorAll(
    // Use > to ignore rows from nested data grids (for example in detail panel)
    `:scope > div > div > .${gridClasses.row}`,
  );
}

function parseCellColIndex(col: Element) {
  const ariaColIndex = col.getAttribute('aria-colindex');
  if (!ariaColIndex) {
    return null;
  }
  return Number(ariaColIndex) - 1;
}
