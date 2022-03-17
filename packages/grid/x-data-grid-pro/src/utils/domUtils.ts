import { gridClasses } from '@mui/x-data-grid';
import { findParentElementFromClassName } from '@mui/x-data-grid/internals';

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
    throw new Error('MUI: The root element is not found.');
  }
  const cells = root.querySelectorAll(
    // Include cells that have colspan > 1 and allocate `field` cell space
    `.${gridClasses.cell}[data-field="${field}"], .${gridClasses.cell}[data-colspan-allocates-field-${field}="1"]`,
  );
  return cells;
}
