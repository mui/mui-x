import { gridClasses } from '@mui/x-data-grid';
import { findParentElementFromClassName } from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../models/gridApiPro';

export function getFieldFromHeaderElem(colCellEl: Element): string {
  return colCellEl.getAttribute('data-field')!;
}

export function findHeaderElementFromField(elem: Element, field: string): Element | null {
  return elem.querySelector(`[data-field="${field}"]`);
}

export function findGroupHeaderElementsFromField(elem: Element, field: string): Element[] {
  return Array.from(elem.querySelectorAll<HTMLDivElement>(`[data-fields*="|-${field}-|"]`) ?? []);
}

export function findGridCellElementsFromCol(col: HTMLElement, api: GridPrivateApiPro) {
  const root = findParentElementFromClassName(col, gridClasses.root);
  if (!root) {
    throw new Error('MUI: The root element is not found.');
  }

  const ariaColIndex = col.getAttribute('aria-colindex');
  if (!ariaColIndex) {
    return [];
  }

  const colIndex = Number(ariaColIndex) - 1;
  const cells: Element[] = [];

  const virtualScrollerContent = api.virtualScrollerRef?.current?.firstElementChild;
  if (!virtualScrollerContent) {
    return [];
  }

  const renderedRowElements = virtualScrollerContent.querySelectorAll(
    `:scope > div > .${gridClasses.row}`, // Use > to ignore rows from detail panels
  );

  renderedRowElements.forEach((rowElement) => {
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
