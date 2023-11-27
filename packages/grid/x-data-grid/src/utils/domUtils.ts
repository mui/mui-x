import { gridClasses } from '../constants/gridClasses';
import { GridRowId } from '../models/gridRows';

export function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

export function findParentElementFromClassName(elem: Element, className: string): Element | null {
  return elem.closest(`.${className}`);
}

function escapeOperandAttributeSelector(operand: string): string {
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
