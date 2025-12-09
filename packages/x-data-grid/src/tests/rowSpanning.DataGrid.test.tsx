import { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { DataGrid, useGridApiRef, DataGridProps, GridApi } from '@mui/x-data-grid';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { getCell, getActiveCell, microtasks } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe.skipIf(isJSDOM)('<DataGrid /> - Row spanning', () => {
  const { render } = createRenderer();

  let publicApiRef: RefObject<GridApi | null>;
  const baselineProps: DataGridProps = {
    rowSpanning: true,
    columns: [
      {
        field: 'code',
        headerName: 'Item Code',
        width: 85,
        cellClassName: ({ row }) => (row.summaryRow ? 'bold' : ''),
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 170,
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        width: 80,
        // Do not span the values
        rowSpanValueGetter: () => null,
      },
      {
        field: 'unitPrice',
        headerName: 'Unit Price',
        type: 'number',
        valueFormatter: (value) => (value ? `$${value}.00` : ''),
      },
      {
        field: 'totalPrice',
        headerName: 'Total Price',
        type: 'number',
        valueGetter: (value, row) => value ?? row?.unitPrice,
        valueFormatter: (value) => `$${value}.00`,
      },
    ],
    rows: [
      {
        id: 1,
        code: 'A101',
        description: 'Wireless Mouse',
        quantity: 2,
        unitPrice: 50,
        totalPrice: 100,
      },
      {
        id: 2,
        code: 'A102',
        description: 'Mechanical Keyboard',
        quantity: 1,
        unitPrice: 75,
      },
      {
        id: 3,
        code: 'A103',
        description: 'USB Dock Station',
        quantity: 1,
        unitPrice: 400,
      },
      {
        id: 4,
        code: 'A104',
        description: 'Laptop',
        quantity: 1,
        unitPrice: 1800,
        totalPrice: 2050,
      },
      {
        id: 5,
        code: 'A104',
        description: '- 16GB RAM Upgrade',
        quantity: 1,
        unitPrice: 100,
        totalPrice: 2050,
      },
      {
        id: 6,
        code: 'A104',
        description: '- 512GB SSD Upgrade',
        quantity: 1,
        unitPrice: 150,
        totalPrice: 2050,
      },
      {
        id: 7,
        code: 'TOTAL',
        totalPrice: 2625,
        summaryRow: true,
      },
    ],
  };

  function TestDataGrid(props: Partial<DataGridProps>) {
    publicApiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGrid {...baselineProps} apiRef={publicApiRef} {...props} />
      </div>
    );
  }

  const rowHeight = 52;

  it('should span the repeating row values', async () => {
    render(<TestDataGrid />);
    const api = unwrapPrivateAPI(publicApiRef.current!);

    if (!api?.state) {
      throw new Error('api.virtualizer.store.state is undefined');
    }

    const store = api.virtualizer.store;
    const rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
    expect(rowsWithSpannedCells.length).to.equal(1);
    const rowIndex = api.getRowIndexRelativeToVisibleRows(4);
    expect(rowIndex).to.equal(3);
    const spanValue = store.state.rowSpanning.caches.spannedCells['4'];
    expect(spanValue).to.deep.equal({ '0': 3, '4': 3 });
    const spannedCell = getCell(rowIndex, 0);
    expect(spannedCell).to.have.style('height', `${rowHeight * spanValue[0]}px`);
    await microtasks();
  });

  describe('sorting', () => {
    it('should work with sorting when initializing sorting', async () => {
      render(
        <TestDataGrid
          initialState={{ sorting: { sortModel: [{ field: 'code', sort: 'desc' }] } }}
        />,
      );

      const api = unwrapPrivateAPI(publicApiRef.current!);
      const store = api.virtualizer.store;
      const rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
      expect(rowsWithSpannedCells.length).to.equal(1);
      const rowIndex = api.getRowIndexRelativeToVisibleRows(4);
      expect(rowIndex).to.equal(1);
      const spanValue = store.state.rowSpanning.caches.spannedCells['4'];
      expect(spanValue).to.deep.equal({ '0': 3, '4': 3 });
      const spannedCell = getCell(rowIndex, 0);
      expect(spannedCell).to.have.style('height', `${rowHeight * spanValue[0]}px`);
      await microtasks();
    });

    it('should work with sorting when controlling sorting', async () => {
      render(<TestDataGrid sortModel={[{ field: 'code', sort: 'desc' }]} />);

      const api = unwrapPrivateAPI(publicApiRef.current!);
      const store = api.virtualizer.store;
      const rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
      expect(rowsWithSpannedCells.length).to.equal(1);
      const rowIndex = api.getRowIndexRelativeToVisibleRows(4);
      expect(rowIndex).to.equal(1);
      const spanValue = store.state.rowSpanning.caches.spannedCells['4'];
      expect(spanValue).to.deep.equal({ '0': 3, '4': 3 });
      const spannedCell = getCell(rowIndex, 0);
      expect(spannedCell).to.have.style('height', `${rowHeight * spanValue[0]}px`);
      await microtasks();
    });
  });

  describe('filtering', () => {
    it('should work with filtering when initializing filter', async () => {
      render(
        <TestDataGrid
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'description', operator: 'contains', value: 'Upgrade' }],
              },
            },
          }}
        />,
      );

      const api = unwrapPrivateAPI(publicApiRef.current!);
      const store = api.virtualizer.store;
      const rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
      expect(rowsWithSpannedCells.length).to.equal(1);
      const rowIndex = api.getRowIndexRelativeToVisibleRows(5);
      expect(rowIndex).to.equal(0);
      const spanValue = store.state.rowSpanning.caches.spannedCells['5'];
      expect(spanValue).to.deep.equal({ '0': 2, '4': 2 });
      const spannedCell = getCell(rowIndex, 0);
      expect(spannedCell).to.have.style('height', `${rowHeight * spanValue[0]}px`);
      await microtasks();
    });

    it('should work with filtering when controlling filter', async () => {
      render(
        <TestDataGrid
          filterModel={{
            items: [{ field: 'description', operator: 'contains', value: 'Upgrade' }],
          }}
        />,
      );

      const api = unwrapPrivateAPI(publicApiRef.current!);
      const store = api.virtualizer.store;
      const rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
      expect(rowsWithSpannedCells.length).to.equal(1);
      const rowIndex = api.getRowIndexRelativeToVisibleRows(5);
      expect(rowIndex).to.equal(0);
      const spanValue = store.state.rowSpanning.caches.spannedCells['5'];
      expect(spanValue).to.deep.equal({ '0': 2, '4': 2 });
      const spannedCell = getCell(rowIndex, 0);
      expect(spannedCell).to.have.style('height', `${rowHeight * spanValue[0]}px`);
      await microtasks();
    });
  });

  describe('pagination', () => {
    it('should only compute the row spanning state for current page', async () => {
      render(
        <TestDataGrid
          pagination
          initialState={{ pagination: { paginationModel: { pageSize: 4, page: 0 } } }}
          pageSizeOptions={[4]}
        />,
      );

      const api = unwrapPrivateAPI(publicApiRef.current!);

      const store = api.virtualizer.store;
      expect(Object.keys(store.state.rowSpanning.caches.spannedCells).length).to.equal(0);
      act(() => {
        api?.setPage(1);
      });
      expect(Object.keys(store.state.rowSpanning.caches.spannedCells).length).to.equal(1);
      expect(Object.keys(store.state.rowSpanning.caches.hiddenCells).length).to.equal(1);
    });
  });

  describe('keyboard navigation', () => {
    it('should respect the spanned cells when navigating using keyboard', async () => {
      render(<TestDataGrid />);
      // Set focus to the cell with value `- 16GB RAM Upgrade`
      act(() => publicApiRef.current?.setCellFocus(5, 'description'));
      expect(getActiveCell()).to.equal('4-1');
      const cell41 = getCell(4, 1);
      fireEvent.keyDown(cell41, { key: 'ArrowLeft' });
      expect(getActiveCell()).to.equal('3-0');
      const cell30 = getCell(3, 0);
      fireEvent.keyDown(cell30, { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('3-1');
      await microtasks();
    });
  });

  describe('rows update', () => {
    it('should update the row spanning state when the rows are updated', () => {
      const rowSpanValueGetter = spy((value) => value);
      let rowSpanningStateUpdates = 0;
      let spannedCells = {};
      render(
        <TestDataGrid
          columns={[{ field: 'code', rowSpanValueGetter }]}
          rows={[{ id: 1, code: 'A101' }]}
        />,
      );

      const api = unwrapPrivateAPI(publicApiRef.current!);
      const store = api.virtualizer.store;
      const dispose = store.subscribe((newState) => {
        const newSpannedCells = newState.rowSpanning.caches.spannedCells;
        if (newSpannedCells !== spannedCells) {
          rowSpanningStateUpdates += 1;
          spannedCells = newSpannedCells;
        }
      });

      act(() => {
        publicApiRef.current?.setRows([
          { id: 1, code: 'A101' },
          { id: 2, code: 'A101' },
        ]);
      });

      expect(rowSpanningStateUpdates).to.equal(1);

      dispose();
    });
  });

  // TODO: Add tests for row reordering
});
