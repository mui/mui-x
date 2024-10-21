import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    taxRate: 0.1,
  },
  {
    id: 2,
    taxRate: 0.2,
  },
  {
    id: 3,
    taxRate: 0.3,
  },
];

export default function ValueFormatterGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={[
          {
            type: 'number',
            field: 'taxRate',
            headerName: 'Tax Rate',
            width: 150,
            valueGetter: (value) => {
              if (!value) {
                return value;
              }
              return value * 100;
            },
            valueFormatter: (value?: number) => {
              if (value == null) {
                return '';
              }
              return `${value.toLocaleString()} %`;
            },
          },
        ]}
      />
    </div>
  );
}
