import {
  GRID_CELL_CSS_CLASS,
  GRID_DATA_CONTAINER_CSS_CLASS,
  GRID_COLUMN_HEADER_CSS_CLASS,
  GRID_COLUMN_HEADER_TITLE_CSS_CLASS,
  GRID_ROW_CSS_CLASS,
} from '../constants/cssClassesConstants';
import { GridCellIndexCoordinates } from '../models/gridCell';
import { GridRowId } from '../models/gridRows';

export function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

export function findParentElementFromClassName(elem: Element, className: string): Element | null {
  return elem.closest(`.${className}`);
}

export function getRowEl(cell?: Element | null): HTMLElement | null {
  if (!cell) {
    return null;
  }
  return findParentElementFromClassName(cell as HTMLDivElement, GRID_ROW_CSS_CLASS)! as HTMLElement;
}

export function isGridCellRoot(elem: Element | null): boolean {
  return elem != null && elem.classList.contains(GRID_CELL_CSS_CLASS);
}

export function isGridHeaderCellRoot(elem: Element | null): boolean {
  return elem != null && elem.classList.contains(GRID_COLUMN_HEADER_CSS_CLASS);
}

export function isGridHeaderTitleContainer(elem: Element): boolean {
  return elem && findParentElementFromClassName(elem, GRID_COLUMN_HEADER_TITLE_CSS_CLASS) !== null;
}

export function getIdFromRowElem(rowEl: Element): string {
  return rowEl.getAttribute('data-id')!;
}

export function getFieldFromHeaderElem(colCellEl: Element): string {
  return colCellEl.getAttribute('data-field')!;
}

export function findHeaderElementFromField(elem: Element, field: string): Element | null {
  return elem.querySelector(`[data-field="${field}"]`);
}

export function findGridCellElementsFromCol(col: HTMLElement): NodeListOf<Element> | null {
  const field = col.getAttribute('data-field');
  const root = findParentElementFromClassName(col, 'MuiDataGrid-root');
  if (!root) {
    throw new Error('Material-UI: The root element is not found.');
  }
  const cells = root.querySelectorAll(`:scope .${GRID_CELL_CSS_CLASS}[data-field="${field}"]`);
  return cells;
}

export function findGridRootFromCurrent(elem: Element): HTMLDivElement | null {
  if (elem.classList.contains('MuiDataGrid-root')) {
    return elem as HTMLDivElement;
  }
  const root = findParentElementFromClassName(elem, 'MuiDataGrid-root');
  return root as HTMLDivElement;
}

export function findGridDataContainerFromCurrent(elem: Element): HTMLDivElement | null {
  const root = findGridRootFromCurrent(elem);
  if (!root) {
    return null;
  }
  return root.querySelector(`:scope .${GRID_DATA_CONTAINER_CSS_CLASS}`) as HTMLDivElement;
}

export function getGridCellElementFromIndexes(
  root: Element,
  { colIndex, rowIndex }: GridCellIndexCoordinates,
) {
  return root.querySelector(
    `:scope .${GRID_CELL_CSS_CLASS}[aria-colIndex='${colIndex}'][data-rowIndex='${rowIndex}']`,
  ) as HTMLDivElement;
}

export function getGridColumnHeaderElement(root: Element, field: string) {
  return root.querySelector(`[role='columnheader'][data-field='${field}']`) as HTMLDivElement;
}

export function getGridRowElement(root: Element, id: GridRowId) {
  return root.querySelector(`:scope .${GRID_ROW_CSS_CLASS}[data-id='${id}']`) as HTMLDivElement;
}

export function getGridCellElement(root: Element, { id, field }: { id: GridRowId; field: string }) {
  const row = getGridRowElement(root, id);
  if (!row) {
    return null;
  }
  return row.querySelector(`.${GRID_CELL_CSS_CLASS}[data-field='${field}']`) as HTMLDivElement;
}
