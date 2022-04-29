import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

function ColumnPropTest() {
  return (
    <div>
      {/* Wrong column with explicit generic on DataGrid */}
      <DataGridPremium<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            groupingValueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column with explicit generic on DataGrid */}
      <DataGridPremium<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            groupingValueGetter: (params) => params.row.firstName,
          },
        ]}
      />
      {/* Wrong column without explicit generic on DataGrid */}
      <DataGridPremium
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            groupingValueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column without explicit generic on DataGrid */}
      <DataGridPremium
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            groupingValueGetter: (params) => params.row.firstName,
          },
        ]}
      />
    </div>
  );
}
