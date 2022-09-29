import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

function SxTest() {
  <DataGridPro rows={[]} columns={[]} sx={{ color: 'primary.main' }} />;
}

function ColumnPropTest() {
  return (
    <div>
      {/* Wrong column with explicit generic on DataGrid */}
      <DataGridPro<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            valueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column with explicit generic on DataGrid */}
      <DataGridPro<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            valueGetter: (params) => params.row.firstName,
          },
        ]}
      />
      {/* Wrong column without explicit generic on DataGrid */}
      <DataGridPro
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            valueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column without explicit generic on DataGrid */}
      <DataGridPro
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            valueGetter: (params) => params.row.firstName,
          },
        ]}
      />
    </div>
  );
}
