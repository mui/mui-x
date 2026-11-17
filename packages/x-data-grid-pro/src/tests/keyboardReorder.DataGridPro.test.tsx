import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_FIELD,
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import type { DataGridProProps, GridApi, GridColDef } from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import {
  getCell,
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getRowsFieldContent,
} from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { getKeyboardRowMoveTarget } from '../hooks/features/rowReorder/rowReorderDragUtils';

const rows = [
  { id: 0, name: 'A' },
  { id: 1, name: 'B' },
  { id: 2, name: 'C' },
  { id: 3, name: 'D' },
  { id: 4, name: 'E' },
];

const columns: GridColDef[] = [{ field: 'name' }];

const reorderColumns: GridColDef[] = [
  { field: 'a', headerName: 'Alpha' },
  { field: 'b', headerName: 'Bravo' },
  { field: 'c', headerName: 'Charlie' },
  { field: 'd', headerName: 'Delta' },
];

const reorderRows = [{ id: 0, a: 'a0', b: 'b0', c: 'c0', d: 'd0' }];

function focus(target: Element) {
  if (document.activeElement !== target) {
    act(() => (target as HTMLElement).focus());
  }
}

// Returns whether the key reached the browser, like `fireEvent`
function pressAlt(target: Element, key: string, modifiers: Partial<KeyboardEventInit> = {}) {
  focus(target);
  return fireEvent.keyDown(target, { key, altKey: true, ...modifiers });
}

const getAnnouncement = () => screen.getByRole('status').textContent;

