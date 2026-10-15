import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import type { RefObject } from '@mui/x-internals/types';
import { DataGrid, gridFocusCellSelector, useGridApiRef } from '@mui/x-data-grid';
import type {
  DataGridProps,
  GridApi,
  GridCellModesModel,
  GridColDef,
  GridDataSource,
  GridGetRowsParams,
  GridRowModesModel,
} from '@mui/x-data-grid';
import { getCell, getRow } from 'test/utils/helperFn';
import { vi, describe, it, expect } from 'vitest';

const columns: GridColDef[] = [
  { field: 'name', editable: true },
  { field: 'city', editable: true },
  { field: 'age', type: 'number', editable: true },
];

const rows = [
  { id: 0, name: 'Nike', city: 'Seoul', age: 25 },
  { id: 1, name: 'Adidas', city: 'Tokyo', age: 36 },
  { id: 2, name: 'Puma', city: 'Osaka', age: 42 },
];

const getInput = (cell: HTMLElement) => cell.querySelector('input');
const getEditorWrappers = () => document.querySelectorAll('[data-cell-editor]');

// Composes an IME text in the focused hidden editor and commits it with Enter.
async function composeAndCommit(user: any, input: HTMLInputElement, text: string) {
  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.compositionEnd(input);
  await user.keyboard('{Enter}');
}

