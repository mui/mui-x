import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGrid, useGridApiRef, DataGridProps, GridApi } from '@mui/x-data-grid';
import { getCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Row spanning', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;
  const baselineProps: DataGridProps = {
    unstable_rowSpanning: true,
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
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGrid {...baselineProps} apiRef={apiRef} {...props} disableVirtualization={isJSDOM} />
      </div>
    );
  }

  const rowHeight = 52;

  it('should span the repeating row values', () => {
    render(<TestDataGrid />);
    const rowsWithSpannedCells = Object.keys(apiRef.current.state.rowSpanning.spannedCells);
    expect(rowsWithSpannedCells.length).to.equal(1);
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows('4');
    expect(rowIndex).to.equal(3);
    const spanValue = apiRef.current.state.rowSpanning.spannedCells['4'];
    expect(spanValue).to.deep.equal({ code: 3, totalPrice: 3 });
    const spannedCell = getCell(rowIndex, 0);
    expect(spannedCell).to.have.style('height', `${rowHeight * spanValue.code}px`);
  });

  it('should work with sorting', () => {
    render(
      <TestDataGrid initialState={{ sorting: { sortModel: [{ field: 'code', sort: 'desc' }] } }} />,
    );
    const rowsWithSpannedCells = Object.keys(apiRef.current.state.rowSpanning.spannedCells);
    expect(rowsWithSpannedCells.length).to.equal(1);
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows('4');
    expect(rowIndex).to.equal(1);
    const spanValue = apiRef.current.state.rowSpanning.spannedCells['4'];
    expect(spanValue).to.deep.equal({ code: 3, totalPrice: 3 });
    const spannedCell = getCell(rowIndex, 0);
    expect(spannedCell).to.have.style('height', `${rowHeight * spanValue.code}px`);
  });

  it('should work with filtering', () => {
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
    const rowsWithSpannedCells = Object.keys(apiRef.current.state.rowSpanning.spannedCells);
    expect(rowsWithSpannedCells.length).to.equal(1);
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows('5');
    expect(rowIndex).to.equal(0);
    const spanValue = apiRef.current.state.rowSpanning.spannedCells['5'];
    expect(spanValue).to.deep.equal({ code: 2, totalPrice: 2 });
    const spannedCell = getCell(rowIndex, 0);
    expect(spannedCell).to.have.style('height', `${rowHeight * spanValue.code}px`);
  });

  // TODO: Add tests for keyboard navigation
  // TODO: Add tests for column reordering
});
