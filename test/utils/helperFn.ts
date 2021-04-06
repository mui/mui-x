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

export const CLOCK_SYNC_FACTOR = 10;

export function getActiveCell() {
  let activeElement: Element | null;
  if (document.activeElement && document.activeElement.getAttribute('role') === 'cell') {
    activeElement = document.activeElement;
  } else {
    activeElement = document.activeElement && document.activeElement.closest('[role="cell"]');
  }

  if (!activeElement) {
    return null;
  }

  return `${activeElement.getAttribute('data-rowindex')}-${activeElement.getAttribute(
    'aria-colindex',
  )}`;
}

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

  return `${activeElement.getAttribute('aria-colindex')}`;
}

export async function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export function getColumnValues(colIndex: number = 0) {
  return Array.from(document.querySelectorAll(`[role="cell"][aria-colindex="${colIndex}"]`)).map(
    (node) => node!.textContent,
  );
}

export function getColumnHeaderCell(colIndex: number): HTMLElement {
  const columnHeader = document.querySelector(`[role="columnheader"][aria-colindex="${colIndex}"]`);
  if (columnHeader == null) {
    throw new Error(`columnheader ${colIndex} not found`);
  }
  return columnHeader as HTMLElement;
}

export function getColumnHeadersTextContent() {
  return Array.from(document.querySelectorAll('[role="columnheader"]')).map(
    (node) => node!.textContent,
  );
}

export function getCell(rowIndex: number, colIndex: number): HTMLElement {
  const cell = document.querySelector(
    `[role="cell"][data-rowindex="${rowIndex}"][aria-colindex="${colIndex}"]`,
  );
  if (cell == null) {
    throw new Error(`Cell ${rowIndex} ${colIndex} not found`);
  }
  return cell as HTMLElement;
}

export function getRow(rowIndex: number): HTMLElement {
  const row = document.querySelector(`[role="row"][data-rowindex="${rowIndex}"]`);
  if (row == null) {
    throw new Error(`Row ${rowIndex} not found`);
  }
  return row as HTMLElement;
}
