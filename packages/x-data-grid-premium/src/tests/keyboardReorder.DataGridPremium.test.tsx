import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import type { DataGridPremiumProps, GridApi } from '@mui/x-data-grid-premium';
import { getCell, getRowsFieldContent } from 'test/utils/helperFn';
import { vi, describe, it, expect } from 'vitest';

const rows = [
  { id: 0, name: 'A', group: 'X', amount: 1 },
  { id: 1, name: 'B', group: 'X', amount: 2 },
  { id: 2, name: 'C', group: 'Y', amount: 3 },
  { id: 3, name: 'D', group: 'Y', amount: 4 },
];

const columns = [
  { field: 'name' },
  { field: 'group' },
  { field: 'amount', type: 'number' as const },
];

function pressAlt(target: HTMLElement, key: string) {
  act(() => target.focus());
  fireEvent.keyDown(target, { key, altKey: true });
}

const getAnnouncement = () => screen.getByRole('status').textContent;

describe('<DataGridPremium /> - Keyboard reorder', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 600, height: 400 }}>
        <DataGridPremium apiRef={apiRef} rows={rows} columns={columns} rowReordering {...props} />
      </div>
    );
  }

  it('should move the focused row without changing the cell selection', async () => {
    const onCellSelectionModelChange = vi.fn();
    render(
      <Test
        cellSelection
        initialState={{ cellSelection: { 2: { name: true } } }}
        onCellSelectionModelChange={onCellSelectionModelChange}
      />,
    );

    // The name column follows the row reorder column
    pressAlt(getCell(1, 1), 'ArrowDown');
    await waitFor(() => expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D']));
    expect(apiRef.current!.getCellSelectionModel()).to.deep.equal({ 2: { name: true } });
    expect(onCellSelectionModelChange).not.toHaveBeenCalled();
  });

  it('should restart the Shift + arrow keys cell selection after moving the focused column', async () => {
    const { user } = render(<Test cellSelection rowReordering={false} />);
    await user.click(getCell(0, 0));
    // The cell selection extends without moving the focus
    await user.keyboard('{Shift>}[ArrowRight]{/Shift}');
    expect(apiRef.current!.getCellSelectionModel()).to.deep.equal({
      0: { name: true, group: true },
    });

    // `name` moves after `group`, the focus stays on it
    await user.keyboard('{Alt>}[ArrowRight]{/Alt}');
    expect(apiRef.current!.getAllColumns().map((column) => column.field)).to.deep.equal([
      'group',
      'name',
      'amount',
    ]);

    // The range restarts from the focused cell instead of extending the previous one
    await user.keyboard('{Shift>}[ArrowRight]{/Shift}');
    expect(apiRef.current!.getCellSelectionModel()).to.deep.equal({
      0: { name: true, amount: true },
    });
  });

  it('should not move rows with row grouping', async () => {
    const onRowOrderChange = vi.fn();
    render(
      <Test
        onRowOrderChange={onRowOrderChange}
        initialState={{ rowGrouping: { model: ['group'] } }}
        defaultGroupingExpansionDepth={-1}
      />,
    );

    const leafCell = document.querySelector<HTMLElement>('[data-id="0"] [data-field="name"]')!;
    pressAlt(leafCell, 'ArrowDown');
    await act(() => Promise.resolve());
    expect(onRowOrderChange).not.toHaveBeenCalled();
    expect(getAnnouncement()).to.equal('');
  });

  it('should not move a row below the aggregation footer', async () => {
    render(<Test initialState={{ aggregation: { model: { amount: 'sum' } } }} />);

    pressAlt(getCell(0, 1), 'End');
    await waitFor(() =>
      expect(getRowsFieldContent('name')).to.deep.equal(['B', 'C', 'D', 'A', '']),
    );
    expect(getAnnouncement()).to.equal('Row moved to position 4 of 4.');
  });
});
