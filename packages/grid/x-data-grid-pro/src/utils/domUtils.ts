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

  const renderedRowElements = api.virtualScrollerRef?.current.querySelectorAll(
    `:scope > div > div > .${gridClasses.row}`, // Use > to ignore rows from nested data grids (e.g. in detail panel)
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

export function findGridHeader(api: GridPrivateApiPro, field: string) {
  const headers = api.columnHeadersContainerElementRef!.current!;
  return headers.querySelector(`:scope > div > div > [data-field="${field}"][role="columnheader"]`);
}

export function findGridCells(api: GridPrivateApiPro, field: string) {
  const container = api.virtualScrollerRef!.current!;
  const selectorFor = (role: string) =>
    `:scope > div > div > div > [data-field="${field}"][role="${role}"]`;
  // TODO(v7): Keep only the selector for the correct role
  return Array.from(
    container.querySelectorAll(`${selectorFor('cell')}, ${selectorFor('gridcell')}`),
  );
}
