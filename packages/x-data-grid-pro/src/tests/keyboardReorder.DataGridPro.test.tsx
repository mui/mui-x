import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import {
  DataGridPro,
  GridRow,
  GRID_CHECKBOX_SELECTION_FIELD,
  gridClasses,
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import type { DataGridProProps, GridApi, GridColDef, GridRowProps } from '@mui/x-data-grid-pro';
import {
  getCell,
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getRowsFieldContent,
} from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { getRowMoveTarget } from '../hooks/features/rowReorder/rowReorderDragUtils';

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

    it('should announce the position among all the rows with server-side pagination', async () => {
      render(
        <Test
          rows={rows.slice(2, 4)}
          pagination
          paginationMode="server"
          rowCount={rows.length}
          pageSizeOptions={[2]}
          initialState={{ pagination: { paginationModel: { page: 1, pageSize: 2 } } }}
        />,
      );

      pressAlt(document.querySelector('[data-id="2"] [data-field="name"]')!, 'ArrowDown');
      await waitFor(() => expect(getRowsFieldContent('name')).to.deep.equal(['D', 'C']));
      expect(getAnnouncement()).to.equal('Row moved to position 4 of 5.');
    });

    it('should announce the position in the page with server-side pagination and an unknown row count', async () => {
      render(
        <Test
          rows={rows.slice(2, 4)}
          pagination
          paginationMode="server"
          rowCount={-1}
          pageSizeOptions={[2]}
          initialState={{ pagination: { paginationModel: { page: 1, pageSize: 2 } } }}
        />,
      );

      pressAlt(document.querySelector('[data-id="2"] [data-field="name"]')!, 'ArrowDown');
      await waitFor(() => expect(getRowsFieldContent('name')).to.deep.equal(['D', 'C']));
      expect(getAnnouncement()).to.equal('Row moved to position 2 of 2.');
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

    it('should not move a pinned column, like a drag', () => {
      const onColumnOrderChange = vi.fn();
      render(
        <ColumnTest
          onColumnOrderChange={onColumnOrderChange}
          initialState={{ pinnedColumns: { left: ['a'], right: ['d'] } }}
        />,
      );
      focusHeader('a');
      pressAlt(getColumnHeaderCell(0), 'ArrowRight');
      expect(getAnnouncement()).to.equal("Column Alpha can't be reordered.");

      focusHeader('d');
      pressAlt(getColumnHeaderCell(3), 'ArrowLeft');
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Bravo', 'Charlie', 'Delta']);
      expect(apiRef.current!.getPinnedColumns()).to.deep.equal({ left: ['a'], right: ['d'] });
      expect(onColumnOrderChange).not.toHaveBeenCalled();
    });

    it('should name a column without a header name by its field', () => {
      render(
        <ColumnTest
          columns={reorderColumns.map((column) =>
            column.field === 'b' ? { ...column, headerName: '' } : column,
          )}
        />,
      );
      focusHeader('b');
      pressAlt(getColumnHeaderCell(1), 'ArrowRight');
      expect(getAnnouncement()).to.equal('Column b moved to position 3 of 4.');
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
    it('should swallow a row move while the rows are loading, like a drag', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test loading onRowOrderChange={onRowOrderChange} />);

      expect(pressAlt(getNameCell(1), 'ArrowDown')).to.equal(false);
      await act(() => Promise.resolve());
      expect(onRowOrderChange).not.toHaveBeenCalled();
      expect(getAnnouncement()).to.equal('');
      expect(document.activeElement).to.equal(getNameCell(1));
    });

    it('should move when onCellKeyDown only prevents the browser default', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={onRowOrderChange}
          onCellKeyDown={(params, event) => event.preventDefault()}
        />,
      );

      pressAlt(getNameCell(1), 'ArrowDown');
      await waitFor(() => expect(onRowOrderChange).toHaveBeenCalledTimes(1));
    });

    it('should not move when the cell content handles the key', async () => {
      const onRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={onRowOrderChange}
          columns={[
            {
              field: 'name',
              // Like a Select, which opens on `Alt+ArrowDown`
              renderCell: () => (
                <button type="button" onKeyDown={(event) => event.preventDefault()}>
                  open
                </button>
              ),
            },
          ]}
        />,
      );

      pressAlt(screen.getAllByRole('button', { name: 'open' })[1], 'ArrowDown');
      await act(() => Promise.resolve());
      expect(onRowOrderChange).not.toHaveBeenCalled();
    });

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

    it('should not move a column when a first columnHeaderKeyDown listener prevents the default behavior', () => {
      const onColumnOrderChange = vi.fn();
      render(<ColumnTest onColumnOrderChange={onColumnOrderChange} />);
      act(() =>
        apiRef.current!.subscribeEvent(
          'columnHeaderKeyDown',
          (params, event) => {
            event.defaultMuiPrevented = true;
          },
          { isFirst: true },
        ),
      );

      expect(pressAlt(getColumnHeaderCell(1), 'ArrowRight')).to.equal(true);
      expect(getColumnHeadersTextContent()).to.deep.equal(['Alpha', 'Bravo', 'Charlie', 'Delta']);
      expect(onColumnOrderChange).not.toHaveBeenCalled();
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

    it('should move the row from the pre-mounted editor of imeFastEdit', async () => {
      const { user } = render(
        <Test
          columns={[{ field: 'name', editable: true }]}
          experimentalFeatures={{ imeFastEdit: true }}
        />,
      );
      await user.click(getNameCell(1));
      // The hidden editor of the cell has the DOM focus
      const editorInput = getNameCell(1).querySelector('[data-cell-editor="preMounted"] input')!;
      expect(document.activeElement).to.equal(editorInput);

      fireEvent.keyDown(editorInput, { key: 'ArrowDown', altKey: true });
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D', 'E']),
      );
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

  describe('private API', () => {
    let privateApi: ReturnType<typeof useGridPrivateApiContext>;

    function Footer() {
      privateApi = useGridPrivateApiContext();
      return null;
    }

    it('should move a row without a key press', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} slots={{ footer: Footer }} />);

      await act(() => privateApi.current.stepRowReorder(1, 'down', { toEdge: false }));
      expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D', 'E']);
      expect(onRowOrderChange).toHaveBeenCalledTimes(1);
      expect(getAnnouncement()).to.equal('Row moved to position 3 of 5.');
    });

    it('should move a column without a key press', () => {
      const onColumnOrderChange = vi.fn();
      render(<ColumnTest onColumnOrderChange={onColumnOrderChange} slots={{ footer: Footer }} />);

      act(() => privateApi.current.stepColumnReorder('a', 'right', { toEdge: true }));
      expect(getColumnHeadersTextContent()).to.deep.equal(['Bravo', 'Charlie', 'Delta', 'Alpha']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
      expect(getAnnouncement()).to.equal('Column Alpha moved to position 4 of 4.');
    });

    it('should do nothing when row reordering is off', async () => {
      render(<Test rowReordering={false} slots={{ footer: Footer }} />);

      await act(() => privateApi.current.stepRowReorder(1, 'down', { toEdge: false }));
      expect(getRowsFieldContent('name')).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
      expect(getAnnouncement()).to.equal('');
    });
  });

  describe('target marker', () => {
    const getRowElement = (id: number) => document.querySelector(`[role="row"][data-id="${id}"]`)!;
    const getHeader = (field: string) =>
      document.querySelector(`[role="columnheader"][data-field="${field}"]`)!;

    it('should mark the row and the column header of the focused cell after a key press', async () => {
      const { user } = render(<Test columns={[{ field: 'name' }, { field: 'other' }]} />);
      await user.click(getNameCell(1));
      expect(getRowElement(1)).not.to.have.class(gridClasses['row--reorderTarget']);
      expect(getHeader('name')).not.to.have.class(gridClasses['columnHeader--reorderTarget']);

      await user.keyboard('{ArrowDown}');
      expect(getRowElement(2)).to.have.class(gridClasses['row--reorderTarget']);
      expect(getRowElement(1)).not.to.have.class(gridClasses['row--reorderTarget']);
      expect(getHeader('name')).to.have.class(gridClasses['columnHeader--reorderTarget']);
      expect(getHeader('other')).not.to.have.class(gridClasses['columnHeader--reorderTarget']);
    });

    it('should mark the focused column header after a key press', async () => {
      const { user } = render(<ColumnTest />);
      focusHeader('b');
      await user.keyboard('{ArrowRight}');
      expect(getHeader('c')).to.have.class(gridClasses['columnHeader--reorderTarget']);
      expect(getHeader('b')).not.to.have.class(gridClasses['columnHeader--reorderTarget']);
    });

    it('should mark the moved row after the first Alt+ArrowDown', async () => {
      const { user } = render(<Test />);
      await user.click(getNameCell(1));
      expect(getRowElement(1)).not.to.have.class(gridClasses['row--reorderTarget']);

      // The reorder marks the key as handled, the marker still turns on
      pressAlt(getNameCell(1), 'ArrowDown');
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D', 'E']),
      );
      expect(getRowElement(1)).to.have.class(gridClasses['row--reorderTarget']);
    });

    it('should remove the marker on pointer down', async () => {
      const { user } = render(<Test />);
      await user.click(getNameCell(1));
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(2)).to.have.class(gridClasses['row--reorderTarget']);

      fireEvent.pointerDown(getNameCell(3));
      expect(getRowElement(2)).not.to.have.class(gridClasses['row--reorderTarget']);
      expect(getHeader('name')).not.to.have.class(gridClasses['columnHeader--reorderTarget']);
    });

    it('should remove the marker when the focus leaves the grid', async () => {
      const { user } = render(
        <React.Fragment>
          <Test />
          <button type="button">after</button>
        </React.Fragment>,
      );
      await user.click(getNameCell(1));
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(2)).to.have.class(gridClasses['row--reorderTarget']);

      act(() => screen.getByRole('button', { name: 'after' }).focus());
      await waitFor(() =>
        expect(getRowElement(2)).not.to.have.class(gridClasses['row--reorderTarget']),
      );
      expect(getHeader('name')).not.to.have.class(gridClasses['columnHeader--reorderTarget']);
    });

    it('should not mark the row on a modifier key or a shortcut', async () => {
      const { user } = render(<Test />);
      await user.click(getNameCell(1));

      await user.keyboard('{Shift}{Control>}c{/Control}');
      expect(getRowElement(1)).not.to.have.class(gridClasses['row--reorderTarget']);
      await user.keyboard('{Control>}{Home}{/Control}');
      expect(getRowElement(0)).to.have.class(gridClasses['row--reorderTarget']);
    });

    it('should not mark the row on the release of a shortcut key', async () => {
      const { user } = render(<Test />);
      await user.click(getNameCell(1));

      // `Ctrl` released first, so the `keyup` of `c` has no modifier
      await user.keyboard('{Control>}{c>}{/Control}{/c}');
      expect(getRowElement(1)).not.to.have.class(gridClasses['row--reorderTarget']);
    });

    it('should mark the column header when the focus enters the grid with Tab', async () => {
      const { user } = render(
        <React.Fragment>
          <button type="button">before</button>
          <ColumnTest />
        </React.Fragment>,
      );
      await user.click(screen.getByRole('button', { name: 'before' }));
      await user.tab();
      expect(getHeader('a')).to.have.class(gridClasses['columnHeader--reorderTarget']);
    });

    it('should not mark the row when the grid is sorted', async () => {
      const { user } = render(
        <Test initialState={{ sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }} />,
      );
      await user.click(getNameCell(1));
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(2)).not.to.have.class(gridClasses['row--reorderTarget']);
    });

    it('should not mark the row while a cell is edited', async () => {
      const { user } = render(<Test columns={[{ field: 'name', editable: true }]} />);
      await user.click(getNameCell(1));
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(2)).to.have.class(gridClasses['row--reorderTarget']);

      await act(async () => apiRef.current!.startCellEditMode({ id: 2, field: 'name' }));
      expect(getRowElement(2)).not.to.have.class(gridClasses['row--reorderTarget']);
    });

    it('should not mark a row that isRowReorderable rejects', async () => {
      const { user } = render(<Test isRowReorderable={({ row }) => row.id !== 2} />);
      await user.click(getNameCell(0));
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(1)).to.have.class(gridClasses['row--reorderTarget']);
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(2)).not.to.have.class(gridClasses['row--reorderTarget']);
    });

    it('should not mark the header of a column with disableReorder', async () => {
      const { user } = render(
        <ColumnTest
          columns={reorderColumns.map((column) =>
            column.field === 'b' ? { ...column, disableReorder: true } : column,
          )}
        />,
      );
      focusHeader('a');
      await user.keyboard('{ArrowRight}');
      expect(getHeader('b')).not.to.have.class(gridClasses['columnHeader--reorderTarget']);
    });

    it.skipIf(isJSDOM)(
      'should paint the row tint on pinned cells, and the header tint',
      async () => {
        const { user } = render(
          <Test
            columns={[{ field: 'name' }, { field: 'other' }]}
            initialState={{ pinnedColumns: { left: ['name'] } }}
          />,
        );
        await user.click(
          document.querySelector<HTMLElement>('[data-id="1"] [data-field="other"]')!,
        );
        await user.keyboard('{ArrowDown}');

        const pinnedCell = document.querySelector('[data-id="2"] [data-field="name"]')!;
        expect(getComputedStyle(pinnedCell).backgroundImage).to.include('linear-gradient');
        expect(getComputedStyle(getHeader('other')).backgroundImage).to.include('linear-gradient');
        expect(getComputedStyle(getHeader('name')).backgroundImage).to.equal('none');
      },
    );

    it('should only render the previous and the new focused rows on a focus change', async () => {
      const renders: Record<string, number> = {};
      function CountingRow(props: GridRowProps) {
        return (
          <React.Profiler
            id={String(props.rowId)}
            onRender={(id) => {
              renders[id] = (renders[id] ?? 0) + 1;
            }}
          >
            <GridRow {...props} />
          </React.Profiler>
        );
      }
      const { user } = render(<Test slots={{ row: CountingRow }} />);
      await user.click(getNameCell(1));
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(2)).to.have.class(gridClasses['row--reorderTarget']);

      Object.keys(renders).forEach((id) => delete renders[id]);
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(3)).to.have.class(gridClasses['row--reorderTarget']);
      expect(Object.keys(renders).sort()).to.deep.equal(['2', '3']);
    });

    it('should not mark anything when reordering is off', async () => {
      const { user } = render(<Test rowReordering={false} disableColumnReorder />);
      await user.click(getCell(1, 0));
      await user.keyboard('{ArrowDown}');
      expect(getRowElement(2)).not.to.have.class(gridClasses['row--reorderTarget']);
      expect(getHeader('name')).not.to.have.class(gridClasses['columnHeader--reorderTarget']);
    });
  });

  describe('screen reader hints', () => {
    const rowHint = 'Press Alt+Up Arrow or Alt+Down Arrow to move the row.';
    const columnHint = 'Press Alt+Left Arrow or Alt+Right Arrow to move the column.';

    const getHeader = (field: string) =>
      document.querySelector(`[role="columnheader"][data-field="${field}"]`)!;
    const getCellOf = (id: number, field: string) =>
      document.querySelector(`[role="row"][data-id="${id}"] [data-field="${field}"]`)!;
    // The texts of the nodes that describe the element
    const getHints = (element: Element) =>
      (element.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent);
    const getDescribedCells = () =>
      Array.from(document.querySelectorAll('[role="gridcell"][aria-describedby]'));
    const focusCell = (id: number, field: string) =>
      act(() => apiRef.current!.setCellFocus(id, field));

    const twoColumns: GridColDef[] = [{ field: 'name' }, { field: 'other' }];

    it('should describe the column keys on a reorderable header without a key press', () => {
      render(<ColumnTest />);
      expect(getHints(getHeader('a'))).to.deep.equal([columnHint]);
      const node = document.getElementById(getHeader('a').getAttribute('aria-describedby')!)!;
      expect(node).to.have.attribute('hidden');
      expect(getHeader('d').getAttribute('aria-describedby')).to.equal(
        getHeader('a').getAttribute('aria-describedby'),
      );
    });

    it('should not describe a header whose column cannot move', () => {
      render(
        <ColumnTest
          checkboxSelection
          columns={reorderColumns.map((column) =>
            column.field === 'b' ? { ...column, disableReorder: true } : column,
          )}
          initialState={{ pinnedColumns: { left: ['c'] } }}
        />,
      );
      expect(getHints(getHeader('a'))).to.deep.equal([columnHint]);
      expect(getHeader('b')).not.to.have.attribute('aria-describedby');
      expect(getHeader('c')).not.to.have.attribute('aria-describedby');
      expect(getHeader(GRID_CHECKBOX_SELECTION_FIELD)).not.to.have.attribute('aria-describedby');
    });

    it('should not describe the headers when column reordering is off', () => {
      render(<ColumnTest disableColumnReorder />);
      expect(getHeader('a')).not.to.have.attribute('aria-describedby');
      expect(document.querySelector('[id$="-reorder-description"]')).to.equal(null);
    });

    it('should not describe the headers while a row is edited', async () => {
      render(<Test columns={[{ field: 'name', editable: true }]} />);
      expect(getHints(getHeader('name'))).to.deep.equal([columnHint]);
      expect(getHeader('__reorder__')).not.to.have.attribute('aria-describedby');

      await act(async () => apiRef.current!.startCellEditMode({ id: 1, field: 'name' }));
      expect(getHeader('name')).not.to.have.attribute('aria-describedby');
    });

    it('should describe the row and the column keys on the focused cell only', () => {
      render(<Test columns={twoColumns} />);
      expect(getDescribedCells()).to.have.length(0);

      focusCell(1, 'name');
      expect(getHints(getCellOf(1, 'name'))).to.deep.equal([rowHint, columnHint]);
      expect(getDescribedCells()).to.deep.equal([getCellOf(1, 'name')]);
    });

    it('should describe the keys on the cell with the tab stop before the focus lands', async () => {
      const { user } = render(
        <React.Fragment>
          <Test columns={twoColumns} />
          <button type="button">after</button>
        </React.Fragment>,
      );
      focusCell(1, 'name');
      await user.keyboard('{ArrowRight}');
      expect(getDescribedCells()).to.have.length(0);

      // Leave the grid, the cell keeps the tab stop
      act(() => screen.getByRole('button', { name: 'after' }).focus());
      await waitFor(() =>
        expect(getHints(getCellOf(1, 'other'))).to.deep.equal([rowHint, columnHint]),
      );
      expect(document.activeElement).not.to.equal(getCellOf(1, 'other'));
    });

    it('should only describe the column keys without row reordering', () => {
      render(<Test columns={twoColumns} rowReordering={false} />);
      focusCell(1, 'name');
      expect(getHints(getCellOf(1, 'name'))).to.deep.equal([columnHint]);
    });

    it('should only describe the row keys on a cell of a column that cannot move', () => {
      render(<Test columns={[{ field: 'name', disableReorder: true }, { field: 'other' }]} />);
      focusCell(1, 'name');
      expect(getHints(getCellOf(1, 'name'))).to.deep.equal([rowHint]);
    });

    it('should only describe the row keys on the row reorder cell', () => {
      render(<Test />);
      focusCell(1, '__reorder__');
      expect(getHints(getCellOf(1, '__reorder__'))).to.deep.equal([rowHint]);
    });

    it('should not describe the row keys on a row that isRowReorderable rejects', () => {
      render(<Test columns={twoColumns} isRowReorderable={({ row }) => row.id !== 2} />);
      focusCell(2, 'name');
      expect(getHints(getCellOf(2, 'name'))).to.deep.equal([columnHint]);
    });

    it('should not describe the row keys when the grid is sorted', () => {
      render(
        <Test
          columns={twoColumns}
          initialState={{ sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
        />,
      );
      focusCell(1, 'name');
      expect(getHints(getCellOf(1, 'name'))).to.deep.equal([columnHint]);
    });

    it('should not describe the row keys while the rows are loading', () => {
      render(<Test columns={twoColumns} loading />);
      focusCell(1, 'name');
      expect(getHints(getCellOf(1, 'name'))).to.deep.equal([columnHint]);
    });

    it('should not describe anything while a cell is edited', async () => {
      render(<Test columns={[{ field: 'name', editable: true }, { field: 'other' }]} />);
      focusCell(1, 'other');
      expect(getHints(getCellOf(1, 'other'))).to.deep.equal([rowHint, columnHint]);

      await act(async () => apiRef.current!.startCellEditMode({ id: 2, field: 'name' }));
      expect(getCellOf(1, 'other')).not.to.have.attribute('aria-describedby');
    });

    it('should not describe the row keys in tree data', () => {
      render(
        <Test
          treeData
          getTreeDataPath={(row) => row.path}
          rows={[
            { id: 0, path: ['A'], name: 'A' },
            { id: 1, path: ['A', 'B'], name: 'B' },
          ]}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      focusCell(0, 'name');
      expect(getHints(getCellOf(0, 'name'))).to.deep.equal([columnHint]);
    });

    it('should describe the keys once per visit to the grid', async () => {
      const { user } = render(
        <React.Fragment>
          <Test columns={twoColumns} />
          <button type="button">after</button>
        </React.Fragment>,
      );
      focusCell(1, 'name');
      expect(getHints(getCellOf(1, 'name'))).to.deep.equal([rowHint, columnHint]);

      await user.keyboard('{ArrowDown}');
      expect(document.activeElement).to.equal(getCellOf(2, 'name'));
      expect(getDescribedCells()).to.have.length(0);

      // The headers keep their description
      await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
      expect(getHints(getHeader('name'))).to.deep.equal([columnHint]);
      await user.keyboard('{ArrowDown}');
      expect(getDescribedCells()).to.have.length(0);

      act(() => screen.getByRole('button', { name: 'after' }).focus());
      await waitFor(() => expect(getDescribedCells()).to.have.length(1));
      focusCell(3, 'other');
      expect(getHints(getCellOf(3, 'other'))).to.deep.equal([rowHint, columnHint]);
    });

    it('should describe the first focused cell without the tab stop', () => {
      render(<Test columns={twoColumns} />);
      // Like VoiceOver, which moves the focus without key presses that reach the page
      act(() => (getCellOf(3, 'other') as HTMLElement).focus());
      expect(getHints(getCellOf(3, 'other'))).to.deep.equal([rowHint, columnHint]);
    });

    it('should not describe the keys again after a move', async () => {
      render(<Test columns={twoColumns} />);
      focusCell(1, 'name');
      pressAlt(getCellOf(1, 'name'), 'ArrowDown');
      await waitFor(() =>
        expect(getRowsFieldContent('name')).to.deep.equal(['A', 'C', 'B', 'D', 'E']),
      );
      // The focus leaves the moved cell until React restores it
      await act(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve);
          }),
      );
      expect(getDescribedCells()).to.have.length(0);
    });

    it('should use the locale texts, and remove the hints when they are empty', () => {
      const { setProps } = render(
        <Test
          columns={twoColumns}
          localeText={{
            rowReorderingKeyboardDescription: () => 'Row keys',
            columnReorderingKeyboardDescription: () => 'Column keys',
          }}
        />,
      );
      focusCell(1, 'name');
      expect(getHints(getCellOf(1, 'name'))).to.deep.equal(['Row keys', 'Column keys']);
      expect(getHints(getHeader('name'))).to.deep.equal(['Column keys']);

      setProps({
        localeText: {
          rowReorderingKeyboardDescription: () => '',
          columnReorderingKeyboardDescription: () => '',
        },
      });
      expect(getCellOf(1, 'name')).not.to.have.attribute('aria-describedby');
      expect(getHeader('name')).not.to.have.attribute('aria-describedby');
      expect(document.querySelector('[id$="-reorder-description"]')).to.equal(null);
    });

    it('should keep the aria-describedby of slotProps.cell', () => {
      render(<Test columns={twoColumns} slotProps={{ cell: { 'aria-describedby': 'custom' } }} />);
      expect(getCellOf(2, 'name').getAttribute('aria-describedby')).to.equal('custom');

      focusCell(1, 'name');
      const [custom, ...hints] = getCellOf(1, 'name').getAttribute('aria-describedby')!.split(' ');
      expect(custom).to.equal('custom');
      expect(hints.map((id) => document.getElementById(id)?.textContent)).to.deep.equal([
        rowHint,
        columnHint,
      ]);
    });

    it('should use different ids in two grids', () => {
      render(
        <React.Fragment>
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} />
          </div>
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} />
          </div>
        </React.Fragment>,
      );
      const ids = Array.from(
        document.querySelectorAll('[role="columnheader"][data-field="name"]'),
      ).map((header) => header.getAttribute('aria-describedby'));
      expect(ids).to.have.length(2);
      expect(ids[0]).not.to.equal(ids[1]);
      ids.forEach((id) => expect(document.getElementById(id!)).not.to.equal(null));
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

  describe('getRowMoveTarget', () => {
    const getTarget = (
      rowId: number,
      direction: 'up' | 'down',
      toEdge: boolean,
      hasCustomValidation = false,
    ) => getRowMoveTarget(apiRef as any, { rowId, direction, toEdge, hasCustomValidation });

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
