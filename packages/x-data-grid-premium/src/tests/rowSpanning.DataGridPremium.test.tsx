import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGridPremium, DataGridPremiumProps } from '@mui/x-data-grid-premium';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPremium /> - Row spanning', () => {
  const { render } = createRenderer();

  const baselineProps: DataGridPremiumProps = {
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
        type: 'number',
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

  function TestDataGrid(props: Partial<DataGridPremiumProps>) {
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGridPremium {...baselineProps} {...props} disableVirtualization={isJSDOM} />
      </div>
    );
  }

  // See https://github.com/mui/mui-x/issues/14691
  testSkipIf(isJSDOM)('should not throw when initializing an aggregation model', () => {
    expect(() =>
      render(
        <TestDataGrid
          initialState={{
            aggregation: {
              model: {
                quantity: 'sum',
                unitPrice: 'sum',
              },
            },
          }}
        />,
      ),
    ).not.toErrorDev();
  });
});
