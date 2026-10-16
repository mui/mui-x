import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import type { RefObject } from '@mui/x-internals/types';
import {
  DataGridPro,
  gridClasses,
  gridFocusCellSelector,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import type {
  DataGridProProps,
  GridApi,
  GridColDef,
  GridDataSource,
  GridGetRowsParams,
  GridRowsProp,
} from '@mui/x-data-grid-pro';
import { getCell, getRow } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';

const getInput = (cell: HTMLElement) => cell.querySelector('input');

// Describes the element that has the focus: `body`, `cell r,c`, `input r,c` (the hidden editor), or `other`.
function describeFocus() {
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
const getEditorWrappers = () => document.querySelectorAll('[data-cell-editor]');

describe('<DataGridPro /> - IME fast edit with data loading', () => {
  const { render } = createRenderer();
  let apiRef: RefObject<GridApi | null>;

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

  // Asserts the DOM focus of the cell with the focus state, with and without the flag.
  function expectFocusedCell(cell: HTMLElement, imeFastEdit: boolean) {
    if (imeFastEdit) {
      expectHiddenEditor(cell);
    } else {
      expect(document.activeElement).to.equal(cell);
      expect(getEditorWrappers()).to.have.length(0);
    }
  }

  async function focusCell(user: any, row: number, col: number) {
    const cell = getCell(row, col);
    await user.click(cell);
    return cell;
  }

  describe('rowsLoadingMode="server"', () => {
    const columns: GridColDef[] = [{ field: 'id' }, { field: 'name', editable: true }];
    const rows: GridRowsProp = [
      { id: 0, name: 'Nike' },
      { id: 1, name: 'Adidas' },
      { id: 2, name: 'Puma' },
    ];

    function TestLazyLoader(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            rowCount={10}
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            rowsLoadingMode="server"
            onFetchRows={() => {}}
            experimentalFeatures={{ imeFastEdit: true }}
            {...props}
          />
        </div>
      );
    }

    // Needs layout
    it.skipIf(isJSDOM).each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'does not render an editor in skeleton rows (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(<TestLazyLoader experimentalFeatures={{ imeFastEdit }} />);
        expect(getRow(3).dataset.id).to.equal('auto-generated-skeleton-row-root-0');

        const cell = await focusCell(user, 0, 1);
        expectFocusedCell(cell, imeFastEdit);

        const skeletonRow = getRow(3);
        expect(skeletonRow.querySelectorAll('input')).to.have.length(0);
        expect(skeletonRow.querySelectorAll('[data-cell-editor]')).to.have.length(0);

        // A click on a skeleton cell clears the focus state, with and without the flag.
        const skeletonCell = skeletonRow.querySelector<HTMLElement>(
          `.${gridClasses.cellSkeleton}`,
        )!;
        await user.click(skeletonCell);
        expect(gridFocusCellSelector(apiRef as any)).to.equal(null);
        expect(getEditorWrappers()).to.have.length(0);
        expect(getInput(getCell(0, 1))).to.equal(null);
        expect(describeFocus()).to.equal('other');
      },
    );

    // Needs layout
    it.skipIf(isJSDOM)(
      'keeps the focus on the hidden editor when the loaded rows replace the skeleton rows',
      async () => {
        const { user, setProps } = render(<TestLazyLoader />);
        const cell = await focusCell(user, 0, 1);
        const input = expectHiddenEditor(cell);

        setProps({
          rows: [...rows, { id: 3, name: 'Reebok' }, { id: 4, name: 'Asics' }],
        });
        expect(getRow(3).dataset.id).to.equal('3');
        expect(getInput(getCell(0, 1))).to.equal(input);
        expect(document.activeElement).to.equal(input);
        expect(getEditorWrappers()).to.have.length(1);

        fireEvent.compositionStart(input);
        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
        expect(getInput(getCell(0, 1))).to.equal(input);
      },
    );
  });

  // Needs layout
  describe.skipIf(isJSDOM)('data source lazy loading', () => {
    const fetchRowsSpy = vi.fn();
    const updateRowSpy = vi.fn();
    const rowHeight = 50;
    const columnHeaderHeight = 50;
    const gridHeight = 4 * rowHeight + columnHeaderHeight + 2;
    let mockServer: ReturnType<typeof useMockServer>;

    function Reset() {
      React.useLayoutEffect(() => {
        fetchRowsSpy.mockClear();
        updateRowSpy.mockClear();
      }, []);
      return null;
    }

    function TestDataSourceLazyLoader(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      mockServer = useMockServer(
        { rowLength: 100, maxColumns: 3, editable: true },
        { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
      );
      const { fetchRows, editRow } = mockServer;

      const dataSource: GridDataSource = React.useMemo(
        () => ({
          getRows: async (params: GridGetRowsParams) => {
            const urlParams = new URLSearchParams({
              filterModel: JSON.stringify(params.filterModel),
              sortModel: JSON.stringify(params.sortModel),
              start: `${params.start}`,
              end: `${params.end}`,
            });
            const url = `https://mui.com/x/api/data-grid?${urlParams.toString()}`;
            fetchRowsSpy(url);
            const response = await fetchRows(url);
            return { rows: response.rows, rowCount: response.rowCount };
          },
          updateRow: async (params) => {
            updateRowSpy(params);
            return editRow(params.rowId, params.updatedRow);
          },
        }),
        [fetchRows, editRow],
      );

      if (!mockServer.isReady) {
        return null;
      }

      return (
        <div style={{ width: 300, height: gridHeight }}>
          <Reset />
          <DataGridPro
            apiRef={apiRef}
            columns={[{ field: 'desk' }, { field: 'commodity', editable: true }]}
            dataSource={dataSource}
            dataSourceCache={null}
            lazyLoading
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
            }}
            rowHeight={rowHeight}
            columnHeaderHeight={columnHeaderHeight}
            experimentalFeatures={{ imeFastEdit: true }}
            {...props}
          />
        </div>
      );
    }

    it('does not render an editor in skeleton rows and commits a composition with `updateRow`', async () => {
      const { user } = render(<TestDataSourceLazyLoader />);
      await waitFor(() => {
        expect(getRow(0)).not.to.equal(null);
      });

      const cell = await focusCell(user, 1, 1);
      const input = expectHiddenEditor(cell);
      // Only the focused cell renders an editor.
      expect(getEditorWrappers()).to.have.length(1);
      expect(document.querySelectorAll(`.${gridClasses.cellSkeleton} input`)).to.have.length(0);

      const text = `한글${Date.now()}`;
      fireEvent.compositionStart(input);
      expect(getInput(getCell(1, 1))).to.equal(input);
      fireEvent.change(input, { target: { value: text } });
      fireEvent.compositionEnd(input);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(updateRowSpy.mock.calls.length).to.equal(1);
      });
      expect(updateRowSpy.mock.calls[0][0].updatedRow.commodity).to.equal(text);
      await waitFor(() => {
        expect(getCell(1, 1).textContent).to.equal(text);
      });
    });

    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'keeps the focus when the focused row scrolls out of the render window and more rows load (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(
          <TestDataSourceLazyLoader experimentalFeatures={{ imeFastEdit }} />,
        );
        await waitFor(() => {
          expect(getRow(0)).not.to.equal(null);
        });
        const cell = await focusCell(user, 0, 1);
        const focusedElement = document.activeElement as HTMLElement;
        expectFocusedCell(cell, imeFastEdit);
        fetchRowsSpy.mockClear();

        // Scroll to the skeleton rows, so that more rows load.
        await act(async () => apiRef.current!.scrollToIndexes({ rowIndex: 12 }));
        await waitFor(() => {
          expect(fetchRowsSpy.mock.calls.length).to.equal(1);
        });
        await waitFor(() => {
          expect(getRow(12).dataset.id).not.to.contain('skeleton');
        });

        // The focused row is kept rendered, so the DOM focus stays in it.
        expect(gridFocusCellSelector(apiRef as any)).to.deep.equal({
          id: apiRef.current!.getRowIdFromRowIndex(0),
          field: 'commodity',
        });
        expect(document.activeElement).to.equal(focusedElement);
        expect(focusedElement.isConnected).to.equal(true);
        expect(getEditorWrappers()).to.have.length(imeFastEdit ? 1 : 0);

        // Scroll back to the top.
        await act(async () => apiRef.current!.scrollToIndexes({ rowIndex: 0 }));
        await waitFor(() => {
          expect(getRow(0)).not.to.equal(null);
        });
        expect(document.activeElement).to.equal(focusedElement);
        expect(getCell(0, 1).contains(focusedElement)).to.equal(true);
      },
    );
  });

  describe('tree data', () => {
    const rows: GridRowsProp = [
      { id: 0, name: 'A', note: 'root' },
      { id: 1, name: 'A.B', note: 'child' },
      { id: 2, name: 'C', note: 'root' },
    ];
    const columns: GridColDef[] = [{ field: 'note', editable: true }];

    function TestTreeData(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            treeData
            getTreeDataPath={(row) => row.name.split('.')}
            defaultGroupingExpansionDepth={-1}
            experimentalFeatures={{ imeFastEdit: true }}
            {...props}
          />
        </div>
      );
    }

    it('does not render an editor in the grouping column and renders one in editable cells', async () => {
      const { user } = render(<TestTreeData />);
      const groupingCell = await focusCell(user, 0, 0);
      expect(getInput(groupingCell)).to.equal(null);
      expect(document.activeElement).to.equal(groupingCell);

      const childCell = await focusCell(user, 1, 1);
      const input = expectHiddenEditor(childCell);

      fireEvent.compositionStart(input);
      expect(childCell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(childCell)).to.equal(input);
    });

    it('drops the hidden editor when the parent row collapses and restores it when it expands', async () => {
      const { user } = render(<TestTreeData />);
      const childCell = await focusCell(user, 1, 1);
      expectHiddenEditor(childCell);

      await act(async () => {
        apiRef.current!.setRowChildrenExpansion(0, false);
      });
      expect(getEditorWrappers()).to.have.length(0);
      expect(describeFocus()).to.equal('body');

      await act(async () => {
        apiRef.current!.setRowChildrenExpansion(0, true);
      });
      const cell = getCell(1, 1);
      await waitFor(() => {
        expect(cell.contains(document.activeElement)).to.equal(true);
      });
      expectHiddenEditor(cell);
    });
  });
});
