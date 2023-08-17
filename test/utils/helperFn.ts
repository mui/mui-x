import { spy } from 'sinon';
import { act } from '@mui/monorepo/test/utils';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import type { GridApiCommon } from '@mui/x-data-grid/models/api/gridApiCommon';

export function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export function microtasks() {
  return act(() => Promise.resolve());
}

export function spyApi(api: GridApiCommon, methodName: string) {
  const methodKey = methodName as keyof GridApiCommon;
  const privateApi = unwrapPrivateAPI(api);
  const method = privateApi[methodKey];

  const spyFn = spy((...args: any[]) => {
    return spyFn.target(...args);
  }) as any;
  spyFn.spying = true;
  spyFn.target = method;

  api[methodKey] = spyFn;
  privateApi[methodKey] = spyFn;

  return spyFn;
}

export async function raf() {
  return new Promise<void>((resolve) => {
    // Chrome and Safari have a bug where calling rAF once returns the current
    // frame instead of the next frame, so we need to call a double rAF here.
    // See crbug.com/675795 for more.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/**
 * Returns the 0-based row and column index of the active cell
 */
export function getActiveCell(): string | null {
  let activeElement: Element | null;
  if (document.activeElement && document.activeElement.getAttribute('role') === 'cell') {
    activeElement = document.activeElement;
  } else {
    activeElement = document.activeElement && document.activeElement.closest('[role="cell"]');
  }

  if (!activeElement) {
    return null;
  }

  return `${activeElement.parentElement!.getAttribute(
    'data-rowindex',
  )}-${activeElement.getAttribute('data-colindex')}`;
}

/**
 * Returns the 0-based column index of the active column header
 */
export function getActiveColumnHeader() {
  let activeElement: Element | null;
  if (document.activeElement && document.activeElement.getAttribute('role') === 'columnheader') {
    activeElement = document.activeElement;
  } else {
    activeElement =
      document.activeElement && document.activeElement.closest('[role="columnheader"]');
  }

  if (!activeElement) {
    return null;
  }

  return `${Number(activeElement.getAttribute('aria-colindex')) - 1}`;
}

export function getColumnValues(colIndex: number) {
  return Array.from(document.querySelectorAll(`[role="cell"][data-colindex="${colIndex}"]`)).map(
    (node) => node!.textContent,
  );
}

export function getColumnHeaderCell(colIndex: number, rowIndex?: number): HTMLElement {
  const headerRowSelector =
    rowIndex === undefined ? '' : `[role="row"][aria-rowindex="${rowIndex + 1}"] `;
  const headerCellSelector = `[role="columnheader"][aria-colindex="${colIndex + 1}"]`;
  const columnHeader = document.querySelector<HTMLElement>(
    `${headerRowSelector}${headerCellSelector}`,
  );

  if (columnHeader == null) {
    throw new Error(`columnheader ${colIndex} not found`);
  }
  return columnHeader;
}

export function getColumnHeadersTextContent() {
  return Array.from(document.querySelectorAll('[role="columnheader"]')).map(
    (node) => node!.textContent,
  );
}

export function getRowsFieldContent(field: string) {
  return Array.from(document.querySelectorAll('[role="row"][data-rowindex]')).map(
    (node) => node.querySelector(`[role="cell"][data-field="${field}"]`)?.textContent,
  );
}

export function getCell(rowIndex: number, colIndex: number): HTMLElement {
  const cell = document.querySelector<HTMLElement>(
    `[role="row"][data-rowindex="${rowIndex}"] [role="cell"][data-colindex="${colIndex}"]`,
  );
  if (cell == null) {
    throw new Error(`Cell ${rowIndex} ${colIndex} not found`);
  }
  return cell;
}

export function getRows() {
  return document.querySelectorAll(`[role="row"][data-rowindex]`);
}

export function getRow(rowIndex: number): HTMLElement {
  const row = document.querySelector<HTMLElement>(`[role="row"][data-rowindex="${rowIndex}"]`);
  if (row == null) {
    throw new Error(`Row ${rowIndex} not found`);
  }
  return row;
}
