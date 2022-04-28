import { gridClasses } from '@mui/x-data-grid';
import { findParentElementFromClassName } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../models/gridApiPro';

export function getFieldFromHeaderElem(colCellEl: Element): string {
  return colCellEl.getAttribute('data-field')!;
}

export function findHeaderElementFromField(elem: Element, field: string): Element | null {
  return elem.querySelector(`[data-field="${field}"]`);
}

export function findGridCellElementsFromCol(col: HTMLElement, api: GridApiPro) {
  const root = findParentElementFromClassName(col, 'MuiDataGrid-root');
  if (!root) {
    throw new Error('MUI: The root element is not found.');
  }

  const ariaColIndex = col.getAttribute('aria-colindex');
  if (!ariaColIndex) {
    return [];
  }

  const colIndex = Number(ariaColIndex) - 1;
  const cells: Element[] = [];

  const renderedRowElements = root.querySelectorAll(`.${gridClasses.row}`);

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