describe('<DataGrid /> - IME fast edit with data loading and updates', () => {
  const { render } = createRenderer();
  let apiRef: RefObject<GridApi | null>;

  function TestCase(props: Partial<DataGridProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          experimentalFeatures={{ imeFastEdit: true }}
          {...props}
        />
      </div>
    );
  }

  async function focusCell(user: any, row: number, col: number) {
    const cell = getCell(row, col);
    await user.click(cell);
    return cell;
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

  // Asserts the DOM focus of the cell with the focus state, with and without the flag.
  function expectFocusedCell(cell: HTMLElement, imeFastEdit: boolean) {
    if (imeFastEdit) {
      expectHiddenEditor(cell);
    } else {
      expect(document.activeElement).to.equal(cell);
      expect(getEditorWrappers()).to.have.length(0);
    }
  }

  describe('data source', () => {
    const serverOptions = { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false };
    const dataSetOptions = { rowLength: 100, maxColumns: 3, editable: true };
    const dataSourceColumns: GridColDef[] = [
      { field: 'desk' },
      { field: 'commodity', editable: true },
    ];
    const fetchRowsSpy = vi.fn();
    const updateRowSpy = vi.fn();
    let mockServer: ReturnType<typeof useMockServer>;

    // The mock server keeps its rows between tests. A commit must use a new value,
    // otherwise `stopCellEditMode` sees no change and does not call `updateRow`.
    let composedCount = 0;
    const nextText = () => {
      composedCount += 1;
      return `한글${composedCount}`;
    };

    function Reset() {
      React.useLayoutEffect(() => {
        fetchRowsSpy.mockClear();
        updateRowSpy.mockClear();
      }, []);
      return null;
    }

    function TestDataSource(props: Partial<DataGridProps> & { updateRowFails?: boolean }) {
      apiRef = useGridApiRef();
      const { updateRowFails = false, ...other } = props;
      mockServer = useMockServer(dataSetOptions, serverOptions, false);
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
            if (updateRowFails) {
              throw new Error('update failed');
            }
            return editRow(params.rowId, params.updatedRow);
          },
        }),
        [fetchRows, editRow, updateRowFails],
      );

      if (!mockServer.isReady) {
        return null;
      }

      return (
        <div style={{ width: 300, height: 300 }}>
          <Reset />
          <DataGrid
            apiRef={apiRef}
            columns={dataSourceColumns}
            dataSource={dataSource}
            dataSourceCache={null}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 }, rowCount: 0 },
            }}
            pagination
            pageSizeOptions={[5]}
            disableVirtualization
            experimentalFeatures={{ imeFastEdit: true }}
            {...other}
          />
        </div>
      );
    }

    async function waitForRows(count: number) {
      await waitFor(() => {
        expect(getRow(count - 1)).not.to.equal(null);
      });
    }

    it('focuses the hidden editor in a fetched row and commits a composition with `updateRow`', async () => {
      const { user } = render(<TestDataSource />);
      await waitForRows(5);
      expect(getEditorWrappers()).to.have.length(0);

      const cell = await focusCell(user, 1, 1);
      const rowId = apiRef.current!.getRowId(apiRef.current!.getRow(getRow(1).dataset.id!)!);
      const input = expectHiddenEditor(cell);
      const text = nextText();
      // The desk column is not editable, so it has no editor.
      expect(getInput(getCell(1, 0))).to.equal(null);

      fireEvent.compositionStart(input);
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(document.activeElement).to.equal(input);

      fireEvent.change(input, { target: { value: text } });
      fireEvent.compositionEnd(input);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(updateRowSpy.mock.calls.length).to.equal(1);
      });
      expect(updateRowSpy.mock.calls[0][0].rowId).to.equal(rowId);
      expect(updateRowSpy.mock.calls[0][0].updatedRow.commodity).to.equal(text);
      await waitFor(() => {
        expect(getCell(1, 1).textContent).to.equal(text);
      });
      // After the commit, Enter moves the focus to the cell below, which renders the hidden editor.
      expect(getCell(1, 1)).not.to.have.class('MuiDataGrid-cell--editing');
      expect(getEditorWrappers()).to.have.length(1);
      expectHiddenEditor(getCell(2, 1));
    });

    it('keeps the cell value and the hidden editor empty when `updateRow` rejects', async () => {
      const onDataSourceError = vi.fn();
      const { user } = render(
        <TestDataSource updateRowFails onDataSourceError={onDataSourceError} />,
      );
      await waitForRows(5);
      const cell = await focusCell(user, 1, 1);
      const previousValue = cell.textContent;
      const input = expectHiddenEditor(cell);
      const text = nextText();

      await composeAndCommit(user, input, text);

      await waitFor(() => {
        expect(onDataSourceError.mock.calls.length).to.equal(1);
      });
      expect(updateRowSpy.mock.calls.length).to.equal(1);
      // The cell stays in edit mode with the composed text.
      expect(getCell(1, 1)).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(getCell(1, 1))).to.equal(input);
      expect(input.value).to.equal(text);

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(getCell(1, 1)).not.to.have.class('MuiDataGrid-cell--editing');
      });
      expect(getCell(1, 1).textContent).to.equal(previousValue);
      expectHiddenEditor(getCell(1, 1));
    });

    it('keeps the focus on the hidden editor when the rows are fetched again', async () => {
      const { user } = render(<TestDataSource />);
      await waitForRows(5);
      const cell = await focusCell(user, 1, 1);
      const input = expectHiddenEditor(cell);
      fetchRowsSpy.mockClear();

      await act(async () => {
        await apiRef.current!.dataSource.fetchRows();
      });
      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(1);
      });

      expect(getInput(getCell(1, 1))).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(getEditorWrappers()).to.have.length(1);
      expect(input.value).to.equal('');
    });

    it('keeps the fetched rows out of the hidden editor when the fetch resolves during a composition', async () => {
      const { user } = render(<TestDataSource />);
      await waitForRows(5);
      const cell = await focusCell(user, 1, 1);
      const input = expectHiddenEditor(cell);

      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: '한' } });
      await act(async () => {
        await apiRef.current!.dataSource.fetchRows();
      });

      expect(getInput(getCell(1, 1))).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(input.value).to.equal('한');
      expect(getCell(1, 1)).to.have.class('MuiDataGrid-cell--editing');
    });

    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'drops the hidden editor when a server-side sort replaces the rows (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(<TestDataSource experimentalFeatures={{ imeFastEdit }} />);
        await waitForRows(5);
        await focusCell(user, 1, 1);

        await act(async () => {
          apiRef.current!.sortColumn('commodity', 'desc');
        });
        await waitFor(() => {
          expect(fetchRowsSpy.mock.calls.length).to.equal(2);
        });
        await waitForRows(5);

        // The rows are replaced while loading, so the focus state is cleared with or without the flag.
        await waitFor(() => {
          expect(gridFocusCellSelector(apiRef)).to.equal(null);
        });
        expect(getEditorWrappers()).to.have.length(0);
        expect(document.activeElement).to.equal(document.body);

        const cell = await focusCell(user, 1, 1);
        expectFocusedCell(cell, imeFastEdit);
      },
    );

    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'drops the hidden editor when a server-side page change removes the focused row (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(<TestDataSource experimentalFeatures={{ imeFastEdit }} />);
        await waitForRows(5);
        await focusCell(user, 1, 1);

        await act(async () => {
          apiRef.current!.setPage(1);
        });
        await waitFor(() => {
          expect(fetchRowsSpy.mock.calls.length).to.equal(2);
        });
        await waitForRows(5);

        // The focused row is not on the page, so no cell has an editor.
        expect(getEditorWrappers()).to.have.length(0);
        expect(document.activeElement!.isConnected).to.equal(true);

        // A click on the new page gives the focus to the hidden editor again.
        const cell = await focusCell(user, 2, 1);
        expectFocusedCell(cell, imeFastEdit);
      },
    );

    it('commits a composition with a controlled `cellModesModel`', async () => {
      const onCellModesModelChange = vi.fn();
      function ControlledTest() {
        const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
        return (
          <TestDataSource
            cellModesModel={cellModesModel}
            onCellModesModelChange={(model) => {
              onCellModesModelChange(model);
              setCellModesModel(model);
            }}
          />
        );
      }
      const { user } = render(<ControlledTest />);
      await waitForRows(5);
      const cell = await focusCell(user, 1, 1);
      const input = expectHiddenEditor(cell);

      fireEvent.compositionStart(input);
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(onCellModesModelChange.mock.calls.length).to.equal(1);

      const text = nextText();
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

    it('commits a composition with a controlled `rowModesModel`', async () => {
      function ControlledTest() {
        const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
        return (
          <TestDataSource
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
          />
        );
      }
      const { user } = render(<ControlledTest />);
      await waitForRows(5);
      const cell = await focusCell(user, 1, 1);
      const input = expectHiddenEditor(cell);
      const text = nextText();

      await composeAndCommit(user, input, text);
      await waitFor(() => {
        expect(updateRowSpy.mock.calls.length).to.equal(1);
      });
      expect(updateRowSpy.mock.calls[0][0].updatedRow.commodity).to.equal(text);
      await waitFor(() => {
        expect(getCell(1, 1).textContent).to.equal(text);
      });
    });
  });

  describe('row updates', () => {
    it('shows the new value and keeps the hidden editor empty after `updateRows`', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      await act(async () => {
        apiRef.current!.updateRows([{ id: 0, city: 'Busan' }]);
      });

      expect(getCell(0, 1).textContent).to.equal('Busan');
      expect(getInput(getCell(0, 1))).to.equal(input);
      expectHiddenEditor(getCell(0, 1));

      // Enter starts edit mode with the new value.
      await user.keyboard('{Enter}');
      expect(getInput(getCell(0, 1))).to.equal(input);
      expect(input.value).to.equal('Busan');
    });

    it('keeps the composed text when `updateRows` changes the edited cell', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: '부' } });
      await act(async () => {
        apiRef.current!.updateRows([{ id: 0, city: 'Busan' }]);
      });

      expect(getInput(getCell(0, 1))).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(input.value).to.equal('부');

      fireEvent.change(input, { target: { value: '부산' } });
      fireEvent.compositionEnd(input);
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('부산');
      });
    });

    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'moves the focus to the next row when `updateRows` deletes the focused row (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(<TestCase experimentalFeatures={{ imeFastEdit }} />);
        await focusCell(user, 0, 1);

        await act(async () => {
          apiRef.current!.updateRows([{ id: 0, _action: 'delete' }]);
        });
        await waitFor(() => {
          expect(gridFocusCellSelector(apiRef)).to.deep.equal({
            id: 1,
            field: 'city',
          });
        });

        const cell = getCell(0, 1);
        expect(cell.textContent).to.equal('Tokyo');
        await waitFor(() => {
          expect(cell.contains(document.activeElement)).to.equal(true);
        });
        expectFocusedCell(cell, imeFastEdit);
        expect(getEditorWrappers()).to.have.length(imeFastEdit ? 1 : 0);
      },
    );

    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'moves the DOM focus like without the flag when the focused row is deleted while an outside element has the focus (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(
          <React.Fragment>
            <input data-testid="outside" />
            <TestCase experimentalFeatures={{ imeFastEdit }} />
          </React.Fragment>,
        );
        await focusCell(user, 0, 1);
        const outside = document.querySelector<HTMLInputElement>('[data-testid="outside"]')!;
        await act(async () => {
          outside.focus();
        });

        await act(async () => {
          apiRef.current!.updateRows([{ id: 0, _action: 'delete' }]);
        });
        await waitFor(() => {
          expect(gridFocusCellSelector(apiRef)).to.deep.equal({
            id: 1,
            field: 'city',
          });
        });
        // Pre-existing behaviour: the cell with the focus state takes the DOM focus back.
        const cell = getCell(0, 1);
        await waitFor(() => {
          expect(cell.contains(document.activeElement)).to.equal(true);
        });
        expectFocusedCell(cell, imeFastEdit);
      },
    );

    it('follows the row when the `rows` prop changes its value and position', async () => {
      const { user, setProps } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      setProps({
        rows: [rows[1], { ...rows[0], city: 'Busan' }, rows[2]],
      });

      const movedCell = getCell(1, 1);
      expect(movedCell.textContent).to.equal('Busan');
      expect(getInput(movedCell)).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(getEditorWrappers()).to.have.length(1);
    });

    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'handles a `rows` prop without the focused row (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user, setProps } = render(<TestCase experimentalFeatures={{ imeFastEdit }} />);
        await focusCell(user, 0, 1);

        setProps({ rows: [rows[1], rows[2]] });
        await waitFor(() => {
          expect(gridFocusCellSelector(apiRef)).to.deep.equal({
            id: 1,
            field: 'city',
          });
        });

        const cell = getCell(0, 1);
        await waitFor(() => {
          expect(cell.contains(document.activeElement)).to.equal(true);
        });
        expectFocusedCell(cell, imeFastEdit);

        setProps({ rows: [] });
        expect(getEditorWrappers()).to.have.length(0);
        expect(document.activeElement!.isConnected).to.equal(true);
      },
    );

    it('keeps the value of the edited cell when `setRows` replaces the rows during a composition', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: '한' } });
      await act(async () => {
        apiRef.current!.setRows([{ ...rows[0], city: 'Busan' }, rows[1]]);
      });

      expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(getCell(0, 1))).to.equal(input);
      expect(input.value).to.equal('한');
    });
  });

  describe('processRowUpdate', () => {
    it('calls a sync `processRowUpdate` once with the composed value', async () => {
      const processRowUpdate = vi.fn((newRow: any, _oldRow: any) => newRow);
      const { user } = render(<TestCase processRowUpdate={processRowUpdate} />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      await composeAndCommit(user, input, '한글');

      await waitFor(() => {
        expect(processRowUpdate.mock.calls.length).to.equal(1);
      });
      expect(processRowUpdate.mock.calls[0][0].city).to.equal('한글');
      expect(processRowUpdate.mock.calls[0][1].city).to.equal('Seoul');
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('한글');
      });
      // Enter moves the focus to the cell below.
      expectHiddenEditor(getCell(1, 1));
    });

    it('calls an async `processRowUpdate` once and shows its result', async () => {
      const processRowUpdate = vi.fn(async (newRow) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        return { ...newRow, city: `${newRow.city}!` };
      });
      const { user } = render(<TestCase processRowUpdate={processRowUpdate} />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      await composeAndCommit(user, input, '한글');

      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('한글!');
      });
      expect(processRowUpdate.mock.calls.length).to.equal(1);
      // Enter moves the focus to the cell below.
      expectHiddenEditor(getCell(1, 1));
    });

    it('keeps the cell in edit mode when `processRowUpdate` rejects', async () => {
      const onProcessRowUpdateError = vi.fn();
      const processRowUpdate = vi.fn(async () => {
        throw new Error('rejected');
      });
      const { user } = render(
        <TestCase
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
        />,
      );
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      await composeAndCommit(user, input, '한글');

      await waitFor(() => {
        expect(onProcessRowUpdateError.mock.calls.length).to.equal(1);
      });
      expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(getCell(0, 1))).to.equal(input);
      expect(input.value).to.equal('한글');

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(getCell(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
      });
      expect(getCell(0, 1).textContent).to.equal('Seoul');
      expectHiddenEditor(getCell(0, 1));
    });

    it('calls `processRowUpdate` once in row edit mode', async () => {
      const processRowUpdate = vi.fn((newRow: any, _oldRow: any) => newRow);
      const { user } = render(<TestCase editMode="row" processRowUpdate={processRowUpdate} />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      await composeAndCommit(user, input, '한글');

      await waitFor(() => {
        expect(processRowUpdate.mock.calls.length).to.equal(1);
      });
      expect(processRowUpdate.mock.calls[0][0]).to.deep.equal({ ...rows[0], city: '한글' });
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('한글');
      });
    });
  });

  describe('client-side pagination, sorting and filtering', () => {
    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'drops the hidden editor when the page changes (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(
          <TestCase
            experimentalFeatures={{ imeFastEdit }}
            pagination
            pageSizeOptions={[2]}
            initialState={{ pagination: { paginationModel: { pageSize: 2, page: 0 } } }}
          />,
        );
        await focusCell(user, 0, 1);

        await act(async () => {
          apiRef.current!.setPage(1);
        });
        expect(getRow(2).textContent).to.contain('Osaka');
        expect(getEditorWrappers()).to.have.length(0);
        expect(document.activeElement!.isConnected).to.equal(true);

        // The first cell of the new page is the tab stop.
        expect(getCell(2, 0)).to.have.attribute('tabindex', '0');

        await act(async () => {
          apiRef.current!.setPage(0);
        });
        // The focused row is back, so its cell takes the focus again like without the flag.
        const cell = getCell(0, 1);
        await waitFor(() => {
          expect(cell.contains(document.activeElement)).to.equal(true);
        });
        expectFocusedCell(cell, imeFastEdit);
      },
    );

    it('keeps the focus on the same input when a sort moves the focused row', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      await act(async () => {
        apiRef.current!.sortColumn('city', 'desc');
      });
      // Tokyo, Seoul, Osaka
      expect(getCell(1, 1).textContent).to.equal('Seoul');
      expect(getInput(getCell(1, 1))).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(getEditorWrappers()).to.have.length(1);

      fireEvent.compositionStart(input);
      expect(getCell(1, 1)).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(getCell(1, 1))).to.equal(input);
    });

    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'drops and restores the hidden editor when a filter removes and restores the focused row (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(<TestCase experimentalFeatures={{ imeFastEdit }} />);
        await focusCell(user, 0, 1);

        await act(async () => {
          apiRef.current!.setFilterModel({
            items: [{ field: 'city', operator: 'equals', value: 'Tokyo' }],
          });
        });
        expect(getRow(0).textContent).to.contain('Tokyo');
        expect(getEditorWrappers()).to.have.length(0);
        expect(document.activeElement!.isConnected).to.equal(true);

        await act(async () => {
          apiRef.current!.setFilterModel({ items: [] });
        });
        const cell = getCell(0, 1);
        await waitFor(() => {
          expect(cell.contains(document.activeElement)).to.equal(true);
        });
        expectFocusedCell(cell, imeFastEdit);
      },
    );

    it('keeps the focus on the same input when a quick filter keeps the focused row', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = expectHiddenEditor(cell);

      await act(async () => {
        apiRef.current!.setQuickFilterValues(['Seoul']);
      });
      expect(getRow(0).textContent).to.contain('Seoul');
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(1);
      expect(getInput(getCell(0, 1))).to.equal(input);
      expect(document.activeElement).to.equal(input);
    });
  });
});
