import * as React from 'react';
import { act, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import type { RefObject } from '@mui/x-internals/types';
import {
  DataGridPremium,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApi,
  GridColDef,
  GridRowsProp,
} from '@mui/x-data-grid-premium';
import { getCell, getRow } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';

const getInput = (cell: HTMLElement) => cell.querySelector('input');
const getEditorWrappers = () => document.querySelectorAll('[data-cell-editor]');

const rows: GridRowsProp = [
  { id: 0, category: 'Cat A', name: 'Nike', price: 10 },
  { id: 1, category: 'Cat A', name: 'Adidas', price: 20 },
  { id: 2, category: 'Cat B', name: 'Puma', price: 30 },
];

const columns: GridColDef[] = [
  { field: 'category' },
  { field: 'name', editable: true },
  { field: 'price', type: 'number', editable: true },
];

describe('<DataGridPremium /> - IME fast edit with row grouping and aggregation', () => {
  const { render } = createRenderer();
  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 400, height: 400 }}>
        <DataGridPremium
          apiRef={apiRef}
          autoHeight={isJSDOM}
          disableVirtualization
          rows={rows}
          columns={columns}
          initialState={{
            rowGrouping: { model: ['category'] },
            aggregation: { model: { price: 'sum', name: 'size' } },
          }}
          defaultGroupingExpansionDepth={-1}
          experimentalFeatures={{ imeFastEdit: true }}
          {...props}
        />
      </div>
    );
  }

  // Asserts that the focused editable string cell has its hidden editor focused.
  function expectHiddenEditor(cell: HTMLElement) {
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

  async function focusCell(user: any, row: number, col: number) {
    const cell = getCell(row, col);
    await user.click(cell);
    return cell;
  }

  // Row layout: 0 = group Cat A, 1 = Nike, 2 = Adidas, 3 = group Cat B, 4 = Puma, 5 = footer.
  // Column layout: 0 = grouping column, 1 = category, 2 = name, 3 = price.
  it('does not render an editor in group rows, aggregation footers and non-string cells', async () => {
    const { user } = render(<Test />);
    expect(getRow(0).dataset.id).to.equal('auto-generated-row-category/Cat A');

    // The group row shows the aggregated value of the editable string column.
    const groupNameCell = await focusCell(user, 0, 2);
    expect(groupNameCell.textContent).to.equal('2');
    expect(getInput(groupNameCell)).to.equal(null);
    expect(document.activeElement).to.equal(groupNameCell);

    const groupingCell = await focusCell(user, 0, 0);
    expect(getInput(groupingCell)).to.equal(null);
    expect(document.activeElement).to.equal(groupingCell);

    const footerNameCell = await focusCell(user, 5, 2);
    expect(footerNameCell.textContent).to.equal('3');
    expect(getInput(footerNameCell)).to.equal(null);
    expect(document.activeElement).to.equal(footerNameCell);

    const priceCell = await focusCell(user, 1, 3);
    expect(getInput(priceCell)).to.equal(null);
    expect(document.activeElement).to.equal(priceCell);

    expect(getEditorWrappers()).to.have.length(0);
  });

  it('commits a composition in a grouped leaf row through `processRowUpdate`', async () => {
    const processRowUpdate = vi.fn((newRow) => newRow);
    const { user } = render(<Test processRowUpdate={processRowUpdate} />);
    const leafCell = await focusCell(user, 1, 2);
    expect(leafCell.textContent).to.equal('Nike');
    const input = expectHiddenEditor(leafCell);
    expect(getEditorWrappers()).to.have.length(1);

    fireEvent.compositionStart(input);
    expect(leafCell).to.have.class('MuiDataGrid-cell--editing');
    expect(getInput(leafCell)).to.equal(input);
    fireEvent.change(input, { target: { value: '나이키' } });
    fireEvent.compositionEnd(input);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(processRowUpdate.mock.calls.length).to.equal(1);
    });
    expect(processRowUpdate.mock.calls[0][0]).to.deep.equal({ ...rows[0], name: '나이키' });
    await waitFor(() => {
      expect(getCell(1, 2).textContent).to.equal('나이키');
    });
    // The aggregation of the group row is unchanged.
    expect(getCell(0, 2).textContent).to.equal('2');
    // Enter moves the focus to the next leaf row, which renders the hidden editor.
    expectHiddenEditor(getCell(2, 2));
  });

  it('keeps the hidden editor focused when `updateRows` moves the row to another group', async () => {
    const { user } = render(<Test />);
    const leafCell = await focusCell(user, 1, 2);
    const input = expectHiddenEditor(leafCell);

    await act(async () => {
      apiRef.current!.updateRows([{ id: 0, category: 'Cat B' }]);
    });
    // Row layout: 0 = group Cat A, 1 = Adidas, 2 = group Cat B, 3 = Nike, 4 = Puma.
    const movedCell = apiRef.current!.getCellElement(0, 'name')!;
    expect(movedCell.textContent).to.equal('Nike');
    expect(getInput(movedCell)).to.equal(input);
    expect(document.activeElement).to.equal(input);
    expect(input.value).to.equal('');
    expect(getEditorWrappers()).to.have.length(1);
  });

  it('keeps the hidden editor when the row grouping model changes', async () => {
    const { user } = render(<Test />);
    const leafCell = await focusCell(user, 1, 2);
    const input = expectHiddenEditor(leafCell);

    await act(async () => {
      apiRef.current!.setRowGroupingModel([]);
    });
    // Without grouping, the rows are flat and the focused row keeps its editor.
    expect(getRow(0).dataset.id).to.equal('0');
    await waitFor(() => {
      expect(getCell(0, 1).contains(document.activeElement)).to.equal(true);
    });
    expect(getEditorWrappers()).to.have.length(1);
    expect(getInput(getCell(0, 1))!.value).to.equal('');
    expect(input.isConnected).to.equal(true);

    await act(async () => {
      apiRef.current!.setRowGroupingModel(['category']);
    });
    expect(getRow(0).dataset.id).to.equal('auto-generated-row-category/Cat A');
    expect(apiRef.current!.getColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD)).not.to.equal(
      undefined,
    );
    await waitFor(() => {
      expect(getCell(1, 2).contains(document.activeElement)).to.equal(true);
    });
    expectHiddenEditor(getCell(1, 2));
  });
});
