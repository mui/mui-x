import { CELL_CSS_CLASS, HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
const DATA_ATTRIBUTE_PREFIX = 'data-';

export function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

export function findElementFromClassName(elem: Element, className: string): Element | null {
  return elem.closest('.' + className);
}

export function isCell(elem: Element): boolean {
  return elem && findElementFromClassName(elem, CELL_CSS_CLASS) !== null;
}

export function isHeaderCell(elem: Element): boolean {
  return elem && findElementFromClassName(elem, HEADER_CELL_CSS_CLASS) !== null;
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
