import {
  CELL_CSS_CLASS,
  DATA_CONTAINER_CSS_CLASS,
  HEADER_CELL_CSS_CLASS,
  ROOT_CSS_CLASS,
} from '../constants/cssClassesConstants';
import { CellIndexCoordinates } from '../models/rows';

const DATA_ATTRIBUTE_PREFIX = 'data-';

export function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

export function findParentElementFromClassName(elem: Element, className: string): Element | null {
  return elem.closest(`.${className}`);
}

export function isCell(elem: Element | null): boolean {
  return elem != null && findParentElementFromClassName(elem, CELL_CSS_CLASS) !== null;
}

export function isHeaderCell(elem: Element): boolean {
  return elem && findParentElementFromClassName(elem, HEADER_CELL_CSS_CLASS) !== null;
}

export function getDataFromElem(elem: Element, field: string) {
  return elem.getAttribute(DATA_ATTRIBUTE_PREFIX + field)!;
}

export function getIdFromRowElem(rowEl: Element): string {
  return getDataFromElem(rowEl, 'id')!;
}

export function getFieldFromHeaderElem(colCellEl: Element): string {
  return getDataFromElem(colCellEl, 'field')!;
}
export function findCellElementsFromCol(col: HTMLElement): NodeListOf<Element> | null {
  const field = getDataFromElem(col, 'field');
  const root = findParentElementFromClassName(col, ROOT_CSS_CLASS);
  if (!root) {
    throw new Error('Material-UI: The root element is not found.');
  }
  const cells = root.querySelectorAll(`:scope .${CELL_CSS_CLASS}[data-field="${field}"]`);
  return cells;
}

export function findGridRootFromCurrent(elem: Element): HTMLDivElement | null {
  if (elem.classList.contains(ROOT_CSS_CLASS)) {
    return elem as HTMLDivElement;
  }
  const root = findParentElementFromClassName(elem, ROOT_CSS_CLASS);
  return root as HTMLDivElement;
}

export function findDataContainerFromCurrent(elem: Element): HTMLDivElement | null {
  const root = findGridRootFromCurrent(elem);
  if (!root) {
    return null;
  }
  return root.querySelector(`:scope .${DATA_CONTAINER_CSS_CLASS}`) as HTMLDivElement;
}

export function getCellElementFromIndexes(
  root: Element,
  { colIndex, rowIndex }: CellIndexCoordinates,
) {
  return root.querySelector(
    `:scope .${CELL_CSS_CLASS}[data-colIndex='${colIndex}'][data-rowIndex='${rowIndex}']`,
  ) as HTMLDivElement;
}
