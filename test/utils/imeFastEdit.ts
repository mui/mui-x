// Helpers for the `experimentalFeatures.imeFastEdit` tests.
import { expect } from 'vitest';
import { fireEvent, waitFor } from '@mui/internal-test-utils';
import type { MuiRenderResult } from '@mui/internal-test-utils';
import type { GridDataSource, GridGetRowsParams } from '@mui/x-data-grid';
import type { GridApiCommon } from '@mui/x-data-grid/models/api/gridApiCommon';
import type { useMockServer } from '@mui/x-data-grid-generator';
import { getActiveCell, getCell } from 'test/utils/helperFn';

export type User = MuiRenderResult['user'];

// A grid API ref, used to get the column of a cell.
export type ColumnLookup = { current: Pick<GridApiCommon, 'getColumn'> | null };

export const getInput = (cell: HTMLElement) => cell.querySelector('input');

export const getEditorWrappers = () => document.querySelectorAll('[data-cell-editor]');

export const getPreMountedEditor = (cell: HTMLElement) =>
  cell.querySelector<HTMLElement>('[data-cell-editor="preMounted"]');

export async function focusCell(user: User, row: number, col: number) {
  const cell = getCell(row, col);
  await user.click(cell);
  return cell;
}

// Asserts that the focused editable string cell has its hidden editor focused and empty.
export function expectHiddenEditor(cell: HTMLElement) {
  const input = getInput(cell)!;
  expect(input).not.to.equal(null);
  expect(cell.querySelector('[data-cell-editor]')).to.have.attribute(
    'data-cell-editor',
    'preMounted',
  );
  expect(document.activeElement).to.equal(input);
  expect(input.value).to.equal('');
  return input;
}

// Asserts the DOM focus of the cell with the focus state, with and without the flag.
export function expectFocusedCell(cell: HTMLElement, imeFastEdit: boolean) {
  if (imeFastEdit) {
    expectHiddenEditor(cell);
  } else {
    expect(document.activeElement).to.equal(cell);
    expect(getEditorWrappers()).to.have.length(0);
  }
}

// Returns the focused element: the hidden editor with the flag, the cell without it.
export function getFocusTarget(cell: HTMLElement, imeFastEdit: boolean) {
  const target = imeFastEdit ? getInput(cell)! : cell;
  expect(document.activeElement).to.equal(target);
  return target;
}

// Describes the element that has the focus: `body`, `cell r,c`, `input r,c` (the hidden editor), or `other`.
export function describeFocus() {
  const element = document.activeElement;
  if (element === null || element === document.body) {
    return 'body';
  }
  const cell = element.closest<HTMLElement>('[role="gridcell"]');
  if (cell === null) {
    return 'other';
  }
  const rowIndex = cell.closest<HTMLElement>('[data-rowindex]')?.dataset.rowindex;
  const position = `${rowIndex},${cell.dataset.colindex}`;
  return element === cell ? `cell ${position}` : `input ${position}`;
}

// Describes the active element without DOM references, so that two renders can be compared.
export function describeActiveElement() {
  const active = document.activeElement;
  if (!active || active === document.body) {
    return 'body';
  }
  if (active.closest('[role="gridcell"], [role="rowheader"]')) {
    return `cell:${getActiveCell()}`;
  }
  const header = active.closest('[role="columnheader"]');
  if (header) {
    const colIndex = header.getAttribute('aria-colindex');
    // The header filter text depends on the filter state, so skip it.
    if (header.classList.contains('MuiDataGrid-columnHeader--filter')) {
      return `filter:${colIndex}`;
    }
    return `header:${colIndex}:${header.textContent}`;
  }
  const label =
    active.getAttribute('data-testid') ?? active.getAttribute('aria-label') ?? active.textContent;
  return `${active.tagName.toLowerCase()}:${label}`;
}