describe('<DataGridPro /> - Keyboard reorder', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 600, height: 400 }}>
        <DataGridPro apiRef={apiRef} rows={rows} columns={columns} rowReordering {...props} />
      </div>
    );
  }

  function ColumnTest(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 800, height: 300 }}>
        <DataGridPro apiRef={apiRef} rows={reorderRows} columns={reorderColumns} {...props} />
      </div>
    );
  }

  // The name column follows the row reorder column
  const getNameCell = (rowIndex: number) => getCell(rowIndex, 1);

  const focusHeader = (field: string) => act(() => apiRef.current!.setColumnHeaderFocus(field));

  describe('rows', () => {
    it('should move the row down and up by one', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} />);

      expect(pressAlt(getNameCell(1), 'ArrowDown')).to.equal(false);
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D', 'E']),
      );
      expect(onRowOrderChange).toHaveBeenCalledTimes(1);
      expect(onRowOrderChange.mock.calls[0][0]).to.include({ oldIndex: 1, targetIndex: 2 });
      expect(getAnnouncement()).to.equal('Row moved to position 3 of 5.');

      expect(pressAlt(getNameCell(2), 'ArrowUp')).to.equal(false);
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'B', 'C', 'D', 'E']),
      );
      expect(onRowOrderChange).toHaveBeenCalledTimes(2);
      expect(onRowOrderChange.mock.calls[1][0]).to.include({ oldIndex: 2, targetIndex: 1 });
      expect(getAnnouncement()).to.equal('Row moved to position 2 of 5.');
    });

    it('should keep the focus on the moved cell', async () => {
      const { user } = render(<Test />);
      await user.click(getNameCell(1));

      pressAlt(getNameCell(1), 'ArrowDown');
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D', 'E']),
      );
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 1, field: 'name' });
    });

    it('should move the row to the last and the first row with Alt+End and Alt+Home', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} />);

      pressAlt(getNameCell(1), 'End');
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'D', 'E', 'B']),
      );
      expect(onRowOrderChange).toHaveBeenCalledTimes(1);
      expect(getAnnouncement()).to.equal('Row moved to position 5 of 5.');

      pressAlt(getNameCell(3), 'Home');
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['E', 'A', 'C', 'D', 'B']),
      );
      expect(onRowOrderChange).toHaveBeenCalledTimes(2);
      expect(getAnnouncement()).to.equal('Row moved to position 1 of 5.');
    });

    it('should stop Alt+End before the first row that isValidRowReorder rejects', async () => {
      render(<Test isValidRowReorder={(context) => context.targetNode.id !== 3} />);

      pressAlt(getNameCell(0), 'End');
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['B', 'C', 'A', 'D', 'E']),
      );
    });

    it('should stay within the current page', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={onRowOrderChange}
          pagination
          pageSizeOptions={[2]}
          initialState={{ pagination: { paginationModel: { page: 1, pageSize: 2 } } }}
        />,
      );

      expect(getRowsFieldContent('name')).to.deep.equal(['C', 'D']);
      expect(pressAlt(getNameCell(2), 'ArrowUp')).to.equal(false);
      expect(getAnnouncement()).to.equal("Can't move the row further up.");
      pressAlt(getNameCell(2), 'End');
      await waitFor(() => expect(getRowsFieldContent('name')).to.deep.equal(['D', 'C']));
      expect(pressAlt(getNameCell(3), 'ArrowDown')).to.equal(false);
      await act(() => Promise.resolve());
      expect(getRowsFieldContent('name')).to.deep.equal(['D', 'C']);
      expect(getAnnouncement()).to.equal("Can't move the row further down.");
      expect(onRowOrderChange).toHaveBeenCalledTimes(1);
    });

    it('should refuse to move the first row up and the last row down', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} />);

      expect(pressAlt(getNameCell(0), 'ArrowUp')).to.equal(false);
      expect(getAnnouncement()).to.equal("Can't move the row further up.");
      expect(pressAlt(getNameCell(4), 'End')).to.equal(false);
      expect(getAnnouncement()).to.equal("Can't move the row further down.");
      await act(() => Promise.resolve());
      expect(getRowsFieldContent('name')).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
      expect(onRowOrderChange).not.toHaveBeenCalled();
    });

    it('should refuse to move a row while the grid is sorted', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={onRowOrderChange}
          initialState={{ sorting: { sortModel: [{ field: 'name', sort: 'desc' }] } }}
        />,
      );

      expect(pressAlt(getNameCell(1), 'ArrowDown')).to.equal(false);
      expect(getAnnouncement()).to.equal("Rows can't be reordered while the grid is sorted.");
      await act(() => Promise.resolve());
      expect(getRowsFieldContent('name')).to.deep.equal(['E', 'D', 'C', 'B', 'A']);
      expect(onRowOrderChange).not.toHaveBeenCalled();
    });

    it('should refuse to move a row that isRowReorderable rejects', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test onRowOrderChange={onRowOrderChange} isRowReorderable={({ row }) => row.id !== 1} />,
      );

      expect(pressAlt(getNameCell(1), 'ArrowDown')).to.equal(false);
      expect(getAnnouncement()).to.equal("The row can't be moved there.");
      await act(() => Promise.resolve());
      expect(getRowsFieldContent('name')).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
      expect(onRowOrderChange).not.toHaveBeenCalled();
    });

    it('should refuse to move a pinned row', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={onRowOrderChange}
          rows={rows.slice(1)}
          pinnedRows={{ top: [rows[0]] }}
        />,
      );

      const pinnedCell = document.querySelector('[data-id="0"] [data-field="name"]')!;
      expect(pressAlt(pinnedCell, 'ArrowDown')).to.equal(false);
      expect(getAnnouncement()).to.equal("The row can't be moved there.");
      await act(() => Promise.resolve());
      expect(onRowOrderChange).not.toHaveBeenCalled();
    });

    it('should leave the key to the navigation while a cell is edited', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test onRowOrderChange={onRowOrderChange} columns={[{ field: 'name', editable: true }]} />,
      );

      await act(async () => apiRef.current!.startCellEditMode({ id: 3, field: 'name' }));
      pressAlt(getNameCell(1), 'ArrowDown');
      await act(() => Promise.resolve());
      expect(getRowsFieldContent('name')).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
      expect(onRowOrderChange).not.toHaveBeenCalled();
      expect(getAnnouncement()).to.equal('');
    });

    it('should leave the key to the navigation when row reordering is off', async () => {
      const { user } = render(<Test rowReordering={false} />);
      await user.click(getCell(1, 0));

      expect(pressAlt(getCell(1, 0), 'ArrowDown')).to.equal(false);
      await act(() => Promise.resolve());
      expect(getRowsFieldContent('name')).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 2, field: 'name' });
      expect(getAnnouncement()).to.equal('');
    });

    it('should ignore a press while a move is pending', async () => {
      let privateApi: ReturnType<typeof useGridPrivateApiContext>;
      function Footer() {
        privateApi = useGridPrivateApiContext();
        return null;
      }
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} slots={{ footer: Footer }} />);

      const setRowPosition = privateApi!.current.setRowPosition;
      let resolveMove: () => void = () => {};
      privateApi!.current.setRowPosition = (...args) =>
        new Promise<void>((resolve) => {
          resolveMove = () => resolve(setRowPosition(...args));
        });

      expect(pressAlt(getNameCell(1), 'ArrowDown')).to.equal(false);
      expect(pressAlt(getNameCell(1), 'ArrowDown')).to.equal(false);
      await act(async () => resolveMove());
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D', 'E']),
      );
      expect(onRowOrderChange).toHaveBeenCalledTimes(1);
    });

    it('should not move rows in tree data', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={onRowOrderChange}
          treeData
          getTreeDataPath={(row) => (row.id === 0 ? ['A'] : ['A', row.name])}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      pressAlt(getCell(1, 1), 'ArrowDown');
      await act(() => Promise.resolve());
      expect(onRowOrderChange).not.toHaveBeenCalled();
      expect(getAnnouncement()).to.equal('');
    });
  });

  describe('columns', () => {
    it('should move the column right and left from a header', () => {
      const onColumnOrderChange = vi.fn();
      render(<ColumnTest onColumnOrderChange={onColumnOrderChange} />);
      focusHeader('b');

      expect(pressAlt(getColumnHeaderCell(1), 'ArrowRight')).to.equal(false);
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Charlie', 'Bravo', 'Delta']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
      expect(onColumnOrderChange.mock.calls[0][0]).to.include({ oldIndex: 1, targetIndex: 2 });
      expect(getAnnouncement()).to.equal('Column Bravo moved to position 3 of 4.');
      expect(gridFocusColumnHeaderSelector(apiRef)).to.deep.equal({ field: 'b' });

      pressAlt(getColumnHeaderCell(2), 'ArrowLeft');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Bravo', 'Charlie', 'Delta']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(2);
    });

    it('should move the column from a cell', async () => {
      const onColumnOrderChange = vi.fn();
      const { user } = render(<ColumnTest onColumnOrderChange={onColumnOrderChange} />);
      await user.click(getCell(0, 2));

      expect(pressAlt(getCell(0, 2), 'ArrowLeft')).to.equal(false);
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Charlie', 'Bravo', 'Delta']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 0, field: 'c' });
    });

    it('should move the column to the first and the last position with Alt+Home and Alt+End', () => {
      const onColumnOrderChange = vi.fn();
      render(<ColumnTest onColumnOrderChange={onColumnOrderChange} />);
      focusHeader('c');

      pressAlt(getColumnHeaderCell(2), 'Home');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Charlie', 'Alpha', 'Bravo', 'Delta']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
      expect(onColumnOrderChange.mock.calls[0][0]).to.include({ oldIndex: 2, targetIndex: 0 });

      pressAlt(getColumnHeaderCell(0), 'End');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Bravo', 'Delta', 'Charlie']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(2);
      expect(getAnnouncement()).to.equal('Column Charlie moved to position 4 of 4.');
    });

    it('should stop Alt+Home after a column that cannot be reordered at the edge', () => {
      render(<ColumnTest checkboxSelection />);
      focusHeader('c');

      pressAlt(getColumnHeaderCell(3), 'Home');
      expect(getColumnHeadersTextContent().slice(1)).to.deep.equal([
        'Charlie',
        'Alpha',
        'Bravo',
        'Delta',
      ]);
    });

    it('should keep a column inside its pinned section', () => {
      render(<ColumnTest initialState={{ pinnedColumns: { left: ['a', 'b'] } }} />);
      focusHeader('d');

      pressAlt(getColumnHeaderCell(3), 'Home');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Bravo', 'Delta', 'Charlie']);
      pressAlt(getColumnHeaderCell(2), 'ArrowLeft');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Bravo', 'Delta', 'Charlie']);
      expect(getAnnouncement()).to.equal("Can't move column Delta further left.");
    });

    it('should move toward the visual direction in RTL', () => {
      render(
        <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
          <ColumnTest />
        </ThemeProvider>,
      );
      focusHeader('b');

      pressAlt(getColumnHeaderCell(1), 'ArrowLeft');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Charlie', 'Bravo', 'Delta']);
      pressAlt(getColumnHeaderCell(2), 'Home');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Bravo', 'Alpha', 'Charlie', 'Delta']);
    });

    it('should refuse to move the first column left and the last column right', () => {
      const onColumnOrderChange = vi.fn();
      render(<ColumnTest onColumnOrderChange={onColumnOrderChange} />);

      expect(pressAlt(getColumnHeaderCell(0), 'ArrowLeft')).to.equal(false);
      expect(getAnnouncement()).to.equal("Can't move column Alpha further left.");
      expect(pressAlt(getColumnHeaderCell(3), 'End')).to.equal(false);
      expect(getAnnouncement()).to.equal("Can't move column Delta further right.");
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Bravo', 'Charlie', 'Delta']);
      expect(onColumnOrderChange).not.toHaveBeenCalled();
    });

    it('should refuse to move a column with disableReorder', () => {
      const onColumnOrderChange = vi.fn();
      render(
        <ColumnTest
          onColumnOrderChange={onColumnOrderChange}
          columns={reorderColumns.map((column) =>
            column.field === 'b' ? { ...column, disableReorder: true } : column,
          )}
        />,
      );

      expect(pressAlt(getColumnHeaderCell(1), 'ArrowRight')).to.equal(false);
      expect(getAnnouncement()).to.equal("Column Bravo can't be reordered.");
      expect(onColumnOrderChange).not.toHaveBeenCalled();
    });

    it('should move over a column with disableReorder, like a drag', () => {
      render(
        <ColumnTest
          columns={reorderColumns.map((column) =>
            column.field === 'b' ? { ...column, disableReorder: true } : column,
          )}
        />,
      );

      pressAlt(getColumnHeaderCell(0), 'ArrowRight');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Bravo', 'Alpha', 'Charlie', 'Delta']);
    });

    it('should refuse to move next to a column with disableReorder at the edge', () => {
      render(<ColumnTest checkboxSelection />);

      expect(pressAlt(getColumnHeaderCell(1), 'ArrowLeft')).to.equal(false);
      expect(getAnnouncement()).to.equal("Can't move column Alpha further left.");
      expect(getColumnHeadersTextContent().slice(1)).to.deep.equal([
        'Alpha',
        'Bravo',
        'Charlie',
        'Delta',
      ]);
    });

    it('should swallow the key on a special column without an announcement', async () => {
      render(<ColumnTest checkboxSelection />);
      focus(getColumnHeaderCell(0));
      // The focus ripple of the checkbox
      await act(() => Promise.resolve());

      // The header gives the focus to its checkbox
      expect(pressAlt(document.activeElement!, 'ArrowRight')).to.equal(false);
      expect(getAnnouncement()).to.equal('');
      expect(apiRef.current!.getColumnIndex(GRID_CHECKBOX_SELECTION_FIELD)).to.equal(0);
    });

    it('should leave the key to the navigation when column reordering is off', () => {
      render(<ColumnTest disableColumnReorder />);
      focusHeader('b');

      pressAlt(getColumnHeaderCell(1), 'ArrowRight');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Bravo', 'Charlie', 'Delta']);
      expect(gridFocusColumnHeaderSelector(apiRef)).to.deep.equal({ field: 'c' });
      expect(getAnnouncement()).to.equal('');
    });

    it('should not move a column out of its column group', () => {
      render(
        <ColumnTest
          columnGroupingModel={[{ groupId: 'group', children: [{ field: 'a' }, { field: 'b' }] }]}
        />,
      );

      const header = document.querySelector('[role="columnheader"][data-field="b"]')!;
      expect(pressAlt(header, 'ArrowRight')).to.equal(false);
      expect(getAnnouncement()).to.equal("Can't move column Bravo further right.");
      expect(apiRef.current!.getColumnIndex('b')).to.equal(1);
      pressAlt(header, 'ArrowLeft');
      expect(apiRef.current!.getColumnIndex('b')).to.equal(0);
    });

    it('should move the row, not the column, with Alt+Home and Alt+End from a cell', async () => {
      const onColumnOrderChange = vi.fn();
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onColumnOrderChange={onColumnOrderChange}
          onRowOrderChange={onRowOrderChange}
          columns={[{ field: 'name' }, { field: 'other' }]}
        />,
      );

      pressAlt(getNameCell(0), 'End');
      await waitFor(() => expect(onRowOrderChange).toHaveBeenCalledTimes(1));
      expect(onColumnOrderChange).not.toHaveBeenCalled();
    });
  });

  describe('guards', () => {
    it('should not move when onCellKeyDown prevents the default behavior', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={onRowOrderChange}
          onCellKeyDown={(params, event) => {
            event.defaultMuiPrevented = true;
          }}
        />,
      );

      expect(pressAlt(getNameCell(1), 'ArrowDown')).to.equal(true);
      await act(() => Promise.resolve());
      expect(onRowOrderChange).not.toHaveBeenCalled();
    });

    it('should leave the key to a text input inside a cell', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={onRowOrderChange}
          columns={[{ field: 'name', renderCell: () => <input data-testid="input" /> }]}
        />,
      );

      pressAlt(screen.getAllByTestId('input')[1], 'ArrowDown');
      await act(() => Promise.resolve());
      expect(onRowOrderChange).not.toHaveBeenCalled();
      expect(getAnnouncement()).to.equal('');
    });

    it('should not move during a drag', async () => {
      let privateApi: ReturnType<typeof useGridPrivateApiContext>;
      function Footer() {
        privateApi = useGridPrivateApiContext();
        return null;
      }
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} slots={{ footer: Footer }} />);

      act(() => privateApi!.current.setRowDragActive(true));
      expect(pressAlt(getNameCell(1), 'ArrowDown')).to.equal(false);
      await act(() => Promise.resolve());
      expect(onRowOrderChange).not.toHaveBeenCalled();
    });

    it('should ignore keys with another modifier', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} />);

      pressAlt(getNameCell(1), 'ArrowDown', { shiftKey: true });
      pressAlt(getNameCell(1), 'ArrowDown', { ctrlKey: true });
      pressAlt(getNameCell(1), 'ArrowDown', { metaKey: true });
      await act(() => Promise.resolve());
      expect(onRowOrderChange).not.toHaveBeenCalled();
    });
  });

  describe.skipIf(isJSDOM)('focus', () => {
    it('should keep the DOM focus in the moved cell after a row move', async () => {
      const { user } = render(<Test />);
      await user.click(getNameCell(1));

      await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D', 'E']),
      );
      await waitFor(() =>
        expect(document.activeElement!.closest('[data-id="1"][role="row"]')).not.to.equal(null),
      );
    });

    it('should keep the DOM focus in the moved header after a column move', async () => {
      const { user } = render(<ColumnTest />);
      act(() => getColumnHeaderCell(1).focus());

      await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Charlie', 'Bravo', 'Delta']);
      await waitFor(() =>
        expect(document.activeElement!.closest('[data-field="b"]')).not.to.equal(null),
      );
    });

    it('should scroll to the moved row and keep the focus with many rows', async () => {
      const manyRows = Array.from({ length: 1000 }, (_, id) => ({ id, name: `Row ${id}` }));
      const { user } = render(<Test rows={manyRows} />);
      await user.click(getNameCell(0));

      await user.keyboard('{Alt>}{End}{/Alt}');
      await waitFor(() =>
        expect(document.activeElement!.closest('[data-id="0"][role="row"]')).not.to.equal(null),
      );
      expect(apiRef.current!.getRowIndexRelativeToVisibleRows(0)).to.equal(999);
    });
  });

  describe('getKeyboardRowMoveTarget', () => {
    const getTarget = (
      rowId: number,
      direction: 'up' | 'down',
      toEdge: boolean,
      hasCustomValidation = false,
    ) => getKeyboardRowMoveTarget(apiRef as any, { rowId, direction, toEdge, hasCustomValidation });

    it('should target the previous row above, and the next row below', () => {
      render(<Test />);
      expect(getTarget(2, 'up', false)).to.deep.equal({
        target: { rowId: 1, position: 'above' },
        targetIndex: 1,
      });
      expect(getTarget(2, 'down', false)).to.deep.equal({
        target: { rowId: 3, position: 'below' },
        targetIndex: 3,
      });
    });

    it('should target the first and the last row to the edge', () => {
      render(<Test />);
      expect(getTarget(2, 'up', true)).to.deep.equal({
        target: { rowId: 0, position: 'above' },
        targetIndex: 0,
      });
      expect(getTarget(2, 'down', true)).to.deep.equal({
        target: { rowId: 4, position: 'below' },
        targetIndex: 4,
      });
    });

    it('should refuse at the first and the last row', () => {
      render(<Test />);
      expect(getTarget(0, 'up', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(0, 'up', true)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(4, 'down', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(4, 'down', true)).to.deep.equal({ refusal: 'edge' });
    });

    it('should stay within the current page', () => {
      render(
        <Test
          pagination
          pageSizeOptions={[2]}
          initialState={{ pagination: { paginationModel: { page: 1, pageSize: 2 } } }}
        />,
      );
      expect(getTarget(2, 'up', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(3, 'down', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(3, 'up', true)).to.deep.equal({
        target: { rowId: 2, position: 'above' },
        targetIndex: 2,
      });
    });

    it('should not target a pinned row', () => {
      render(
        <Test
          rows={rows.slice(1)}
          pinnedRows={{ top: [rows[0]], bottom: [{ id: 5, name: 'F' }] }}
        />,
      );
      expect(getTarget(1, 'up', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(4, 'down', false)).to.deep.equal({ refusal: 'edge' });
    });

    it('should refuse a step that isValidRowReorder rejects', () => {
      render(<Test isValidRowReorder={(context) => context.targetNode.id !== 1} />);
      expect(getTarget(2, 'up', false, true)).to.deep.equal({ refusal: 'invalid' });
    });

    it('should stop before the first step that isValidRowReorder rejects', () => {
      render(<Test isValidRowReorder={(context) => context.targetNode.id !== 1} />);
      expect(getTarget(4, 'up', true, true)).to.deep.equal({
        target: { rowId: 2, position: 'above' },
        targetIndex: 2,
      });
    });
  });
});