// Asserts the active element: the hidden editor in an editable string cell with the flag, else the cell.
export function expectFocusMatchesCell(imeFastEdit: boolean, apiRef: ColumnLookup) {
  const active = document.activeElement as HTMLElement;
  const cell = active.closest<HTMLElement>('[role="gridcell"]');
  if (!cell) {
    return;
  }
  const column = apiRef.current!.getColumn(cell.getAttribute('data-field')!);
  // The class also includes `isCellEditable` and the rows that are not editable, such as group rows.
  const isEditable = cell.classList.contains('MuiDataGrid-cell--editable');
  const isEditableString = isEditable && (column?.type ?? 'string') === 'string';
  if (imeFastEdit && isEditableString) {
    expect(active.tagName).to.equal('INPUT');
    expect(getPreMountedEditor(cell)).not.to.equal(null);
    expect(cell).to.have.attribute('tabindex', '-1');
  } else {
    expect(active).to.equal(cell);
    expect(getPreMountedEditor(cell)).to.equal(null);
  }
}

// Presses each key and returns the active element after each key.
export async function pressKeys(
  user: User,
  keys: string[],
  imeFastEdit: boolean,
  apiRef: ColumnLookup,
) {
  const result: string[] = [];
  for (const key of keys) {
    // eslint-disable-next-line no-await-in-loop
    await user.keyboard(key);
    result.push(describeActiveElement());
    expectFocusMatchesCell(imeFastEdit, apiRef);
  }
  return result;
}

// Runs the same scenario without and with the flag and returns the results.
export async function compareWithBaseline<T>(
  scenario: (imeFastEdit: boolean) => Promise<T>,
): Promise<{ baseline: T; withFlag: T }> {
  const baseline = await scenario(false);
  const withFlag = await scenario(true);
  return { baseline, withFlag };
}

declare global {
  // eslint-disable-next-line vars-on-top
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

// Presses a real key without `act()`, so that React renders as in a browser. Browser only.
export async function pressKeyWithBrowserTiming(key: string) {
  const { userEvent } = await import('vitest/browser');
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  try {
    await userEvent.keyboard(key);
  } finally {
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
}

// Composes an IME text in the input. The composition does not commit the value.
export function compose(input: HTMLInputElement, text: string) {
  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.compositionEnd(input);
}

// Composes an IME text in the input and commits it with Enter.
export async function composeAndCommit(user: User, input: HTMLInputElement, text: string) {
  compose(input, text);
  await user.keyboard('{Enter}');
}

// Composes and commits text in the hidden editor. Asserts that the input is kept and the cell shows the text.
export async function composeAndCommitInCell(user: User, cell: HTMLElement, text: string) {
  const input = getInput(cell)!;
  expect(document.activeElement).to.equal(input);
  fireEvent.compositionStart(input);
  expect(getInput(cell)).to.equal(input);
  expect(document.activeElement).to.equal(input);
  expect(input.value).to.equal('');
  fireEvent.change(input, { target: { value: text } });
  fireEvent.compositionEnd(input);
  await user.keyboard('{Enter}');
  await waitFor(() => {
    expect(cell.textContent).to.equal(text);
  });
}

// A data source over the `useMockServer` rows. The spies get each fetch URL and update params.
export function createMockDataSource(
  server: Pick<ReturnType<typeof useMockServer>, 'fetchRows' | 'editRow'>,
  options: {
    fetchRowsSpy: (url: string) => void;
    updateRowSpy: (params: Parameters<NonNullable<GridDataSource['updateRow']>>[0]) => void;
    updateRowFails?: boolean;
  },
): GridDataSource {
  const { fetchRowsSpy, updateRowSpy, updateRowFails = false } = options;
  return {
    getRows: async (params: GridGetRowsParams) => {
      const urlParams = new URLSearchParams({
        filterModel: JSON.stringify(params.filterModel),
        sortModel: JSON.stringify(params.sortModel),
        start: `${params.start}`,
        end: `${params.end}`,
      });
      const url = `https://mui.com/x/api/data-grid?${urlParams.toString()}`;
      fetchRowsSpy(url);
      const response = await server.fetchRows(url);
      return { rows: response.rows, rowCount: response.rowCount };
    },
    updateRow: async (params) => {
      updateRowSpy(params);
      if (updateRowFails) {
        throw new Error('update failed');
      }
      return server.editRow(params.rowId, params.updatedRow);
    },
  };
}
